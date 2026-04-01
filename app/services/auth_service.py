"""
Production-grade authentication service.
Includes account lockout, failed login tracking, and security best practices.
"""

from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import secrets
import httpx

from app.models.user import User, UserRole, UserStatus
from app.schemas.auth import RegisterRequest, LoginRequest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from app.core.config import settings

# Security constants
MAX_FAILED_LOGIN_ATTEMPTS = 5
ACCOUNT_LOCKOUT_DURATION_MINUTES = 30


def _has_active_iam_roles(user: User) -> bool:
    return any(role.is_active for role in user.roles_assigned)


def _enforce_login_portal_access(user: User, login_portal: str) -> None:
    portal = (login_portal or "customer").strip().lower()
    has_iam_roles = _has_active_iam_roles(user)

    if portal == "admin":
        if user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin portal access is restricted to admins only.",
            )
        return

    if portal == "staff":
        if user.role == UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admins must sign in through the Admin portal.",
            )
        if not has_iam_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Staff portal access requires staff role assignment.",
            )
        return

    if portal == "customer":
        if user.role == UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin accounts must sign in through Admin Login.",
            )
        if has_iam_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Staff accounts must sign in through Staff Login.",
            )
        return

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid login portal",
    )


# ============================================================================
# REGISTER
# ============================================================================

def register_user(
    db: Session,
    data: RegisterRequest,
    created_by_id: Optional[int] = None,
) -> Dict[str, str]:
    """
    Register a new user account.
    
    Args:
        db: Database session
        data: Registration request data
        created_by_id: Optional ID of admin who created this user
        
    Returns:
        Success message dict
        
    Raises:
        400: User already exists
    """
    email = data.email.strip().lower()

    # Check if user already exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists",
        )

    # Determine role (bootstrap admin if this is the admin email)
    role = (
        UserRole.ADMIN
        if email == settings.ADMIN_EMAIL.strip().lower()
        else UserRole.CUSTOMER
    )

    # Extract full_name from request (field is 'name' in RegisterRequest)
    full_name = data.name.strip() if data.name else email.split('@')[0]

    # Create new user
    user = User(
        email=email,
        full_name=full_name,
        hashed_password=hash_password(data.password),
        role=role,
        status=UserStatus.ACTIVE,
        created_by=created_by_id,
        failed_login_attempts=0,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "user_id": str(user.id),
    }


# ============================================================================
# LOGIN
# ============================================================================

def login_user(
    db: Session,
    data: LoginRequest,
    ip_address: Optional[str] = None,
    login_portal: str = "customer",
) -> Dict[str, Any]:
    """
    Authenticate user and return JWT tokens.
    
    Implements account lockout after 5 failed attempts.
    
    Args:
        db: Database session
        data: Login credentials
        ip_address: Optional IP address of the request
        
    Returns:
        Dict with access_token, refresh_token, and user info
        
    Raises:
        401: Invalid credentials
        403: Account locked or inactive
    """
    email = data.email.strip().lower()

    # Find user
    user = db.query(User).filter(User.email == email).first()

    if not user:
        # Don't reveal whether user exists
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Check if account is locked
    if user.account_locked_until and user.account_locked_until > datetime.utcnow():
        lockout_remaining = user.account_locked_until - datetime.utcnow()
        minutes_remaining = int(lockout_remaining.total_seconds() / 60) + 1
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is locked for {minutes_remaining} more minutes due to multiple failed login attempts",
        )

    # Check account status
    if user.status == UserStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been suspended. Please contact support.",
        )
    
    if user.status == UserStatus.INACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Please contact support.",
        )

    # Verify password
    if not verify_password(data.password, user.hashed_password):
        # Increment failed login attempts
        user.failed_login_attempts = (user.failed_login_attempts or 0) + 1
        user.last_failed_login_at = datetime.utcnow()
        
        # Lock account if too many failed attempts
        if user.failed_login_attempts >= MAX_FAILED_LOGIN_ATTEMPTS:
            user.account_locked_until = datetime.utcnow() + timedelta(
                minutes=ACCOUNT_LOCKOUT_DURATION_MINUTES
            )
            user.account_locked_reason = "Multiple failed login attempts"
            db.commit()
            
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Account locked for {ACCOUNT_LOCKOUT_DURATION_MINUTES} minutes due to multiple failed login attempts",
            )
        
        db.commit()
        
        # Show remaining attempts
        attempts_remaining = MAX_FAILED_LOGIN_ATTEMPTS - user.failed_login_attempts
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid email or password. {attempts_remaining} attempts remaining.",
        )

    # Enforce strict portal access rules (admin/staff/customer)
    _enforce_login_portal_access(user, login_portal)

    # Successful login - reset failed attempts
    user.failed_login_attempts = 0
    user.last_failed_login_at = None
    user.account_locked_until = None
    user.account_locked_reason = None
    user.last_login_at = datetime.utcnow()
    user.last_login_ip = ip_address
    
    db.commit()
    db.refresh(user)

    # Create tokens
    access_token = create_access_token(
        user_id=user.id,
        role=user.role.value,
    )

    refresh_token = create_refresh_token(
        user_id=user.id,
        role=user.role.value,
    )

    # Get IAM roles with full details
    iam_roles = [
        {
            "id": role.id,
            "name": role.slug,  # e.g., "manager", "driver"
            "display_name": role.name,  # e.g., "Operations Manager"
        }
        for role in user.roles_assigned if role.is_active
    ]

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,  # Legacy role
            "iam_roles": iam_roles,  # New IAM roles with full details
            "status": user.status.value,
        },
    }


# ============================================================================
# UNLOCK ACCOUNT (Admin function)
# ============================================================================

def unlock_account(db: Session, user_id: int, admin_id: int) -> Dict[str, str]:
    """
    Unlock a locked user account (admin only).
    
    Args:
        db: Database session
        user_id: ID of user to unlock
        admin_id: ID of admin performing unlock
        
    Returns:
        Success message
        
    Raises:
        404: User not found
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.failed_login_attempts = 0
    user.last_failed_login_at = None
    user.account_locked_until = None
    user.account_locked_reason = None

    db.commit()

    return {
        "message": f"Account for {user.email} has been unlocked",
    }


# ============================================================================
# GOOGLE OAUTH
# ============================================================================

def google_login_or_register(
    db: Session,
    google_token: str,
    login_portal: str = "customer",
) -> Dict[str, Any]:
    """
    Sign in or register a user via Google OAuth access token.

    Verifies the token by calling Google's userinfo endpoint, then finds or
    creates a local account linked to the Google email.

    Args:
        db: Database session
        google_token: Access token returned by Google OAuth (implicit flow)

    Returns:
        Dict with access_token, refresh_token, and user info

    Raises:
        401: Invalid or expired Google token
        403: Account suspended or inactive
    """
    # Verify token with Google and get user info
    try:
        with httpx.Client(timeout=10.0) as client:
            resp = client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {google_token}"},
            )
    except httpx.RequestError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Could not reach Google servers. Please try again.",
        )

    if resp.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Google token.",
        )

    info = resp.json()
    email = info.get("email", "").strip().lower()
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account does not have a verified email.",
        )

    name = info.get("name") or email.split("@")[0]

    # Find existing user or create a new one
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(
            email=email,
            full_name=name,
            # Google users have no password — store a random unusable hash
            hashed_password=hash_password(secrets.token_urlsafe(32)),
            role=UserRole.CUSTOMER,
            status=UserStatus.ACTIVE,
            failed_login_attempts=0,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        if user.status == UserStatus.SUSPENDED:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account has been suspended. Please contact support.",
            )
        if user.status == UserStatus.INACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is inactive. Please contact support.",
            )

    # Enforce portal access rules for social sign-in too
    _enforce_login_portal_access(user, login_portal)

    # Update last login
    user.last_login_at = datetime.utcnow()
    db.commit()
    db.refresh(user)

    # Issue JWTs
    access_token = create_access_token(user_id=user.id, role=user.role.value)
    refresh_token = create_refresh_token(user_id=user.id, role=user.role.value)
    iam_roles = [
        {
            "id": r.id,
            "name": r.slug,
            "display_name": r.name,
        }
        for r in user.roles_assigned if r.is_active
    ]

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role.value,
            "iam_roles": iam_roles,
            "status": user.status.value,
        },
    }
