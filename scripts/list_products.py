#!/usr/bin/env python3
"""List all products in database with their slugs."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.session import SessionLocal
from app.models.product import Product


def list_products():
    db = SessionLocal()
    try:
        products = db.query(Product).all()
        
        print(f"\n{'='*70}")
        print(f"Products in Database: {len(products)}")
        print(f"{'='*70}\n")
        
        for p in products:
            has_images = 'Yes' if (p.images and len(p.images) > 0) else 'No'
            img_count = len(p.images) if p.images else 0
            slug = p.slug or 'NO-SLUG'
            print(f"  {p.id:3d}. {slug:40s} | Images: {img_count} | {p.name}")
        
        print(f"\n{'='*70}\n")
        
    finally:
        db.close()


if __name__ == "__main__":
    list_products()
