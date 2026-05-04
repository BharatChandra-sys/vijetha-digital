# Vijetha Digital Backend - Production Deployment Guide

Complete guide for deploying the Vijetha Digital backend to production.

## 📋 Prerequisites

### System Requirements

- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB recommended
- **Disk**: 20GB minimum, 50GB+ recommended
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

### Required Accounts & Services

- Domain name with DNS access
- SSL certificate (Let's Encrypt recommended)
- Razorpay account (production keys)
- Cloudinary account or AWS S3
- SMTP service (for emails)
- Sentry account (optional, for error tracking)

## 🚀 Quick Start

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker compose version
```

### 2. Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/vijetha-digital-backend.git
cd vijetha-digital-backend

# Checkout production branch
git checkout main
```

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

**Critical Environment Variables:**

```bash
# Application
ENV=production
APP_NAME="Vijetha Digital Backend"

# Database (use strong password!)
DATABASE_URL=postgresql://vijetha:STRONG_PASSWORD_HERE@db:5432/vijetha_db
POSTGRES_USER=vijetha
POSTGRES_PASSWORD=STRONG_PASSWORD_HERE
POSTGRES_DB=vijetha_db

# Redis
REDIS_URL=redis://redis:6379/0

# JWT (generate strong random key!)
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Frontend
FRONTEND_URL=https://yourdomain.com

# Admin (first admin user)
FIRST_ADMIN_EMAIL=admin@yourdomain.com
FIRST_ADMIN_PASSWORD=SecureAdminPass123!
FIRST_ADMIN_NAME=Admin User

# Razorpay (PRODUCTION keys)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Email/SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
MAIL_FROM=noreply@yourdomain.com

# Security
TRUSTED_HOSTS=["yourdomain.com", "www.yourdomain.com"]

# Monitoring (optional)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

**Generate Strong JWT Secret:**

```bash
# Generate a secure random key
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 4. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt install certbot

# Stop nginx if running
docker-compose stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates will be in: /etc/letsencrypt/live/yourdomain.com/
```

#### Option B: Custom Certificate

Place your certificate files:
- `fullchain.pem` → `/etc/letsencrypt/live/yourdomain.com/fullchain.pem`
- `privkey.pem` → `/etc/letsencrypt/live/yourdomain.com/privkey.pem`

### 5. Nginx Configuration

Update `nginx/conf.d/vijetha.conf`:

```bash
# Replace 'yourdomain.com' with your actual domain
sed -i 's/yourdomain.com/your-actual-domain.com/g' nginx/conf.d/vijetha.conf
```

### 6. Build and Deploy

```bash
# Make scripts executable
chmod +x scripts/deploy.sh scripts/rollback.sh

# Build images
docker compose build

# Start database and Redis first
docker compose up -d db redis

# Wait for services to be ready
sleep 10

# Run migrations
docker compose run --rm api alembic upgrade head

# Run data backfill
docker compose run --rm api python scripts/backfill_data.py

# Seed admin user
docker compose run --rm api python scripts/seed_admin.py

# Start all services
docker compose --profile nginx --profile celery up -d

# Check status
docker compose ps
```

### 7. Verify Deployment

```bash
# Check health
curl https://yourdomain.com/health

# Expected response:
# {
#   "status": "ok",
#   "version": "2.0.0",
#   "db": "ok",
#   "redis": "ok",
#   "timestamp": "2026-04-25T..."
# }

# Check logs
docker compose logs -f api

# Run smoke tests
docker compose exec api pytest tests/integration/test_critical_paths.py -v
```

## 🔧 Advanced Configuration

### Database Optimization

```bash
# Connect to database
docker compose exec db psql -U vijetha vijetha_db

# Check indexes
\di

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;
```

### Redis Configuration

Edit `docker-compose.yml` to adjust Redis memory:

```yaml
redis:
  command: redis-server --maxmemory 512mb --maxmemory-policy allkeys-lru
```

### Celery Workers

Adjust worker concurrency in `docker-compose.yml`:

```yaml
worker:
  command: ["celery", "-A", "app.celery_app", "worker", "--loglevel=info", "--concurrency=4"]
```

### Gunicorn Workers

Edit `Dockerfile` to adjust workers:

```dockerfile
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \  # 2 per CPU core
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000"]
```

## 📊 Monitoring

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

### Metrics

```bash
# Prometheus metrics
curl https://yourdomain.com/metrics

# Health check
curl https://yourdomain.com/health
```

### Database Monitoring

```bash
# Connection count
docker compose exec db psql -U vijetha vijetha_db -c "SELECT count(*) FROM pg_stat_activity;"

# Database size
docker compose exec db psql -U vijetha vijetha_db -c "SELECT pg_size_pretty(pg_database_size('vijetha_db'));"

# Active queries
docker compose exec db psql -U vijetha vijetha_db -c "SELECT pid, usename, application_name, state, query FROM pg_stat_activity WHERE state != 'idle';"
```

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Run deployment script (includes backup)
./scripts/deploy.sh
```

### Manual Update

```bash
# Backup database
docker compose exec db pg_dump -U vijetha vijetha_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Pull latest code
git pull origin main

# Rebuild images
docker compose build

# Run migrations
docker compose run --rm api alembic upgrade head

# Restart services
docker compose down
docker compose --profile nginx --profile celery up -d
```

### Rollback

```bash
# List available backups
ls -lh backups/

# Rollback to specific timestamp
./scripts/rollback.sh 20260425_120000
```

## 🔐 Security Best Practices

### 1. Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### 2. Fail2Ban (Optional)

```bash
# Install fail2ban
sudo apt install fail2ban

# Configure for nginx
sudo nano /etc/fail2ban/jail.local
```

Add:

```ini
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
```

### 3. Regular Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d
```

### 4. Backup Strategy

```bash
# Create backup script
cat > /usr/local/bin/backup-vijetha.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/vijetha"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup database
docker compose exec -T db pg_dump -U vijetha vijetha_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz uploads/

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/backup-vijetha.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-vijetha.sh") | crontab -
```

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose logs api

# Check environment variables
docker compose exec api env | grep DATABASE_URL

# Restart service
docker compose restart api
```

### Database Connection Issues

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U vijetha vijetha_db -c "SELECT 1;"

# Check DATABASE_URL format
echo $DATABASE_URL
```

### Redis Connection Issues

```bash
# Check Redis is running
docker compose ps redis

# Test connection
docker compose exec redis redis-cli ping

# Check Redis logs
docker compose logs redis
```

### High Memory Usage

```bash
# Check container stats
docker stats

# Restart services
docker compose restart

# Adjust worker concurrency
# Edit docker-compose.yml and reduce --concurrency value
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Restart nginx
docker compose restart nginx
```

## 📞 Support and Resources

### Useful Commands

```bash
# View all containers
docker compose ps

# Restart all services
docker compose restart

# Stop all services
docker compose down

# View resource usage
docker stats

# Clean up unused resources
docker system prune -a

# Access API shell
docker compose exec api bash

# Access database shell
docker compose exec db psql -U vijetha vijetha_db
```

### Log Locations

- **Application logs**: `docker compose logs api`
- **Nginx logs**: `docker compose logs nginx`
- **Database logs**: `docker compose logs db`
- **Worker logs**: `docker compose logs worker`

### Performance Tuning

```bash
# Check database performance
docker compose exec db psql -U vijetha vijetha_db -c "SELECT * FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;"

# Check slow queries
docker compose logs api | grep "slow query"

# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com/health
```

Create `curl-format.txt`:

```
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_appconnect:  %{time_appconnect}\n
time_pretransfer:  %{time_pretransfer}\n
time_redirect:  %{time_redirect}\n
time_starttransfer:  %{time_starttransfer}\n
----------\n
time_total:  %{time_total}\n
```

## ✅ Post-Deployment Checklist

- [ ] All services running (`docker compose ps`)
- [ ] Health check returns OK
- [ ] Database migrations applied
- [ ] Admin user created and can login
- [ ] SSL certificate valid
- [ ] HTTPS redirect working
- [ ] WebSocket connections work
- [ ] Email sending works (test password reset)
- [ ] Payment webhook configured in Razorpay dashboard
- [ ] Backups configured and tested
- [ ] Monitoring alerts configured
- [ ] DNS records pointing to server
- [ ] Firewall rules configured
- [ ] Smoke tests passing

---

**Need Help?**

- Check logs: `docker compose logs -f`
- Run diagnostics: `python scripts/diagnostic_report.py`
- Review health: `curl https://yourdomain.com/health`
- Check metrics: `curl https://yourdomain.com/metrics`

**Version**: 2.0.0  
**Last Updated**: 2026-04-25
