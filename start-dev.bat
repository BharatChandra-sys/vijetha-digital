@echo off
REM Development Startup Script for Windows
REM This script helps you start all services for local development

echo ==========================================
echo Vijetha Digital - Development Startup
echo ==========================================
echo.

echo This script will guide you through starting:
echo 1. Backend API (FastAPI)
echo 2. Frontend (React + Vite)
echo 3. ngrok (optional - for external access)
echo.

REM Check if virtual environment exists
if not exist "venv\" (
    echo Virtual environment not found. Creating one...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Check if dependencies are installed
echo Checking backend dependencies...
pip install -q -r requirements.txt

REM Check database
echo Checking database...
alembic upgrade head

echo.
echo ==========================================
echo MANUAL STEPS REQUIRED:
echo ==========================================
echo.
echo Open 3 separate terminals and run:
echo.
echo Terminal 1 - Backend:
echo   cd %CD%
echo   venv\Scripts\activate
echo   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo Terminal 2 - Frontend:
echo   cd %CD%\frontend
echo   npm install  (first time only)
echo   npm run dev
echo.
echo Terminal 3 - ngrok (optional):
echo   ngrok http 8000
echo.
echo ==========================================
echo URLs:
echo ==========================================
echo Backend API:  http://localhost:8000
echo API Docs:     http://localhost:8000/docs
echo Frontend:     http://localhost:5173
echo Health Check: http://localhost:8000/health
echo.
echo After starting ngrok, you'll get a public URL like:
echo https://xxxx-xx-xx-xx-xx.ngrok-free.app
echo.
pause
