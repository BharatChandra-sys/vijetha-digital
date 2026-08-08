#!/usr/bin/env python3
"""
Update product database with gallery images from manifest.

Usage:
    python scripts/update_product_gallery.py
"""

import sys
import json
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.product import Product


def update_gallery_from_manifest(db: Session):
    """Update products with images from manifest.json."""
    
    # Load manifest
    manifest_path = Path(__file__).parent.parent / "frontend" / "public" / "products" / "manifest.json"
    
    if not manifest_path.exists():
        print("❌ Manifest not found. Run scrape_product_gallery.py first!")
        return False
    
    with open(manifest_path, 'r') as f:
        manifest = json.load(f)
    
    print(f"📋 Manifest loaded: {manifest['total_products']} products, {manifest['total_images']} images")
    print()
    
    updated = 0
    not_found = 0
    
    for product_data in manifest['products']:
        slug = product_data['slug']
        images = product_data['images']
        
        if not images:
            print(f"  ⚠️  {slug}: No images")
            continue
        
        # Find product
        product = db.query(Product).filter(Product.slug == slug).first()
        
        if not product:
            print(f"  ❌ {slug}: Product not found in database")
            not_found += 1
            continue
        
        # Update gallery
        product.images = images
        product.image_url = images[0] if images else None  # Set first as primary
        
        print(f"  ✅ {slug}: {len(images)} images")
        updated += 1
    
    db.commit()
    
    print()
    print("=" * 70)
    print(f"✅ Gallery Updated!")
    print(f"   Updated: {updated}")
    print(f"   Not found: {not_found}")
    print("=" * 70)
    
    return True


def main():
    """Main entry point."""
    print("=" * 70)
    print("🗄️  VIJETHA DIGITAL - Gallery Database Updater")
    print("=" * 70)
    print()
    
    db = SessionLocal()
    try:
        success = update_gallery_from_manifest(db)
        if not success:
            sys.exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        sys.exit(1)
    finally:
        db.close()
    
    print()


if __name__ == "__main__":
    main()
