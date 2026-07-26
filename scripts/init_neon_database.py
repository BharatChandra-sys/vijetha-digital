#!/usr/bin/env python3
"""
Script to initialize Neon database with all tables.
This creates tables directly from models, then stamps with Alembic version.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session

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

# Neon database URL
DATABASE_URL = "postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

def init_database():
    """Initialize database with all tables."""
    print("=" * 60)
    print("VIJETHA DIGITAL - Initialize Neon Database")
    print("=" * 60)
    print()
    
    try:
        # Create engine
        print("📡 Connecting to Neon database...")
        engine = create_engine(DATABASE_URL, echo=False)
        
        print("✅ Connected successfully!")
        print()
        
        # Create all tables
        print("🔨 Creating all tables from models...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created!")
        print()
        
        # Show created tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"📋 Created {len(tables)} tables:")
        for table in sorted(tables):
            print(f"   - {table}")
        print()
        
        # Stamp with alembic version (mark as up-to-date)
        print("🏷️  Stamping database with Alembic head version...")
        with engine.connect() as conn:
            # Create alembic_version table
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS alembic_version (
                    version_num VARCHAR(32) NOT NULL,
                    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
                );
            """))
            
            # Get head revision (the latest migration)
            # Using the phase2 migration as the head
            head_revision = "3fb3fd862589"  # phase2_model_upgrades_payment_order_user
            
            # Delete any existing version
            conn.execute(text("DELETE FROM alembic_version;"))
            
            # Insert head revision
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
        print("2. Verify: https://vijetha-digital-backend.onrender.com/health")
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
    success = init_database()
    sys.exit(0 if success else 1)
