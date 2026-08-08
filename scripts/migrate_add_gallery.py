#!/usr/bin/env python3
"""
Add gallery support to products table in Neon database.
Adds images and videos JSON columns.

Usage:
    python scripts/migrate_add_gallery.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.db.session import SessionLocal


def add_gallery_columns():
    """Add images and videos columns to products table."""
    
    print("=" * 70)
    print("🗄️  NEON DATABASE - Add Product Gallery Support")
    print("=" * 70)
    print()
    
    db = SessionLocal()
    
    try:
        print("📊 Checking current schema...")
        
        # Check if columns already exist
        result = db.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'products' 
            AND column_name IN ('images', 'videos')
        """))
        
        existing_columns = [row[0] for row in result]
        
        if 'images' in existing_columns and 'videos' in existing_columns:
            print("✅ Gallery columns already exist!")
            print()
            return True
        
        print("📝 Adding gallery columns...")
        print()
        
        # Add images column if not exists
        if 'images' not in existing_columns:
            print("  Adding 'images' column (JSON array)...")
            db.execute(text("""
                ALTER TABLE products 
                ADD COLUMN IF NOT EXISTS images JSONB
            """))
            print("  ✅ images column added")
        
        # Add videos column if not exists
        if 'videos' not in existing_columns:
            print("  Adding 'videos' column (JSON array)...")
            db.execute(text("""
                ALTER TABLE products 
                ADD COLUMN IF NOT EXISTS videos JSONB
            """))
            print("  ✅ videos column added")
        
        print()
        print("🔄 Migrating existing image_url to images array...")
        
        # Migrate existing single image_url to images array
        db.execute(text("""
            UPDATE products 
            SET images = CASE 
                WHEN image_url IS NOT NULL AND image_url != '' THEN 
                    jsonb_build_array(image_url)
                ELSE 
                    '[]'::jsonb
            END
            WHERE images IS NULL OR images::text = 'null'
        """))
        
        # Initialize empty videos array
        db.execute(text("""
            UPDATE products 
            SET videos = '[]'::jsonb
            WHERE videos IS NULL OR videos::text = 'null'
        """))
        
        db.commit()
        
        print("  ✅ Data migrated")
        print()
        
        # Verify changes
        print("🔍 Verifying changes...")
        result = db.execute(text("""
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN images IS NOT NULL AND jsonb_array_length(images) > 0 THEN 1 END) as with_images,
                COUNT(CASE WHEN videos IS NOT NULL THEN 1 END) as with_videos
            FROM products
        """))
        
        stats = result.fetchone()
        print(f"  Total products: {stats[0]}")
        print(f"  Products with images: {stats[1]}")
        print(f"  Products with videos column: {stats[2]}")
        print()
        
        print("=" * 70)
        print("✅ Migration Complete!")
        print("=" * 70)
        print()
        print("Next steps:")
        print("  1. Run: py scripts\\scrape_product_gallery.py")
        print("  2. Run: py scripts\\update_product_gallery.py")
        print()
        
        return True
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        return False
        
    finally:
        db.close()


def main():
    """Main entry point."""
    success = add_gallery_columns()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
