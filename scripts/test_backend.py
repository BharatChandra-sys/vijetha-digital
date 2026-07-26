#!/usr/bin/env python3
"""
Test the backend locally to ensure it works before deployment.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import requests
from app.core.config import settings

# Use Neon database
DATABASE_URL = "postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

def test_database_connection():
    """Test direct database connection."""
    print("🔍 Testing database connection...")
    try:
        from sqlalchemy import create_engine, text
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT COUNT(*) FROM products;"))
            count = result.fetchone()[0]
            print(f"✅ Database connected! Found {count} products")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False


def test_products_query():
    """Test products query directly."""
    print("\n📦 Testing products query...")
    try:
        from sqlalchemy import create_engine
        from sqlalchemy.orm import sessionmaker
        from app.models.product import Product
        
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        products = db.query(Product).limit(5).all()
        print(f"✅ Found {len(products)} products:")
        for product in products:
            print(f"   - {product.name} ({product.category}) - ₹{product.base_price}")
        
        db.close()
        return True
    except Exception as e:
        print(f"❌ Products query failed: {e}")
        return False


def test_users_query():
    """Test users query directly."""
    print("\n👥 Testing users query...")
    try:
        from sqlalchemy import create_engine
        from sqlalchemy.orm import sessionmaker
        from app.models.user import User
        
        engine = create_engine(DATABASE_URL)
        SessionLocal = sessionmaker(bind=engine)
        db = SessionLocal()
        
        users = db.query(User).all()
        print(f"✅ Found {len(users)} users:")
        for user in users:
            print(f"   - {user.email} ({user.role.value})")
        
        db.close()
        return True
    except Exception as e:
        print(f"❌ Users query failed: {e}")
        return False


def main():
    """Main test runner."""
    print("=" * 60)
    print("VIJETHA DIGITAL - Backend Testing")
    print("=" * 60)
    print()
    
    results = []
    
    # Test database
    results.append(("Database Connection", test_database_connection()))
    results.append(("Products Query", test_products_query()))
    results.append(("Users Query", test_users_query()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    all_passed = all(passed for _, passed in results)
    
    if all_passed:
        print("\n🎉 All tests passed! Backend is ready.")
        print("\nNext steps:")
        print("1. Commit and push to GitHub")
        print("2. Update Render with Neon DATABASE_URL")
        print("3. Deploy frontend to Vercel")
    else:
        print("\n⚠️  Some tests failed. Please fix issues before deployment.")
        sys.exit(1)


if __name__ == "__main__":
    main()
