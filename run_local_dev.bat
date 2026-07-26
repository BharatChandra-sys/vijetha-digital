@echo off
title Vijetha Digital - Local Development
color 0A

echo ========================================
echo   VIJETHA DIGITAL - LOCAL DEV SETUP
echo ========================================
echo.

REM Check if node_modules exists in frontend
if not exist "frontend\node_modules\" (
    echo [1/3] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo.
) else (
    echo [1/3] Frontend dependencies already installed
    echo.
)

REM Check if backend is running
echo [2/3] Checking backend connection...
curl -s https://vijetha-digital-backend.onrender.com/health >nul 2>&1
if %errorlevel% equ 0 (
    echo      Backend is UP and running!
) else (
    echo      Backend is sleeping, waking it up...
    echo      This may take 30-50 seconds on first request...
)
echo.

REM Start frontend dev server
echo [3/3] Starting frontend dev server...
echo.
echo ========================================
echo   Frontend will open at:
echo   http://localhost:5173
echo ========================================
echo.
echo   Press Ctrl+C to stop the server
echo.

cd frontend
npm run dev
