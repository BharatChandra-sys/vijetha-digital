"""
Production-grade dependency injection for authentication and authorization.
Centralized, type-safe, and follows best practices.
"""

from typing import List, Optional
from datetime import datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.session import get_db
from app.models.user import User, UserStatus, UserRole
from app.models.token_blacklist import TokenBlacklist
from app.services.rbac_service import RBACService

# ============================================================================
# SECURITY SCHEME
# ============================================================================

# Allow OPTIONS requests (preflight) to pass through without auth
security = HTTPBearer(auto_error=False)


# ============================================================================
# AUTHENTICATION
# ============================================================================

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Extract and validate JWT token, return current user.
    
    Raises:
        401: Invalid/expired token or user not found
        403: User account is suspended/inactive/locked
    """
    # Handle missing credentials (e.g., preflight requests)
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = credentials.credentials
    
    # Check if token is blacklisted
    is_blacklisted = db.query(TokenBlacklist).filter(TokenBlacklist.token == token).first()
    if is_blacklisted:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id_str = payload.get("sub")
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Check if account is locked
    if user.account_locked_until and user.account_locked_until > datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Account is locked. Reason: {user.account_locked_reason or 'Security'}",
        )

    # Check account status
    if user.status == UserStatus.SUSPENDED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been suspended",
        )
    
    if user.status == UserStatus.INACTIVE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Get current user and ensure account is active (not suspended/inactive/locked).
    This is an alias for get_current_user for semantic clarity.
    """
    return current_user


# ============================================================================
# AUTHORIZATION - ROLE-BASED
# ============================================================================

def require_any_role(role_slugs: List[str]):
    """
    Require user to have ANY of the specified roles.
    
    Example:
        @router.get("/admin/dashboard", dependencies=[Depends(require_any_role(["super_admin", "admin"]))])
    """
    def check_roles(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if not RBACService.has_any_role(db, current_user.id, role_slugs):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires one of: {', '.join(role_slugs)}",
            )
        return current_user
    return check_roles


def require_all_roles(role_slugs: List[str]):
    """
    Require user to have ALL of the specified roles.
    
    Example:
        @router.post("/critical", dependencies=[Depends(require_all_roles(["admin", "auditor"]))])
    """
    def check_roles(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if not RBACService.has_all_roles(db, current_user.id, role_slugs):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires all of: {', '.join(role_slugs)}",
            )
        return current_user
    return check_roles


def require_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """
    Require user to have admin-level access.
    Checks IAM roles first, then falls back to the legacy role column
    so that users created before IAM was seeded still work.
    """
    iam_admin_roles = ["super_admin", "admin", "manager"]
    has_iam_admin = RBACService.has_any_role(db, current_user.id, iam_admin_roles)
    has_legacy_admin = current_user.role in {UserRole.ADMIN}

    if not has_iam_admin and not has_legacy_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


def require_super_admin(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> User:
    """
    Require user to have super_admin role.
    
    Usage:
        def critical_route(current_user: User = Depends(require_super_admin)):
            ...
    """
    if not RBACService.has_any_role(db, current_user.id, ["super_admin"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super admin access required",
        )
    return current_user


# ============================================================================
# AUTHORIZATION - PERMISSION-BASED
# ============================================================================

def require_permission(permission_key: str):
    """
    Require user to have a specific permission.
    Legacy admins (role=admin) bypass all permission checks automatically.
    """
    def check_permission(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        # Legacy admin always has all permissions
        if current_user.role == UserRole.ADMIN:
            return current_user
        if not RBACService.has_permission(db, current_user.id, permission_key):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Missing permission: {permission_key}",
            )
        return current_user
    return check_permission


def require_any_permission(permission_keys: List[str]):
    """
    Require user to have ANY of the specified permissions.
    Legacy admins bypass all permission checks.
    """
    def check_permissions(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if current_user.role == UserRole.ADMIN:
            return current_user
        for perm in permission_keys:
            if RBACService.has_permission(db, current_user.id, perm):
                return current_user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Requires one of: {', '.join(permission_keys)}",
        )
    return check_permissions


def require_all_permissions(permission_keys: List[str]):
    """
    Require user to have ALL of the specified permissions.
    Legacy admins bypass all permission checks.
    """
    def check_permissions(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> User:
        if current_user.role == UserRole.ADMIN:
            return current_user
        for perm in permission_keys:
            if not RBACService.has_permission(db, current_user.id, perm):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Missing permission: {perm}",
                )
        return current_user
    return check_permissions


# ============================================================================
# OPTIONAL USER (for public endpoints that can be enhanced with auth)
# ============================================================================

def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """
    Get current user if token is provided, otherwise return None.
    Useful for endpoints that work for both authenticated and unauthenticated users.
    
    Example:
        @router.get("/products")
        def list_products(current_user: Optional[User] = Depends(get_current_user_optional)):
            # Show personalized results if user is authenticated
            ...
    """
    if not credentials:
        return None
    
    try:
        token = credentials.credentials
        
        is_blacklisted = db.query(TokenBlacklist).filter(TokenBlacklist.token == token).first()
        if is_blacklisted:
            return None

        payload = decode_access_token(token)
        
        if not payload:
            return None
        
        user_id_str = payload.get("sub")
        if not user_id_str:
            return None
        
        user_id = int(user_id_str)
        user = db.query(User).filter(User.id == user_id).first()
        
        # Only return user if account is active
        if user and user.status == UserStatus.ACTIVE:
            if not user.account_locked_until or user.account_locked_until <= datetime.utcnow():
                return user
        
        return None
    
    except Exception:
        return None