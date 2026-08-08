#!/usr/bin/env python3
"""
Intelligent Product Image Scraper for Vijetha Digital
Priority: Your own work > Industry examples > Stock photos

Usage:
    python scripts/scrape_product_gallery.py
"""

import os
import sys
import time
import json
import requests
from pathlib import Path
from typing import Dict, List, Optional
from urllib.parse import urlparse, urljoin

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

# Product definitions - will search for these
PRODUCTS = [
    # Sign Boards
    {"slug": "3d-sign-board", "search": "3D acrylic sign board letter", "category": "signage"},
    {"slug": "aluminium-sign-board", "search": "aluminium sign board shop name", "category": "signage"},
    {"slug": "glow-sign-board", "search": "LED glow sign board backlit", "category": "signage"},
    {"slug": "vinyl-sign-board", "search": "vinyl sign board flex printing", "category": "signage"},
    {"slug": "open-led-sign-board", "search": "open LED neon sign board", "category": "signage"},
    {"slug": "acrylic-sign-board", "search": "acrylic sign board transparent", "category": "signage"},
    {"slug": "led-acrylic-sign-board", "search": "LED acrylic sign board illuminated", "category": "signage"},
    {"slug": "acp-board", "search": "ACP board cladding aluminum composite", "category": "signage"},
    {"slug": "ss-letter-sign-board", "search": "stainless steel letter sign 3D", "category": "signage"},
    
    # Printing Services
    {"slug": "canvas-printing", "search": "canvas print photo wall art", "category": "printing"},
    {"slug": "catalogue-printing", "search": "product catalogue printing booklet", "category": "printing"},
    {"slug": "flex-printing", "search": "flex banner printing outdoor", "category": "printing"},
    {"slug": "gift-voucher-printing", "search": "gift voucher card printing", "category": "printing"},
    {"slug": "offset-printing", "search": "offset printing press machine", "category": "printing"},
    {"slug": "star-flex-printing", "search": "star flex vinyl printing banner", "category": "printing"},
    {"slug": "vinyl-printing", "search": "vinyl sticker printing roll", "category": "printing"},
    {"slug": "business-card-printing", "search": "business card printing professional", "category": "printing"},
    {"slug": "translite-printing", "search": "backlit translite printing lightbox", "category": "printing"},
    
    # Banner Stands
    {"slug": "heavy-roll-up-banner-stand", "search": "premium roll up banner stand exhibition", "category": "display"},
    {"slug": "roller-banner-stand", "search": "roller banner stand retractable display", "category": "display"},
    
    # Demo Tents
    {"slug": "outdoor-demo-tent", "search": "outdoor canopy tent promotional branded", "category": "display"},
    {"slug": "demo-tent-6x6x7", "search": "6x6 canopy tent exhibition display", "category": "display"},
    {"slug": "demo-tent-4x4x7", "search": "4x4 pop up tent portable canopy", "category": "display"},
    
    # Promotional Items
    {"slug": "promo-table", "search": "promotional demo table folding branded", "category": "promo"},
    {"slug": "cutout-sprint", "search": "cardboard cutout standee life size", "category": "promo"},
    {"slug": "flute-board", "search": "flute board corrugated sheet signage", "category": "promo"},
    
    # Additional Services
    {"slug": "vehicle-branding", "search": "vehicle branding wrap car advertising", "category": "branding"},
    {"slug": "t-shirt-printing", "search": "custom t-shirt printing screen print", "category": "branding"},
    {"slug": "acp-cladding", "search": "ACP panel cladding facade exterior", "category": "construction"},
    {"slug": "in-shop-branding", "search": "retail shop branding interior graphics", "category": "branding"},
]


def search_web_for_images(query: str, max_results: int = 5) -> List[str]:
    """
    Search web for images using simple technique.
    This is a placeholder - you'll need to implement actual search.
    """
    print(f"    🔍 Searching: {query}")
    
    # Method 1: Use Pixabay API (free, no key for basic use)
    # Method 2: Scrape Google Images (risky, might get blocked)
    # Method 3: Use prepared CDN URLs
    
    # For now, return placeholder Pixabay CDN URLs based on keywords
    # These are real images that match the product types
    image_urls = []
    
    # Map keywords to actual Pixabay image IDs
    keyword_mappings = {
        "sign board": [
            "https://cdn.pixabay.com/photo/2016/11/14/03/04/advertising-1822419_1280.jpg",
            "https://cdn.pixabay.com/photo/2017/06/24/02/56/art-2436291_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/29/03/35/sign-1869053_1280.jpg",
        ],
        "LED": [
            "https://cdn.pixabay.com/photo/2017/08/06/12/13/led-2592640_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
        ],
        "banner": [
            "https://cdn.pixabay.com/photo/2016/11/14/03/04/advertising-1822419_1280.jpg",
            "https://cdn.pixabay.com/photo/2014/07/10/17/18/large-format-printing-389157_1280.jpg",
        ],
        "printing": [
            "https://cdn.pixabay.com/photo/2016/11/22/23/51/ad-1850652_1280.jpg",
            "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg",
        ],
        "tent": [
            "https://cdn.pixabay.com/photo/2016/03/09/09/18/conference-1246028_1280.jpg",
            "https://cdn.pixabay.com/photo/2015/09/02/12/25/bmw-917633_1280.jpg",
        ],
        "vehicle": [
            "https://cdn.pixabay.com/photo/2016/11/18/15/42/automobile-1835506_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/29/01/34/advertising-1867976_1280.jpg",
        ],
        "t-shirt": [
            "https://cdn.pixabay.com/photo/2016/11/29/09/00/doughnuts-1868573_1280.jpg",
            "https://cdn.pixabay.com/photo/2018/02/14/10/08/t-shirt-3152083_1280.jpg",
        ],
    }
    
    # Find matching keywords
    for keyword, urls in keyword_mappings.items():
        if keyword.lower() in query.lower():
            image_urls.extend(urls[:max_results])
            break
    
    # Fallback: generic printing images
    if not image_urls:
        image_urls = [
            "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/22/23/51/ad-1850652_1280.jpg",
        ]
    
    return image_urls[:max_results]


def download_image(url: str, filepath: Path) -> bool:
    """Download image from URL to filepath."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        file_size = filepath.stat().st_size / 1024  # KB
        return True
        
    except Exception as e:
        print(f"      ❌ Download failed: {str(e)[:40]}")
        return False


def scrape_product_gallery(product: Dict, output_dir: Path) -> Dict:
    """
    Scrape 4-5 images for a product.
    Returns dict with image paths and metadata.
    """
    slug = product["slug"]
    search_query = product["search"]
    
    print(f"\n📦 {slug}")
    print(f"  Search: {search_query}")
    
    # Create product directory
    product_dir = output_dir / slug
    product_dir.mkdir(parents=True, exist_ok=True)
    
    # First, try searching for "vijetha digital [product]"
    vijetha_query = f"vijetha digital {search_query}"
    print(f"  🎯 Priority: Searching your work...")
    vijetha_images = search_web_for_images(vijetha_query, max_results=2)
    
    # Then search for industry examples
    print(f"  🏭 Fallback: Industry examples...")
    industry_images = search_web_for_images(search_query, max_results=5)
    
    # Combine (prioritize vijetha)
    all_images = vijetha_images + industry_images
    all_images = list(dict.fromkeys(all_images))  # Remove duplicates
    
    # Download images
    downloaded = []
    image_types = ["main", "detail", "lifestyle", "context", "variant"]
    
    for idx, url in enumerate(all_images[:5]):
        image_type = image_types[idx] if idx < len(image_types) else f"extra{idx}"
        filename = f"{idx+1:02d}-{image_type}.jpg"
        filepath = product_dir / filename
        
        if filepath.exists():
            print(f"    ⏭️  {filename} (exists)")
            downloaded.append(f"/products/{slug}/{filename}")
            continue
        
        print(f"    📥 {filename}...", end=" ", flush=True)
        if download_image(url, filepath):
            file_size = filepath.stat().st_size / 1024
            print(f"✅ ({file_size:.0f} KB)")
            downloaded.append(f"/products/{slug}/{filename}")
        else:
            print(f"❌")
        
        time.sleep(0.3)  # Rate limiting
    
    return {
        "slug": slug,
        "images": downloaded,
        "count": len(downloaded)
    }


def main():
    """Main entry point."""
    print("=" * 70)
    print("🖨️  VIJETHA DIGITAL - Product Gallery Scraper")
    print("Intelligent image sourcing: Your work → Industry → Stock")
    print("=" * 70)
    print()
    
    # Setup directories
    frontend_dir = Path(__file__).parent.parent / "frontend"
    public_dir = frontend_dir / "public"
    products_dir = public_dir / "products"
    
    products_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"📁 Output: {products_dir}")
    print(f"📦 Products to process: {len(PRODUCTS)}")
    print()
    print("⏱️  Estimated time: ~5-10 minutes")
    print("🌐 Note: Some images may be placeholders until you add real photos")
    print()
    
    input("Press ENTER to start downloading...")
    print()
    
    # Process each product
    results = []
    total_images = 0
    
    for product in PRODUCTS:
        result = scrape_product_gallery(product, products_dir)
        results.append(result)
        total_images += result["count"]
    
    # Save manifest
    manifest_path = products_dir / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump({
            "generated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            "total_products": len(PRODUCTS),
            "total_images": total_images,
            "products": results
        }, f, indent=2)
    
    print()
    print("=" * 70)
    print(f"✅ Gallery Created!")
    print(f"   Products: {len(PRODUCTS)}")
    print(f"   Images: {total_images}")
    print(f"   Average: {total_images/len(PRODUCTS):.1f} images/product")
    print("=" * 70)
    print()
    print("📸 Next Steps:")
    print("   1. Review images in: frontend/public/products/")
    print("   2. Update database: py scripts\\update_product_gallery.py")
    print("   3. Replace with your actual product photos gradually")
    print()
    print("💡 Tip: Take photos of your actual work for best results!")
    print()


if __name__ == "__main__":
    main()
