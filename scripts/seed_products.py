#!/usr/bin/env python3
"""
Seed script to load products into the database.
Run this after deployment to populate initial products.

Usage:
    python scripts/seed_products.py
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.product import Product


def seed_products(db: Session):
    """Seed initial products into the database."""
    
    products_data = [
        {
            "name": "Business Cards",
            "category": "cards",
            "base_price": 500.00,
            "description": "Professional business cards with premium finish",
            "unit": "box",
            "image_url": None,
            "slug": "business-cards",
            "is_active": True,
        },
        {
            "name": "Flyers",
            "category": "marketing",
            "base_price": 1000.00,
            "description": "High-quality promotional flyers",
            "unit": "piece",
            "image_url": None,
            "slug": "flyers",
            "is_active": True,
        },
        {
            "name": "Banners",
            "category": "large-format",
            "base_price": 2500.00,
            "description": "Large format banners for events and promotions",
            "unit": "sqft",
            "image_url": None,
            "slug": "banners",
            "is_active": True,
        },
        {
            "name": "Brochures",
            "category": "marketing",
            "base_price": 1500.00,
            "description": "Professional marketing brochures",
            "unit": "piece",
            "image_url": None,
            "slug": "brochures",
            "is_active": True,
        },
        {
            "name": "Posters",
            "category": "marketing",
            "base_price": 800.00,
            "description": "Eye-catching posters for advertising",
            "unit": "piece",
            "image_url": None,
            "slug": "posters",
            "is_active": True,
        },
        {
            "name": "Letterheads",
            "category": "stationery",
            "base_price": 600.00,
            "description": "Professional letterheads for business correspondence",
            "unit": "piece",
            "image_url": None,
            "slug": "letterheads",
            "is_active": True,
        },
        {
            "name": "Envelopes",
            "category": "stationery",
            "base_price": 400.00,
            "description": "Custom printed envelopes",
            "unit": "piece",
            "image_url": None,
            "slug": "envelopes",
            "is_active": True,
        },
        {
            "name": "Stickers",
            "category": "marketing",
            "base_price": 300.00,
            "description": "Custom stickers for branding",
            "unit": "piece",
            "image_url": None,
            "slug": "stickers",
            "is_active": True,
        },
        {
            "name": "Catalogs",
            "category": "marketing",
            "base_price": 2000.00,
            "description": "Professional product catalogs",
            "unit": "piece",
            "image_url": None,
            "slug": "catalogs",
            "is_active": True,
        },
        {
            "name": "Packaging Boxes",
            "category": "packaging",
            "base_price": 1200.00,
            "description": "Custom packaging boxes for products",
            "unit": "piece",
            "image_url": None,
            "slug": "packaging-boxes",
            "is_active": True,
        },
    ]
    
    print("🌱 Seeding products...")
    
    for product_data in products_data:
        # Check if product already exists
        existing = db.query(Product).filter(Product.slug == product_data["slug"]).first()
        
        if existing:
            print(f"  ⏭️  Skipping '{product_data['name']}' (already exists)")
            continue
        
        # Create new product
        product = Product(**product_data)
        db.add(product)
        print(f"  ✅ Added '{product_data['name']}'")
    
    db.commit()
    print(f"\n✨ Successfully seeded {len(products_data)} products!")


def main():
    """Main entry point."""
    print("=" * 60)
    print("VIJETHA DIGITAL - Product Seeding Script")
    print("=" * 60)
    print()
    
    db = SessionLocal()
    try:
        seed_products(db)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()
    
    print("\n" + "=" * 60)
    print("✅ Seeding complete!")
    print("=" * 60)


if __name__ == "__main__":
    main()
