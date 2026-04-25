"""
Admin user management endpoints — list, status update, soft delete.
Mounted under /admin/users-mgmt to avoid conflict with IAM users router.
"""
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.auth.dependencies import admin_required
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import AdminUserListResponse, AdminUserView
from app.services.user_service import list_users, soft_delete_user, update_user_status

router = APIRouter(prefix="/users-mgmt", tags=["admin-users"])


@router.get("", response_model=AdminUserListResponse)
def list_all_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    role: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """List all users with pagination, filtering, and search."""
    result = list_users(db, page=page, page_size=page_size, role=role, status=status, search=search)
    items = [
        AdminUserView(
            id=u.id,
            email=u.email,
            full_name=u.full_name,
            phone=u.phone,
            role=u.role.value,
            status=u.status.value,
            email_verified=u.email_verified,
            failed_login_attempts=u.failed_login_attempts or 0,
            account_locked_until=u.account_locked_until.isoformat() if u.account_locked_until else None,
            created_at=u.created_at.isoformat() if u.created_at else None,
            last_login_at=u.last_login_at.isoformat() if u.last_login_at else None,
            last_login_ip=u.last_login_ip,
            is_deleted=u.is_deleted,
        )
        for u in result["items"]
    ]
    return AdminUserListResponse(
        items=items,
        total=result["total"],
        page=result["page"],
        page_size=result["page_size"],
        pages=result["pages"],
    )


@router.patch("/{user_id}/status")
def change_user_status(
    user_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Update a user's account status (active/inactive/suspended)."""
    new_status = data.get("status", "")
    user = update_user_status(db, user_id, new_status, admin_id=current_user.id)
    return {"message": f"User status updated to {user.status.value}", "user_id": user.id}


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Soft-delete a user account (non-admin only)."""
    soft_delete_user(db, user_id, admin_id=current_user.id)
    return {"message": "User deleted", "user_id": user_id}
