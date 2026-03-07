"""
Authentication dependencies for backward compatibility.
All auth/authorization logic now lives in app.core.deps.

This file re-exports from core.deps to avoid breaking existing imports.
New code should import from app.core.deps directly.
"""

# Re-export all dependencies from core.deps
from app.core.deps import (
    get_current_user,
    get_current_active_user,
    require_admin,
    require_super_admin,
    require_any_role,
    require_all_roles,
    require_permission,
    require_any_permission,
    require_all_permissions,
    get_current_user_optional,
)

# Backward compatibility alias
admin_required = require_admin

__all__ = [
    "get_current_user",
    "get_current_active_user",
    "require_admin",
    "admin_required",  # Backward compatibility
    "require_super_admin",
    "require_any_role",
    "require_all_roles",
    "require_permission",
    "require_any_permission",
    "require_all_permissions",
    "get_current_user_optional",
]
