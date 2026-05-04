# Pre-Launch TODO List

## ✅ Backend (DONE)
- [x] Remove Redis dependency
- [x] Remove Celery workers
- [x] Add "Coming Soon" middleware for checkout/payments
- [x] Make admin endpoints secure
- [x] Reduce memory footprint (512MB total)

## 🎨 Frontend (TO DO)

### 1. Coming Soon Popup
- [ ] Create ComingSoon modal component
- [ ] Show on checkout button click
- [ ] Show on cart page
- [ ] Show on payment pages
- [ ] Message: "Coming Soon! We're preparing to launch. Check back soon!"

### 2. Admin Pages Security
- [ ] Move admin routes to `/admin/*` (currently mixed)
- [ ] Add admin login page separate from user login
- [ ] Add admin route guard
- [ ] Hide admin links from public navigation
- [ ] Add easy reconnect after securing

### 3. UI/UX Fixes

#### Typography
- [ ] Fix inconsistent fonts across pages
- [ ] Set global font family (Poppins/Inter recommended)
- [ ] Fix font sizes (headings too small/large)
- [ ] Fix line heights for readability

#### Product Page Images
- [ ] Optimize image sizes (currently too heavy)
- [ ] Add image lazy loading
- [ ] Compress images (use WebP format)
- [ ] Add image placeholders while loading
- [ ] Download and replace with optimized versions

#### General UI Bugs
- [ ] Fix mobile responsiveness issues
- [ ] Fix button hover states
- [ ] Fix form validation messages
- [ ] Fix loading states
- [ ] Fix error messages styling
- [ ] Add proper spacing/padding
- [ ] Fix color contrast issues

### 4. Product Images
**Current Issue**: Images too large, slow loading

**Action Items**:
- [ ] Find product images (printing services):
  - Business cards
  - Banners
  - Posters
  - Flyers
  - Stickers
  - Vinyl prints
- [ ] Download from free sources:
  - Unsplash (https://unsplash.com)
  - Pexels (https://pexels.com)
  - Pixabay (https://pixabay.com)
- [ ] Optimize images:
  - Resize to max 800x800px
  - Convert to WebP format
  - Compress to <100KB each
- [ ] Upload to `/public/images/products/`
- [ ] Update product data with new image paths

### 5. Performance
- [ ] Enable code splitting
- [ ] Add service worker for caching
- [ ] Minify CSS/JS
- [ ] Remove unused dependencies
- [ ] Add loading skeletons

### 6. SEO & Meta
- [ ] Add meta descriptions
- [ ] Add Open Graph tags
- [ ] Add favicon
- [ ] Add robots.txt
- [ ] Add sitemap.xml

## 📦 Deployment Checklist
- [ ] Test coming soon mode locally
- [ ] Test admin access
- [ ] Test product browsing
- [ ] Verify images load fast
- [ ] Test on mobile devices
- [ ] Deploy to production
- [ ] Set LAUNCH_MODE=coming_soon
- [ ] Monitor logs

## 🚀 Launch Day Checklist
- [ ] Remove LAUNCH_MODE env variable
- [ ] Enable checkout/payments
- [ ] Enable Redis/Celery (optional)
- [ ] Monitor server resources
- [ ] Test complete order flow
- [ ] Announce launch!

---

## Priority Order:
1. **Coming Soon Popup** (blocks checkout)
2. **Product Images** (optimize & replace)
3. **Typography** (consistent fonts)
4. **Admin Security** (hide from public)
5. **UI Bugs** (polish)
6. **Performance** (optimize)
