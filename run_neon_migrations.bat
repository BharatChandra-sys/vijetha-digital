@echo off
REM Script to run Alembic migrations on Neon database
REM Uses the Neon connection string provided by the user

echo ============================================
echo Vijetha Digital - Neon Database Migrations
echo ============================================
echo.

REM Set the Neon database URL
set DATABASE_URL=postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

echo Activating virtual environment...
call .venv\Scripts\activate.bat

echo.
echo Checking current migration status...
alembic current

echo.
echo Running migrations to head...
alembic upgrade head

echo.
echo Checking final migration status...
alembic current

echo.
echo ============================================
echo Migration complete!
echo ============================================
echo.
echo Next steps:
echo 1. Run: py scripts\seed_products.py
echo 2. Verify backend health: https://vijetha-digital-backend.onrender.com/health
echo.

pause
