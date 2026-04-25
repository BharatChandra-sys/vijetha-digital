# Production Deployment Guide

This guide covers deploying Vijetha Digital to production with all services.

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured with DNS
- SSL certificate (Let's Encrypt recommended)
- SMTP credentials for email
- Razorpay account for payments
- Cloudinary account for image uploads
- PostgreSQL 15+ and Redis 7+

## Environment Configuration

### 1. Copy and Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with production values:

```bash
# Application
ENV=production
APP_NAME="Vijetha Digital"

# Database (use strong password)
DATABASE_URL=postgresql+psycopg2://vijetha:STRONG_PASSWORD@db:5432/vijetha_db
POSTGRES_USER=vijetha
POSTGRES_PASSWORD=STRONG_PASSWORD
POSTGRES_DB=vijetha_db

# Frontend
FRONTEND_URL=https://yourdomain.com

# JWT (generate strong secret: openssl rand -hex 32)
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin Account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=SecureAdminPassword123!
FIRST_ADMIN_EMAIL=admin@yourdomain.com
FIRST_ADMIN_PASSWORD=SecureAdminPassword123!
FIRST_ADMIN_NAME=Admin User

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# SMTP (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
MAIL_FROM=noreply@yourdomain.com

# Redis
REDIS_URL=redis://redis:6379/0

# Sentry (optional but recommended)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project

# Security
TRUSTED_HOSTS=yourdomain.com,www.yourdomain.com,api.yourdomain.com

# Business Config
GST_PERCENTAGE=18.0
MIN_ORDER_AMOUNT=100.0
MAX_FILE_SIZE_MB=50
```

## Deployment Steps

### 1. Build and Start Services

```bash
# Build images
docker compose build

# Start core services (API, DB, Redis)
docker compose up -d

# Start with Celery workers (for background tasks)
docker compose --profile celery up -d

# Start with Nginx (for production)
docker compose --profile nginx up -d
```

### 2. Run Database Migrations

```bash
# Run migrations
docker compose exec api alembic upgrade head

# Seed admin user and initial data
docker compose exec api python scripts/seed_admin.py
```

### 3. Verify Services

```bash
# Check service status
docker compose ps

# Check logs
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f nginx

# Test health endpoint
curl http://localhost/health

# Test metrics endpoint
curl http://localhost/metrics
```

## SSL/TLS Configuration

### Using Let's Encrypt with Certbot

1. Install Certbot:
```bash
docker compose run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email admin@yourdomain.com \
  --agree-tos \
  --no-eff-email
```

2. Update `nginx/conf.d/vijetha.conf` with SSL configuration:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # ... rest of config
}
```

3. Restart Nginx:
```bash
docker compose restart nginx
```

## Monitoring Setup

### 1. Prometheus

Create `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'vijetha-api'
    static_configs:
      - targets: ['api:8000']
    metrics_path: '/metrics'
```

Add to `docker-compose.yml`:
```yaml
prometheus:
  image: prom/prometheus:latest
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml
    - prometheus_data:/prometheus
  ports:
    - "9090:9090"
  networks:
    - backend
```

### 2. Grafana

Add to `docker-compose.yml`:
```yaml
grafana:
  image: grafana/grafana:latest
  ports:
    - "3000:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
  volumes:
    - grafana_data:/var/lib/grafana
  networks:
    - backend
```

## Backup Strategy

### Database Backups

Create backup script `scripts/backup_db.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/vijetha_db_$TIMESTAMP.sql.gz"

docker compose exec -T db pg_dump -U vijetha vijetha_db | gzip > $BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -name "vijetha_db_*.sql.gz" -mtime +30 -delete
```

Schedule with cron:
```bash
0 2 * * * /path/to/scripts/backup_db.sh
```

### File Backups

If using local file storage:
```bash
# Backup uploads directory
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz uploads/

# Sync to S3 (if configured)
aws s3 sync uploads/ s3://your-bucket/uploads/
```

## Scaling

### Horizontal Scaling (Multiple API Instances)

```yaml
api:
  # ... existing config
  deploy:
    replicas: 3
    resources:
      limits:
        cpus: '1'
        memory: 1G
```

### Worker Scaling

```yaml
worker:
  # ... existing config
  deploy:
    replicas: 2
```

## Maintenance Mode

Enable maintenance mode:
```bash
# Set environment variable
docker compose exec api sh -c 'echo "MAINTENANCE_MODE=true" >> .env'

# Restart API
docker compose restart api
```

## Troubleshooting

### Check Service Health

```bash
# API health
curl http://localhost/health

# Database connection
docker compose exec db psql -U vijetha -d vijetha_db -c "SELECT 1;"

# Redis connection
docker compose exec redis redis-cli ping
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f worker
docker compose logs -f nginx

# Last 100 lines
docker compose logs --tail=100 api
```

### Database Issues

```bash
# Connect to database
docker compose exec db psql -U vijetha -d vijetha_db

# Check migrations
docker compose exec api alembic current
docker compose exec api alembic history
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Check database connections
docker compose exec db psql -U vijetha -d vijetha_db -c "SELECT count(*) FROM pg_stat_activity;"

# Check Redis memory
docker compose exec redis redis-cli info memory
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret key
- [ ] Enable HTTPS/TLS
- [ ] Configure firewall rules
- [ ] Set up fail2ban for SSH
- [ ] Enable database encryption at rest
- [ ] Configure backup encryption
- [ ] Set up monitoring alerts
- [ ] Enable Sentry error tracking
- [ ] Review and restrict CORS origins
- [ ] Enable rate limiting
- [ ] Set up DDoS protection (Cloudflare)

## Post-Deployment

1. Test all critical flows:
   - User registration and login
   - Order creation and payment
   - Admin operations
   - Email delivery

2. Monitor metrics:
   - Response times
   - Error rates
   - Database performance
   - Memory usage

3. Set up alerts:
   - Service downtime
   - High error rates
   - Database connection issues
   - Disk space warnings

## Rollback Procedure

If deployment fails:

```bash
# Stop new services
docker compose down

# Restore database from backup
gunzip < /backups/vijetha_db_TIMESTAMP.sql.gz | \
  docker compose exec -T db psql -U vijetha -d vijetha_db

# Start previous version
git checkout <previous-tag>
docker compose up -d
```

## Support

For issues or questions:
- Check logs: `docker compose logs -f`
- Review metrics: http://localhost/metrics
- Check health: http://localhost/health
- Contact: admin@yourdomain.com
