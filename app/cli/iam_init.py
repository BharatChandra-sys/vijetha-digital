"""
CLI command to initialize the IAM system.
Run this after database migrations: python -m app.cli.iam_init
"""

import sys

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.db.init_iam import init_iam_system
from app.db.session import SessionLocal, engine
from app.models.user import User, UserStatus


def init_iam():
    """Initialize the IAM system with default roles and permissions."""
    
    db = SessionLocal()
    
    try:
        print("\n" + "="*75)
        print("VIJETHA DIGITAL - IAM SYSTEM INITIALIZATION")
        print("="*75)
        
        # Step 1: Initialize permissions and roles
        print("\n📋 Step 1: Creating Permissions and Roles...")
        stats = init_iam_system(db)
        
        # Step 2: Create Super Admin if doesn't exist
        print("\n👤 Step 2: Setting up Super Admin Account...")
        admin_email = settings.ADMIN_EMAIL
        admin_password = settings.ADMIN_PASSWORD
        
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        
        if existing_admin:
            print(f"   ⊘ Admin account already exists: {admin_email}")
        else:
            from app.models.iam import Role
            
            super_admin_role = db.query(Role).filter(
                Role.slug == "super_admin"
            ).first()
            
            if not super_admin_role:
                print("   ❌ Super admin role not found! Run init_iam_system first.")
                return
            
            admin_user = User(
                email=admin_email,
                full_name="System Administrator",
                hashed_password=hash_password(admin_password),
                status=UserStatus.ACTIVE,
                email_verified=True,
                phone="",
            )
            
            admin_user.roles_assigned.append(super_admin_role)
            db.add(admin_user)
            db.commit()
            
            print(f"   ✓ Super admin created: {admin_email}")
            print("   ⚠️  IMPORTANT: Change the default password!")
        
        # Step 3: Display summary
        print("\n" + "="*75)
        print("✅ IAM SYSTEM INITIALIZATION COMPLETE!")
        print("="*75)
        print(f"""
Permissions Created: {stats['permissions_created']}
Roles Created: {stats['roles_created']}

Available Roles:
  • super_admin  - Full system access (use carefully!)
  • admin        - Administrator with broad access
  • manager      - Operations manager
  • driver       - Delivery driver
  • helper       - Operations helper
  • customer     - Regular customer
  • guest        - Read-only guest access

Next Steps:
  1. Log in with Super Admin account
  2. Navigate to /admin/users and /admin/roles
  3. Create additional users and assign roles as needed
  4. Review and adjust permissions for custom roles

SUPER ADMIN ACCESS:
  Email: {admin_email}
  Password: (as configured in .env)
        """)
        
        print("="*75 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    init_iam()
