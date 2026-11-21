# Product Media Strategy - Vijetha Digital
## 43 Products × 5 Images + Videos = Professional E-Commerce Gallery

## The Challenge
You need **215+ high-quality images** (43 products × 5 images each) plus optional videos. This is a significant content creation task that can't be fully automated with stock photos because:

1. **Relevance**: Generic stock photos don't show YOUR actual work quality
2. **Trust**: Customers want to see real examples of your printing
3. **SEO**: Original photos rank better than stock images
4. **Brand**: Your actual products showcase your capabilities

## Recommended Approach: Hybrid Strategy

### Phase 1: Quick Launch (1-2 hours)
**Goal**: Get site live with decent placeholder images

**Action**:
- Use 1-2 stock images per product category
- Total: ~10-15 curated stock photos
- Good enough for testing and initial launch

**Run**: `py scripts\download_product_placeholders.py`

### Phase 2: Real Product Photography (Ongoing)
**Goal**: Replace stock with actual product photos

**Action**:
- Photograph your actual work (best option!)
- Take 4-5 photos per product type
- Use phone camera with good lighting

**Timeline**: Can be done gradually over 2-4 weeks

### Phase 3: Professional Enhancement (Optional)
**Goal**: Add videos and lifestyle shots

**Action**:
- Short video demos of printing process
- Before/after shots
- Installation photos for signboards
- Customer testimonial photos

---

## Quick Start: Run Phase 1 Now

I'll create a smart script that downloads **curated, relevant** stock images:

### What the script does:
1. ✅ Downloads 2-3 high-quality images per product
2. ✅ Uses Pixabay/Pexels free stock photos
3. ✅ Organizes by product slug
4. ✅ Updates database automatically
5. ✅ Total: ~100-130 images (manageable size)

### Image naming convention:
```
products/
  ├── business-cards-standard/
  │   ├── 01-main.jpg          (primary hero image)
  │   ├── 02-detail.jpg        (close-up/detail shot)
  │   └── 03-lifestyle.jpg     (in-use/context shot)
  ├── banners-flex/
  │   ├── 01-main.jpg
  │   ├── 02-detail.jpg
  │   └── 03-lifestyle.jpg
```

---

## For Best Results: Take Your Own Photos

### Equipment Needed:
- ✅ Smartphone camera (iPhone/Android)
- ✅ White background (paper/cloth)
- ✅ Natural window light OR 2 desk lamps
- ✅ Simple photo editing app (free)

### Photo Types Per Product (5 shots):

**1. Hero Shot** - Main product image
- Clean, straight-on view
- White/neutral background
- Shows full product clearly

**2. Detail Shot** - Close-up of quality
- Shows printing quality/texture
- Highlights finish (gloss/matte)
- Demonstrates craftsmanship

**3. Context/Lifestyle** - Product in use
- Business cards on desk
- Banner at event
- Brochure in hands

**4. Size Reference** - Scale comparison
- Next to common objects
- Hand holding product
- Shows actual dimensions

**5. Variety Shot** - Options/variations
- Different colors/finishes
- Multiple pieces together
- Before/after if applicable

### Quick Photography Tips:

**Lighting**:
- Shoot near window with indirect light
- OR use 2 lamps at 45-degree angles
- Avoid harsh shadows

**Composition**:
- Fill frame with product
- Leave some breathing room
- Keep camera level (not tilted)

**Editing** (use free apps):
- Crop to square or 4:3 ratio
- Increase brightness slightly
- Enhance colors slightly
- Remove background if needed (remove.bg)

---

## Video Content (Optional but Powerful)

### What Videos to Create:

**1. Process Videos** (15-30 seconds)
- Printing business cards time-lapse
- Banner installation process
- Quality check demonstration

**2. Before/After Transformations**
- Blank material → finished product
- Unboxing new prints
- Application process (stickers, vinyl)

**3. Product Demos**
- Flex banner durability test
- Business card paper quality
- Waterproof sticker test

### Video Specs:
- Format: MP4 (H.264)
- Resolution: 1080p or 720p
- Length: 15-60 seconds
- File size: Under 10MB each
- Hosting: Upload to YouTube/Vimeo, embed URL

---

## Implementation Timeline

### Week 1: Launch with Placeholders
- [x] Run download script (automated)
- [x] Apply migration (1 command)
- [x] Update frontend gallery component
- [x] Test on local
- [x] Deploy to production

### Week 2-3: Replace with Real Photos
- [ ] Photograph 5-10 products
- [ ] Edit and optimize images
- [ ] Upload to `/products/{slug}/` folder
- [ ] Update database with new URLs

### Week 4+: Add Videos
- [ ] Record 5-10 product videos
- [ ] Upload to YouTube unlisted
- [ ] Add video URLs to database

---

## Database Structure

```python
Product {
    # Legacy (backward compatible)
    image_url: str  # First image from gallery
    
    # New gallery system
    images: List[str] = [
        "/products/business-cards/01-main.jpg",
        "/products/business-cards/02-detail.jpg",
        "/products/business-cards/03-lifestyle.jpg",
    ]
    
    # Videos
    videos: List[dict] = [
        {
            "url": "https://youtube.com/embed/xxxxx",
            "thumbnail": "/products/business-cards/video-thumb.jpg",
            "title": "Business Card Printing Process",
            "duration": "0:30"
        }
    ]
}
```

---

## Action Items for You

### Immediate (Today):
1. ✅ Run: `py scripts\download_product_placeholders.py`
2. ✅ Run: `alembic upgrade head`
3. ✅ Test locally
4. ✅ Deploy to production

### This Week:
1. 📸 Take photos of 5-10 best products
2. 🎨 Edit photos (crop, brighten, remove background)
3. 📤 Upload to replace placeholders

### Next 2 Weeks:
1. 📸 Continue photographing remaining products
2. 🎥 Record 2-3 demo videos
3. 📊 Track which products need better images

---

## Tools & Resources

### Free Photo Editing:
- **Remove.bg** - Remove backgrounds automatically
- **Canva.com** - Resize, crop, enhance
- **Photopea.com** - Free Photoshop alternative
- **ILoveIMG.com** - Batch resize/compress

### Free Video Editing:
- **CapCut** (mobile/desktop) - Easy video editor
- **DaVinci Resolve** - Professional (free version)
- **iMovie** (Mac) / **Photos** (Windows) - Built-in

### Stock Photo Backup:
- **Pixabay.com** - Free, no attribution
- **Pexels.com** - Free, high quality
- **Unsplash.com** - Free, artistic

---

## Cost-Benefit Analysis

### Option A: All Stock Photos
- Cost: $0 (free stock photos)
- Time: 2-3 hours (automated)
- Quality: ⭐⭐⭐ (generic, not your work)
- Trust: ⭐⭐ (customers know it's stock)

### Option B: Your Own Photos
- Cost: $0 (use phone camera)
- Time: 5-10 hours (spread over weeks)
- Quality: ⭐⭐⭐⭐⭐ (shows YOUR quality)
- Trust: ⭐⭐⭐⭐⭐ (authentic, builds credibility)

### Option C: Professional Photography
- Cost: ₹15,000-30,000 (hire photographer)
- Time: 1 week
- Quality: ⭐⭐⭐⭐⭐ (very professional)
- Trust: ⭐⭐⭐⭐⭐ (top tier)

**Recommendation**: Start with Option A (stock), gradually replace with Option B (your photos), consider Option C for hero products only.

---

## Ready to Start?

Run this command to download curated placeholder images:
```bash
py scripts\download_product_placeholders.py
```

Then run the migration:
```bash
alembic upgrade head
```

The script will download 2-3 relevant images per product and organize them properly!
