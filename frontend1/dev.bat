@echo off
REM Development server startup script for Windows
REM Run this instead of blocking "npm run dev"

echo Starting Vijetha Digital development server...
echo.
echo Server will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
start /B npm run dev

echo.
echo Development server started in background!
echo Open http://localhost:3000 in your browser
echo.
pause
