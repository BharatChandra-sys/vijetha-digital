"""
Production-level RBAC (Role-Based Access Control) service.
Provides permission checking, role management, and audit logging.
"""

from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.iam import (
    Permission,
    PermissionAccessLog,
    Role,
    RoleAssignmentLog,
)
from app.models.user import User


class RBACService:
    """
    Comprehensive RBAC service for permission and role management.
    """

    @staticmethod
    def get_user_permissions(db: Session, user_id: int) -> set[str]:
        """
        Get all permissions for a user across all assigned roles.
        Returns set of permission_keys (e.g., {"order:create", "user:read"})
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return set()

        permissions = set()

        # Collect permissions from all assigned roles
        for role in user.roles_assigned:
            if not role.is_active:
                continue

            # Add role's direct permissions
            for permission in role.permissions:
                if permission.is_active:
                    permissions.add(permission.permission_key)

            # Add inherited permissions from parent role
            if role.parent_role:
                parent_perms = db.query(Permission).join(
                    Role.permissions
                ).filter(
                    Role.id == role.parent_role_id,
                    Permission.is_active
                ).all()
                for perm in parent_perms:
                    permissions.add(perm.permission_key)

        return permissions

    @staticmethod
    def has_permission(
        db: Session,
        user_id: int,
        permission_key: str,
    ) -> bool:
        """
        Check if user has specific permission.
        Returns True/False.
        """
        permissions = RBACService.get_user_permissions(db, user_id)
        return permission_key in permissions

    @staticmethod
    def has_any_role(
        db: Session,
        user_id: int,
        role_slugs: list[str],
    ) -> bool:
        """
        Check if user has ANY of the specified roles.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False

        user_role_slugs = {role.slug for role in user.roles_assigned if role.is_active}
        return bool(user_role_slugs.intersection(set(role_slugs)))

    @staticmethod
    def has_all_roles(
        db: Session,
        user_id: int,
        role_slugs: list[str],
    ) -> bool:
        """
        Check if user has ALL of the specified roles.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return False

        user_role_slugs = {role.slug for role in user.roles_assigned if role.is_active}
        return set(role_slugs).issubset(user_role_slugs)

    @staticmethod
    def get_user_roles(db: Session, user_id: int) -> list[Role]:
        """
        Return all active roles assigned to a user.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        return [role for role in user.roles_assigned if role.is_active]

    @staticmethod
    def assign_role(
        db: Session,
        user_id: int,
        role_slug: str,
        assigned_by_id: int,
        reason: str | None = None,
        expires_in_days: int | None = None,
    ) -> Role:
        """
        Assign a role to a user.

        Args:
            db: Database session
            user_id: User to assign role to
            role_slug: Role identifier
            assigned_by_id: Admin user assigning the role
            reason: Reason for assignment
            expires_in_days: Days until role expires (None = permanent)

        Returns:
            The assigned Role

        Raises:
            HTTPException: If user/role not found or already has role
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        role = db.query(Role).filter(Role.slug == role_slug, Role.is_active).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")

        # Check if user already has this role
        if role in user.roles_assigned:
            raise HTTPException(
                status_code=400,
                detail=f"User already has role: {role.name}"
            )

        # Check max_users limit
        if role.max_users is not None:
            current_users = len(role.users)
            if current_users >= role.max_users:
                raise HTTPException(
                    status_code=400,
                    detail=f"Role {role.name} has reached maximum users ({role.max_users})"
                )

        # Assign the role
        user.roles_assigned.append(role)

        # Log the assignment
        assignment_log = RoleAssignmentLog(
            user_id=user_id,
            role_id=role.id,
            action="assigned",
            assigned_by_id=assigned_by_id,
            reason=reason,
            expires_at=datetime.utcnow() + timedelta(days=expires_in_days)
            if expires_in_days else None,
            requires_approval=role.requires_approval,
        )

        db.add(assignment_log)
        db.commit()
        db.refresh(user)

        return role

    @staticmethod
    def revoke_role(
        db: Session,
        user_id: int,
        role_slug: str,
        revoked_by_id: int,
        reason: str | None = None,
    ) -> bool:
        """
        Revoke a role from a user.
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        role = db.query(Role).filter(Role.slug == role_slug).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")

        if role not in user.roles_assigned:
            raise HTTPException(
                status_code=400,
                detail=f"User does not have role: {role.name}"
            )

        # Cannot revoke system roles
        if role.is_system_role and role_slug == "super_admin":
            raise HTTPException(
                status_code=403,
                detail="Cannot revoke super_admin role"
            )

        user.roles_assigned.remove(role)

        # Log the revocation
        assignment_log = RoleAssignmentLog(
            user_id=user_id,
            role_id=role.id,
            action="revoked",
            assigned_by_id=revoked_by_id,
            revoked_at=datetime.utcnow(),
            revoked_reason=reason,
        )

        db.add(assignment_log)
        db.commit()

        return True

    @staticmethod
    def log_permission_access(
        db: Session,
        user_id: int,
        permission_id: int,
        resource_type: str,
        resource_id: int | None,
        action: str,
        endpoint: str | None = None,
        method: str | None = None,
        status_code: int | None = None,
        ip_address: str | None = None,
        success: bool = True,
        error_message: str | None = None,
    ) -> None:
        """
        Log access to sensitive/dangerous operations.
        """
        log_entry = PermissionAccessLog(
            user_id=user_id,
            permission_id=permission_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            endpoint=endpoint,
            method=method,
            status_code=status_code,
            ip_address=ip_address,
            success=success,
            error_message=error_message,
        )

        db.add(log_entry)
        db.commit()

    @staticmethod
    def create_custom_role(
        db: Session,
        name: str,
        slug: str,
        description: str | None = None,
        permission_keys: list[str] | None = None,
        created_by_id: int | None = None,
        parent_role_slug: str | None = None,
    ) -> Role:
        """
        Create a new custom role with specified permissions.
        """
        # Check if role slug already exists
        existing = db.query(Role).filter(Role.slug == slug).first()
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Role with slug '{slug}' already exists"
            )

        parent_role = None
        if parent_role_slug:
            parent_role = db.query(Role).filter(Role.slug == parent_role_slug).first()
            if not parent_role:
                raise HTTPException(status_code=404, detail="Parent role not found")

        # Fetch permissions
        permissions = []
        if permission_keys:
            permissions = db.query(Permission).filter(
                Permission.permission_key.in_(permission_keys),
                Permission.is_active
            ).all()

        role = Role(
            name=name,
            slug=slug,
            description=description,
            parent_role_id=parent_role.id if parent_role else None,
            created_by=created_by_id,
            is_system_role=False,
        )

        role.permissions = permissions
        db.add(role)
        db.commit()
        db.refresh(role)

        return role

    @staticmethod
    def enforce_permission(
        db: Session,
        user_id: int,
        permission_key: str,
        raise_exception: bool = True,
    ) -> bool:
        """
        Enforce a permission check.
        Raises HTTPException if user lacks permission (when raise_exception=True).
        """
        has_perm = RBACService.has_permission(db, user_id, permission_key)

        if not has_perm and raise_exception:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission_key}"
            )

        return has_perm

    @staticmethod
    def get_role_hierarchy(db: Session, role_id: int) -> dict:
        """
        Get the role hierarchy including inherited permissions.
        """
        role = db.query(Role).filter(Role.id == role_id).first()
        if not role:
            return {}

        hierarchy = {
            "id": role.id,
            "name": role.name,
            "slug": role.slug,
            "permissions": [p.permission_key for p in role.permissions if p.is_active],
            "parent_role": None,
            "inherited_permissions": [],
        }

        if role.parent_role:
            hierarchy["parent_role"] = {
                "id": role.parent_role.id,
                "name": role.parent_role.name,
                "slug": role.parent_role.slug,
            }
            hierarchy["inherited_permissions"] = [
                p.permission_key for p in role.parent_role.permissions if p.is_active
            ]

        return hierarchy
