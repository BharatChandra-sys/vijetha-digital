"""Check admin user and test authentication"""
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password

db = SessionLocal()

# Check admin user
admin = db.query(User).filter_by(email='admin@vijetha.com').first()

print("="*60)
print("ADMIN USER CHECK")
print("="*60)

if admin:
    print(f"✓ Admin user exists")
    print(f"  Email: {admin.email}")
    print(f"  Full name: {admin.full_name}")
    print(f"  Status: {admin.status}")
    print(f"  Role: {admin.role}")
    print(f"  Password hash exists: {bool(admin.hashed_password)}")
    print(f"  Password hash length: {len(admin.hashed_password) if admin.hashed_password else 0}")
    
    # Test password
    test_password = "admin123"
    print(f"\n  Testing password '{test_password}':")
    is_valid = verify_password(test_password, admin.hashed_password)
    print(f"  Result: {'✓ VALID' if is_valid else '✗ INVALID'}")
    
    # Check roles assigned
    print(f"\n  Roles assigned: {len(admin.roles_assigned)}")
    for role in admin.roles_assigned:
        print(f"    - {role.name} ({role.slug})")
else:
    print("✗ Admin user NOT FOUND in database!")

db.close()
