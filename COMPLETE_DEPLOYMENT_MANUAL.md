# 🚀 Complete Deployment Manual - Vijetha Digital

**Comprehensive step-by-step guide to deploy your full-stack application to production.**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Part 1: Backend Deployment (Render)](#part-1-backend-deployment-render)
4. [Part 2: Frontend Deployment (Vercel)](#part-2-frontend-deployment-vercel)
5. [Part 3: Database Setup & Seeding](#part-3-database-setup--seeding)
6. [Part 4: Email & OAuth Configuration](#part-4-email--oauth-configuration)
7. [Part 5: Testing & Verification](#part-5-testing--verification)
8. [Part 6: Post-Deployment](#part-6-post-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Accounts (All Free Tier Available)
- [ ] GitHub account
- [ ] Render account (https://render.com)
- [ ] Vercel account (https://vercel.com)
- [ ] Brevo account (https://brevo.com) - for emails
- [ ] Cloudinary account (https://cloudinary.com) - for images
- [ ] Razorpay account (https://razorpay.com) - for payments
- [ ] Google Cloud account (https://console.cloud.google.com) - for OAuth

### Local Setup
- [ ] Git installed
- [ ] Code pushed to GitHub
- [ ] All sensitive data removed from code
- [ ] `.env` file configured locally (for reference)

---

## Pre-Deployment Checklist

### Security Review
- [ ] No hardcoded secrets in code
- [ ] `.env` file in `.gitignore`
- [ ] Strong JWT secret key generated
- [ ] Admin password is strong
- [ ] API docs disabled in production
- [ ] CORS configured correctly
- [ ] Rate limiting enabled

### Code Review
- [ ] All tests passing locally
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Database migrations up to date
- [ ] Dependencies up to date

### Configuration Files Ready
- [ ] `requirements-pinned.txt` exists
- [ ] `render.yaml` configured
- [ ] `vercel.json` configured
- [ ] `.env.example` updated
- [ ] `alembic.ini` configured

---

## Part 1: Backend Deployment (Render)

### Step 1.1: Push Code to GitHub

```bash
# Ensure all changes are committed
git status

# Add all files
git add .

# Commit
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin main
```

### Step 1.2: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub
4. Authorize Render to access your repositories

### Step 1.3: Create PostgreSQL Database

1. In Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure database:
   - **Name**: `vijetha-digital-db`
   - **Database**: `vijetha_db`
   - **User**: `vijetha_user`
   - **Region**: Choose closest to your users (e.g., Singapore, Oregon)
   - **PostgreSQL Version**: 15
   - **Plan**: **Free** (or Starter $7/month for production)
3. Click **"Create Database"**
4. Wait for database creation (2-3 minutes)
5. **IMPORTANT**: Copy the **Internal Database URL**
   - Format: `postgresql://user:password@host:5432/database`
   - Save this securely - you'll need it next

### Step 1.4: Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your repository: `vijetha-digital-backend`
4. Configure service:

**Basic Settings:**
- **Name**: `vijetha-digital-api`
- **Region**: Same as database
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: `Python 3`

**Build & Start Commands:**
- **Build Command**:
  ```bash
  pip install --upgrade pip && pip install -r requirements-pinned.txt && alembic upgrade head
  ```
- **Start Command**:
  ```bash
  gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --bind 0.0.0.0:$PORT --timeout 120 --access-logfile - --error-logfile - --log-level info
  ```

**Instance Type:**
- **Plan**: Free (or Starter $7/month for always-on)

5. Click **"Advanced"** to add environment variables

### Step 1.5: Configure Environment Variables

Click **"Add Environment Variable"** for each:

**Required Variables:**

```bash
# Application
ENV=production
APP_NAME=Vijetha Digital Backend

# Database (paste the Internal Database URL from Step 1.3)
DATABASE_URL=postgresql://vijetha_user:password@host:5432/vijetha_db

# Frontend URL (you'll update this after deploying frontend)
FRONTEND_URL=https://your-app.vercel.app

# JWT Configuration (generate a strong random string)
JWT_SECRET_KEY=<generate-64-character-random-string>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin Account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<create-strong-password>

# Cloudinary (get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (get from razorpay.com dashboard)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-secret-key
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Brevo Email (get from brevo.com - see BREVO_OAUTH_SETUP_GUIDE.md)
BREVO_API_KEY=xkeysib-your-api-key
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=Vijetha Digital

# Google OAuth (optional - see BREVO_OAUTH_SETUP_GUIDE.md)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Business Configuration
GST_PERCENTAGE=18.0
MIN_ORDER_AMOUNT=100.0
MAX_FILE_SIZE_MB=50
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,tiff,ai,psd,eps,cdr
UPLOAD_DIR=uploads

# Redis (leave empty for free tier)
REDIS_URL=

# Security
AUTO_CREATE_SCHEMA_ON_STARTUP=false
TRUSTED_HOSTS=*
```

**How to Generate JWT_SECRET_KEY:**
```bash
# On Linux/Mac:
openssl rand -hex 32

# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | % {[char]$_})

# Or use online: https://randomkeygen.com/
```

6. Click **"Create Web Service"**
7. Wait for deployment (5-10 minutes)

### Step 1.6: Verify Backend Deployment

1. Once deployed, you'll get a URL like: `https://vijetha-digital-api.onrender.com`
2. Test the health endpoint:
   ```bash
   curl https://vijetha-digital-api.onrender.com/health
   ```
3. Expected response:
   ```json
   {
     "status": "ok",
     "version": "2.0.0",
     "db": "ok",
     "redis": "error",
     "timestamp": "2026-05-05T..."
   }
   ```
4. Note: `redis: "error"` is normal on free tier

---

## Part 2: Frontend Deployment (Vercel)

### Step 2.1: Create Vercel Account

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Sign up with GitHub
4. Authorize Vercel

### Step 2.2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Vercel will auto-detect it's a monorepo

### Step 2.3: Configure Project

**Framework Preset:**
- Vercel should auto-detect: **Vite**

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Select: `frontend`

**Build Settings:**
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 2.4: Add Environment Variables

Click **"Environment Variables"** and add:

```bash
# Backend API URL (your Render URL from Part 1)
VITE_API_BASE_URL=https://vijetha-digital-api.onrender.com

# WhatsApp Number (with country code, no + or spaces)
VITE_WHATSAPP_NUMBER=919876543210

# Google OAuth Client ID (optional)
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Razorpay Key (for frontend payments)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

### Step 2.5: Deploy

1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

### Step 2.6: Update Backend CORS

1. Go back to Render dashboard
2. Open your backend service
3. Go to **"Environment"**
4. Update `FRONTEND_URL` to your Vercel URL:
   ```bash
   FRONTEND_URL=https://your-app.vercel.app
   ```
5. Click **"Save Changes"**
6. Service will auto-redeploy

### Step 2.7: Verify Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. You should see the homepage
3. Try browsing products
4. Check browser console for errors

---

## Part 3: Database Setup & Seeding

### Step 3.1: Connect to Database

**Option A: Using Render Dashboard**
1. Go to Render dashboard → Your database
2. Click **"Connect"** → **"External Connection"**
3. Copy the connection command

**Option B: Using psql locally**
```bash
psql postgresql://user:password@host:5432/database
```

### Step 3.2: Verify Schema

```sql
-- Check if tables exist
\dt

-- Should see tables like:
-- users, products, orders, order_items, etc.
```

If tables don't exist, migrations didn't run. Check Render logs.

### Step 3.3: Seed Products

**Option A: Using SQL Script (Recommended)**

1. Connect to database (see Step 3.1)
2. Run the seed script:
   ```bash
   psql postgresql://user:password@host:5432/database < scripts/seed_products.sql
   ```

**Option B: Using Python Script**

1. Set DATABASE_URL locally:
   ```bash
   export DATABASE_URL="postgresql://user:password@host:5432/database"
   ```
2. Run seed script:
   ```bash
   python scripts/seed_products.py
   ```

**Option C: Using Admin Dashboard**

1. Go to `https://your-app.vercel.app/admin/login`
2. Login with admin credentials
3. Navigate to Products
4. Add products manually through UI

### Step 3.4: Verify Products

```sql
-- Check products
SELECT id, name, category, base_price, is_active FROM products;

-- Should see 10 products
```

Or visit: `https://your-app.vercel.app/products`

---

## Part 4: Email & OAuth Configuration

See **[BREVO_OAUTH_SETUP_GUIDE.md](BREVO_OAUTH_SETUP_GUIDE.md)** for detailed instructions.

### Quick Summary:

**Brevo Email:**
1. Create account at https://brevo.com
2. Get API key
3. Verify sender email
4. Add to Render environment variables

**Google OAuth:**
1. Create project at https://console.cloud.google.com
2. Enable Google+ API
3. Configure OAuth consent screen
4. Create credentials
5. Add to Render and Vercel environment variables

---

## Part 5: Testing & Verification

### 5.1 Backend Health Check

```bash
curl https://your-render-app.onrender.com/health
```

Expected:
```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "error",
  "timestamp": "..."
}
```

### 5.2 Test User Registration

```bash
curl -X POST https://your-render-app.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

Expected: 201 Created + welcome email sent

### 5.3 Test User Login

```bash
curl -X POST https://your-render-app.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'
```

Expected: 200 OK + access_token

### 5.4 Test Products API

```bash
curl https://your-render-app.onrender.com/products
```

Expected: Array of products

### 5.5 Frontend Testing

Visit your Vercel URL and test:

- [ ] Homepage loads
- [ ] Products page shows products
- [ ] Product images load
- [ ] Can add to cart
- [ ] Registration works
- [ ] Login works
- [ ] Google OAuth works (if configured)
- [ ] WhatsApp button works
- [ ] Admin login works
- [ ] Mobile responsive

### 5.6 Email Testing

- [ ] Welcome email on registration
- [ ] Password reset email
- [ ] Order confirmation email
- [ ] Check spam folder if not received

### 5.7 Payment Testing

Use Razorpay test mode:
- Test Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

---

## Part 6: Post-Deployment

### 6.1 Custom Domain (Optional)

**For Frontend (Vercel):**
1. Go to Vercel project → Settings → Domains
2. Add your domain: `www.vijetha.com`
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

**For Backend (Render):**
1. Go to Render service → Settings → Custom Domain
2. Add your API domain: `api.vijetha.com`
3. Add CNAME record to DNS
4. SSL is automatic

### 6.2 Update Environment Variables

After adding custom domains:

**Render:**
```bash
FRONTEND_URL=https://www.vijetha.com
```

**Vercel:**
```bash
VITE_API_BASE_URL=https://api.vijetha.com
```

### 6.3 Enable Auto-Deploy

**Render:**
- Auto-deploy is enabled by default
- Push to `main` branch triggers deployment

**Vercel:**
- Auto-deploy is enabled by default
- Push to `main` branch triggers deployment

### 6.4 Set Up Monitoring

**Render:**
- View logs: Service → Logs
- Set up alerts: Service → Settings → Notifications

**Vercel:**
- View logs: Project → Deployments → Click deployment
- Analytics: Project → Analytics

**Brevo:**
- Monitor email delivery: Dashboard → Statistics

**Razorpay:**
- Monitor payments: Dashboard → Transactions

---

## Troubleshooting

### Backend Won't Start

**Check Render Logs:**
1. Go to Render dashboard → Your service → Logs
2. Look for errors

**Common Issues:**
- Missing environment variables
- Database connection failed
- Migration errors
- Port binding issues

**Solutions:**
```bash
# Verify all required env vars are set
# Check DATABASE_URL format
# Ensure database is running
# Check build command completed successfully
```

### Frontend Can't Connect to Backend

**Check:**
- [ ] VITE_API_BASE_URL is correct
- [ ] Backend is running (check /health)
- [ ] CORS is configured (FRONTEND_URL in backend)
- [ ] No mixed content (HTTPS frontend → HTTP backend)

**Test CORS:**
```bash
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-render-app.onrender.com/auth/login
```

### Database Connection Errors

**Check:**
- [ ] DATABASE_URL is correct
- [ ] Database is running in Render
- [ ] Migrations ran successfully
- [ ] Connection pool not exhausted

**Verify Connection:**
```bash
psql $DATABASE_URL -c "SELECT 1"
```

### Emails Not Sending

**Check:**
- [ ] BREVO_API_KEY is set
- [ ] Sender email is verified in Brevo
- [ ] Check Brevo dashboard for errors
- [ ] Check spam folder

**Test Brevo API:**
```bash
curl -X POST https://api.brevo.com/v3/smtp/email \
  -H "api-key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "sender": {"email": "noreply@yourdomain.com"},
    "to": [{"email": "test@example.com"}],
    "subject": "Test",
    "htmlContent": "<p>Test email</p>"
  }'
```

### Google OAuth Not Working

**Check:**
- [ ] Client ID is correct
- [ ] Redirect URI matches exactly
- [ ] OAuth consent screen is configured
- [ ] Test users added (if in testing mode)

**Common Errors:**
- "Redirect URI mismatch" → Check Google Console
- "Invalid client" → Check VITE_GOOGLE_CLIENT_ID
- "Access blocked" → Complete consent screen

### Products Not Loading

**Check:**
- [ ] Products seeded in database
- [ ] API endpoint works: `/products`
- [ ] CORS allows frontend domain
- [ ] No JavaScript errors in console

**Verify:**
```bash
curl https://your-render-app.onrender.com/products
```

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Check Render service status
- [ ] Check Vercel deployment status
- [ ] Monitor error rates in logs
- [ ] Check email delivery rates in Brevo

### Weekly Checks

- [ ] Review Render logs for errors
- [ ] Check database size and performance
- [ ] Review payment transactions in Razorpay
- [ ] Check SSL certificate status

### Monthly Checks

- [ ] Update dependencies
- [ ] Review security alerts
- [ ] Backup database
- [ ] Review and optimize slow queries
- [ ] Check API usage and costs

### Backup Strategy

**Database Backup (Render):**
1. Go to database → Backups
2. Manual backup or automatic (paid plans)

**Code Backup:**
- Already in GitHub
- Tag releases: `git tag v1.0.0`

### Scaling Considerations

**When to Upgrade:**
- Free tier sleeps after 15 min inactivity
- Database storage limit reached
- Need faster response times
- High traffic expected

**Upgrade Path:**
- Render Starter: $7/month (always on)
- Render Standard: $25/month (better performance)
- Database Starter: $7/month (1GB storage)

---

## Cost Summary

### Free Tier (Testing)
- Render Web Service: Free (sleeps after 15 min)
- Render PostgreSQL: Free (limited storage)
- Vercel: Free (unlimited bandwidth)
- Brevo: Free (300 emails/day)
- Cloudinary: Free (25GB storage)
- **Total: $0/month**

### Production Tier (Recommended)
- Render Web Service: $7/month (always on)
- Render PostgreSQL: $7/month (1GB)
- Vercel: Free
- Brevo: Free (or $25/month for 10k emails)
- Cloudinary: Free
- **Total: $14-39/month**

---

## Final Checklist

### Pre-Launch
- [ ] All environment variables set
- [ ] Database seeded with products
- [ ] Admin account created and tested
- [ ] Email service working
- [ ] Payment gateway configured
- [ ] SSL certificates active
- [ ] Custom domains configured (if applicable)
- [ ] All tests passing
- [ ] Error monitoring set up
- [ ] Backup strategy in place

### Launch Day
- [ ] Final smoke test
- [ ] Monitor logs closely
- [ ] Test critical user flows
- [ ] Verify email delivery
- [ ] Test payment processing
- [ ] Check mobile responsiveness
- [ ] Monitor performance metrics

### Post-Launch
- [ ] Announce to users
- [ ] Monitor error rates
- [ ] Collect user feedback
- [ ] Plan next iteration

---

## 🎉 Congratulations!

Your Vijetha Digital application is now live in production!

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-render-app.onrender.com`
- Admin: `https://your-app.vercel.app/admin`

**Next Steps:**
1. Share with users
2. Monitor performance
3. Collect feedback
4. Iterate and improve

**Support:**
- Check logs for errors
- Review documentation
- Test thoroughly
- Monitor metrics

---

**Document Version**: 1.0  
**Last Updated**: 2026-05-05  
**Status**: Production Ready ✅
