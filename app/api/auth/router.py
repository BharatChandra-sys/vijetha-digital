from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Literal

from app.db.session import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)
from app.services.auth_service import (
    register_user,
    login_user,
    google_login_or_register,
)
from app.services.password_reset_service import (
    request_password_reset,
    reset_password,
)
from app.core.security import (
    decode_refresh_token,
    create_access_token,
)
from app.core.rate_limiter import limiter
from app.api.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

# =========================
# AUTH
# =========================

@router.post("/register")
@limiter.limit("3/minute")
def register(
    request: Request,
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    return register_user(db, data)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(
    request: Request,
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    # Extract client IP address
    ip_address = request.client.host if request.client else None

    # login_user returns access_token, refresh_token, token_type, and user info
    return login_user(db, data, ip_address=ip_address, login_portal=data.login_portal)


# =========================
# GOOGLE OAUTH
# =========================

class GoogleAuthRequest(BaseModel):
    google_token: str
    login_portal: Literal["customer", "staff", "admin"] = "customer"


@router.post("/google", response_model=TokenResponse)
def google_auth(
    data: GoogleAuthRequest,
    db: Session = Depends(get_db),
):
    """Sign in or register via Google OAuth access token."""
    return google_login_or_register(db, data.google_token, data.login_portal)


# =========================
# REFRESH TOKEN
# =========================

@router.post("/refresh")
def refresh_token(
    data: dict,
    db: Session = Depends(get_db),
):
    """
    Refresh access token using a valid refresh token.
    Validates user status before issuing new token.
    """
    refresh_token = data.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token required")

    payload = decode_refresh_token(refresh_token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # Extract user_id from token
    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(status_code=401, detail="Malformed token payload")

    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Invalid token payload")

    # Validate user still exists and is active
    from app.models.user import User, UserStatus
    from datetime import datetime
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    # Check account status
    if user.status in {UserStatus.SUSPENDED, UserStatus.INACTIVE}:
        raise HTTPException(
            status_code=403,
            detail="Account is not active"
        )
    
    # Check if account is locked
    if user.account_locked_until and user.account_locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=403,
            detail="Account is locked"
        )

    # Issue new access token
    new_access_token = create_access_token(
        user_id=user_id,
        role=user.role.value,
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


# =========================
# PASSWORD RESET
# =========================

@router.post("/forgot-password")
@limiter.limit("2/minute")
def forgot_password(
    request: Request,
    data: dict,
    db: Session = Depends(get_db),
):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    request_password_reset(db, email)

    return {
        "message": "If the email exists, a reset link was sent"
    }


@router.post("/reset-password")
@limiter.limit("3/minute")
def reset_user_password(
    request: Request,
    data: dict,
    db: Session = Depends(get_db),
):
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        raise HTTPException(
            status_code=400,
            detail="Token and new_password are required"
        )

    try:
        reset_password(db, token, new_password)
        return {"message": "Password updated successfully"}
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token"
        )


# =========================
# PROFILE
# =========================

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None


@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user),
):
    iam_roles = [r.slug for r in current_user.roles_assigned if r.is_active]
    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "role": current_user.role.value,
        "iam_roles": iam_roles,
        "status": current_user.status.value,
        "created_at": current_user.created_at,
        "last_login_at": current_user.last_login_at,
    }


@router.put("/me")
def update_profile(
    data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.full_name is not None:
        full_name = data.full_name.strip()
        if not full_name:
            raise HTTPException(status_code=400, detail="Name cannot be empty")
        current_user.full_name = full_name

    if data.phone is not None:
        current_user.phone = data.phone.strip() or None

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "phone": current_user.phone,
        "role": current_user.role.value,
        "status": current_user.status.value,
    }