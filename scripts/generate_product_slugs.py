#!/usr/bin/env python3
"""
Generate slugs for all products in database.
Slugs are URL-friendly versions of product names.

Example: "Business Cards - Standard" -> "business-cards-standard"
"""

import sys
import re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db.session import SessionLocal
from app.models.product import Product


def slugify(text: str) -> str:
    """Convert text to URL-friendly slug."""
    # Convert to lowercase
    text = text.lower()
    
    # Replace spaces and special chars with hyphens
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    
    # Remove leading/trailing hyphens
    text = text.strip('-')
    
    return text


def generate_slugs():
    """Generate slugs for all products without slugs."""
    db = SessionLocal()
    try:
        # Get all products
        products = db.query(Product).all()
        
        print(f"\n{'='*70}")
        print(f"🏷️  Generating Slugs for Products")
        print(f"{'='*70}\n")
        
        updated = 0
        skipped = 0
        errors = 0
        
        for product in products:
            try:
                # Skip if already has slug
                if product.slug:
                    print(f"  ⏭️  {product.id:3d}. {product.slug} (exists)")
                    skipped += 1
                    continue
                
                # Generate slug from name
                slug = slugify(product.name)
                
                # Check for duplicates
                existing = db.query(Product).filter(
                    Product.slug == slug,
                    Product.id != product.id
                ).first()
                
                if existing:
                    # Add ID to make unique
                    slug = f"{slug}-{product.id}"
                
                # Update product
                product.slug = slug
                print(f"  ✅ {product.id:3d}. {slug:40s} <- {product.name}")
                updated += 1
                
            except Exception as e:
                print(f"  ❌ {product.id:3d}. {product.name} - Error: {e}")
                errors += 1
        
        # Commit all changes
        if updated > 0:
            db.commit()
            print(f"\n{'='*70}")
            print(f"✅ Database Updated!")
            print(f"   ✅ Generated: {updated}")
            print(f"   ⏭️  Skipped: {skipped}")
            print(f"   ❌ Errors: {errors}")
            print(f"{'='*70}\n")
        else:
            print(f"\n{'='*70}")
            print(f"⏭️  All products already have slugs!")
            print(f"{'='*70}\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    generate_slugs()
