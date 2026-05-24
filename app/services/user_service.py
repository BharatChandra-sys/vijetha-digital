"""
User service — profile management, admin user operations, change-password.
"""
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.core.exceptions import (
    ForbiddenException,
    NotFoundException,
    ValidationException,
)
from app.core.security import hash_password, is_strong_password, verify_password
from app.models.user import User, UserRole, UserStatus
from app.schemas.auth import ProfileUpdateRequest

# ── Profile ───────────────────────────────────────────────────────────

def get_user_by_id(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id, not User.is_deleted).first()
    if not user:
        raise NotFoundException("User", str(user_id))
    return user


def update_profile(db: Session, user: User, data: ProfileUpdateRequest) -> User:
    if data.full_name is not None:
        full_name = data.full_name.strip()
        if not full_name:
            raise ValidationException("Name cannot be empty")
        user.full_name = full_name

    if data.phone is not None:
        user.phone = data.phone.strip() or None

    if data.avatar_url is not None:
        user.avatar_url = data.avatar_url.strip() or None

    if data.address is not None:
        user.address = data.address.strip() or None

    if data.city is not None:
        user.city = data.city.strip() or None

    if data.state is not None:
        user.state = data.state.strip() or None

    if data.postal_code is not None:
        user.postal_code = data.postal_code.strip() or None

    db.commit()
    db.refresh(user)
    return user


def change_password(db: Session, user: User, current_password: str, new_password: str) -> None:
    if not verify_password(current_password, user.hashed_password):
        raise ForbiddenException("Current password is incorrect")

    if not is_strong_password(new_password):
        raise ValidationException(
            "Password must be at least 8 characters with uppercase, lowercase, digit, and special character"
        )

    user.hashed_password = hash_password(new_password)
    user.failed_login_attempts = 0
    user.account_locked_until = None
    db.commit()


# ── Admin user management ─────────────────────────────────────────────

def list_users(
    db: Session,
    page: int = 1,
    page_size: int = 20,
    role: str | None = None,
    status: str | None = None,
    search: str | None = None,
) -> dict[str, Any]:
    query = db.query(User).filter(not User.is_deleted)

    if role:
        try:
            query = query.filter(User.role == UserRole(role))
        except ValueError:
            pass

    if status:
        try:
            query = query.filter(User.status == UserStatus(status))
        except ValueError:
            pass

    if search:
        like = f"%{search}%"
        query = query.filter(
            (User.email.ilike(like)) | (User.full_name.ilike(like))
        )

    total = query.count()
    users = (
        query.order_by(User.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    pages = max(1, (total + page_size - 1) // page_size)
    return {"items": users, "total": total, "page": page, "page_size": page_size, "pages": pages}


def update_user_status(db: Session, user_id: int, new_status: str, admin_id: int) -> User:
    user = get_user_by_id(db, user_id)

    try:
        status = UserStatus(new_status)
    except ValueError:
        raise ValidationException(f"Invalid status: {new_status}")

    if user.role == UserRole.ADMIN:
        raise ForbiddenException("Cannot change status of admin accounts")

    user.status = status
    db.commit()
    db.refresh(user)
    return user


def soft_delete_user(db: Session, user_id: int, admin_id: int) -> None:
    user = get_user_by_id(db, user_id)

    if user.role == UserRole.ADMIN:
        raise ForbiddenException("Cannot delete admin accounts")

    user.is_deleted = True
    user.deleted_at = datetime.utcnow()
    user.status = UserStatus.INACTIVE
    db.commit()
