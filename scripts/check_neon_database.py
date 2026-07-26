#!/usr/bin/env python3
"""
Script to check Neon database status and tables.
This helps diagnose migration issues.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, inspect, text

# Neon database URL
DATABASE_URL = "postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

def check_database():
    """Check database connection and table status."""
    print("=" * 60)
    print("VIJETHA DIGITAL - Neon Database Status Check")
    print("=" * 60)
    print()
    
    try:
        # Create engine
        print("📡 Connecting to Neon database...")
        engine = create_engine(DATABASE_URL, echo=False)
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Connected successfully!")
            print(f"   PostgreSQL version: {version.split(',')[0]}")
            print()
        
        # Check tables
        print("📋 Checking existing tables...")
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        if not tables:
            print("⚠️  No tables found in database!")
            print()
            print("🔧 Recommendation:")
            print("   Run: run_neon_migrations.bat")
            print()
        else:
            print(f"✅ Found {len(tables)} tables:")
            for table in sorted(tables):
                print(f"   - {table}")
            print()
        
        # Check alembic_version table
        print("🔍 Checking migration status...")
        if 'alembic_version' in tables:
            with engine.connect() as conn:
                result = conn.execute(text("SELECT version_num FROM alembic_version;"))
                version = result.fetchone()
                if version:
                    print(f"✅ Alembic version: {version[0]}")
                    print()
                else:
                    print("⚠️  alembic_version table exists but is empty!")
                    print()
        else:
            print("⚠️  alembic_version table not found!")
            print("   Database has never been migrated.")
            print()
        
        # Expected tables
        expected_tables = [
            'access_logs', 'addresses', 'audit_logs', 'business_profiles',
            'coupons', 'coupon_usages', 'role_permissions', 'user_roles',
            'permissions', 'roles', 'role_assignment_logs', 'permission_access_logs',
            'notifications', 'orders', 'order_files', 'order_items',
            'order_timeline', 'payments', 'material_rates', 'extra_rates',
            'products', 'reviews', 'staff', 'users'
        ]
        
        missing_tables = [t for t in expected_tables if t not in tables]
        
        if missing_tables:
            print("❌ Missing tables:")
            for table in missing_tables:
                print(f"   - {table}")
            print()
            print("🔧 Recommendation:")
            print("   Run: run_neon_migrations.bat")
            print()
        else:
            print("✅ All expected tables exist!")
            print()
            print("🎉 Database is ready!")
            print("   Next step: Run seed_neon_database.bat to add demo data")
            print()
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print()
        return False
    finally:
        if 'engine' in locals():
            engine.dispose()

if __name__ == "__main__":
    success = check_database()
    print("=" * 60)
    sys.exit(0 if success else 1)
