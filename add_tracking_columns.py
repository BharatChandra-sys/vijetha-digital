#!/usr/bin/env python3
"""
Add tracking and invoice columns to orders table if they don't exist
"""
from sqlalchemy import create_engine, text, inspect
from app.core.config import settings

def add_tracking_columns():
    engine = create_engine(settings.DATABASE_URL)
    
    # Check if columns exist
    inspector = inspect(engine)
    existing_columns = {col['name'] for col in inspector.get_columns('orders')}
    
    needed_columns = {
        'tracking_number': 'VARCHAR(100)',
        'tracking_url': 'VARCHAR(500)',
        'invoice_url': 'VARCHAR(500)'
    }
    
    with engine.connect() as conn:
        for col_name, col_type in needed_columns.items():
            if col_name not in existing_columns:
                print(f"Adding column {col_name}...")
                conn.execute(text(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type}"))
                conn.commit()
                print(f"✓ Added {col_name}")
            else:
                print(f"✓ Column {col_name} already exists")

if __name__ == "__main__":
    add_tracking_columns()
    print("\n✓ Database schema updated successfully")
