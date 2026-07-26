@echo off
echo Testing Render Backend...
echo.

echo 1. Health Check:
curl -s https://vijetha-digital-backend.onrender.com/health
echo.
echo.

echo 2. Products List:
curl -s https://vijetha-digital-backend.onrender.com/api/v1/products
echo.
echo.

pause
