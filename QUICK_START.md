# Quick Start Guide - Vijetha Digital Backend

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (for production)

## Development Setup

### 1. Clone and Install
```bash
# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

### 2. Configure Database
Edit `.env`:
```bash
DATABASE_URL=postgresql+psycopg2://postgres:admin123@localhost:5432/vijetha_db
REDIS_URL=redis://localhost:6379/0
FRONTEND_URL=http://localhost:5173
JWT_SECRET_KEY=your-secret-key-here
```

### 3. Run Migrations
```bash
# Create database
createdb vijetha_db

# Run migrations
alembic upgrade head

# Seed admin user
python scripts/seed_admin.py
```

### 4. Start Development Server
```bash
# Using Makefile
make dev

# Or directly
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs

## Production Deployment

### Option 1: Docker Compose (Recommended)

```bash
# Build and start all services
docker compose --profile celery --profile nginx up -d

# Check status
docker compose ps

# View logs
docker compose logs -f api

# Run migrations
docker compose exec api alembic upgrade head

# Seed admin
docker compose exec api python scripts/seed_admin.py
```

### Option 2: Manual Deployment

```bash
# Install dependencies
pip install -r requirements.txt

# Set production environment
export ENV=production

# Run migrations
alembic upgrade head

# Start API with Gunicorn
gunicorn app.main:app \
  --worker-class uvicorn.workers.UvicornWorker \
  --workers 4 \
  --bind 0.0.0.0:8000

# Start Celery worker (separate terminal)
celery -A app.celery_app worker --loglevel=info

# Start Celery beat (separate terminal)
celery -A app.celery_app beat --loglevel=info
```

## Essential Commands

### Development
```bash
make dev          # Start development server
make test         # Run tests
make lint         # Run linter
make fmt          # Format code
make migrate      # Run migrations
make seed         # Seed admin user
```

### Docker
```bash
make docker-up    # Start all services
make docker-down  # Stop all services
```

### Database
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1

# View migration history
alembic history
```

### Testing
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_auth_api.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run integration tests only
pytest tests/integration/
```

## Key Endpoints

### Health & Monitoring
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics
- `GET /docs` - API documentation (dev only)

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `POST /auth/refresh` - Refresh token
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Orders
- `POST /orders` - Create order
- `GET /orders` - List user orders
- `GET /orders/{id}` - Get order details
- `POST /orders/{id}/cancel` - Cancel order

### Payments
- `POST /payments/create` - Create payment order
- `POST /payments/verify` - Verify payment
- `POST /payments/webhook` - Razorpay webhook

### Admin
- `GET /api/v1/admin/dashboard/stats` - Dashboard statistics
- `GET /api/v1/admin/orders` - All orders
- `GET /api/v1/admin/users` - All users
- `GET /api/v1/admin/revenue/trend` - Revenue trend
- `GET /api/v1/admin/exports/orders` - Export orders CSV

### WebSocket
- `WS /ws/notifications?token=<jwt>` - Real-time notifications

## Environment Variables

### Required
```bash
DATABASE_URL=postgresql+psycopg2://user:pass@host:5432/db
REDIS_URL=redis://host:6379/0
FRONTEND_URL=https://yourdomain.com
JWT_SECRET_KEY=<strong-secret>
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>
```

### Services
```bash
# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Razorpay
RAZORPAY_KEY_ID=<key-id>
RAZORPAY_KEY_SECRET=<key-secret>
RAZORPAY_WEBHOOK_SECRET=<webhook-secret>

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASSWORD=<app-password>
```

### Optional
```bash
# Monitoring
SENTRY_DSN=<sentry-dsn>

# Security
TRUSTED_HOSTS=yourdomain.com,www.yourdomain.com
```

## Troubleshooting

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

### Redis Connection Error
```bash
# Check Redis is running
redis-cli ping

# Check connection
redis-cli -u $REDIS_URL ping
```

### Migration Issues
```bash
# Check current version
alembic current

# View pending migrations
alembic heads

# Force stamp to specific version
alembic stamp head
```

### Celery Not Processing Tasks
```bash
# Check worker is running
celery -A app.celery_app inspect active

# Check Redis connection
redis-cli -u $REDIS_URL ping

# View task queue
redis-cli -u $REDIS_URL llen celery
```

### Port Already in Use
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

## Testing

### Run Tests
```bash
# All tests
pytest

# Specific test
pytest tests/test_auth_api.py::test_login

# With output
pytest -v -s

# With coverage
pytest --cov=app
```

### Test Database
Tests use the same database as development by default. To use a separate test database:

```bash
# Create test database
createdb vijetha_test

# Update tests/conftest.py
DATABASE_URL=postgresql+psycopg2://postgres:admin123@localhost:5432/vijetha_test
```

## Monitoring

### View Logs
```bash
# Docker logs
docker compose logs -f api
docker compose logs -f worker

# Application logs
tail -f logs/app.log
```

### Check Metrics
```bash
# Prometheus metrics
curl http://localhost:8000/metrics

# Health check
curl http://localhost:8000/health
```

### Monitor Celery
```bash
# Active tasks
celery -A app.celery_app inspect active

# Registered tasks
celery -A app.celery_app inspect registered

# Stats
celery -A app.celery_app inspect stats
```

## Common Tasks

### Add New Admin User
```bash
# Via API
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"Admin123!","name":"Admin"}'

# Then update role in database
psql $DATABASE_URL -c "UPDATE users SET role='admin' WHERE email='admin@example.com';"
```

### Reset User Password
```bash
# Request reset
curl -X POST http://localhost:8000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Check email for OTP
```

### Export Orders
```bash
# Via API
curl -X GET "http://localhost:8000/api/v1/admin/exports/orders?start_date=2024-01-01" \
  -H "Authorization: Bearer <admin-token>" \
  -o orders.csv
```

## Performance Tips

### Database
- Use connection pooling (already configured)
- Add indexes for frequently queried columns
- Use `EXPLAIN ANALYZE` for slow queries

### Caching
- Redis is configured for sessions and rate limiting
- Add caching for frequently accessed data

### API
- Use pagination for list endpoints
- Implement field selection for large responses
- Enable gzip compression (configured in Nginx)

## Security Checklist

- [x] Change default admin password
- [x] Use strong JWT secret
- [x] Enable HTTPS in production
- [x] Configure CORS properly
- [x] Set up rate limiting
- [x] Enable security headers
- [x] Use environment variables for secrets
- [ ] Set up firewall rules
- [ ] Enable database encryption
- [ ] Configure backup encryption

## Support

### Documentation
- API Docs: http://localhost:8000/docs
- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- Production Checklist: `PRODUCTION_CHECKLIST.md`

### Logs
- Application: `docker compose logs api`
- Worker: `docker compose logs worker`
- Database: `docker compose logs db`

### Health Checks
- API: `curl http://localhost:8000/health`
- Database: `docker compose exec db pg_isready`
- Redis: `docker compose exec redis redis-cli ping`

## Next Steps

1. ✅ Complete development setup
2. ✅ Run tests to verify installation
3. ✅ Configure environment variables
4. ✅ Start development server
5. ⏭️ Deploy to staging
6. ⏭️ Run load tests
7. ⏭️ Deploy to production

---

**Need Help?**
- Check logs: `docker compose logs -f`
- Review health: `curl http://localhost:8000/health`
- Read docs: `DEPLOYMENT_GUIDE.md`
