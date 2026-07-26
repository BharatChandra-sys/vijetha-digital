#!/usr/bin/env python3
"""
Script to check all schemas and tables in Neon database.
"""

import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import create_engine, inspect, text

# Neon database URL
DATABASE_URL = "postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

def check_schemas():
    """Check all schemas and tables."""
    print("=" * 60)
    print("VIJETHA DIGITAL - Neon Database Schema Check")
    print("=" * 60)
    print()
    
    try:
        # Create engine
        print("📡 Connecting to Neon database...")
        engine = create_engine(DATABASE_URL, echo=False)
        
        print("✅ Connected!")
        print()
        
        # Check all schemas
        print("🔍 Checking schemas...")
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT schema_name 
                FROM information_schema.schemata 
                WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
                ORDER BY schema_name;
            """))
            schemas = [row[0] for row in result]
            
            print(f"Found {len(schemas)} schemas:")
            for schema in schemas:
                print(f"   - {schema}")
            print()
            
            # Check tables in each schema
            for schema in schemas:
                print(f"📋 Tables in schema '{schema}':")
                result = conn.execute(text(f"""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = :schema
                    ORDER BY table_name;
                """), {"schema": schema})
                tables = [row[0] for row in result]
                
                if tables:
                    print(f"   Found {len(tables)} tables:")
                    for table in tables:
                        print(f"      - {table}")
                else:
                    print("   No tables found")
                print()
        
        # Check using inspector (only checks public schema by default)
        print("🔍 Inspector check (public schema):")
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        print(f"   Found {len(tables)} tables in public schema")
        if tables:
            for table in sorted(tables):
                print(f"      - {table}")
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
    success = check_schemas()
    print("=" * 60)
    sys.exit(0 if success else 1)
