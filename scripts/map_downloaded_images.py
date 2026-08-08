#!/usr/bin/env python3
"""
Map downloaded product images to database products.
Reads images from frontend/public/products/ and updates database.

Usage:
    python scripts/map_downloaded_images.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.session import SessionLocal
from app.models.product import Product


def map_images():
    """Map downloaded images to products in database."""
    db = SessionLocal()
    
    try:
        # Get path to downloaded images
        frontend_dir = Path(__file__).parent.parent / "frontend"
        products_dir = frontend_dir / "public" / "products"
        
        if not products_dir.exists():
            print(f"\n❌ Products directory not found: {products_dir}")
            print("   Run: py scripts\\download_product_images.py first")
            sys.exit(1)
        
        # Get all downloaded images
        downloaded_images = list(products_dir.glob("*.jpg"))
        
        print(f"\n{'='*70}")
        print(f"🖼️  Mapping Downloaded Images to Products")
        print(f"{'='*70}\n")
        print(f"📁 Images directory: {products_dir}")
        print(f"📸 Images found: {len(downloaded_images)}\n")
        
        if not downloaded_images:
            print("❌ No images found! Download images first:")
            print("   py scripts\\download_product_images.py\n")
            sys.exit(1)
        
        updated = 0
        not_found = 0
        failed_matches = []
        
        # Process each image
        for img_path in downloaded_images:
            # Extract slug from filename (e.g., "business-cards-standard.jpg" -> "business-cards-standard")
            slug = img_path.stem
            
            # Find product by slug
            product = db.query(Product).filter(Product.slug == slug).first()
            
            if not product:
                print(f"  ⚠️  {slug}.jpg - No matching product")
                not_found += 1
                failed_matches.append(slug)
                continue
            
            # Build image URL (relative to public folder)
            image_url = f"/products/{img_path.name}"
            
            # Update product images array
            if not product.images:
                product.images = []
            
            # Add image if not already there
            if image_url not in product.images:
                product.images.append(image_url)
                
                # Also update legacy image_url field (for backward compatibility)
                if not product.image_url:
                    product.image_url = image_url
                
                print(f"  ✅ {slug:40s} <- {img_path.name}")
                updated += 1
            else:
                print(f"  ⏭️  {slug:40s} (already has this image)")
        
        # Commit changes
        if updated > 0:
            db.commit()
            print(f"\n{'='*70}")
            print(f"✅ Database Updated!")
            print(f"   ✅ Images mapped: {updated}")
            print(f"   ⚠️  Not matched: {not_found}")
            print(f"{'='*70}\n")
            
            if failed_matches:
                print("⚠️  Images without matching products:")
                for slug in failed_matches:
                    print(f"   - {slug}.jpg")
                print()
        else:
            print(f"\n{'='*70}")
            print(f"⏭️  No new images to map!")
            print(f"{'='*70}\n")
        
        # Show products that still need images
        from sqlalchemy import cast, TEXT
        products_without_images = db.query(Product).filter(
            (Product.images == None) | (cast(Product.images, TEXT) == '[]')
        ).all()
        
        if products_without_images:
            print(f"📋 Products still needing images: {len(products_without_images)}\n")
            for p in products_without_images[:10]:  # Show first 10
                print(f"   - {p.slug or 'NO-SLUG'}: {p.name}")
            if len(products_without_images) > 10:
                print(f"   ... and {len(products_without_images) - 10} more")
            print()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    map_images()
