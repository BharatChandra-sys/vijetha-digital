"""
Admin API endpoints for IAM role management.
Manage roles, permissions, and role-permission associations.
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from app.db.session import get_db
from app.models.user import User
from app.models.iam import Role, Permission, RoleType, PermissionCategory
from app.services.rbac_service import RBACService
from app.api.auth.dependencies import get_current_user, require_permission
from pydantic import BaseModel

router = APIRouter(prefix="/roles", tags=["admin-roles"])


# ============================================================================
# SCHEMAS
# ============================================================================

class PermissionResponse(BaseModel):
    id: int
    permission_key: str
    display_name: str
    description: Optional[str]
    category: str
    is_dangerous: bool
    created_at: datetime

    class Config:
        from_attributes = True


class RoleResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str]
    is_system_role: bool
    is_active: bool
    priority: int
    max_users: Optional[int]
    created_at: datetime
    permissions: List[PermissionResponse]

    class Config:
        from_attributes = True


class CreateRoleRequest(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    permission_keys: List[str] = []
    parent_role_slug: Optional[str] = None
    priority: int = 0
    max_users: Optional[int] = None


class UpdateRoleRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    permission_keys: Optional[List[str]] = None
    is_active: Optional[bool] = None


class AddPermissionsRequest(BaseModel):
    permission_keys: List[str]


# ============================================================================
# LIST ROLES
# ============================================================================

@router.get("", response_model=List[RoleResponse])
def list_roles(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:read")),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    is_active: Optional[bool] = None,
):
    """
    List all roles.
    Requires: role:read permission
    """
    query = db.query(Role)

    if is_active is not None:
        query = query.filter(Role.is_active == is_active)

    roles = query.offset(skip).limit(limit).all()

    return [
        {
            "id": r.id,
            "name": r.name,
            "slug": r.slug,
            "description": r.description,
            "is_system_role": r.is_system_role,
            "is_active": r.is_active,
            "priority": r.priority,
            "max_users": r.max_users,
            "created_at": r.created_at,
            "permissions": [
                {
                    "id": p.id,
                    "permission_key": p.permission_key,
                    "display_name": p.display_name,
                    "description": p.description,
                    "category": p.category.value,
                    "is_dangerous": p.is_dangerous,
                    "created_at": p.created_at,
                }
                for p in r.permissions
            ],
        }
        for r in roles
    ]


# ============================================================================
# GET ROLE DETAILS
# ============================================================================

@router.get("/{role_slug}", response_model=RoleResponse)
def get_role(
    role_slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:read")),
):
    """
    Get detailed information about a specific role.
    Requires: role:read permission
    """
    role = db.query(Role).filter(Role.slug == role_slug).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    return {
        "id": role.id,
        "name": role.name,
        "slug": role.slug,
        "description": role.description,
        "is_system_role": role.is_system_role,
        "is_active": role.is_active,
        "priority": role.priority,
        "max_users": role.max_users,
        "created_at": role.created_at,
        "permissions": [
            {
                "id": p.id,
                "permission_key": p.permission_key,
                "display_name": p.display_name,
                "description": p.description,
                "category": p.category.value,
                "is_dangerous": p.is_dangerous,
                "created_at": p.created_at,
            }
            for p in role.permissions
        ],
    }


# ============================================================================
# CREATE CUSTOM ROLE
# ============================================================================

@router.post("", response_model=RoleResponse, status_code=201)
def create_role(
    request: CreateRoleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:create")),
):
    """
    Create a new custom role.
    Requires: role:create permission
    """
    if request.slug.startswith("system_"):
        raise HTTPException(
            status_code=400,
            detail="Custom roles cannot start with 'system_'"
        )

    role = RBACService.create_custom_role(
        db=db,
        name=request.name,
        slug=request.slug,
        description=request.description,
        permission_keys=request.permission_keys,
        created_by_id=current_user.id,
        parent_role_slug=request.parent_role_slug,
    )

    role.priority = request.priority
    role.max_users = request.max_users
    db.commit()
    db.refresh(role)

    return {
        "id": role.id,
        "name": role.name,
        "slug": role.slug,
        "description": role.description,
        "is_system_role": role.is_system_role,
        "is_active": role.is_active,
        "priority": role.priority,
        "max_users": role.max_users,
        "created_at": role.created_at,
        "permissions": [
            {
                "id": p.id,
                "permission_key": p.permission_key,
                "display_name": p.display_name,
                "description": p.description,
                "category": p.category.value,
                "is_dangerous": p.is_dangerous,
                "created_at": p.created_at,
            }
            for p in role.permissions
        ],
    }


# ============================================================================
# UPDATE ROLE
# ============================================================================

@router.put("/{role_slug}", response_model=RoleResponse)
def update_role(
    role_slug: str,
    request: UpdateRoleRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:update")),
):
    """
    Update role information and permissions.
    Requires: role:update permission
    """
    role = db.query(Role).filter(Role.slug == role_slug).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if role.is_system_role:
        raise HTTPException(
            status_code=400,
            detail="System roles cannot be modified"
        )

    if request.name:
        role.name = request.name
    if request.description is not None:
        role.description = request.description
    if request.is_active is not None:
        role.is_active = request.is_active

    if request.permission_keys is not None:
        permissions = db.query(Permission).filter(
            Permission.permission_key.in_(request.permission_keys),
            Permission.is_active == True
        ).all()
        role.permissions = permissions

    db.commit()
    db.refresh(role)

    return {
        "id": role.id,
        "name": role.name,
        "slug": role.slug,
        "description": role.description,
        "is_system_role": role.is_system_role,
        "is_active": role.is_active,
        "priority": role.priority,
        "max_users": role.max_users,
        "created_at": role.created_at,
        "permissions": [
            {
                "id": p.id,
                "permission_key": p.permission_key,
                "display_name": p.display_name,
                "description": p.description,
                "category": p.category.value,
                "is_dangerous": p.is_dangerous,
                "created_at": p.created_at,
            }
            for p in role.permissions
        ],
    }


# ============================================================================
# ADD PERMISSIONS TO ROLE
# ============================================================================

@router.post("/{role_slug}/permissions")
def add_permissions_to_role(
    role_slug: str,
    request: AddPermissionsRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:update")),
):
    """
    Add permissions to an existing role.
    Requires: role:update permission
    """
    role = db.query(Role).filter(Role.slug == role_slug).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    permissions = db.query(Permission).filter(
        Permission.permission_key.in_(request.permission_keys),
        Permission.is_active == True
    ).all()

    for perm in permissions:
        if perm not in role.permissions:
            role.permissions.append(perm)

    db.commit()

    return {
        "message": f"Added {len(permissions)} permissions to {role.name}",
        "permissions_added": [p.permission_key for p in permissions]
    }


# ============================================================================
# REMOVE PERMISSIONS FROM ROLE
# ============================================================================

@router.delete("/{role_slug}/permissions/{permission_key}")
def remove_permission_from_role(
    role_slug: str,
    permission_key: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:update")),
):
    """
    Remove a permission from a role.
    Requires: role:update permission
    """
    role = db.query(Role).filter(Role.slug == role_slug).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    permission = db.query(Permission).filter(
        Permission.permission_key == permission_key
    ).first()
    if not permission:
        raise HTTPException(status_code=404, detail="Permission not found")

    if permission in role.permissions:
        role.permissions.remove(permission)
        db.commit()

    return {"message": f"Removed {permission_key} from {role.name}"}


# ============================================================================
# DELETE ROLE
# ============================================================================

@router.delete("/{role_slug}", status_code=204)
def delete_role(
    role_slug: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:delete")),
):
    """
    Delete a custom role.
    Cannot delete system roles.
    Requires: role:delete permission
    """
    role = db.query(Role).filter(Role.slug == role_slug).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    if role.is_system_role:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete system roles"
        )

    # Check if role is assigned to any users
    if role.users:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete role with {len(role.users)} assigned users"
        )

    db.delete(role)
    db.commit()

    return None


# ============================================================================
# LIST PERMISSIONS
# ============================================================================

@router.get("/permissions", response_model=List[PermissionResponse])
def list_permissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission("role:read")),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = None,
):
    """
    List all available permissions.
    Requires: role:read permission
    """
    query = db.query(Permission).filter(Permission.is_active == True)

    if category:
        try:
            cat = PermissionCategory(category)
            query = query.filter(Permission.category == cat)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid category: {category}")

    permissions = query.offset(skip).limit(limit).all()

    return [
        {
            "id": p.id,
            "permission_key": p.permission_key,
            "display_name": p.display_name,
            "description": p.description,
            "category": p.category.value,
            "is_dangerous": p.is_dangerous,
            "created_at": p.created_at,
        }
        for p in permissions
    ]
