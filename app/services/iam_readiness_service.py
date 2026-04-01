"""IAM readiness checks used for operational health reporting."""

from __future__ import annotations

from sqlalchemy import inspect
from sqlalchemy.orm import Session

from app.models.iam import Permission, Role, RoleAssignmentLog, user_role_association


class IAMReadinessService:
    """Compute IAM readiness checks for admin diagnostics."""

    REQUIRED_TABLES = {
        "permissions",
        "roles",
        "role_permissions",
        "user_roles",
        "role_assignment_logs",
    }
    REQUIRED_ROLE_SLUGS = {"super_admin", "admin", "manager", "driver", "helper", "customer"}

    @staticmethod
    def build_report(db: Session) -> dict:
        engine = db.get_bind()
        inspector = inspect(engine)
        tables = set(inspector.get_table_names())

        permissions_count = db.query(Permission).filter(Permission.is_active == True).count()
        roles = db.query(Role).all()
        roles_count = len(roles)
        active_roles_count = len([role for role in roles if role.is_active])
        user_role_assignments = db.execute(user_role_association.select()).fetchall()
        assignment_count = len(user_role_assignments)
        role_logs_count = db.query(RoleAssignmentLog).count()

        existing_slugs = {role.slug for role in roles}
        missing_roles = sorted(list(IAMReadinessService.REQUIRED_ROLE_SLUGS - existing_slugs))
        missing_tables = sorted(list(IAMReadinessService.REQUIRED_TABLES - tables))

        checks = {
            "tables_present": len(missing_tables) == 0,
            "permissions_seeded": permissions_count > 0,
            "roles_seeded": roles_count > 0,
            "required_roles_available": len(missing_roles) == 0,
            "user_role_assignments_exist": assignment_count > 0,
            "role_assignment_logging_available": role_logs_count >= 0,
        }

        failed_checks = [name for name, passed in checks.items() if not passed]
        status = "healthy" if len(failed_checks) == 0 else "warning"

        return {
            "status": status,
            "checks": checks,
            "failedChecks": failed_checks,
            "metrics": {
                "permissions": permissions_count,
                "roles": roles_count,
                "activeRoles": active_roles_count,
                "userRoleAssignments": assignment_count,
                "roleAssignmentLogs": role_logs_count,
            },
            "missing": {
                "tables": missing_tables,
                "roles": missing_roles,
            },
        }
