@echo off
REM Script to seed products into Neon database
REM Run this AFTER migrations have been applied

echo ============================================
echo Vijetha Digital - Seed Neon Database
echo ============================================
echo.

REM Set the Neon database URL
set DATABASE_URL=postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

REM Set other required env vars (these don't matter for seeding, but config.py requires them)
set JWT_SECRET_KEY=temp_key_for_seeding
set ADMIN_EMAIL=admin@vijethadigital.com
set ADMIN_PASSWORD=admin123
set CLOUDINARY_CLOUD_NAME=temp
set CLOUDINARY_API_KEY=temp
set CLOUDINARY_API_SECRET=temp
set BREVO_API_KEY=temp
set FRONTEND_URL=https://vijetha-digital-store.vercel.app
set RAZORPAY_KEY_ID=temp
set RAZORPAY_KEY_SECRET=temp
set RAZORPAY_WEBHOOK_SECRET=temp

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo.
echo Seeding products...
py scripts\seed_products.py

echo.
echo ============================================
echo Seeding complete!
echo ============================================
echo.
echo Next steps:
echo 1. Test backend: https://vijetha-digital-backend.onrender.com/products
echo 2. Deploy frontend to Vercel
echo.

pause
