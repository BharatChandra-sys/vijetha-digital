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

UNSPLASH_API = "https://api.unsplash.com/search/photos"
# Get your own key at: https://unsplash.com/developers
UNSPLASH_KEY = "YOUR_ACCESS_KEY_IF_NEEDED"

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


def get_unsplash_image(query: str, product_id: int, category: str) -> str | None:
    """Get image URL from Unsplash or a reliable placeholder fallback"""
    try:
        # Attempt Unsplash only if a valid API key is set
        if UNSPLASH_KEY != "YOUR_ACCESS_KEY_IF_NEEDED":
            params = {
                "query": query,
                "per_page": 1,
                "orientation": "landscape",
                "client_id": UNSPLASH_KEY
            }
            
            response = requests.get(UNSPLASH_API, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("results"):
                    return data["results"][0]["urls"]["regular"]

        # Fallback to placehold.co for consistent, properly aligned images
        safe_text = category.replace(" ", "+")
        return f"https://placehold.co/800x600/e2e8f0/1e293b/png?text={safe_text}"
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
            
            # Force re-download to ensure properly aligned images
            # if product.image_url:
            #     print(f"  → Already has image: {product.image_url}\n")
            #     continue
            
            # Get search keywords for category
            keywords = CATEGORY_KEYWORDS.get(product.category, product.name)
            
            # Fetch image URL
            print(f"  → Fetching image for: {keywords}")
            image_url = get_unsplash_image(keywords, product.id, product.category)
            
            if not image_url:
                print(f"  → No image found, skipping\n")
                continue
            
            # For Render deployments: if it's a placehold.co URL, assign it directly 
            # without downloading so it survives container restarts!
            if "placehold.co" in image_url:
                if update_product_image(db, product.id, image_url):
                    print(f"  → Success! Assigned remote placeholder URL directly.\n")
                else:
                    print(f"  → Database update failed\n")
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
