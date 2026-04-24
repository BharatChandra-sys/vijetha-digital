"""
IAM System Tests
DB-dependent tests are skipped when postgres is not available (e.g. local dev without DB).
They run in CI where the postgres service container is present.
"""

import os

import pytest
from fastapi.testclient import TestClient


# ── DB availability guard ─────────────────────────────────────────────
def _db_available() -> bool:
    """Return True only when the test DB is actually reachable."""
    try:
        import psycopg2
        url = os.environ.get("DATABASE_URL", "")
        # Parse minimal connection params from the URL
        # postgresql+psycopg2://user:pass@host:port/db
        import re
        m = re.match(r"postgresql\+psycopg2://([^:]+):([^@]+)@([^:/]+):?(\d+)?/(.+)", url)
        if not m:
            return False
        user, password, host, port, dbname = m.groups()
        conn = psycopg2.connect(
            host=host, port=int(port or 5432),
            user=user, password=password, dbname=dbname,
            connect_timeout=2,
        )
        conn.close()
        return True
    except Exception:
        return False


requires_db = pytest.mark.skipif(
    not _db_available(),
    reason="PostgreSQL not available — skipped in local dev without DB",
)


# ── Model / DB tests ──────────────────────────────────────────────────

@requires_db
class TestIAMModels:
    """Test IAM model structure and relationships"""

    @pytest.fixture(autouse=True)
    def setup(self):
        from app.db.session import SessionLocal
        self.db = SessionLocal()
        yield
        self.db.close()

    def test_permissions_exist(self):
        from app.models import Permission
        count = self.db.query(Permission).count()
        assert count > 0, "No permissions found. Run: python -m app.cli.iam_init"

    def test_roles_exist(self):
        from app.models import Role
        count = self.db.query(Role).count()
        assert count > 0, "No roles found. Run: python -m app.cli.iam_init"

    def test_role_relationships(self):
        from app.models import Role
        role = self.db.query(Role).filter_by(slug="admin").first()
        assert role is not None, "Admin role not found"
        assert len(role.permissions) > 0, "Admin role has no permissions"

    def test_user_role_relationship(self):
        from app.models import User
        user = self.db.query(User).first()
        if user:
            assert hasattr(user, "roles_assigned"), "User missing roles_assigned relationship"


@requires_db
class TestRBACService:
    """Test RBAC service methods"""

    @pytest.fixture(autouse=True)
    def setup(self):
        from app.core.security import hash_password
        from app.db.session import SessionLocal
        from app.models import User, UserStatus

        self.db = SessionLocal()
        test_user = self.db.query(User).filter_by(email="rbac_test@test.com").first()
        if not test_user:
            test_user = User(
                email="rbac_test@test.com",
                full_name="Test User",
                hashed_password=hash_password("password"),
                role="customer",
                status=UserStatus.ACTIVE,
            )
            self.db.add(test_user)
            self.db.commit()
        self.user_id = test_user.id
        yield
        self.db.close()

    def test_get_user_permissions(self):
        from app.services.rbac_service import RBACService
        permissions = RBACService.get_user_permissions(self.db, self.user_id)
        assert isinstance(permissions, set)

    def test_has_permission(self):
        from app.services.rbac_service import RBACService
        result = RBACService.has_permission(self.db, self.user_id, "user:read")
        assert isinstance(result, bool)

    def test_get_user_roles(self):
        from app.services.rbac_service import RBACService
        roles = RBACService.get_user_roles(self.db, self.user_id)
        assert isinstance(roles, list)

    def test_assign_role(self):
        from app.models import User
        from app.services.rbac_service import RBACService

        admin_user = self.db.query(User).filter_by(role="admin").first() or self.db.query(User).first()
        if not admin_user:
            pytest.skip("No admin user available")

        existing = RBACService.get_user_roles(self.db, self.user_id)
        if any(r.slug == "driver" for r in existing):
            RBACService.revoke_role(self.db, self.user_id, "driver", admin_user.id, reason="cleanup")

        role = RBACService.assign_role(self.db, self.user_id, "driver", admin_user.id, reason="Testing")
        assert role is not None

        roles = RBACService.get_user_roles(self.db, self.user_id)
        assert any(r.slug == "driver" for r in roles)

    def test_revoke_role(self):
        from app.models import User
        from app.services.rbac_service import RBACService

        admin_user = self.db.query(User).filter_by(role="admin").first() or self.db.query(User).first()
        if not admin_user:
            pytest.skip("No admin user available")

        RBACService.assign_role(self.db, self.user_id, "helper", admin_user.id, reason="Testing")
        result = RBACService.revoke_role(self.db, self.user_id, "helper", admin_user.id, reason="Testing revoke")
        assert result is True


# ── API endpoint tests (no DB needed — just checks routes exist) ──────

class TestAdminAPI:
    """Test admin API endpoints exist and require auth."""

    @pytest.fixture
    def client(self):
        from app.main import app
        return TestClient(app, raise_server_exceptions=False)

    def test_admin_users_endpoint_exists(self, client):
        # Route is mounted under /api/v1/admin/users
        response = client.get("/api/v1/admin/users")
        assert response.status_code in [401, 403, 422], (
            f"Expected auth error, got {response.status_code}"
        )

    def test_admin_roles_endpoint_exists(self, client):
        response = client.get("/api/v1/admin/roles")
        assert response.status_code in [401, 403, 422], (
            f"Expected auth error, got {response.status_code}"
        )


# ── IAM initialization test ───────────────────────────────────────────

@requires_db
class TestIAMInitialization:

    def test_init_iam_system(self):
        from app.db.init_iam import init_iam_system
        from app.db.session import SessionLocal
        from app.models import Permission, Role

        db = SessionLocal()
        try:
            perm_count = db.query(Permission).count()
            db.query(Role).count()  # ensure roles table is accessible
            if perm_count == 0:
                stats = init_iam_system(db)
                assert stats["permissions_created"] > 0
                assert stats["roles_created"] > 0
        finally:
            db.close()
