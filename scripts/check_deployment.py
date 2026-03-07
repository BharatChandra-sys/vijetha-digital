#!/usr/bin/env python3
"""
Check if IAM deployment was successful
"""

import sys
from pathlib import Path

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))

def check_deployment():
    """Check if IAM deployment completed successfully"""
    print("\n" + "="*70)
    print("IAM DEPLOYMENT VERIFICATION")
    print("="*70 + "\n")
    
    from app.db.session import SessionLocal
    from sqlalchemy import inspect
    
    db = SessionLocal()
    
    try:
        # Check database connection
        print("1️⃣  Checking Database Connection...")
        try:
            result = db.execute("SELECT 1")
            print("   ✅ Database connection successful\n")
        except Exception as e:
            print(f"   ❌ Database connection failed: {e}\n")
            return False
        
        # Check if IAM tables exist
        print("2️⃣  Checking IAM Tables...")
        inspector = inspect(db.bind)
        tables = inspector.get_table_names()
        
        required_tables = [
            'permissions',
            'roles',
            'role_permissions',
            'user_roles',
            'role_assignment_logs',
            'permission_access_logs'
        ]
        
        missing = [t for t in required_tables if t not in tables]
        
        if missing:
            print(f"   ❌ Missing tables: {missing}")
            print("   ⚠️  Run: alembic upgrade head\n")
            return False
        else:
            print(f"   ✅ All IAM tables exist: {required_tables}\n")
        
        # Check if permissions were created
        print("3️⃣  Checking Permissions...")
        from app.models.iam import Permission
        perm_count = db.query(Permission).count()
        
        if perm_count == 0:
            print(f"   ⚠️  No permissions found (expected 40+)")
            print("   ⚠️  Run: python -m app.cli.iam_init\n")
            return False
        else:
            print(f"   ✅ Permissions created: {perm_count}\n")
        
        # Check if roles were created
        print("4️⃣  Checking Roles...")
        from app.models.iam import Role
        role_count = db.query(Role).count()
        
        if role_count == 0:
            print(f"   ⚠️  No roles found (expected 7)")
            print("   ⚠️  Run: python -m app.cli.iam_init\n")
            return False
        else:
            print(f"   ✅ Roles created: {role_count}")
            roles = db.query(Role).all()
            for role in roles:
                perm_count = len(role.permissions)
                print(f"      - {role.slug}: {perm_count} permissions")
            print()
        
        # Check if super admin was created
        print("5️⃣  Checking Super Admin User...")
        from app.models.user import User
        admin_user = db.query(User).filter_by(role="admin").first()
        
        if not admin_user:
            print("   ⚠️  No admin user found")
            print("   ℹ️  This is OK - you may have created users with different roles\n")
        else:
            print(f"   ✅ Admin user found: {admin_user.email}")
            roles = [r.slug for r in admin_user.roles_assigned]
            print(f"      Roles: {roles}\n")
        
        # Check migration version
        print("6️⃣  Checking Migration Version...")
        try:
            from sqlalchemy import text
            result = db.execute(text("SELECT version_num FROM alembic_version ORDER BY version_num DESC LIMIT 1"))
            row = result.fetchone()
            current_version = row[0] if row else "None"
            print(f"   ✅ Current migration: {current_version}\n")
        except Exception as e:
            print(f"   ⚠️  Could not read migration version: {e}\n")
        
        print("="*70)
        print("✅ IAM DEPLOYMENT SUCCESSFUL!")
        print("="*70)
        print("\nNext Steps:")
        print("1. Start server: uvicorn app.main:app --reload")
        print("2. Test endpoints: http://localhost:5000/admin/users")
        print("3. Run tests: pytest tests/test_iam_system.py -v")
        print()
        
        return True
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    success = check_deployment()
    sys.exit(0 if success else 1)
