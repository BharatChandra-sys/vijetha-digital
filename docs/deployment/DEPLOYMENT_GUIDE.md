# 🚀 Complete Deployment Guide
**Vijetha Digital Platform - Render (Backend) + Neon (Database) + Vercel (Frontend)**

> **Free Tier Setup**: This guide uses free tiers for all services - Render, Neon PostgreSQL, and Vercel.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup - Neon PostgreSQL](#1-database-setup---neon-postgresql)
3. [Backend Deployment - Render](#2-backend-deployment---render)
4. [Frontend Deployment - Vercel](#3-frontend-deployment---vercel)
5. [Database Migration & Seeding](#4-database-migration--seeding)
6. [Post-Deployment Testing](#5-post-deployment-testing)
7. [Troubleshooting](#6-troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- ✅ GitHub account (to push code)
- ✅ [Neon account](https://neon.tech) (free tier)
- ✅ [Render account](https://render.com) (free tier)
- ✅ [Vercel account](https://vercel.com) (free tier)
- ✅ Your code pushed to a GitHub repository

---

## 1. Database Setup - Neon PostgreSQL

### Step 1.1: Create Neon Project

1. Go to [neon.tech](https://neon.tech) and sign up/login
2. Click **"New Project"**
3. Configure:
   - **Project name**: `vijetha-digital-db`
   - **Region**: Choose closest to your users (e.g., `US East (Ohio)`)
   - **PostgreSQL version**: `16` (recommended)
   - **Compute size**: Shared (Free tier)
4. Click **"Create Project"**

### Step 1.2: Get Database Connection String

1. Once created, go to **Dashboard** → **Connection Details**
2. Select **"Connection string"** format
3. Copy the connection string - it looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```
4. **IMPORTANT**: Save this - you'll need it for Render and migrations

### Step 1.3: Enable Connection Pooling (Recommended)

1. In Neon dashboard, go to **"Pooled connection"**
2. Toggle **"Enable pooling"**
3. Copy the **pooled connection string** (has port `:5432` and `?sslmode=require`)
4. Use this pooled string for your backend

### Step 1.4: Configure Database (Optional but Recommended)

1. In Neon console, go to **SQL Editor**
2. Run this to set timezone:
   ```sql
   ALTER DATABASE dbname SET timezone TO 'Asia/Kolkata';
   ```

---

## 2. Backend Deployment - Render

### Step 2.1: Prepare Backend for Deployment

1. **Create `render.yaml`** (already exists, verify it):
   ```yaml
   services:
     - type: web
       name: vijetha-backend
       runtime: python
       plan: free
       buildCommand: pip install -r requirements-pinned.txt
       startCommand: gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
       envVars:
         - key: PYTHON_VERSION
           value: "3.11"
         - key: DATABASE_URL
           sync: false
         - key: SECRET_KEY
           generateValue: true
         - key: ENVIRONMENT
           value: production
   ```

2. **Verify `requirements-pinned.txt`** includes:
   ```txt
   fastapi
   uvicorn[standard]
   gunicorn
   sqlalchemy
   alembic
   psycopg2-binary
   python-jose[cryptography]
   passlib[bcrypt]
   python-multipart
   pydantic
   pydantic-settings
   python-dotenv
   ```

### Step 2.2: Create Render Web Service

1. Go to [render.com](https://render.com) and login
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `vijetha-digital-backend`
   - **Region**: Same as Neon (e.g., `Oregon (US West)`)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (or `.` if backend is in root)
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements-pinned.txt
     ```
   - **Start Command**:
     ```bash
     gunicorn app.main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
     ```
   - **Plan**: `Free`

5. Click **"Advanced"** and add environment variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon pooled connection string |
   | `SECRET_KEY` | Generate a strong key: `openssl rand -hex 32` |
   | `ENVIRONMENT` | `production` |
   | `ALLOWED_ORIGINS` | Your Vercel frontend URL (add after frontend deployment) |
   | `CORS_ORIGINS` | Your Vercel frontend URL |
   | `RAZORPAY_KEY_ID` | Your Razorpay key (if using payments) |
   | `RAZORPAY_KEY_SECRET` | Your Razorpay secret |
   | `BREVO_API_KEY` | Your Brevo API key (if using emails) |
   | `FRONTEND_URL` | Your Vercel URL |

6. Click **"Create Web Service"**

### Step 2.3: Monitor Deployment

1. Render will start building and deploying
2. Check logs in real-time
3. Wait for: **"Your service is live 🎉"**
4. Copy the service URL: `https://vijetha-digital-backend.onrender.com`

### Step 2.4: Verify Backend is Running

```bash
curl https://vijetha-digital-backend.onrender.com/health
```

Expected response:
```json
{"status": "healthy"}
```

---

## 3. Frontend Deployment - Vercel

### Step 3.1: Prepare Frontend Environment Variables

1. Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://vijetha-digital-backend.onrender.com
   VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
   ```

2. **Update `frontend/vite.config.js`** to handle environment:
   ```js
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'

   export default defineConfig({
     plugins: [react()],
     server: {
       port: 5173,
       proxy: process.env.NODE_ENV === 'development' ? {
         '/api': {
           target: 'http://localhost:8000',
           changeOrigin: true,
         }
       } : undefined
     }
   })
   ```

### Step 3.2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and login
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://vijetha-digital-backend.onrender.com` |
   | `VITE_RAZORPAY_KEY_ID` | Your Razorpay key |

6. Click **"Deploy"**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: vijetha-digital-frontend
# - Directory: ./
# - Override settings? Yes
#   - Build Command: npm run build
#   - Output Directory: dist
#   - Development Command: npm run dev

# Production deployment
vercel --prod
```

### Step 3.3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your custom domain: `www.vijethadigital.com`
3. Update DNS records as instructed
4. Vercel automatically provisions SSL certificate

### Step 3.4: Update Backend CORS

1. Go back to Render dashboard
2. Update environment variables:
   - `ALLOWED_ORIGINS`: `https://your-app.vercel.app,https://vijethadigital.com`
   - `FRONTEND_URL`: `https://your-app.vercel.app`
3. Save - Render will auto-redeploy

---

## 4. Database Migration & Seeding

### Step 4.1: Connect to Neon Database Locally

1. Install PostgreSQL client tools:
   ```bash
   # Windows
   choco install postgresql

   # Mac
   brew install postgresql

   # Linux
   sudo apt install postgresql-client
   ```

2. Set environment variable:
   ```bash
   # Windows PowerShell
   $env:DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/dbname?sslmode=require"

   # Mac/Linux
   export DATABASE_URL="postgresql://username:password@ep-xxx.neon.tech/dbname?sslmode=require"
   ```

### Step 4.2: Run Alembic Migrations

```bash
# Install dependencies
pip install -r requirements-pinned.txt

# Run migrations
alembic upgrade head
```

**Expected output:**
```
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> c7295d7f80f0, baseline_schema
INFO  [alembic.runtime.migration] Running upgrade c7295d7f80f0 -> add_iam_system_001, comprehensive_iam
```

### Step 4.3: Seed Initial Data

1. **Create admin user** - Update `scripts/seed_products.py` to include:
   ```python
   from app.models.user import User
   from app.core.security import get_password_hash

   # Create admin user
   admin = User(
       email="admin@vijethadigital.com",
       hashed_password=get_password_hash("admin123"),
       full_name="System Administrator",
       role="admin",
       is_active=True,
       is_verified=True
   )
   db.add(admin)

   # Create staff user
   staff = User(
       email="staff@vijethadigital.com",
       hashed_password=get_password_hash("staff123"),
       full_name="Staff Member",
       role="staff",
       is_active=True,
       is_verified=True
   )
   db.add(staff)

   # Create reception user
   reception = User(
       email="reception@vijethadigital.com",
       hashed_password=get_password_hash("reception123"),
       full_name="Reception Desk",
       role="reception",
       is_active=True,
       is_verified=True
   )
   db.add(reception)

   db.commit()
   ```

2. **Run seed script**:
   ```bash
   python scripts/seed_products.py
   ```

### Step 4.4: Alternative - Run Migrations from Render Shell

1. In Render dashboard, go to your web service
2. Click **"Shell"** tab
3. Run:
   ```bash
   alembic upgrade head
   python scripts/seed_products.py
   ```

---

## 5. Post-Deployment Testing

### Step 5.1: Test Backend Health

```bash
curl https://vijetha-digital-backend.onrender.com/health
```

### Step 5.2: Test API Endpoints

```bash
# Test authentication
curl -X POST https://vijetha-digital-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vijethadigital.com","password":"admin123"}'

# Test products endpoint
curl https://vijetha-digital-backend.onrender.com/products
```

### Step 5.3: Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Test navigation to all pages
3. Test login with demo credentials:
   - **Admin**: `admin@vijethadigital.com` / `admin123`
   - **Staff**: `staff@vijethadigital.com` / `staff123`
   - **Reception**: `reception@vijethadigital.com` / `reception123`

### Step 5.4: Test Portal Features

1. **Admin Dashboard**:
   - Visit `/workspace` → Choose Admin Portal
   - Click "Use demo credentials" → Login
   - Check dashboard charts load
   - Test Orders, Products, Staff pages

2. **Staff Portal**:
   - Visit `/workspace` → Choose Staff Portal
   - Use demo credentials
   - Test workspace, orders, products

3. **Reception Portal**:
   - Visit `/workspace` → Choose Reception
   - Use demo credentials
   - Test dashboard and order management

---

## 6. Troubleshooting

### Issue: Backend deployment fails

**Solution 1**: Check Python version
```yaml
# In render.yaml
envVars:
  - key: PYTHON_VERSION
    value: "3.11"
```

**Solution 2**: Pin dependencies
```bash
pip freeze > requirements-pinned.txt
```

**Solution 3**: Check build logs in Render dashboard

### Issue: Database connection fails

**Solution 1**: Verify connection string format
```
postgresql://user:pass@host:5432/db?sslmode=require
```

**Solution 2**: Use pooled connection string from Neon

**Solution 3**: Check Neon project isn't suspended (free tier auto-suspends after 7 days inactivity)

### Issue: CORS errors in frontend

**Solution**: Update Render environment variable:
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.yourdomain.com
```

### Issue: Frontend can't connect to backend

**Solution 1**: Check `VITE_API_URL` in Vercel environment variables

**Solution 2**: Verify backend is accessible:
```bash
curl https://vijetha-digital-backend.onrender.com/health
```

**Solution 3**: Check browser console for errors

### Issue: Migrations fail

**Solution 1**: Drop all tables and re-run:
```sql
-- In Neon SQL Editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

**Solution 2**: Run migrations manually:
```bash
alembic downgrade base
alembic upgrade head
```

### Issue: Render free tier sleeps after 15 min

**Solution**: Use a uptime monitor (free):
- [UptimeRobot](https://uptimerobot.com) - ping your `/health` endpoint every 5 minutes
- [Cron-job.org](https://cron-job.org) - schedule health checks

**Setup UptimeRobot**:
1. Sign up at uptimerobot.com
2. Add New Monitor:
   - **Type**: HTTP(s)
   - **URL**: `https://vijetha-digital-backend.onrender.com/health`
   - **Interval**: 5 minutes
3. This keeps your service awake!

---

## 📝 Environment Variables Reference

### Backend (Render)

```env
# Required
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
SECRET_KEY=your-secret-key-here
ENVIRONMENT=production

# CORS
ALLOWED_ORIGINS=https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app

# Optional - Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret

# Optional - Email Service
BREVO_API_KEY=your_brevo_key

# Optional - Performance
MAX_WORKERS=2
WORKER_CLASS=uvicorn.workers.UvicornWorker
```

### Frontend (Vercel)

```env
VITE_API_URL=https://vijetha-digital-backend.onrender.com
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

## 🎯 Quick Deployment Checklist

- [ ] Create Neon database and get connection string
- [ ] Deploy backend to Render with environment variables
- [ ] Run database migrations (Alembic)
- [ ] Seed initial data (admin, staff, reception users)
- [ ] Deploy frontend to Vercel with API URL
- [ ] Update backend CORS with Vercel URL
- [ ] Test admin login and dashboard
- [ ] Test staff portal
- [ ] Test reception portal
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Configure custom domain (optional)

---

## 🚀 One-Command Setup Script

Create `deploy.sh` for automated deployment:

```bash
#!/bin/bash
set -e

echo "🚀 Vijetha Digital - Automated Deployment"

# 1. Check prerequisites
echo "✅ Checking prerequisites..."
command -v alembic >/dev/null 2>&1 || { echo "❌ alembic not found. Run: pip install alembic"; exit 1; }
command -v vercel >/dev/null 2>&1 || { echo "❌ vercel CLI not found. Run: npm i -g vercel"; exit 1; }

# 2. Run migrations
echo "📦 Running database migrations..."
alembic upgrade head

# 3. Seed data
echo "🌱 Seeding database..."
python scripts/seed_products.py

# 4. Deploy frontend
echo "🎨 Deploying frontend to Vercel..."
cd frontend
vercel --prod
cd ..

echo "✅ Deployment complete!"
echo "🌐 Frontend: Check Vercel dashboard for URL"
echo "🔧 Backend: https://vijetha-digital-backend.onrender.com"
```

Make it executable:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Vercel Docs](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Alembic Tutorial](https://alembic.sqlalchemy.org/en/latest/tutorial.html)

---

## 🎉 Success!

Your Vijetha Digital platform is now live with:
- ✅ Backend on Render (Free tier, auto-scaling)
- ✅ Database on Neon PostgreSQL (Free tier, 512MB storage)
- ✅ Frontend on Vercel (Free tier, global CDN)
- ✅ Automatic deployments from GitHub
- ✅ SSL certificates (HTTPS)
- ✅ Demo credentials for all portals

**Demo Credentials:**
- Admin: `admin@vijethadigital.com` / `admin123`
- Staff: `staff@vijethadigital.com` / `staff123`
- Reception: `reception@vijethadigital.com` / `reception123`

**Access Points:**
- Public Site: `https://your-app.vercel.app`
- Workspace Portal: `https://your-app.vercel.app/workspace`
- Admin Dashboard: `https://your-app.vercel.app/admin/dashboard`
- API Docs: `https://vijetha-digital-backend.onrender.com/docs`

---

*Last Updated: January 2026*
