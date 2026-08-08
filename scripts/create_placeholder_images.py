#!/usr/bin/env python3
"""
Create professional placeholder images for products.
Uses PIL to generate clean gradient images with product names.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from PIL import Image, ImageDraw, ImageFont
    import textwrap
except ImportError:
    print("❌ Pillow not installed. Installing...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow"])
    from PIL import Image, ImageDraw, ImageFont
    import textwrap

from app.db.session import SessionLocal
from app.models.product import Product


# Professional color palette for placeholders
CATEGORY_COLORS = {
    'signage': ('#1e40af', '#3b82f6'),  # Blue gradient
    'printing': ('#059669', '#10b981'),  # Green gradient
    'banner': ('#7c3aed', '#a78bfa'),   # Purple gradient
    'tent': ('#dc2626', '#f87171'),     # Red gradient
    'branding': ('#ea580c', '#fb923c'),  # Orange gradient
    'default': ('#475569', '#64748b'),   # Gray gradient
}


def get_category_color(product_name: str):
    """Determine color based on product name keywords."""
    name_lower = product_name.lower()
    
    if any(word in name_lower for word in ['sign', 'board', 'led', 'acrylic', 'glow']):
        return CATEGORY_COLORS['signage']
    elif any(word in name_lower for word in ['banner', 'roll', 'stand', 'flex']):
        return CATEGORY_COLORS['banner']
    elif any(word in name_lower for word in ['tent', 'canopy']):
        return CATEGORY_COLORS['tent']
    elif any(word in name_lower for word in ['branding', 'vehicle', 'umbrella', 't-shirt']):
        return CATEGORY_COLORS['branding']
    elif any(word in name_lower for word in ['printing', 'card', 'brochure', 'letterhead', 'sticker']):
        return CATEGORY_COLORS['printing']
    else:
        return CATEGORY_COLORS['default']


def create_gradient_image(width, height, color1, color2):
    """Create a vertical gradient image."""
    base = Image.new('RGB', (width, height), color1)
    top = Image.new('RGB', (width, height), color2)
    mask = Image.new('L', (width, height))
    mask_data = []
    for y in range(height):
        mask_data.extend([int(255 * (y / height))] * width)
    mask.putdata(mask_data)
    base.paste(top, (0, 0), mask)
    return base


def create_placeholder(product_name: str, slug: str, output_path: Path):
    """Create a professional placeholder image for a product."""
    
    # Image dimensions
    width, height = 800, 600
    
    # Get colors based on category
    color1, color2 = get_category_color(product_name)
    
    # Create gradient background
    img = create_gradient_image(width, height, color1, color2)
    draw = ImageDraw.Draw(img)
    
    # Try to load a font, fall back to default if not available
    try:
        title_font = ImageFont.truetype("arial.ttf", 48)
        subtitle_font = ImageFont.truetype("arial.ttf", 24)
    except:
        try:
            title_font = ImageFont.truetype("Arial.ttf", 48)
            subtitle_font = ImageFont.truetype("Arial.ttf", 24)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
    
    # Wrap text if too long
    max_width = 700
    wrapped_lines = textwrap.wrap(product_name, width=25)
    
    # Calculate total text height
    line_height = 60
    total_height = len(wrapped_lines) * line_height
    start_y = (height - total_height) // 2
    
    # Draw product name (centered, white text)
    for i, line in enumerate(wrapped_lines):
        # Get text bounding box for centering
        bbox = draw.textbbox((0, 0), line, font=title_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = start_y + (i * line_height)
        
        # Draw text with shadow for better readability
        shadow_offset = 3
        draw.text((x + shadow_offset, y + shadow_offset), line, fill='#00000080', font=title_font)
        draw.text((x, y), line, fill='white', font=title_font)
    
    # Draw "Vijetha Digital" watermark at bottom
    watermark = "VIJETHA DIGITAL"
    bbox = draw.textbbox((0, 0), watermark, font=subtitle_font)
    watermark_width = bbox[2] - bbox[0]
    watermark_x = (width - watermark_width) // 2
    watermark_y = height - 60
    draw.text((watermark_x, watermark_y), watermark, fill='#ffffff80', font=subtitle_font)
    
    # Save image
    img.save(output_path, 'JPEG', quality=85, optimize=True)


def main():
    """Generate placeholder images for all products."""
    print("=" * 70)
    print("🎨 Creating Professional Placeholder Images")
    print("=" * 70)
    print()
    
    # Setup directories
    frontend_dir = Path(__file__).parent.parent / "frontend"
    products_dir = frontend_dir / "public" / "products"
    products_dir.mkdir(parents=True, exist_ok=True)
    
    db = SessionLocal()
    try:
        products = db.query(Product).all()
        
        print(f"📦 Products: {len(products)}")
        print(f"📁 Output: {products_dir}")
        print()
        
        created = 0
        skipped = 0
        
        for product in products:
            if not product.slug:
                print(f"  ⚠️  Skipping {product.name} (no slug)")
                skipped += 1
                continue
            
            filename = f"{product.slug}.jpg"
            output_path = products_dir / filename
            
            if output_path.exists():
                print(f"  ⏭️  {filename} (exists)")
                skipped += 1
                continue
            
            try:
                create_placeholder(product.name, product.slug, output_path)
                file_size = output_path.stat().st_size / 1024
                print(f"  ✅ {filename} ({file_size:.0f} KB)")
                created += 1
            except Exception as e:
                print(f"  ❌ {filename} - Error: {e}")
        
        print()
        print("=" * 70)
        print(f"✅ Complete!")
        print(f"   ✅ Created: {created}")
        print(f"   ⏭️  Skipped: {skipped}")
        print("=" * 70)
        print()
        print("💡 These are placeholder images with product names.")
        print("   Replace them with actual product photos for best results!")
        print()
        
    finally:
        db.close()


if __name__ == "__main__":
    main()
