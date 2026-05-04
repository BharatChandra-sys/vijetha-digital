# How to Run Backend, Frontend, and ngrok

## Prerequisites

1. **Python 3.11+** installed
2. **Node.js 18+** and npm installed
3. **PostgreSQL** running on localhost:5432
4. **Redis** running on localhost:6379 (optional but recommended)
5. **ngrok** installed (download from https://ngrok.com/download)

## Quick Start (3 Terminals)

### Terminal 1: Backend API

```bash
# Navigate to project root
cd /path/to/vijetha-digital-backend

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run migrations (first time only)
alembic upgrade head

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be available at:**
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

---

### Terminal 2: Frontend

```bash
# Navigate to frontend directory
cd /path/to/vijetha-digital-backend/frontend

# Install dependencies (first time only)
npm install

# Start frontend development server
npm run dev
```

**Frontend will be available at:**
- App: http://localhost:5173

---

### Terminal 3: ngrok (Optional - for external access)

```bash
# Expose backend to the internet
ngrok http 8000
```

**ngrok will provide a public URL like:**
- https://xxxx-xx-xx-xx-xx.ngrok-free.app

**To use ngrok URL with frontend:**
1. Copy the ngrok URL
2. Update `frontend/.env`:
   ```
   VITE_API_URL=https://your-ngrok-url.ngrok-free.app
   ```
3. Restart the frontend (Ctrl+C and `npm run dev` again)

---

## Alternative: Using Make Commands

### Backend
```bash
# Start backend
make dev

# Run tests
make test

# Run migrations
make migrate

# Lint code
make lint
```

### Frontend
```bash
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Verification Steps

### 1. Check Backend Health
```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "ok",
  "timestamp": "2026-04-25T..."
}
```

### 2. Check Frontend
Open browser: http://localhost:5173

You should see the Vijetha Digital login page.

### 3. Test API Docs
Open browser: http://localhost:8000/docs

You should see the interactive API documentation.

### 4. Test Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vijetha.com",
    "password": "admin123"
  }'
```

---

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Find process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:8000 | xargs kill -9
```

**Database connection error:**
```bash
# Check if PostgreSQL is running
# Windows:
sc query postgresql-x64-15

# Linux/Mac:
sudo systemctl status postgresql

# Check database exists
psql -U postgres -c "\l" | grep vijetha_db
```

**Redis connection error:**
```bash
# Check if Redis is running
# Windows:
sc query Redis

# Linux/Mac:
redis-cli ping
```

### Frontend Issues

**Port 5173 already in use:**
```bash
# Kill process on port 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

**Dependencies not installed:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
Check that `FRONTEND_URL` in `.env` matches your frontend URL:
```
FRONTEND_URL=http://localhost:5173
```

### ngrok Issues

**ngrok not found:**
- Download from https://ngrok.com/download
- Extract and add to PATH
- Or run from the extracted directory: `./ngrok http 8000`

**ngrok session expired:**
- Sign up for free account at https://ngrok.com
- Get auth token
- Run: `ngrok authtoken YOUR_AUTH_TOKEN`

---

## Environment Variables

### Backend (.env)
```bash
# Development settings
ENV=dev
DATABASE_URL=postgresql+psycopg2://postgres:admin123@localhost:5432/vijetha_db
REDIS_URL=redis://localhost:6379/0
FRONTEND_URL=http://localhost:5173

# Admin credentials
ADMIN_EMAIL=admin@vijetha.com
ADMIN_PASSWORD=admin123

# JWT
JWT_SECRET_KEY=supersecretkeychangeit
```

### Frontend (frontend/.env)
```bash
# API URL (local)
VITE_API_URL=http://localhost:8000

# API URL (ngrok - when using ngrok)
# VITE_API_URL=https://your-ngrok-url.ngrok-free.app
```

---

## Development Workflow

### 1. Start Services
```bash
# Terminal 1: Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: ngrok (optional)
ngrok http 8000
```

### 2. Make Changes
- Backend changes auto-reload (--reload flag)
- Frontend changes auto-reload (Vite HMR)

### 3. Test Changes
- Backend: http://localhost:8000/docs
- Frontend: http://localhost:5173
- API: Use curl or Postman

### 4. Run Tests
```bash
# Backend tests
pytest tests -v

# Frontend tests (if configured)
cd frontend && npm test
```

---

## Production Deployment

For production deployment, see:
- **DEPLOYMENT_GUIDE.md** - Complete deployment guide
- **QUICK_START.md** - Quick deployment guide
- **PRODUCTION_READINESS_CHECKLIST.md** - Pre-deployment checklist

---

## Useful Commands

### Backend
```bash
# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1

# Seed admin user
python scripts/seed_admin.py

# Run specific test
pytest tests/integration/test_auth_api.py -v
```

### Frontend
```bash
# Install new package
npm install package-name

# Update packages
npm update

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database
```bash
# Connect to database
psql -U postgres -d vijetha_db

# Backup database
pg_dump -U postgres vijetha_db > backup.sql

# Restore database
psql -U postgres vijetha_db < backup.sql
```

---

## Support

If you encounter issues:

1. Check logs:
   - Backend: Terminal output
   - Frontend: Browser console (F12)

2. Verify services:
   ```bash
   curl http://localhost:8000/health
   ```

3. Check documentation:
   - API Docs: http://localhost:8000/docs
   - README.md
   - DEPLOYMENT_GUIDE.md

4. Run diagnostics:
   ```bash
   python scripts/diagnostic_report.py
   ```

---

**Happy Coding!** 🚀
