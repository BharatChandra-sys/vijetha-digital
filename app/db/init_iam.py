"""
IAM Initialization and Seeding.
Creates all default roles, permissions, and relationships.
Run this once after migrations.
"""

from sqlalchemy.orm import Session

from app.models.iam import (
    ActionType,
    Permission,
    PermissionCategory,
    ResourceType,
    Role,
)

# ============================================================================
# PERMISSION DEFINITIONS
# ============================================================================

PERMISSIONS = [
    # USER MANAGEMENT
    ("user:create", "Create User", "user_management", "Can create new user accounts", False, True),
    ("user:read", "Read User", "user_management", "Can view user details", False, True),
    ("user:update", "Update User", "user_management", "Can update user information", False, True),
    ("user:delete", "Delete User", "user_management", "Can delete user accounts", True, False),
    ("user:list", "List Users", "user_management", "Can view all users", False, True),
    ("user:suspend", "Suspend User", "user_management", "Can suspend user accounts", True, False),

    # ROLE MANAGEMENT
    ("role:create", "Create Role", "role_management", "Can create custom roles", True, False),
    ("role:read", "Read Role", "role_management", "Can view role details", False, True),
    ("role:update", "Update Role", "role_management", "Can modify roles", True, False),
    ("role:delete", "Delete Role", "role_management", "Can delete roles", True, False),
    ("role:assign", "Assign Role", "role_management", "Can assign roles to users", False, True),
    ("role:revoke", "Revoke Role", "role_management", "Can revoke roles from users", True, False),

    # ORDER MANAGEMENT
    ("order:create", "Create Order", "order_management", "Can create orders", False, True),
    ("order:read", "Read Order", "order_management", "Can view order details", False, True),
    ("order:update", "Update Order", "order_management", "Can update orders", False, True),
    ("order:delete", "Delete Order", "order_management", "Can delete orders", True, False),
    ("order:list", "List Orders", "order_management", "Can view all orders", False, True),
    ("order:approve", "Approve Order", "order_management", "Can approve orders", False, True),
    ("order:cancel", "Cancel Order", "order_management", "Can cancel orders", False, True),

    # FINANCIAL
    ("payment:read", "Read Payment", "financial", "Can view payment details", False, True),
    ("payment:refund", "Refund Payment", "financial", "Can process refunds", True, False),
    ("report:financial", "Financial Reports", "financial", "Can access financial reports", False, True),
    ("report:revenue", "Revenue Reports", "financial", "Can view revenue analytics", False, True),

    # DELIVERY
    ("delivery:create", "Create Delivery", "delivery", "Can create delivery orders", False, True),
    ("delivery:read", "Read Delivery", "delivery", "Can view delivery details", False, True),
    ("delivery:update", "Update Delivery", "delivery", "Can update delivery status", False, True),
    ("delivery:accept", "Accept Delivery", "delivery", "Can accept delivery assignments", False, True),
    ("delivery:complete", "Complete Delivery", "delivery", "Can mark deliveries complete", False, True),

    # ANALYTICS
    ("report:read", "Read Reports", "analytics", "Can view analytics reports", False, True),
    ("report:export", "Export Reports", "analytics", "Can export report data", False, True),
    ("analytics:dashboard", "View Dashboard", "analytics", "Can access analytics dashboard", False, True),

    # PRODUCT MANAGEMENT
    ("product:create", "Create Product", "product", "Can create new products", False, True),
    ("product:read", "Read Product", "product", "Can view product details", False, True),
    ("product:update", "Update Product", "product", "Can edit products", False, True),
    ("product:delete", "Delete Product", "product", "Can delete products", True, False),
    ("product:list", "List Products", "product", "Can view all products", False, True),

    # SYSTEM ADMINISTRATION
    ("system:settings", "System Settings", "system", "Can modify system settings", True, False),
    ("system:logs", "View Logs", "system", "Can access system logs", False, True),
    ("system:backup", "Backup System", "system", "Can create system backups", True, False),
    ("permission:manage", "Manage Permissions", "system", "Can manage permissions", True, False),
]


ROLE_DEFINITIONS = [
    # Format: (name, slug, description, permissions, is_system, priority, max_users, parent_slug, requires_approval)

    {
        "name": "Super Admin",
        "slug": "super_admin",
        "description": "Full system access - use with caution",
        "permissions": [p[0] for p in PERMISSIONS],  # All permissions
        "is_system": True,
        "priority": 1000,
        "max_users": 2,  # Limit to 2 super admins
        "parent_slug": None,
        "requires_approval": True,
    },
    {
        "name": "Admin",
        "slug": "admin",
        "description": "Administrator with broad access",
        "permissions": [
            "user:create", "user:read", "user:update", "user:list", "user:suspend",
            "role:read", "role:assign", "role:revoke",
            "order:read", "order:list", "order:approve", "order:cancel",
            "payment:read", "report:financial", "report:revenue",
            "delivery:read", "delivery:update",
            "product:create", "product:read", "product:update", "product:list",
            "report:read", "report:export",
            "system:logs", "analytics:dashboard",
        ],
        "is_system": True,
        "priority": 900,
        "max_users": None,
        "parent_slug": None,
        "requires_approval": False,
    },
    {
        "name": "Manager",
        "slug": "manager",
        "description": "Operations manager - can oversee orders and deliveries",
        "permissions": [
            "order:read", "order:list", "order:approve", "order:update",
            "delivery:read", "delivery:create", "delivery:update",
            "product:read", "product:list",
            "report:read", "report:export",
            "analytics:dashboard",
        ],
        "is_system": True,
        "priority": 500,
        "max_users": None,
        "parent_slug": None,
        "requires_approval": False,
    },
    {
        "name": "Driver",
        "slug": "driver",
        "description": "Delivery driver - can manage assigned deliveries",
        "permissions": [
            "delivery:read", "delivery:accept", "delivery:update", "delivery:complete",
            "order:read",
        ],
        "is_system": True,
        "priority": 200,
        "max_users": None,
        "parent_slug": None,
        "requires_approval": False,
    },
    {
        "name": "Helper",
        "slug": "helper",
        "description": "Helper - can assist with operations and order processing",
        "permissions": [
            "order:read", "order:list",
            "delivery:read", "delivery:accept",
            "product:read", "product:list",
        ],
        "is_system": True,
        "priority": 100,
        "max_users": None,
        "parent_slug": None,
        "requires_approval": False,
    },
    {
        "name": "Customer",
        "slug": "customer",
        "description": "Regular customer - can place and view own orders",
        "permissions": [
            "order:create", "order:read", "order:list",
            "payment:read",
            "product:read", "product:list",
        ],
        "is_system": True,
        "priority": 50,
        "max_users": None,
        "parent_slug": None,
        "requires_approval": False,
    },
    {
        "name": "Guest",
        "slug": "guest",
        "description": "Guest user - read-only product browsing",
        "permissions": [
            "product:read", "product:list",
        ],
        "is_system": True,
        "priority": 10,
        "max_users": None,
        "parent_slug": None,
        "requires_approval": False,
    },
]


# ============================================================================
# INITIALIZATION FUNCTION
# ============================================================================

def init_iam_system(db: Session) -> dict:
    """
    Initialize the complete IAM system.
    Creates all permissions and default roles.

    Returns:
        dict with created counts
    """

    stats = {
        "permissions_created": 0,
        "permissions_skipped": 0,
        "roles_created": 0,
        "roles_skipped": 0,
    }

    # Create permissions
    print("\n🔐 Creating Permissions...")
    for perm_key, display_name, category, description, is_dangerous, is_delegable in PERMISSIONS:
        existing = db.query(Permission).filter(
            Permission.permission_key == perm_key
        ).first()

        if existing:
            stats["permissions_skipped"] += 1
            continue

        # Parse resource and action from key (e.g., "order:create" -> "order", "create")
        resource_str, action_str = perm_key.split(":")

        try:
            resource = ResourceType(resource_str)
            action = ActionType(action_str)
            cat = PermissionCategory(category)
        except ValueError as e:
            print(f"  ⚠️  Skipping {perm_key}: {str(e)}")
            continue

        permission = Permission(
            permission_key=perm_key,
            display_name=display_name,
            description=description,
            category=cat,
            resource=resource,
            action=action,
            is_dangerous=is_dangerous,
            is_delegable=is_delegable,
        )

        db.add(permission)
        stats["permissions_created"] += 1
        print(f"  ✓ {perm_key}: {display_name}")

    db.commit()

    # Create roles
    print("\n👥 Creating Roles...")
    for role_def in ROLE_DEFINITIONS:
        existing = db.query(Role).filter(Role.slug == role_def["slug"]).first()

        if existing:
            stats["roles_skipped"] += 1
            print(f"  ⊘ {role_def['name']} (already exists)")
            continue

        # Get permissions
        perms = db.query(Permission).filter(
            Permission.permission_key.in_(role_def["permissions"]),
            Permission.is_active
        ).all()

        # Get parent role if specified
        parent_role = None
        if role_def["parent_slug"]:
            parent_role = db.query(Role).filter(
                Role.slug == role_def["parent_slug"]
            ).first()

        role = Role(
            name=role_def["name"],
            slug=role_def["slug"],
            description=role_def["description"],
            is_system_role=role_def["is_system"],
            priority=role_def["priority"],
            max_users=role_def["max_users"],
            parent_role_id=parent_role.id if parent_role else None,
            requires_approval=role_def["requires_approval"],
        )

        role.permissions = perms
        db.add(role)
        stats["roles_created"] += 1
        print(f"  ✓ {role_def['name']} ({len(perms)} permissions)")

    db.commit()

    print("\n✅ IAM System Initialized!")
    print(f"   Permissions: {stats['permissions_created']} created, {stats['permissions_skipped']} skipped")
    print(f"   Roles: {stats['roles_created']} created, {stats['roles_skipped']} skipped")

    return stats


def reset_iam_system(db: Session) -> None:
    """
    DANGEROUS: Reset the entire IAM system.
    Only use for development/testing.
    """
    db.query(Role).delete()
    db.query(Permission).delete()
    db.commit()
    print("⚠️  IAM system reset complete")
