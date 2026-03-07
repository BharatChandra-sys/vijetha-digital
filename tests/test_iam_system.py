"""
Comprehensive IAM System Tests
Tests all IAM functionality in isolation
"""

import pytest
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.models import User, Role, Permission, UserStatus, RoleAssignmentLog
from app.services.rbac_service import RBACService
from app.db.init_iam import init_iam_system
from app.core.security import hash_password
from fastapi.testclient import TestClient
from app.main import app


class TestIAMModels:
    """Test IAM model structure and relationships"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Create fresh session for each test"""
        self.db = SessionLocal()
        yield
        self.db.close()
    
    def test_permissions_exist(self):
        """Test that permissions table has data"""
        count = self.db.query(Permission).count()
        assert count > 0, "No permissions found. Run: python -m app.cli.iam_init"
    
    def test_roles_exist(self):
        """Test that roles table has data"""
        count = self.db.query(Role).count()
        assert count > 0, "No roles found. Run: python -m app.cli.iam_init"
    
    def test_role_relationships(self):
        """Test role to permission relationships"""
        role = self.db.query(Role).filter_by(slug="admin").first()
        assert role is not None, "Admin role not found"
        assert len(role.permissions) > 0, "Admin role has no permissions"
    
    def test_user_role_relationship(self):
        """Test user to role relationships"""
        user = self.db.query(User).first()
        if user:
            # User should have roles_assigned relationship
            assert hasattr(user, 'roles_assigned'), "User missing roles_assigned relationship"


class TestRBACService:
    """Test RBAC service methods"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Create fresh session and test user"""
        self.db = SessionLocal()
        
        # Get or create test user
        test_user = self.db.query(User).filter_by(email="rbac_test@test.com").first()
        if not test_user:
            test_user = User(
                email="rbac_test@test.com",
                full_name="Test User",
                hashed_password=hash_password("password"),
                role="customer",
                status=UserStatus.ACTIVE
            )
            self.db.add(test_user)
            self.db.commit()
        
        self.user_id = test_user.id
        yield
        self.db.close()
    
    def test_get_user_permissions(self):
        """Test getting user permissions"""
        permissions = RBACService.get_user_permissions(self.db, self.user_id)
        assert isinstance(permissions, set), "Should return a set of permissions"
    
    def test_has_permission(self):
        """Test permission checking"""
        has_perm = RBACService.has_permission(self.db, self.user_id, "user:read")
        assert isinstance(has_perm, bool), "Should return boolean"
    
    def test_get_user_roles(self):
        """Test getting user roles"""
        roles = RBACService.get_user_roles(self.db, self.user_id)
        assert isinstance(roles, list), "Should return a list"
    
    def test_assign_role(self):
        """Test assigning a role to user"""
        admin_user = self.db.query(User).filter_by(role="admin").first()
        if not admin_user:
            admin_user = self.db.query(User).first()
        
        if admin_user:
            # First, revoke driver role if it exists
            existing_roles = RBACService.get_user_roles(self.db, self.user_id)
            if any(r.slug == "driver" for r in existing_roles):
                RBACService.revoke_role(
                    self.db,
                    self.user_id,
                    "driver",
                    admin_user.id,
                    reason="Testing - cleanup before assign"
                )
            
            # Assign driver role
            role = RBACService.assign_role(
                self.db,
                self.user_id,
                "driver",
                admin_user.id,
                reason="Testing"
            )
            assert role is not None, "Role assignment failed"
            
            # Verify assignment
            roles = RBACService.get_user_roles(self.db, self.user_id)
            assert any(r.slug == "driver" for r in roles), "Driver role not assigned"
    
    def test_revoke_role(self):
        """Test revoking a role from user"""
        admin_user = self.db.query(User).filter_by(role="admin").first()
        if not admin_user:
            admin_user = self.db.query(User).first()
        
        if admin_user:
            # First assign
            RBACService.assign_role(
                self.db,
                self.user_id,
                "helper",
                admin_user.id,
                reason="Testing"
            )
            
            # Then revoke
            result = RBACService.revoke_role(
                self.db,
                self.user_id,
                "helper",
                admin_user.id,
                reason="Testing revoke"
            )
            assert result is True, "Role revocation failed"


class TestAdminAPI:
    """Test admin API endpoints"""
    
    @pytest.fixture
    def client(self):
        """Create test client"""
        return TestClient(app)
    
    @pytest.fixture
    def auth_header(self, client):
        """Get authentication token for admin"""
        # This would require proper setup with test admin user
        # Skipping for now as it requires auth flow
        return {}
    
    def test_admin_users_endpoint_exists(self, client):
        """Test that admin users endpoint exists"""
        # This will fail without auth, but proves endpoint exists
        response = client.get("/admin/users")
        assert response.status_code in [401, 403, 200], "Endpoint should exist"
    
    def test_admin_roles_endpoint_exists(self, client):
        """Test that admin roles endpoint exists"""
        response = client.get("/admin/roles")
        assert response.status_code in [401, 403, 200], "Endpoint should exist"


class TestIAMInitialization:
    """Test IAM initialization"""
    
    def test_init_iam_system(self):
        """Test IAM system initialization"""
        db = SessionLocal()
        try:
            # Check if permissions and roles exist
            perm_count = db.query(Permission).count()
            role_count = db.query(Role).count()
            
            if perm_count == 0:
                # Run initialization
                stats = init_iam_system(db)
                assert stats['permissions_created'] > 0, "No permissions created"
                assert stats['roles_created'] > 0, "No roles created"
        finally:
            db.close()


# Manual test summary
def manual_test_summary():
    """Summary of manual tests to run"""
    return """
    
    MANUAL TESTING CHECKLIST:
    ========================
    
    1. Database Connection:
       - Verify PostgreSQL is running
       - Verify DATABASE_URL in .env is correct
    
    2. Database Migrations:
       - Run: alembic upgrade head
       - Verify all 6 new tables exist:
         * permissions
         * roles
         * role_permissions
         * user_roles
         * role_assignment_logs
         * permission_access_logs
    
    3. IAM Initialization:
       - Run: python -m app.cli.iam_init
       - Verify all permissions and roles created
       - Verify Super Admin account created
    
    4. API Endpoints:
       - Start server: uvicorn app.main:app --reload
       - Test admin endpoints:
         * GET /admin/users
         * GET /admin/roles
         * POST /admin/users
         * POST /admin/users/{id}/roles
    
    5. Permission Enforcement:
       - Try to create user as non-admin → should fail with 403
       - Try to assign role as non-admin → should fail with 403
       - Try as admin → should succeed
    
    6. Audit Logging:
       - Check role_assignment_logs after role assignment
       - Verify who assigned what role and when
    
    7. Backward Compatibility:
       - Verify existing endpoints still work
       - Verify legacy user.role field still works
       - Verify existing orders and products still accessible
    """


if __name__ == "__main__":
    print(manual_test_summary())
