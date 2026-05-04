#!/bin/bash

# Development Startup Script
# This script helps you start all services for local development

echo "=========================================="
echo "Vijetha Digital - Development Startup"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}This script will guide you through starting:${NC}"
echo "1. Backend API (FastAPI)"
echo "2. Frontend (React + Vite)"
echo "3. ngrok (optional - for external access)"
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating one...${NC}"
    python -m venv venv
fi

# Check if dependencies are installed
echo -e "${GREEN}Checking backend dependencies...${NC}"
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
pip install -q -r requirements.txt

# Check database
echo -e "${GREEN}Checking database...${NC}"
alembic upgrade head

echo ""
echo "=========================================="
echo "MANUAL STEPS REQUIRED:"
echo "=========================================="
echo ""
echo "Open 3 separate terminals and run:"
echo ""
echo -e "${GREEN}Terminal 1 - Backend:${NC}"
echo "  cd $(pwd)"
echo "  source venv/bin/activate  # or: venv\\Scripts\\activate on Windows"
echo "  uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo ""
echo -e "${GREEN}Terminal 2 - Frontend:${NC}"
echo "  cd $(pwd)/frontend"
echo "  npm install  # (first time only)"
echo "  npm run dev"
echo ""
echo -e "${GREEN}Terminal 3 - ngrok (optional):${NC}"
echo "  ngrok http 8000"
echo ""
echo "=========================================="
echo "URLs:"
echo "=========================================="
echo "Backend API:  http://localhost:8000"
echo "API Docs:     http://localhost:8000/docs"
echo "Frontend:     http://localhost:5173"
echo "Health Check: http://localhost:8000/health"
echo ""
echo "After starting ngrok, you'll get a public URL like:"
echo "https://xxxx-xx-xx-xx-xx.ngrok-free.app"
echo ""
