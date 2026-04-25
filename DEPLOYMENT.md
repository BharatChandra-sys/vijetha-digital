# Vijetha Digital - Deployment Guide

## Production Deployment with Docker Compose

### Prerequisites

- Docker and Docker Compose installed
- Domain name configured (for HTTPS)
- SMTP credentials for email
- Razorpay API keys
- (Optional) AWS S3 credentials for file storage

### Environment Setup

1. Copy `.env.example` to `.env` and configure all variables:

```bash
cp .env.example .env
```

2. Update critical environment variables:

```env
# Database
POSTGRES_USER=vijetha
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=vijetha_db
DATABASE_URL=postgresql://vijetha:<strong-password>@db:5432/vijetha_db

# Redis
REDIS_URL=redis://redis:6379/0

# Security
SECRET_KEY=<generate-strong-secret-key>
JWT_SECRET_KEY=<generate-strong-jwt-secret>

# Admin
FIRST_ADMIN_EMAIL=admin@vijethadigital.com
FIRST_ADMIN_PASSWORD=<strong-admin-password>

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=<app-password>

# Razorpay
RAZORPAY_KEY_ID=<your-key-id>
RAZORPAY_KEY_SECRET=<your-key-secret>

# AWS S3 (optional)
USE_S3=false
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
S3_BUCKET_NAME=vijetha-uploads
AWS_REGION=ap-south-1
```

### SSL/TLS Setup

1. Update `nginx/conf.d/vijetha.conf` with your domain name
2. Obtain SSL certificates using Let's Encrypt:

```bash
# Install certbot
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in /etc/letsencrypt/live/yourdomain.com/
```

3. Update nginx config with correct certificate paths

### Deployment Steps

#### 1. Build and Start Services

```bash
# Start core services (API, DB, Redis)
docker-compose up -d

# Start with Celery workers (optional)
docker-compose --profile celery up -d

# Start with Nginx (production)
docker-compose --profile nginx up -d

# Or start everything
docker-compose --profile celery --profile nginx up -d
```

#### 2. Run Database Migrations

```bash
# Run migrations
docker-compose exec api alembic upgrade head

# Seed admin user
docker-compose exec api python scripts/seed_admin.py

# Seed material rates (if needed)
docker-compose exec api python -c "from app.db.seed_material_rates import seed_material_rates; from app.db.session import SessionLocal; db = SessionLocal(); seed_material_rates(db); db.close()"
```

#### 3. Verify Deployment

```bash
# Check service health
curl http://localhost/health

# Check logs
docker-compose logs -f api
docker-compose logs -f nginx
```

### Service URLs

- **API**: `http://localhost` (or `https://yourdomain.com`)
- **API Docs**: `http://localhost/docs` (disabled in production)
- **Health Check**: `http://localhost/health`

### Monitoring

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f worker
docker-compose logs -f nginx

# Check resource usage
docker stats
```

### Backup

```bash
# Backup database
docker-compose exec db pg_dump -U vijetha vijetha_db > backup_$(date +%Y%m%d).sql

# Backup uploads
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/
```

### Restore

```bash
# Restore database
cat backup_20240101.sql | docker-compose exec -T db psql -U vijetha vijetha_db

# Restore uploads
tar -xzf uploads_backup_20240101.tar.gz
```

### Scaling

```bash
# Scale API workers
docker-compose up -d --scale api=3

# Scale Celery workers
docker-compose --profile celery up -d --scale worker=4
```

### Updating

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose build
docker-compose up -d

# Run new migrations
docker-compose exec api alembic upgrade head
```

### Troubleshooting

#### Database Connection Issues

```bash
# Check database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Connect to database
docker-compose exec db psql -U vijetha vijetha_db
```

#### Redis Connection Issues

```bash
# Check Redis is running
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping
```

#### Nginx Issues

```bash
# Test nginx config
docker-compose exec nginx nginx -t

# Reload nginx
docker-compose exec nginx nginx -s reload
```

### Security Checklist

- [ ] Change all default passwords
- [ ] Configure firewall (allow only 80, 443)
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Set strong SECRET_KEY and JWT_SECRET_KEY
- [ ] Configure CORS allowed origins
- [ ] Enable rate limiting
- [ ] Set up log monitoring
- [ ] Configure automated backups
- [ ] Set up SSL certificate auto-renewal

### Performance Tuning

1. **Database**: Adjust PostgreSQL settings in `docker-compose.yml`
2. **Redis**: Configure memory limits and eviction policy
3. **Gunicorn**: Adjust worker count based on CPU cores
4. **Nginx**: Enable caching for static files

### Maintenance Mode

```bash
# Enable maintenance mode
curl -X POST http://localhost/api/v1/admin/maintenance \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"active": true, "message": "System maintenance in progress"}'

# Disable maintenance mode
curl -X POST http://localhost/api/v1/admin/maintenance \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

## Development Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Seed admin
python scripts/seed_admin.py

# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## CI/CD

GitHub Actions workflows are configured in `.github/workflows/`:

- `ci.yml`: Runs tests and linting on every push
- `deploy.yml`: Deploys to production on main branch

Configure secrets in GitHub repository settings:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `SSH_PRIVATE_KEY`
- `SERVER_HOST`
- `SERVER_USER`
