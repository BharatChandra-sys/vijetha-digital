#!/usr/bin/env python3
"""
Update product image URLs in the database after downloading images.

Usage:
    python scripts/update_product_images.py
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.product import Product


# Map of product slugs to their image filenames
PRODUCT_IMAGES = {
    # Business Cards & Cards
    "business-cards-standard": "business-cards-standard.jpg",
    "business-cards-premium": "business-cards-premium.jpg",
    "visiting-cards": "visiting-cards.jpg",
    "id-cards": "id-cards.jpg",
    
    # Marketing Materials
    "flyers-a5": "flyers-a5.jpg",
    "flyers-a4": "flyers-a4.jpg",
    "brochures-bifold": "brochures-bifold.jpg",
    "brochures-trifold": "brochures-trifold.jpg",
    "posters-a3": "posters-a3.jpg",
    "posters-a2": "posters-a2.jpg",
    "catalogs": "catalogs.jpg",
    "stickers-vinyl": "stickers-vinyl.jpg",
    "stickers-paper": "stickers-paper.jpg",
    
    # Large Format Printing
    "banners-flex": "banners-flex.jpg",
    "banners-vinyl": "banners-vinyl.jpg",
    "standees-rollup": "standees-rollup.jpg",
    "standees-xstand": "standees-xstand.jpg",
    "hoarding-boards": "hoarding-boards.jpg",
    
    # Stationery
    "letterheads": "letterheads.jpg",
    "envelopes-standard": "envelopes-standard.jpg",
    "envelopes-window": "envelopes-window.jpg",
    "notepads": "notepads.jpg",
    "folders-presentation": "folders-presentation.jpg",
    "invoice-books": "invoice-books.jpg",
    "receipt-books": "receipt-books.jpg",
    
    # Packaging
    "packaging-boxes-corrugated": "packaging-boxes-corrugated.jpg",
    "packaging-boxes-rigid": "packaging-boxes-rigid.jpg",
    "paper-bags": "paper-bags.jpg",
    "labels-product": "labels-product.jpg",
    "stickers-packaging": "stickers-packaging.jpg",
    
    # Books & Binding
    "notebooks-spiral": "notebooks-spiral.jpg",
    "notebooks-hardcover": "notebooks-hardcover.jpg",
    "diaries": "diaries.jpg",
    "calendars-wall": "calendars-wall.jpg",
    "calendars-table": "calendars-table.jpg",
}


def update_product_images(db: Session):
    """Update product image URLs in the database."""
    print("🖼️  Updating product images...")
    print()
    
    updated = 0
    not_found = 0
    skipped = 0
    
    for slug, image_filename in PRODUCT_IMAGES.items():
        # Find product by slug
        product = db.query(Product).filter(Product.slug == slug).first()
        
        if not product:
            print(f"  ⚠️  Product not found: {slug}")
            not_found += 1
            continue
        
        # Check if image already set
        if product.image_url and product.image_url.startswith("/products/"):
            print(f"  ⏭️  Skipping {slug} (image already set)")
            skipped += 1
            continue
        
        # Update image URL
        image_url = f"/products/{image_filename}"
        product.image_url = image_url
        
        print(f"  ✅ Updated {slug}: {image_url}")
        updated += 1
    
    # Commit changes
    db.commit()
    
    print()
    print("=" * 70)
    print(f"✅ Image URLs updated!")
    print(f"   Updated: {updated}")
    print(f"   Skipped (already set): {skipped}")
    print(f"   Not found: {not_found}")
    print("=" * 70)


def main():
    """Main entry point."""
    print("=" * 70)
    print("VIJETHA DIGITAL - Product Image URL Updater")
    print("=" * 70)
    print()
    
    db = SessionLocal()
    try:
        update_product_images(db)
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
