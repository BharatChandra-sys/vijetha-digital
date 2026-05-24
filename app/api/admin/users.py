"""
Admin API endpoints for IAM user management.
Production-level endpoints with proper validation and audit logging.
"""

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, EmailStr
from sqlalchemy.orm import Session

from app.api.auth.dependencies import require_permission
from app.core.security import hash_password
from app.core.token_manager import TokenManager
from app.db.session import get_db
from app.models.iam import Role, RoleAssignmentLog
from app.models.user import User, UserStatus
from app.services.rbac_service import RBACService

router = APIRouter(prefix="/users", tags=["admin-users"])


# ============================================================================
# SCHEMAS
# ============================================================================


class UserAssignRoleRequest(BaseModel):
    role_slug: str
    reason: str | None = None
    expires_in_days: int | None = None


class UserCreateRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str | None = None
    role_slugs: list[str] = ["customer"]  # Initial roles


class UserUpdateRequest(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    email: EmailStr | None = None
    status: UserStatus | None = None


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: str | None
    status: str
    created_at: datetime
    roles: list[dict]

    model_config = ConfigDict(from_attributes=True)


class RoleAssignmentLogResponse(BaseModel):
    id: int
    user_id: int
    role_id: int
    action: str
    assigned_by_id: int | None
    reason: str | None
    expires_at: datetime | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)



# ============================================================================
# LIST USERS
# ============================================================================

@router.get("", response_model=list[UserResponse])
def list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("user:list")),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: str | None = Query(None, alias="status"),
    role_slug: str | None = None,
):
    """
    List all users with optional filtering.
    Requires: user:list permission
    """
    query = db.query(User)

    if status_filter:
        try:
            user_status = UserStatus(status_filter)
            query = query.filter(User.status == user_status)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid status: {status}")

    if role_slug:
        query = query.join(User.roles_assigned).filter(Role.slug == role_slug)

    users = query.offset(skip).limit(limit).all()

    return [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "phone": u.phone,
            "status": u.status.value,
            "created_at": u.created_at,
            "roles": [
                {"id": r.id, "name": r.name, "slug": r.slug}
                for r in u.roles_assigned
            ],
        }
        for u in users
    ]


# ============================================================================
# GET USER DETAILS
# ============================================================================

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("user:read")),
):
    """
    Get detailed information about a specific user.
    Requires: user:read permission
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "status": user.status.value,
        "created_at": user.created_at,
        "roles": [
            {"id": r.id, "name": r.name, "slug": r.slug}
            for r in user.roles_assigned
        ],
    }


# ============================================================================
# CREATE USER
# ============================================================================

@router.post("", response_model=UserResponse, status_code=201)
def create_user(
    request: UserCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("user:create")),
):
    """
    Create a new user and assign initial roles.
    Requires: user:create permission
    """
    # Check if email already exists
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Fetch roles
    initial_roles = db.query(Role).filter(
        Role.slug.in_(request.role_slugs),
        Role.is_active
    ).all()

    if not initial_roles:
        raise HTTPException(status_code=400, detail="No valid roles specified")

    # Create user
    user = User(
        email=request.email,
        hashed_password=hash_password(request.password),
        full_name=request.full_name,
        phone=request.phone,
        status=UserStatus.ACTIVE,
        created_by=current_user.id,
    )

    user.roles_assigned = initial_roles
    db.add(user)
    db.flush()

    # Log role assignments
    for role in initial_roles:
        log = RoleAssignmentLog(
            user_id=user.id,
            role_id=role.id,
            action="assigned",
            assigned_by_id=current_user.id,
            reason="Initial role assignment during user creation",
        )
        db.add(log)

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "status": user.status.value,
        "created_at": user.created_at,
        "roles": [
            {"id": r.id, "name": r.name, "slug": r.slug}
            for r in user.roles_assigned
        ],
    }


# ============================================================================
# UPDATE USER
# ============================================================================

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    request: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("user:update")),
):
    """
    Update user information.
    Requires: user:update permission
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if request.full_name:
        user.full_name = request.full_name
    if request.phone:
        user.phone = request.phone
    if request.status:
        user.status = request.status
    if request.email and request.email != user.email:
        # Check if new email is unique
        existing = db.query(User).filter(
            User.email == request.email,
            User.id != user_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = request.email

    db.commit()
    db.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "phone": user.phone,
        "status": user.status.value,
        "created_at": user.created_at,
        "roles": [
            {"id": r.id, "name": r.name, "slug": r.slug}
            for r in user.roles_assigned
        ],
    }


# ============================================================================
# SUSPEND USER
# ============================================================================

@router.post("/{user_id}/suspend")
def suspend_user(
    user_id: int,
    reason: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("user:suspend")),
):
    """
    Suspend a user account.
    Requires: user:suspend permission
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot suspend yourself")

    user.status = UserStatus.SUSPENDED
    db.commit()

    return {"message": f"User {user.email} suspended", "reason": reason}


# ============================================================================
# REVOKE ALL USER TOKENS
# ============================================================================

@router.post("/{user_id}/revoke-tokens")
def revoke_all_user_tokens(
    user_id: int,
    reason: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("user:suspend")),
):
    """
    Revoke all active tokens for a user (force logout).
    Useful for security incidents or account compromise.
    Requires: user:suspend permission
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Revoke all tokens using TokenManager
    revoked_count = TokenManager.revoke_all_user_tokens(user_id)

    return {
        "message": f"All tokens revoked for user {user.email}",
        "tokens_revoked": revoked_count,
        "reason": reason
    }


# ============================================================================
# ASSIGN ROLE
# ============================================================================

@router.post("/{user_id}/roles", response_model=RoleAssignmentLogResponse)
def assign_role_to_user(
    user_id: int,
    request: UserAssignRoleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:assign")),
):
    """
    Assign a role to a user.
    Requires: role:assign permission
    """
    RBACService.assign_role(
        db=db,
        user_id=user_id,
        role_slug=request.role_slug,
        assigned_by_id=current_user.id,
        reason=request.reason,
        expires_in_days=request.expires_in_days,
    )

    # Return the assignment log
    log = db.query(RoleAssignmentLog).filter(
        RoleAssignmentLog.user_id == user_id,
        RoleAssignmentLog.role_id == db.query(Role).filter(
            Role.slug == request.role_slug
        ).first().id,
    ).order_by(RoleAssignmentLog.created_at.desc()).first()

    return {
        "id": log.id,
        "user_id": log.user_id,
        "role_id": log.role_id,
        "action": log.action,
        "assigned_by_id": log.assigned_by_id,
        "reason": log.reason,
        "expires_at": log.expires_at,
        "created_at": log.created_at,
    }


# ============================================================================
# REVOKE ROLE
# ============================================================================

@router.delete("/{user_id}/roles/{role_slug}")
def revoke_role_from_user(
    user_id: int,
    role_slug: str,
    reason: str | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:revoke")),
):
    """
    Revoke a role from a user.
    Requires: role:revoke permission
    """
    RBACService.revoke_role(
        db=db,
        user_id=user_id,
        role_slug=role_slug,
        revoked_by_id=current_user.id,
        reason=reason,
    )

    return {"message": f"Role {role_slug} revoked from user"}


# ============================================================================
# GET USER ROLE HISTORY
# ============================================================================

@router.get("/{user_id}/role-history", response_model=list[RoleAssignmentLogResponse])
def get_user_role_history(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("user:read")),
    limit: int = Query(50, ge=1, le=200),
):
    """
    Get role assignment history for a user.
    Requires: user:read permission
    """
    logs = db.query(RoleAssignmentLog).filter(
        RoleAssignmentLog.user_id == user_id
    ).order_by(RoleAssignmentLog.created_at.desc()).limit(limit).all()

    return [
        {
            "id": log.id,
            "user_id": log.user_id,
            "role_id": log.role_id,
            "action": log.action,
            "assigned_by_id": log.assigned_by_id,
            "reason": log.reason,
            "expires_at": log.expires_at,
            "created_at": log.created_at,
        }
        for log in logs
    ]
