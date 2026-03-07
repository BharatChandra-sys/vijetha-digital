"""Simple admin check"""
import sys
sys.path.insert(0, 'C:/Users/bc833/vijetha-digital-backend')

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password, hash_password

db = SessionLocal()

print("="*60)
print("CHECKING ADMIN USER")
print("="*60)

# Check admin user
admin = db.query(User).filter_by(email='admin@vijetha.com').first()

if admin:
    print(f"\n✓ Admin user exists")
    print(f"  Email: {admin.email}")
    print(f"  Full name: {admin.full_name}")
    print(f"  Status: {admin.status.value if hasattr(admin.status, 'value') else admin.status}")
    print(f"  Role: {admin.role.value if hasattr(admin.role, 'value') else admin.role}")
    
    # Test password
    test_pwd = "admin123"
    is_valid = verify_password(test_pwd, admin.hashed_password)
    print(f"\n  Password test for '{test_pwd}': {is_valid}")
    
    if not is_valid:
        print("\n  ⚠️  Password verification FAILED!")
        print("  Generating new hash for 'admin123'...")
        new_hash = hash_password("admin123")
        print(f"  New hash: {new_hash[:50]}...")
        print(f"  Current hash: {admin.hashed_password[:50]}...")
        
        # Update admin password
        admin.hashed_password = new_hash
        db.commit()
        print("\n  ✓ Password has been reset to 'admin123'")
    else:
        print("\n  ✓ Password is correct!")
else:
    print("\n✗ Admin user NOT FOUND")
    print("  Creating admin user...")
    
    from app.models.user import UserRole, UserStatus
    
    new_admin = User(
        email='admin@vijetha.com',
        full_name='Super Admin',
        hashed_password=hash_password('admin123'),
        role=UserRole.ADMIN,
        status=UserStatus.ACTIVE
    )
    db.add(new_admin)
    db.commit()
    print("  ✓ Admin user created!")

db.close()
print("\n" + "="*60)
