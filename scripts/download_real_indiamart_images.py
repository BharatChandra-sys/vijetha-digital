#!/usr/bin/env python3
"""
Download REAL product images from Vijetha Digital's IndiaMART listing.
These are your actual product photos, not stock images!
"""

import os
import sys
import time
import requests
from pathlib import Path

# REAL images from your IndiaMART page
# Format: slug → IndiaMART image URL
INDIAMART_IMAGES = {
    # Sign Boards
    "vinyl-sign-board": "https://4.imimg.com/data4/NW/NM/MY-4392469/vinyl-sign-board-500x500.jpeg",
    "glow-sign-board": "https://4.imimg.com/data4/YH/UY/MY-4392469/glow-sign-board-500x500.jpg",
    "aluminium-sign-board": "https://4.imimg.com/data4/XB/KP/MY-4392469/aluminium-sign-board-500x500.jpg",
    "open-led-sign-board": "https://4.imimg.com/data4/UK/FP/MY-4392469/open-led-sign-board-500x500.jpg",
    "3d-sign-board": "https://4.imimg.com/data4/FR/SP/MY-4392469/3d-sign-boards-500x500.jpg",
    
    # Printing Services
    "offset-printing": "https://4.imimg.com/data4/KA/GP/MY-4392469/offset-printing-service-500x500.jpg",
    "letterhead-printing": "https://4.imimg.com/data4/OQ/AO/MY-4392469/letterhead-printing-service-500x500.jpg",
    "flex-printing": "https://4.imimg.com/data4/UN/HB/GLADMIN-4392469/6.png",
    "gift-voucher-printing": "https://4.imimg.com/data4/NO/OS/MY-4392469/gift-voucher-printing-service-500x500.png",
    "catalogue-printing": "https://4.imimg.com/data4/QC/YW/MY-4392469/catalogue-printing-service-500x500.jpg",
    "canvas-printing": "https://4.imimg.com/data4/SN/JS/NSDMERP-4392469/canvasprinting-500x500.png",
    
    # Banner Stands
    "roller-banner-stand": "https://4.imimg.com/data4/YS/CY/MY-4392469/roller-banner-stand-500x500.jpg",
    "advertising-roll-up-banner-stand": "https://4.imimg.com/data4/ET/JI/MY-4392469/91-500x500.jpg",
    "promotional-banner-stand": "https://4.imimg.com/data4/FT/NO/MY-4392469/92-500x500.jpg",
    "roll-up-banner-stand": "https://4.imimg.com/data4/OE/UF/MY-4392469/roll-up-banner-stand-500x500.jpg",
    "heavy-roll-up-banner-stand": "https://4.imimg.com/data4/NN/LR/MY-4392469/93-500x500.jpg",
    
    # Demo Tents
    "demo-tent-6x6x7-ft": "https://4.imimg.com/data4/DJ/IX/MY-4392469/98-500x500.jpg",
    "demo-tent-4x4x7-ft": "https://4.imimg.com/data4/CJ/HI/MY-4392469/95-500x500.jpg",
    "outdoor-demo-tent": "https://4.imimg.com/data4/YC/HX/MY-4392469/100-500x500.jpg",
    "display-demo-tent": "https://4.imimg.com/data4/IN/RI/MY-4392469/display-demo-tent-500x500.jpg",
}


def download_image(url: str, filename: str, output_dir: Path) -> bool:
    """Download image from URL and save to output directory."""
    try:
        print(f"  📥 {filename}...", end=" ", flush=True)
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
            'Referer': 'https://www.indiamart.com/'
        }
        
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        output_path = output_dir / filename
        
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        file_size = output_path.stat().st_size / 1024
        print(f"✅ ({file_size:.0f} KB)")
        return True
        
    except Exception as e:
        print(f"❌ {str(e)[:50]}")
        return False


def main():
    """Main entry point."""
    print("=" * 70)
    print("🖨️  VIJETHA DIGITAL - Real Product Images from IndiaMART")
    print("Downloading YOUR actual product photos!")
    print("=" * 70)
    print()
    
    # Setup directories
    frontend_dir = Path(__file__).parent.parent / "frontend"
    products_dir = frontend_dir / "public" / "products"
    products_dir.mkdir(parents=True, exist_ok=True)
    
    print(f"📁 Output: {products_dir}")
    print(f"📦 Products: {len(INDIAMART_IMAGES)}")
    print(f"📸 Source: IndiaMART (Your actual listings)")
    print()
    
    successful = 0
    failed = 0
    skipped = 0
    failed_list = []
    
    for slug, url in INDIAMART_IMAGES.items():
        # Determine file extension from URL
        ext = ".jpg"
        if url.endswith(".png"):
            ext = ".png"
        elif url.endswith(".jpeg"):
            ext = ".jpg"
        
        filename = f"{slug}{ext}"
        output_path = products_dir / filename
        
        # Skip if exists
        if output_path.exists():
            file_size = output_path.stat().st_size / 1024
            print(f"  ⏭️  {filename} (exists - {file_size:.0f} KB)")
            skipped += 1
            continue
        
        # Download
        if download_image(url, filename, products_dir):
            successful += 1
        else:
            failed += 1
            failed_list.append(slug)
        
        # Rate limiting - be respectful
        time.sleep(0.5)
    
    print()
    print("=" * 70)
    print(f"✅ Download Complete!")
    print(f"   ✅ Successful: {successful}")
    print(f"   ⏭️  Skipped: {skipped}")
    print(f"   ❌ Failed: {failed}")
    print("=" * 70)
    
    if failed_list:
        print()
        print("⚠️  Failed downloads:")
        for slug in failed_list:
            print(f"   - {slug}")
    
    if successful > 0:
        print()
        print("📸 Next steps:")
        print("   1. Map images to DB: py scripts\\map_downloaded_images.py")
        print("   2. Test locally: cd frontend && npm run dev")
    
    print()
    print("✅ These are YOUR REAL product images from IndiaMART!")
    print()


if __name__ == "__main__":
    main()
