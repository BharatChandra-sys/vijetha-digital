# 🚀 Deployment Instructions

## Prerequisites
- GitHub account
- Render account (free tier available)
- Vercel account (free tier available)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

---

## 📦 Part 1: Deploy Backend to Render

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### Step 3: Create PostgreSQL Database
1. Click "New +" → "PostgreSQL"
2. Name: `vijetha-digital-db`
3. Database: `vijetha_db`
4. User: `vijetha_user`
5. Region: Choose closest to your users
6. Plan: **Free** (or paid for better performance)
7. Click "Create Database"
8. **Save the Internal Database URL** (starts with `postgresql://`)

### Step 4: Deploy Backend Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `vijetha-digital-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install -r requirements-pinned.txt && alembic upgrade head
     ```
   - **Start Command**:
     ```bash
     gunicorn app.main:app --worker-class uvicorn.workers.UvicornWorker --workers 2 --bind 0.0.0.0:$PORT --timeout 120 --access-logfile - --error-logfile - --log-level info
     ```
   - **Plan**: Free (or paid)

### Step 5: Set Environment Variables in Render
Go to your service → Environment → Add the following:

**Required:**
```
DATABASE_URL=<paste-internal-database-url-from-step-3>
FRONTEND_URL=https://your-app.vercel.app
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<create-strong-password>
JWT_SECRET_KEY=<generate-random-64-char-string>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
```

**Optional (use defaults):**
```
ENV=production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
GST_PERCENTAGE=18.0
MIN_ORDER_AMOUNT=100.0
MAX_FILE_SIZE_MB=50
REDIS_URL=
AUTO_CREATE_SCHEMA_ON_STARTUP=false
TRUSTED_HOSTS=*
```

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Your API will be available at: `https://your-app.onrender.com`
4. Test: `https://your-app.onrender.com/health`

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 3: Set Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_BASE_URL=https://your-render-app.onrender.com
VITE_WHATSAPP_NUMBER=919876543210
VITE_GOOGLE_CLIENT_ID=<optional-google-oauth-id>
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Your app will be available at: `https://your-app.vercel.app`

### Step 5: Update Backend CORS
1. Go back to Render
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend service

---

## 🗄️ Part 3: Load Products into Database

### Option A: Using Admin Dashboard (Recommended)
1. Go to `https://your-app.vercel.app/admin/login`
2. Login with admin credentials
3. Navigate to Products section
4. Add products manually through UI

### Option B: Using Database Seed Script
1. Connect to Render PostgreSQL:
   ```bash
   psql <DATABASE_URL>
   ```

2. Run seed script:
   ```sql
   -- Insert sample products
   INSERT INTO products (name, category, base_price, description, is_active, created_at, updated_at)
   VALUES
   ('Business Cards', 'cards', 500.00, 'Professional business cards', true, NOW(), NOW()),
   ('Flyers', 'marketing', 1000.00, 'Promotional flyers', true, NOW(), NOW()),
   ('Banners', 'large-format', 2500.00, 'Large format banners', true, NOW(), NOW()),
   ('Brochures', 'marketing', 1500.00, 'Marketing brochures', true, NOW(), NOW());
   ```

### Option C: Using API
```bash
curl -X POST https://your-render-app.onrender.com/api/v1/admin/products \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Business Cards",
    "category": "cards",
    "base_price": 500.00,
    "description": "Professional business cards",
    "is_active": true
  }'
```

---

## 🔒 Security Checklist

- [ ] Changed default admin password
- [ ] Generated strong JWT_SECRET_KEY (64+ characters)
- [ ] Set FRONTEND_URL to actual Vercel domain
- [ ] Enabled HTTPS only (automatic on Render/Vercel)
- [ ] Configured Razorpay webhook secret
- [ ] Set up Cloudinary with restricted API keys
- [ ] Reviewed CORS settings
- [ ] Disabled debug mode (ENV=production)
- [ ] Set up monitoring (optional: Sentry)

---

## 🧪 Testing Deployment

### Backend Health Check
```bash
curl https://your-render-app.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "error",
  "timestamp": "2026-05-05T..."
}
```

### Frontend Check
1. Visit `https://your-app.vercel.app`
2. Should see homepage
3. Try registering a new user
4. Try logging in
5. Browse products

### Admin Check
1. Visit `https://your-app.vercel.app/admin/login`
2. Login with admin credentials
3. Verify dashboard loads

---

## 📊 Monitoring

### Render Dashboard
- View logs: Service → Logs
- Monitor metrics: Service → Metrics
- Database stats: Database → Metrics

### Vercel Dashboard
- View deployments: Project → Deployments
- Check analytics: Project → Analytics
- Monitor errors: Project → Logs

---

## 🔄 Updating Deployment

### Backend Updates
```bash
git add .
git commit -m "Update backend"
git push origin main
```
Render will auto-deploy on push.

### Frontend Updates
```bash
git add .
git commit -m "Update frontend"
git push origin main
```
Vercel will auto-deploy on push.

---

## 🆘 Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify all environment variables are set
- Ensure DATABASE_URL is correct
- Check build command completed successfully

### Frontend can't connect to backend
- Verify VITE_API_BASE_URL is correct
- Check CORS settings in backend
- Ensure backend is running (check /health)

### Database connection errors
- Verify DATABASE_URL format
- Check database is running in Render
- Ensure IP whitelist allows Render (should be automatic)

### Products not loading
- Check if products exist in database
- Verify API endpoint: `/products`
- Check browser console for errors

---

## 💰 Cost Estimate

**Free Tier (Recommended for testing):**
- Render Web Service: Free (sleeps after 15 min inactivity)
- Render PostgreSQL: Free (limited storage)
- Vercel: Free (unlimited bandwidth)
- **Total: $0/month**

**Paid Tier (Production ready):**
- Render Web Service: $7/month (always on)
- Render PostgreSQL: $7/month (1GB storage)
- Vercel Pro: $20/month (optional, better performance)
- **Total: $14-34/month**

---

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Check Vercel deployment logs
3. Review this guide
4. Check GitHub issues

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Database created and connected
- [ ] Frontend deployed and accessible
- [ ] Admin can login
- [ ] Products loaded in database
- [ ] Users can register/login
- [ ] Payment gateway configured
- [ ] WhatsApp button working
- [ ] All environment variables set
- [ ] HTTPS enabled (automatic)
- [ ] Monitoring set up (optional)

**🎉 Congratulations! Your application is now live!**
