import enum
from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, Enum, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base
from app.models.iam import user_role_association


class UserRole(enum.StrEnum):
    """Legacy role enum - deprecated in favor of IAM system"""
    ADMIN = "admin"
    CUSTOMER = "customer"
    DRIVER = "driver"
    HELPER = "helper"


class UserStatus(enum.StrEnum):
    """User account status"""
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"
    PENDING_VERIFICATION = "pending_verification"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    email = Column(String(255), unique=True, nullable=False, index=True)

    hashed_password = Column(String(255), nullable=False)

    full_name = Column(String(255), nullable=False)

    # Legacy role - kept for backward compatibility, but use roles_assigned instead
    role = Column(
        Enum(UserRole, name="user_role_enum"),
        nullable=False,
        default=UserRole.CUSTOMER,
    )

    # New status field
    status = Column(
        Enum(UserStatus, name="user_status_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        default=UserStatus.ACTIVE,
        index=True
    )

    # Contact details
    phone = Column(String(20), nullable=True, index=True)

    # Profile info
    avatar_url = Column(String(500), nullable=True)
    address = Column(String(500), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)

    reset_token = Column(String(255), nullable=True, index=True)
    reset_token_expiry = Column(DateTime, nullable=True)

    # Email verification
    email_verified = Column(Boolean, default=False)
    email_verified_at = Column(DateTime, nullable=True)

    # Last login tracking
    last_login_at = Column(DateTime, nullable=True)
    last_login_ip = Column(String(50), nullable=True)

    # Account security
    mfa_enabled = Column(Boolean, default=False)
    mfa_secret = Column(String(255), nullable=True)

    # Failed login tracking
    failed_login_attempts = Column(Integer, default=0, nullable=False)
    last_failed_login_at = Column(DateTime, nullable=True)
    account_locked_until = Column(DateTime, nullable=True)
    account_locked_reason = Column(String(500), nullable=True)

    # Notification preferences (JSON: {"email": true, "sms": false, "push": true})
    notification_preferences = Column(JSON, nullable=True, default=dict)

    # Business/GST info (optional, for business customers)
    gst_number = Column(String(20), nullable=True)
    company_name = Column(String(255), nullable=True)

    # Notes (admin-only internal notes)
    admin_notes = Column(Text, nullable=True)

    # Soft delete
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, nullable=True)  # Admin who created this user

    # Relationships
    orders = relationship(
        "Order",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    reviews = relationship(
        "Review",
        back_populates="user",
        cascade="all, delete-orphan",
        foreign_keys="Review.user_id",
    )

    staff_profile = relationship(
        "Staff",
        back_populates="user",
        uselist=False,
        lazy="select",
    )

    # IAM relationships - many-to-many
    # Explicit joins required because user_roles has two FKs to users (user_id + assigned_by)
    roles_assigned = relationship(
        "Role",
        secondary=user_role_association,
        primaryjoin=id == user_role_association.c.user_id,
        secondaryjoin="Role.id == user_roles.c.role_id",
        foreign_keys=[user_role_association.c.user_id, user_role_association.c.role_id],
        back_populates="users",
        lazy="selectin",
        overlaps="users",
    )

    __table_args__ = (
        Index('ix_users_status', 'status'),
        Index('ix_users_created_at', 'created_at'),
        Index('ix_users_phone', 'phone'),
    )
