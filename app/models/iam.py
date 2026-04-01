"""
Production-level Identity and Access Management (IAM) models.
Supports role-based and permission-based access control.
"""

from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, ForeignKey, 
    Table, Text, Index, Enum, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
import enum


# ============================================================================
# ENUMS
# ============================================================================

class RoleType(str, enum.Enum):
    """Core role types"""
    SUPER_ADMIN = "super_admin"      # Full system access
    ADMIN = "admin"                   # Can manage users, roles, orders
    MANAGER = "manager"               # Can view analytics, manage operations
    DRIVER = "driver"                 # Can accept/update deliveries
    HELPER = "helper"                 # Can assist with orders
    CUSTOMER = "customer"             # Can place orders
    GUEST = "guest"                   # Limited read-only access


class PermissionCategory(str, enum.Enum):
    """Permission grouping for clarity"""
    USER_MANAGEMENT = "user_management"
    ROLE_MANAGEMENT = "role_management"
    ORDER_MANAGEMENT = "order_management"
    FINANCIAL = "financial"
    DELIVERY = "delivery"
    ANALYTICS = "analytics"
    PRODUCT = "product"
    SYSTEM = "system"


class ResourceType(str, enum.Enum):
    """Resource types for granular access control"""
    USER = "user"
    ORDER = "order"
    PRODUCT = "product"
    PAYMENT = "payment"
    DELIVERY = "delivery"
    ROLE = "role"
    PERMISSION = "permission"
    REPORT = "report"
    SETTING = "setting"
    ANALYTICS = "analytics"
    SYSTEM = "system"


class ActionType(str, enum.Enum):
    """Actions that can be performed"""
    CREATE = "create"
    READ = "read"
    UPDATE = "update"
    DELETE = "delete"
    LIST = "list"
    SUSPEND = "suspend"
    ASSIGN = "assign"
    REVOKE = "revoke"
    APPROVE = "approve"
    CANCEL = "cancel"
    REFUND = "refund"
    EXPORT = "export"
    ACCEPT = "accept"
    COMPLETE = "complete"
    MANAGE = "manage"
    FINANCIAL = "financial"
    REVENUE = "revenue"
    DASHBOARD = "dashboard"
    SETTINGS = "settings"
    LOGS = "logs"
    BACKUP = "backup"


# ============================================================================
# JUNCTION TABLES
# ============================================================================

role_permission_association = Table(
    'role_permissions',
    Base.metadata,
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    Column('permission_id', Integer, ForeignKey('permissions.id', ondelete='CASCADE'), primary_key=True),
    Index('ix_role_permissions_role_id', 'role_id'),
    Index('ix_role_permissions_permission_id', 'permission_id'),
)

user_role_association = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True),
    Column('role_id', Integer, ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True),
    Column('assigned_at', DateTime, default=datetime.utcnow),
    Column('assigned_by', Integer, ForeignKey('users.id'), nullable=True),
    Index('ix_user_roles_user_id', 'user_id'),
    Index('ix_user_roles_role_id', 'role_id'),
    Index('ix_user_roles_assigned_by', 'assigned_by'),
)


# ============================================================================
# PERMISSION MODEL
# ============================================================================

class Permission(Base):
    """
    Granular permission model for dynamic access control.
    Supports resource:action pattern (e.g., "order:create", "user:delete")
    """
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True)
    
    # permission_key: "order:create", "user:read", "delivery:update"
    permission_key = Column(String(100), unique=True, nullable=False, index=True)
    
    # Human-readable description
    display_name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Categorization
    category = Column(
        Enum(PermissionCategory, name="permission_category_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=False,
        index=True
    )
    
    resource = Column(
        Enum(ResourceType, name="resource_type_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    
    action = Column(
        Enum(ActionType, name="action_type_enum", values_callable=lambda x: [e.value for e in x]),
        nullable=False
    )
    
    # Is this permission critical/dangerous (logs required for audit)
    is_dangerous = Column(Boolean, default=False)
    
    # Can this be delegated?
    is_delegable = Column(Boolean, default=True)
    
    # Soft delete
    is_active = Column(Boolean, default=True, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    roles = relationship(
        'Role',
        secondary=role_permission_association,
        back_populates='permissions',
        lazy='selectin'
    )
    
    __table_args__ = (
        UniqueConstraint('resource', 'action', name='uq_permission_resource_action'),
        Index('ix_permissions_category', 'category'),
        Index('ix_permissions_resource_action', 'resource', 'action'),
    )


# ============================================================================
# ROLE MODEL
# ============================================================================

class Role(Base):
    """
    Production-level role model with dynamic permissions.
    Supports both built-in and custom roles.
    """
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True)
    
    # name: "Super Admin", "Order Manager", "Driver", etc.
    name = Column(String(100), unique=True, nullable=False, index=True)
    
    # slug: "super_admin", "order_manager", etc.
    slug = Column(String(100), unique=True, nullable=False, index=True)
    
    description = Column(Text, nullable=True)
    
    # Built-in roles cannot be deleted
    is_system_role = Column(Boolean, default=False)
    
    # Role is active/usable
    is_active = Column(Boolean, default=True, index=True)
    
    # Priority level for conflict resolution (higher = more privileged)
    priority = Column(Integer, default=0)
    
    # Maximum number of users that can have this role (null = unlimited)
    max_users = Column(Integer, nullable=True)
    
    # Role requires approval to assign
    requires_approval = Column(Boolean, default=False)
    
    # Inherit permissions from parent role
    parent_role_id = Column(Integer, ForeignKey('roles.id'), nullable=True)
    parent_role = relationship('Role', remote_side=[id], lazy='selectin')
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = Column(Integer, ForeignKey('users.id'), nullable=True)
    
    # Relationships
    permissions = relationship(
        'Permission',
        secondary=role_permission_association,
        back_populates='roles',
        cascade='all',
        lazy='selectin'
    )
    
    users = relationship(
        'User',
        secondary=user_role_association,
        primaryjoin=id == user_role_association.c.role_id,
        secondaryjoin="User.id == user_roles.c.user_id",
        foreign_keys=[user_role_association.c.role_id, user_role_association.c.user_id],
        back_populates='roles_assigned',
        lazy='selectin',
        overlaps="roles_assigned",
    )
    
    __table_args__ = (
        Index('ix_roles_slug', 'slug'),
        Index('ix_roles_is_active', 'is_active'),
        Index('ix_roles_priority', 'priority'),
    )


# ============================================================================
# ROLE ASSIGNMENT AUDIT LOG
# ============================================================================

class RoleAssignmentLog(Base):
    """
    Audit log for role assignments.
    Critical for compliance and security tracking.
    """
    __tablename__ = "role_assignment_logs"

    id = Column(Integer, primary_key=True)
    
    # Who was affected
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Which role
    role_id = Column(Integer, ForeignKey('roles.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # Action: "assigned", "revoked", "expired"
    action = Column(String(50), nullable=False, index=True)
    
    # Who made the change
    assigned_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    assigned_by_name = Column(String(255), nullable=True)
    
    # Reason for assignment/revocation
    reason = Column(Text, nullable=True)
    
    # Expiration details
    expires_at = Column(DateTime, nullable=True)
    revoked_at = Column(DateTime, nullable=True)
    revoked_reason = Column(Text, nullable=True)
    
    # Request approval tracking
    requires_approval = Column(Boolean, default=False)
    approved_by_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    user = relationship('User', foreign_keys=[user_id])
    role = relationship('Role')
    assigned_by = relationship('User', foreign_keys=[assigned_by_id])
    approved_by = relationship('User', foreign_keys=[approved_by_id])


# ============================================================================
# PERMISSION ACCESS LOG (Optional - for sensitive operations)
# ============================================================================

class PermissionAccessLog(Base):
    """
    Optional audit log for dangerous/sensitive operations.
    Uncomment/use if you need detailed access tracking.
    """
    __tablename__ = "permission_access_logs"

    id = Column(Integer, primary_key=True)
    
    # Who accessed/performed action
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False, index=True)
    
    # What permission was used
    permission_id = Column(Integer, ForeignKey('permissions.id'), nullable=False)
    
    # What resource was affected
    resource_type = Column(String(50), nullable=False, index=True)
    resource_id = Column(Integer, nullable=True)
    
    # What action was performed
    action = Column(String(50), nullable=False)
    
    # Request/response details
    endpoint = Column(String(255), nullable=True)
    method = Column(String(10), nullable=True)
    status_code = Column(Integer, nullable=True)
    ip_address = Column(String(50), nullable=True)
    
    # Was it successful?
    success = Column(Boolean, default=True)
    error_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    user = relationship('User')
    permission = relationship('Permission')
    
    __table_args__ = (
        Index('ix_access_logs_user_id', 'user_id'),
        Index('ix_access_logs_permission_id', 'permission_id'),
        Index('ix_access_logs_created_at', 'created_at'),
        Index('ix_access_logs_resource', 'resource_type', 'resource_id'),
    )
