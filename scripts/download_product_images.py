#!/usr/bin/env python3
"""
Download production-ready product images from Pixabay CDN.
Uses direct CDN URLs for reliable downloads of printing/signage images.

Usage:
    python scripts/download_product_images.py
"""

import os
import sys
import time
import requests
from pathlib import Path
from typing import Dict

# Direct Pixabay CDN URLs for printing products
# Format: https://pixabay.com/get/{id}-{hash}.jpg
# These are real, publicly accessible images from Pixabay's CDN
PRODUCT_IMAGE_MAPPING: Dict[str, Dict[str, str]] = {
    # Business Cards & Cards - Using actual business card photos from Pixabay
    "business-cards-standard": {
        "url": "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg",
        "alt": "Professional business cards"
    },
    "business-cards-premium": {
        "url": "https://cdn.pixabay.com/photo/2016/11/27/21/42/business-card-1863490_1280.jpg",
        "alt": "Premium business cards with elegant design"
    },
    "visiting-cards": {
        "url": "https://cdn.pixabay.com/photo/2014/11/03/11/03/business-card-318425_1280.jpg",
        "alt": "Professional visiting cards"
    },
    "id-cards": {
        "url": "https://cdn.pixabay.com/photo/2017/01/14/15/19/passport-1979796_1280.jpg",
        "alt": "Professional ID cards and badges"
    },
    
    # Marketing Materials
    "flyers-a5": {
        "url": "https://cdn.pixabay.com/photo/2016/02/19/10/00/flyers-1208287_1280.jpg",
        "alt": "Colorful promotional flyers"
    },
    "flyers-a4": {
        "url": "https://cdn.pixabay.com/photo/2016/11/22/23/51/ad-1850652_1280.jpg",
        "alt": "A4 marketing flyers"
    },
    "brochures-bifold": {
        "url": "https://cdn.pixabay.com/photo/2016/11/27/21/42/flyer-1863392_1280.jpg",
        "alt": "Bi-fold brochures"
    },
    "brochures-trifold": {
        "url": "https://cdn.pixabay.com/photo/2017/01/14/13/14/template-1979654_1280.jpg",
        "alt": "Tri-fold brochures"
    },
    "posters-a3": {
        "url": "https://cdn.pixabay.com/photo/2018/03/10/12/00/teamwork-3213924_1280.jpg",
        "alt": "Eye-catching posters"
    },
    "posters-a2": {
        "url": "https://cdn.pixabay.com/photo/2017/10/04/00/11/poster-2813906_1280.jpg",
        "alt": "Large format posters"
    },
    "catalogs": {
        "url": "https://cdn.pixabay.com/photo/2016/11/22/23/41/brochure-1850645_1280.jpg",
        "alt": "Professional product catalogs"
    },
    "stickers-vinyl": {
        "url": "https://cdn.pixabay.com/photo/2018/02/01/12/13/sticker-3123729_1280.jpg",
        "alt": "Custom vinyl stickers"
    },
    "stickers-paper": {
        "url": "https://cdn.pixabay.com/photo/2017/06/08/14/18/stickers-2383640_1280.jpg",
        "alt": "Paper stickers roll"
    },
    
    # Large Format Printing
    "banners-flex": {
        "url": "https://cdn.pixabay.com/photo/2016/11/14/03/04/advertising-1822419_1280.jpg",
        "alt": "Outdoor flex banners"
    },
    "banners-vinyl": {
        "url": "https://cdn.pixabay.com/photo/2014/07/10/17/18/large-format-printing-389157_1280.jpg",
        "alt": "Vinyl banner printing"
    },
    "standees-rollup": {
        "url": "https://cdn.pixabay.com/photo/2017/05/11/11/15/workplace-2303851_1280.jpg",
        "alt": "Roll-up banner stands"
    },
    "standees-xstand": {
        "url": "https://cdn.pixabay.com/photo/2016/03/09/09/18/conference-1246028_1280.jpg",
        "alt": "X-stand banners"
    },
    "hoarding-boards": {
        "url": "https://cdn.pixabay.com/photo/2014/01/05/22/09/advertising-238866_1280.jpg",
        "alt": "Large outdoor hoarding"
    },
    
    # Stationery
    "letterheads": {
        "url": "https://cdn.pixabay.com/photo/2016/11/27/21/42/letterhead-1863466_1280.jpg",
        "alt": "Professional letterheads"
    },
    "envelopes-standard": {
        "url": "https://cdn.pixabay.com/photo/2016/03/09/09/22/workplace-1246234_1280.jpg",
        "alt": "Business envelopes"
    },
    "envelopes-window": {
        "url": "https://cdn.pixabay.com/photo/2016/11/27/21/42/window-envelope-1863523_1280.jpg",
        "alt": "Window envelopes"
    },
    "notepads": {
        "url": "https://cdn.pixabay.com/photo/2016/11/29/13/00/blank-1869227_1280.jpg",
        "alt": "Custom notepads"
    },
    "folders-presentation": {
        "url": "https://cdn.pixabay.com/photo/2016/03/09/09/30/workplace-1246388_1280.jpg",
        "alt": "Presentation folders"
    },
    "invoice-books": {
        "url": "https://cdn.pixabay.com/photo/2016/03/09/09/30/workplace-1246388_1280.jpg",
        "alt": "Invoice books"
    },
    "receipt-books": {
        "url": "https://cdn.pixabay.com/photo/2016/11/22/23/43/receipt-1850648_1280.jpg",
        "alt": "Receipt books"
    },
    
    # Packaging
    "packaging-boxes-corrugated": {
        "url": "https://cdn.pixabay.com/photo/2014/09/16/22/25/cardboard-449675_1280.jpg",
        "alt": "Corrugated packaging boxes"
    },
    "packaging-boxes-rigid": {
        "url": "https://cdn.pixabay.com/photo/2016/03/02/13/59/gift-1232432_1280.jpg",
        "alt": "Rigid gift boxes"
    },
    "paper-bags": {
        "url": "https://cdn.pixabay.com/photo/2017/03/27/13/56/paper-2178598_1280.jpg",
        "alt": "Eco-friendly paper bags"
    },
    "labels-product": {
        "url": "https://cdn.pixabay.com/photo/2017/08/03/21/58/label-2578430_1280.jpg",
        "alt": "Product labels"
    },
    "stickers-packaging": {
        "url": "https://cdn.pixabay.com/photo/2018/02/01/12/13/sticker-3123729_1280.jpg",
        "alt": "Packaging stickers"
    },
    
    # Books & Binding
    "notebooks-spiral": {
        "url": "https://cdn.pixabay.com/photo/2015/09/05/21/51/reading-925589_1280.jpg",
        "alt": "Spiral notebooks"
    },
    "notebooks-hardcover": {
        "url": "https://cdn.pixabay.com/photo/2016/03/26/22/21/books-1281581_1280.jpg",
        "alt": "Hardcover notebooks"
    },
    "diaries": {
        "url": "https://cdn.pixabay.com/photo/2017/03/27/14/24/diary-2178904_1280.jpg",
        "alt": "Corporate diaries"
    },
    "calendars-wall": {
        "url": "https://cdn.pixabay.com/photo/2017/10/03/20/01/calendar-2813935_1280.jpg",
        "alt": "Wall calendars"
    },
    "calendars-table": {
        "url": "https://cdn.pixabay.com/photo/2016/09/10/11/11/calendar-1659972_1280.jpg",
        "alt": "Table desk calendars"
    },
}


def download_image(url: str, filename: str, output_dir: Path) -> bool:
    """Download image from URL and save to output directory."""
    try:
        print(f"  📥 {filename}...", end=" ", flush=True)
        
        # Add headers to mimic browser request
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        output_path = output_dir / filename
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Get file size
        file_size = output_path.stat().st_size / 1024  # KB
        print(f"✅ ({file_size:.0f} KB)")
        return True
        
    except Exception as e:
        print(f"❌ {str(e)[:50]}")
        return False


def main():
    """Main entry point."""
    print("=" * 70)
    print("🖨️  VIJETHA DIGITAL - Product Image Downloader")
    print("Downloading professional printing images from Pixabay CDN")
    print("=" * 70)
    print()
    
    # Setup output directory
    frontend_dir = Path(__file__).parent.parent / "frontend"
    public_dir = frontend_dir / "public"
    products_dir = public_dir / "products"
    
    # Create products directory if it doesn't exist
    products_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"📁 Output: {products_dir}")
    print(f"📦 Products: {len(PRODUCT_IMAGE_MAPPING)}")
    print()
    
    successful = 0
    failed = 0
    skipped = 0
    failed_list = []
    
    for slug, info in PRODUCT_IMAGE_MAPPING.items():
        filename = f"{slug}.jpg"
        output_path = products_dir / filename
        
        # Skip if already exists
        if output_path.exists():
            file_size = output_path.stat().st_size / 1024
            print(f"  ⏭️  {filename} (exists - {file_size:.0f} KB)")
            skipped += 1
            continue
        
        # Download
        if download_image(info['url'], filename, products_dir):
            successful += 1
        else:
            failed += 1
            failed_list.append(slug)
        
        # Rate limiting - be nice to CDN
        time.sleep(0.2)
    
    print()
    print("=" * 70)
    print(f"✅ Download Complete!")
    print(f"   ✅ Successful: {successful}")
    print(f"   ⏭️  Skipped: {skipped}")
    print(f"   ❌ Failed: {failed}")
    print("=" * 70)
    
    if failed_list:
        print()
        print("Failed downloads:")
        for slug in failed_list:
            print(f"   - {slug}")
    
    if successful > 0:
        print()
        print("📸 Next steps:")
        print("   1. Review images: frontend/public/products/")
        print("   2. Update database: py scripts\\update_product_images.py")
        print("   3. Test on site: Images will be at /products/{slug}.jpg")
    
    if failed > 0 and successful == 0:
        print()
        print("⚠️  All downloads failed. Check your internet connection.")
        sys.exit(1)
    
    print()


if __name__ == "__main__":
    main()
