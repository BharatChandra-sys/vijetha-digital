#!/usr/bin/env python3
"""
Download product images from Unsplash and update database
"""
import os
import sys
import requests
from pathlib import Path
from datetime import datetime

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.product import Product
from sqlalchemy import text

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / settings.UPLOAD_DIR / "products"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Unsplash API - free images, no auth needed for basic usage
UNSPLASH_API = "https://api.unsplash.com/search/photos"
# Using demo key - for production, get your own: https://unsplash.com/developers
UNSPLASH_KEY = "YOUR_ACCESS_KEY_IF_NEEDED"  # Most free queries work without key

# Keywords for each product category
CATEGORY_KEYWORDS = {
    "Banners": "banner flex advertising",
    "Prints": "vinyl print poster",
    "LED Displays": "led board neon light",
    "Cards": "business cards stationery",
    "Documents": "brochure flyer document",
    "Signage": "sign signboard outdoor",
    "Labels": "label sticker packaging",
    "Packaging": "box packaging product",
}


def download_image(url: str, filename: str) -> bool:
    """Download image from URL and save locally"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        filepath = UPLOAD_DIR / filename
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        print(f"✓ Downloaded: {filename}")
        return True
    except Exception as e:
        print(f"✗ Failed to download {filename}: {e}")
        return False


def get_unsplash_image(query: str, product_id: int) -> str | None:
    """Get image URL from Unsplash for a product"""
    try:
        params = {
            "query": query,
            "per_page": 1,
            "orientation": "landscape",
        }
        
        response = requests.get(UNSPLASH_API, params=params, timeout=10)
        response.raise_for_status()
        
        data = response.json()
        if data["results"]:
            image_url = data["results"][0]["urls"]["regular"]
            return image_url
        return None
    except Exception as e:
        print(f"✗ Failed to fetch from Unsplash for '{query}': {e}")
        return None


def update_product_image(db, product_id: int, image_path: str) -> bool:
    """Update product image_url in database"""
    try:
        product = db.query(Product).filter(Product.id == product_id).first()
        if product:
            product.image_url = image_path
            db.commit()
            print(f"✓ Updated product {product_id} with image: {image_path}")
            return True
        return False
    except Exception as e:
        print(f"✗ Failed to update product {product_id}: {e}")
        db.rollback()
        return False


def main():
    """Download and assign images to all products"""
    db = SessionLocal()
    
    try:
        # Get all products without images
        products = db.query(Product).all()
        
        if not products:
            print("No products found in database!")
            return
        
        print(f"Found {len(products)} products\n")
        
        for product in products:
            print(f"Processing: {product.name} (Category: {product.category})")
            
            # Skip if already has image
            if product.image_url:
                print(f"  → Already has image: {product.image_url}\n")
                continue
            
            # Get search keywords for category
            keywords = CATEGORY_KEYWORDS.get(product.category, product.name)
            
            # Fetch image URL from Unsplash
            print(f"  → Searching Unsplash for: {keywords}")
            image_url = get_unsplash_image(keywords, product.id)
            
            if not image_url:
                print(f"  → No image found on Unsplash, trying alternative\n")
                continue
            
            # Download the image
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"product_{product.id}_{timestamp}.jpg"
            
            if download_image(image_url, filename):
                # Update database
                image_path = f"/uploads/products/{filename}"
                if update_product_image(db, product.id, image_path):
                    print(f"  → Success!\n")
                else:
                    print(f"  → Database update failed\n")
            else:
                print(f"  → Download failed\n")
        
        print("\n✓ Image download completed!")
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
