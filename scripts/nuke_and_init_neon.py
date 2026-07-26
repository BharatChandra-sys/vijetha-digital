#!/usr/bin/env python3
"""
Nuclear option: Drop ALL tables and indexes, then create fresh.
Uses direct (non-pooled) connection to avoid caching issues.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text

# Import Base and all models
from app.db.base import Base
import app.models.access_log
import app.models.address
import app.models.audit_log
import app.models.business_profile
import app.models.coupon
import app.models.iam
import app.models.notification
import app.models.order
import app.models.order_file
import app.models.order_item
import app.models.order_timeline
import app.models.payment
import app.models.pricing
import app.models.product
import app.models.review
import app.models.staff
import app.models.token_blacklist
import app.models.user

# Neon database URL - DIRECT (non-pooled) endpoint
DATABASE_URL = "postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

def nuke_and_init():
    """Drop everything and reinitialize."""
    print("=" * 60)
    print("VIJETHA DIGITAL - Nuclear Reset & Initialize")
    print("=" * 60)
    print()
    print("⚠️  WARNING: This will DROP ALL tables and data!")
    print()
    
    try:
        # Create engine with direct endpoint
        print("📡 Connecting to Neon (direct endpoint)...")
        engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
        print("✅ Connected!")
        print()
        
        # Drop all tables in public schema
        print("💣 Dropping ALL tables, indexes, sequences, and constraints...")
        with engine.connect() as conn:
            # Drop everything in public schema
            conn.execute(text("""
                DROP SCHEMA public CASCADE;
                CREATE SCHEMA public;
                GRANT ALL ON SCHEMA public TO neondb_owner;
                GRANT ALL ON SCHEMA public TO public;
            """))
            conn.commit()
        print("✅ All tables dropped!")
        print()
        
        # Verify clean state
        print("🔍 Verifying clean state...")
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"   Tables remaining: {len(tables)}")
        if tables:
            print(f"   WARNING: {tables}")
        print()
        
        # Create all tables fresh
        print("🔨 Creating all tables from models...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created!")
        print()
        
        # Show created tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"📋 Created {len(tables)} tables:")
        for table in sorted(tables):
            print(f"   - {table}")
        print()
        
        # Create and stamp alembic_version
        print("🏷️  Stamping with Alembic head version...")
        with engine.connect() as conn:
            conn.execute(text("""
                CREATE TABLE alembic_version (
                    version_num VARCHAR(32) NOT NULL,
                    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
                );
            """))
            
            head_revision = "3fb3fd862589"
            conn.execute(
                text("INSERT INTO alembic_version (version_num) VALUES (:version);"),
                {"version": head_revision}
            )
            conn.commit()
        
        print(f"✅ Stamped with version: {head_revision}")
        print()
        
        print("=" * 60)
        print("🎉 Database initialization complete!")
        print("=" * 60)
        print()
        print("Next steps:")
        print("1. Run: py scripts\\seed_products.py")
        print("2. Update Render env: Add Neon DATABASE_URL")
        print("3. Test: https://vijetha-digital-backend.onrender.com/products")
        print()
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        print()
        return False
    finally:
        if 'engine' in locals():
            engine.dispose()

if __name__ == "__main__":
    success = nuke_and_init()
    sys.exit(0 if success else 1)
