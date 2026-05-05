# Production Deployment Checklist

## ✅ COMPLETED

### 1. Code Quality & Syntax
- [x] Fixed JSX syntax errors in Checkout.jsx
- [x] Fixed duplicate CSS properties (flex/inline-flex)
- [x] Properly closed multi-line comment blocks
- [x] No syntax errors in production code

### 2. Environment Configuration
- [x] Created frontend/.env.example with all required variables
- [x] Moved WhatsApp number to environment variable
- [x] Backend .env.example properly documented
- [x] Separated development and production configs

### 3. Coming Soon Mode
- [x] ComingSoonModal component created
- [x] Middleware blocks payment endpoints
- [x] Users can browse full checkout UI
- [x] Only payment blocked with professional modal
- [x] WhatsApp CTA in Coming Soon modal

### 4. WhatsApp Integration
- [x] WhatsAppButton component with pulse animation
- [x] Professional pre-filled message
- [x] Appears after 3 seconds
- [x] Configurable via environment variable
- [x] Direct WhatsApp link integration

### 5. Loading States
- [x] ProductSkeleton component (YouTube-style)
- [x] CartSkeleton component
- [x] PageSkeleton component
- [x] Smooth loading animations

### 6. Docker Configuration
- [x] docker-compose.prod.yml with memory limits
- [x] PostgreSQL + API setup (512MB RAM)
- [x] Redis made optional
- [x] Celery workers made optional
- [x] Health checks configured

---

## 🔧 TODO: BEFORE PRODUCTION LAUNCH

### 1. Environment Variables (CRITICAL)
```bash
# Backend (.env)
- [ ] Change JWT_SECRET_KEY to strong random value
- [ ] Update DATABASE_URL with production credentials
- [ ] Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (production keys)
- [ ] Configure SMTP settings for email
- [ ] Set FRONTEND_URL to production domain
- [ ] Update ALLOWED_ORIGINS with production domain
- [ ] Set SECURE_COOKIES=true for HTTPS
- [ ] Configure CLOUDINARY credentials for image uploads

# Frontend (.env)
- [ ] Update VITE_API_BASE_URL to production API URL
- [ ] Update VITE_WHATSAPP_NUMBER to actual business number
- [ ] Set VITE_RAZORPAY_KEY_ID (production key)
- [ ] Set VITE_ENABLE_COMING_SOON=false when ready to launch
```

### 2. Security Hardening
- [ ] Review all CORS settings
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set secure cookie flags
- [ ] Review rate limiting settings
- [ ] Enable security headers (HSTS, CSP, etc.)
- [ ] Review admin access controls
- [ ] Test authentication flows
- [ ] Review password policies

### 3. Database
- [ ] Run all Alembic migrations
- [ ] Create database backups
- [ ] Set up automated backup schedule
- [ ] Test database connection pooling
- [ ] Review indexes for performance
- [ ] Set up database monitoring

### 4. Payment Gateway
- [ ] Switch Razorpay from test to production keys
- [ ] Test payment flow end-to-end
- [ ] Configure webhook endpoints
- [ ] Test refund functionality
- [ ] Review payment error handling
- [ ] Set up payment monitoring/alerts

### 5. Email Configuration
- [ ] Configure SMTP server
- [ ] Test order confirmation emails
- [ ] Test password reset emails
- [ ] Test admin notification emails
- [ ] Set up email templates
- [ ] Configure email rate limits

### 6. Monitoring & Logging
- [ ] Set LOG_LEVEL=WARNING or ERROR in production
- [ ] Replace console.log with logger utility (see frontend/src/utils/logger.js)
- [ ] Set up error tracking (Sentry recommended)
- [ ] Configure application monitoring
- [ ] Set up uptime monitoring
- [ ] Configure log rotation
- [ ] Set up alerts for critical errors

### 7. Performance Optimization
- [ ] Enable frontend production build (npm run build)
- [ ] Configure CDN for static assets
- [ ] Optimize images (compress, WebP format)
- [ ] Enable gzip/brotli compression
- [ ] Test page load times
- [ ] Review database query performance
- [ ] Enable caching where appropriate

### 8. Testing
- [ ] Run all backend tests: `pytest tests/`
- [ ] Test all user flows (registration, login, checkout)
- [ ] Test admin dashboard functionality
- [ ] Test payment flows (success, failure, cancellation)
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Load testing (simulate concurrent users)
- [ ] Security testing (OWASP top 10)

### 9. Content & Business
- [ ] Update WhatsApp number to actual business number
- [ ] Update store address in Checkout.jsx (line 420)
- [ ] Update business hours
- [ ] Add actual product images
- [ ] Review all text content
- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Add refund policy
- [ ] Update contact information

### 10. Deployment
- [ ] Set up production server (1GB RAM minimum)
- [ ] Install Docker and Docker Compose
- [ ] Clone repository to server
- [ ] Configure environment variables
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Start services: `docker-compose -f docker-compose.prod.yml up -d`
- [ ] Run database migrations
- [ ] Create first admin user
- [ ] Test all functionality on production
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure domain DNS
- [ ] Set up automated deployments (optional)

### 11. Post-Launch
- [ ] Monitor error logs daily
- [ ] Monitor payment transactions
- [ ] Set up Google Analytics (optional)
- [ ] Monitor server resources (CPU, RAM, disk)
- [ ] Set up automated backups
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Set up status page (optional)

---

## 📋 KNOWN ISSUES TO FIX

### Frontend Console Statements
Multiple files still use console.log/error. Replace with logger utility:

**Files to update:**
- frontend/src/pages/admin/AdminDashboard.jsx (9 occurrences)
- frontend/src/pages/admin/StaffAccess.jsx
- frontend/src/pages/admin/Reports.jsx
- frontend/src/pages/Products.jsx
- frontend/src/pages/ProductDetail.jsx
- frontend/src/pages/Home.jsx
- frontend/src/pages/Checkout.jsx (commented out, but should use logger when enabled)
- frontend/src/components/layout/Header.jsx

**How to fix:**
```javascript
// Replace this:
console.error("Failed to load data", error);

// With this:
import logger from '../utils/logger';
logger.apiError('/api/endpoint', error, { context: 'loading data' });
```

### Hardcoded Values
- Store address in Checkout.jsx (line 420-421)
- Pickup hours in Checkout.jsx (line 425)
- WhatsApp message templates (should be configurable)

---

## 🚀 QUICK START COMMANDS

### Development
```bash
# Backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
```

### Production Build
```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend (Docker)
docker-compose -f docker-compose.prod.yml up -d
```

### Database Migrations
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 📞 SUPPORT CONTACTS

- **Developer**: [Your contact]
- **Server Admin**: [Server admin contact]
- **Business Owner**: [Business contact]

---

## 🔐 SECURITY NOTES

1. **Never commit .env files** - They contain secrets
2. **Use strong passwords** - Minimum 12 characters
3. **Enable 2FA** - For admin accounts
4. **Regular updates** - Keep dependencies updated
5. **Backup regularly** - Database and uploaded files
6. **Monitor logs** - Watch for suspicious activity
7. **Rate limiting** - Prevent abuse
8. **HTTPS only** - No plain HTTP in production

---

## 📊 RESOURCE REQUIREMENTS

### Minimum (Coming Soon Mode)
- **RAM**: 512MB
- **CPU**: 1 core
- **Disk**: 10GB
- **Bandwidth**: 1TB/month
- **Cost**: $6-12/month

### Recommended (Full Launch)
- **RAM**: 1-2GB
- **CPU**: 2 cores
- **Disk**: 20GB SSD
- **Bandwidth**: 2TB/month
- **Cost**: $12-24/month

### With Redis + Celery
- **RAM**: 2GB
- **CPU**: 2 cores
- **Disk**: 20GB SSD
- **Cost**: $20-30/month

---

## ✨ FEATURE FLAGS

Control features via environment variables:

```bash
# Coming Soon Mode
VITE_ENABLE_COMING_SOON=true  # Block payments, show modal

# WhatsApp Button
VITE_ENABLE_WHATSAPP_BUTTON=true  # Show floating button

# Analytics
VITE_ENABLE_ANALYTICS=false  # Google Analytics

# Backend Features
ENABLE_TWO_FACTOR_AUTH=true
ENABLE_EMAIL_VERIFICATION=false
ENABLE_ANALYTICS=true
```

---

**Last Updated**: 2026-05-04
**Version**: 1.0.0
**Status**: Pre-launch (Coming Soon Mode Active)
