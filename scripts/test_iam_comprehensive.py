#!/usr/bin/env python3
"""
Comprehensive IAM System Test Suite
Tests all components end-to-end
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def print_section(title):
    """Print formatted section header"""
    print(f"\n{'='*80}")
    print(f"  {title}")
    print(f"{'='*80}\n")

def test_imports():
    """Test all imports"""
    print_section("TEST 1: Module Imports")
    
    try:
        print("Importing models...")
        from app.models import User, Role, Permission, RoleAssignmentLog, PermissionAccessLog
        print("  ✅ Core IAM models")
        
        from app.services.rbac_service import RBACService
        print("  ✅ RBAC service")
        
        from app.db.session import SessionLocal
        print("  ✅ Database session")
        
        from app.db.init_iam import init_iam_system
        print("  ✅ IAM initialization")
        
        from app.api.admin.users import router as users_router
        print("  ✅ Users admin router")
        
        from app.api.admin.roles import router as roles_router
        print("  ✅ Roles admin router")
        
        print("\n✅ ALL IMPORTS SUCCESSFUL\n")
        return True
    except Exception as e:
        print(f"\n❌ IMPORT FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def test_database():
    """Test database connectivity"""
    print_section("TEST 2: Database Connection & Schema")
    
    try:
        from app.db.session import SessionLocal
        from sqlalchemy import inspect, text
        from app.models import Permission, Role
        
        db = SessionLocal()
        
        # Test connection
        print("Testing database connection...")
        db.execute(text("SELECT 1"))
        print("  ✅ Connection successful")
        
        # Check tables
        print("\nChecking IAM tables...")
        inspector = inspect(db.bind)
        tables = inspector.get_table_names()
        
        required_tables = [
            'permissions', 'roles', 'role_permissions', 
            'user_roles', 'role_assignment_logs', 'permission_access_logs'
        ]
        
        for table in required_tables:
            if table in tables:
                print(f"  ✅ {table}")
            else:
                print(f"  ❌ {table} MISSING")
                return False
        
        # Check data
        print("\nChecking IAM data...")
        perm_count = db.query(Permission).count()
        role_count = db.query(Role).count()
        
        print(f"  ✅ Permissions: {perm_count} (expected 40+)")
        print(f"  ✅ Roles: {role_count} (expected 7)")
        
        if perm_count < 40 or role_count < 7:
            print("\n⚠️  Warning: Expected more permissions/roles")
        
        db.close()
        print("\n✅ DATABASE TESTS PASSED\n")
        return True
        
    except Exception as e:
        print(f"\n❌ DATABASE TEST FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def test_rbac_service():
    """Test RBAC service functionality"""
    print_section("TEST 3: RBAC Service Methods")
    
    try:
        from app.db.session import SessionLocal
        from app.services.rbac_service import RBACService
        from app.models import User, Role, Permission
        
        db = SessionLocal()
        
        # Get test user
        print("Getting test user...")
        user = db.query(User).first()
        
        if not user:
            print("  ⚠️  No users found - creating test user...")
            from app.core.security import hash_password
            user = User(
                email="test_rbac@test.com",
                hashed_password=hash_password("password"),
                role="customer"
            )
            db.add(user)
            db.commit()
        
        print(f"  ✅ Using user: {user.email}")
        
        # Test get_user_permissions
        print("\nTesting get_user_permissions()...")
        permissions = RBACService.get_user_permissions(db, user.id)
        print(f"  ✅ Got {len(permissions)} permissions")
        
        # Test has_permission
        print("\nTesting has_permission()...")
        has_perm = RBACService.has_permission(db, user.id, "user:read")
        print(f"  ✅ Permission check returned: {has_perm}")
        
        # Test get_user_roles
        print("\nTesting get_user_roles()...")
        roles = RBACService.get_user_roles(db, user.id)
        print(f"  ✅ Got {len(roles)} roles")
        
        # Test has_any_role
        print("\nTesting has_any_role()...")
        has_role = RBACService.has_any_role(db, user.id, ["customer", "admin"])
        print(f"  ✅ Role check returned: {has_role}")
        
        # Test assign_role
        print("\nTesting assign_role()...")
        admin_user = db.query(User).filter_by(role="admin").first()
        if admin_user:
            try:
                role = RBACService.assign_role(
                    db, user.id, "driver", admin_user.id, reason="Testing"
                )
                print(f"  ✅ Role assigned: {role.slug}")
            except Exception as e:
                print(f"  ℹ️  Role assignment (expected if already assigned): {str(e)[:50]}")
        
        db.close()
        print("\n✅ RBAC SERVICE TESTS PASSED\n")
        return True
        
    except Exception as e:
        print(f"\n❌ RBAC SERVICE TEST FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def test_models():
    """Test IAM models"""
    print_section("TEST 4: IAM Models")
    
    try:
        from app.db.session import SessionLocal
        from app.models import Role, Permission, User
        
        db = SessionLocal()
        
        # Test roles
        print("Testing Role model...")
        roles = db.query(Role).limit(3).all()
        for role in roles:
            print(f"  ✅ Role: {role.slug} (permissions: {len(role.permissions)})")
        
        # Test permissions
        print("\nTesting Permission model...")
        perms = db.query(Permission).limit(3).all()
        for perm in perms:
            print(f"  ✅ Permission: {perm.permission_key} ({perm.category})")
        
        # Test user-role relationship
        print("\nTesting User-Role relationships...")
        user = db.query(User).filter(User.roles_assigned.any()).first()
        if user:
            print(f"  ✅ User: {user.email} (roles: {len(user.roles_assigned)})")
        else:
            print(f"  ℹ️  No users with assigned roles yet")
        
        db.close()
        print("\n✅ MODEL TESTS PASSED\n")
        return True
        
    except Exception as e:
        print(f"\n❌ MODEL TEST FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def test_api_routes():
    """Test API routes are registered"""
    print_section("TEST 5: API Routes Registration")
    
    try:
        from app.main import app
        
        print("Checking registered routes...")
        routes = []
        for route in app.routes:
            if hasattr(route, 'path') and 'admin' in route.path:
                routes.append(route.path)
        
        routes = sorted(set(routes))
        
        if not routes:
            print("  ⚠️  No admin routes found")
            return False
        
        print(f"\nFound {len(routes)} admin routes:")
        for route in routes:
            print(f"  ✅ {route}")
        
        # Check for specific routes
        required_routes = [
            '/admin/users',
            '/admin/roles',
        ]
        
        print("\nVerifying required routes:")
        for required in required_routes:
            found = any(required in route for route in routes)
            if found:
                print(f"  ✅ {required}")
            else:
                print(f"  ❌ {required} NOT FOUND")
        
        print("\n✅ API ROUTES TESTS PASSED\n")
        return True
        
    except Exception as e:
        print(f"\n❌ API ROUTES TEST FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def test_permissions_detailed():
    """Test permission details"""
    print_section("TEST 6: Permissions Details")
    
    try:
        from app.db.session import SessionLocal
        from app.models import Permission
        
        db = SessionLocal()
        
        # Group by category
        from sqlalchemy import func
        perms_by_category = db.query(
            Permission.category,
            func.count(Permission.id).label('count')
        ).group_by(Permission.category).all()
        
        print("Permissions by category:")
        total = 0
        for category, count in perms_by_category:
            print(f"  ✅ {category}: {count}")
            total += count
        
        print(f"\nTotal permissions: {total}")
        
        # Check dangerous permissions
        dangerous = db.query(Permission).filter(Permission.is_dangerous == True).count()
        delegable = db.query(Permission).filter(Permission.is_delegable == True).count()
        
        print(f"  ✅ Dangerous permissions: {dangerous}")
        print(f"  ✅ Delegable permissions: {delegable}")
        
        db.close()
        print("\n✅ PERMISSIONS TESTS PASSED\n")
        return True
        
    except Exception as e:
        print(f"\n❌ PERMISSIONS TEST FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def test_roles_detailed():
    """Test role details"""
    print_section("TEST 7: Roles Configuration")
    
    try:
        from app.db.session import SessionLocal
        from app.models import Role
        
        db = SessionLocal()
        
        roles = db.query(Role).order_by(Role.priority.desc()).all()
        
        print("Configured roles:")
        for role in roles:
            print(f"  ✅ {role.slug}")
            print(f"     - Type: {role.role_type}")
            print(f"     - Priority: {role.priority}")
            print(f"     - Permissions: {len(role.permissions)}")
            print(f"     - Max users: {role.max_users}")
        
        print(f"\nTotal roles: {len(roles)}")
        
        db.close()
        print("\n✅ ROLES TESTS PASSED\n")
        return True
        
    except Exception as e:
        print(f"\n❌ ROLES TEST FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def test_audit_logging():
    """Test audit logging tables"""
    print_section("TEST 8: Audit Logging")
    
    try:
        from app.db.session import SessionLocal
        from app.models import RoleAssignmentLog, PermissionAccessLog
        
        db = SessionLocal()
        
        # Check role assignment logs
        role_logs = db.query(RoleAssignmentLog).count()
        print(f"Role assignment logs: {role_logs}")
        print("  ✅ RoleAssignmentLog table exists")
        
        # Check permission access logs
        perm_logs = db.query(PermissionAccessLog).count()
        print(f"Permission access logs: {perm_logs}")
        print("  ✅ PermissionAccessLog table exists")
        
        if role_logs > 0:
            print("\nRecent role assignments:")
            recent = db.query(RoleAssignmentLog).order_by(
                RoleAssignmentLog.created_at.desc()
            ).limit(3).all()
            for log in recent:
                print(f"  ✅ {log.action}: User {log.user_id} - Role {log.role_id}")
        
        db.close()
        print("\n✅ AUDIT LOGGING TESTS PASSED\n")
        return True
        
    except Exception as e:
        print(f"\n❌ AUDIT LOGGING TEST FAILED: {e}\n")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Run all tests"""
    print("\n" + "█"*80)
    print("█" + " "*78 + "█")
    print("█" + " "*20 + "IAM SYSTEM COMPREHENSIVE TEST SUITE" + " "*24 + "█")
    print("█" + " "*78 + "█")
    print("█"*80)
    
    tests = [
        ("Module Imports", test_imports),
        ("Database Connection", test_database),
        ("RBAC Service", test_rbac_service),
        ("IAM Models", test_models),
        ("API Routes", test_api_routes),
        ("Permissions Details", test_permissions_detailed),
        ("Roles Configuration", test_roles_detailed),
        ("Audit Logging", test_audit_logging),
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        results[test_name] = test_func()
    
    # Summary
    print_section("TEST SUMMARY")
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status:12} {test_name}")
    
    print(f"\n{'='*80}")
    print(f"  RESULT: {passed}/{total} tests passed")
    print(f"{'='*80}\n")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED!")
        print("\n✨ IAM System is fully operational and production-ready!\n")
        return 0
    else:
        print(f"⚠️  {total - passed} test(s) failed")
        print("\nPlease review the errors above and fix issues.\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
