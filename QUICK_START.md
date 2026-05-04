# Vijetha Digital Backend - Quick Start Guide

Get the Vijetha Digital backend running in production in under 30 minutes.

## 🚀 Prerequisites

- Ubuntu 20.04+ server with root access
- Domain name pointing to your server
- 4GB RAM minimum (8GB recommended)
- 20GB disk space minimum

## ⚡ Quick Deployment (5 Steps)

### Step 1: Install Docker (2 minutes)

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify
docker --version
```

### Step 2: Clone and Configure (5 minutes)

```bash
# Clone repository
git clone https://github.com/yourusername/vijetha-digital-backend.git
cd vijetha-digital-backend

# Copy environment template
cp .env.example .env

# Edit environment variables (IMPORTANT!)
nano .env
```

**Minimum required changes in `.env`:**

```bash
# Set to production
ENV=production

# Generate strong JWT secret (run this command):
# python3 -c "import secrets; print(secrets.token_urlsafe(32))"
JWT_SECRET_KEY=<paste-generated-secret-here>

# Your domain
FRONTEND_URL=https://yourdomain.com
TRUSTED_HOSTS=["yourdomain.com"]

# Database password (change this!)
POSTGRES_PASSWORD=<strong-password-here>
DATABASE_URL=postgresql://vijetha:<strong-password-here>@db:5432/vijetha_db

# Admin credentials
FIRST_ADMIN_EMAIL=admin@yourdomain.com
FIRST_ADMIN_PASSWORD=<strong-password-here>

# Razorpay PRODUCTION keys
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

### Step 3: SSL Certificate (5 minutes)

```bash
# Install certbot
sudo apt update
sudo apt install certbot -y

# Get certificate (replace yourdomain.com)
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Update nginx config with your domain
sed -i 's/yourdomain.com/your-actual-domain.com/g' nginx/conf.d/vijetha.conf
```

### Step 4: Validate Configuration (2 minutes)

```bash
# Run validation script
python3 scripts/validate_production.py

# Should show all checks passing ✓
```

### Step 5: Deploy (10 minutes)

```bash
# Make deploy script executable
chmod +x scripts/deploy.sh scripts/rollback.sh

# Deploy!
./scripts/deploy.sh

# The script will:
# - Validate configuration
# - Create backups
# - Build Docker images
# - Run database migrations
# - Start all services
# - Run health checks
# - Run smoke tests
```

## ✅ Verify Deployment

```bash
# Check health
curl https://yourdomain.com/health

# Expected response:
# {
#   "status": "ok",
#   "version": "2.0.0",
#   "db": "ok",
#   "redis": "ok"
# }

# Check all services are running
docker compose ps

# Should show: api, db, redis, nginx, worker, beat (all "Up")
```

## 🎯 Test Your Deployment

### 1. Test API Health

```bash
curl https://yourdomain.com/health
```

### 2. Test Admin Login

```bash
curl -X POST https://yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "your-admin-password"
  }'
```

### 3. Access API Documentation

Visit: `https://yourdomain.com/docs` (only in dev mode)

For production, docs are disabled for security.

## 📊 Monitor Your Application

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api
docker compose logs -f nginx
docker compose logs -f worker
```

### Check Metrics

```bash
# Prometheus metrics
curl https://yourdomain.com/metrics

# Health status
curl https://yourdomain.com/health
```

### Check Resource Usage

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

## 🔧 Common Tasks

### Restart Services

```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart api
```

### View Database

```bash
# Connect to database
docker compose exec db psql -U vijetha vijetha_db

# List tables
\dt

# Exit
\q
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Run deployment (includes backup)
./scripts/deploy.sh
```

### Rollback

```bash
# List backups
ls -lh backups/

# Rollback to specific timestamp
./scripts/rollback.sh 20260425_120000
```

## 🐛 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose logs api

# Check environment
docker compose exec api env | grep DATABASE_URL

# Restart
docker compose restart api
```

### Database Connection Error

```bash
# Check database is running
docker compose ps db

# Test connection
docker compose exec db psql -U vijetha vijetha_db -c "SELECT 1;"

# Check DATABASE_URL in .env
cat .env | grep DATABASE_URL
```

### SSL Certificate Error

```bash
# Check certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew

# Restart nginx
docker compose restart nginx
```

### High Memory Usage

```bash
# Check stats
docker stats

# Reduce worker concurrency
# Edit docker-compose.yml, change --concurrency=2 to --concurrency=1

# Restart
docker compose restart worker
```

## 📚 Next Steps

1. **Configure Backups**
   ```bash
   # Set up daily backups (see DEPLOYMENT_GUIDE.md)
   sudo crontab -e
   # Add: 0 2 * * * /path/to/backup-script.sh
   ```

2. **Set Up Monitoring**
   - Configure Sentry for error tracking
   - Set up uptime monitoring (UptimeRobot, Pingdom)
   - Configure log aggregation

3. **Configure Firewall**
   ```bash
   sudo ufw allow 22/tcp   # SSH
   sudo ufw allow 80/tcp   # HTTP
   sudo ufw allow 443/tcp  # HTTPS
   sudo ufw enable
   ```

4. **Configure Razorpay Webhook**
   - Go to Razorpay Dashboard
   - Add webhook URL: `https://yourdomain.com/payments/webhook`
   - Copy webhook secret to `.env`

5. **Test Payment Flow**
   - Create test order
   - Process test payment
   - Verify webhook received

## 🔐 Security Checklist

- [ ] Changed all default passwords
- [ ] JWT secret is strong (32+ characters)
- [ ] ENV set to production
- [ ] SSL certificate installed and working
- [ ] Firewall configured
- [ ] Database password is strong
- [ ] Admin password is strong
- [ ] Razorpay production keys configured
- [ ] CORS origins restricted to your domain
- [ ] API docs disabled in production

## 📞 Need Help?

### Check Documentation

- **Full deployment guide**: `DEPLOYMENT_GUIDE.md`
- **Production checklist**: `PRODUCTION_READINESS_CHECKLIST.md`
- **Upgrade plan**: `UPGRADE_TODO_10_TO_100.md`

### Run Diagnostics

```bash
# Production validation
python3 scripts/validate_production.py

# Health check
curl https://yourdomain.com/health

# Check logs
docker compose logs -f api
```

### Common Commands

```bash
# View all containers
docker compose ps

# Restart all services
docker compose restart

# Stop all services
docker compose down

# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Clean up
docker system prune -a
```

## 🎉 Success!

Your Vijetha Digital backend is now running in production!

**What you have:**
- ✅ Production-ready API
- ✅ Secure authentication
- ✅ Payment processing
- ✅ Background tasks
- ✅ Monitoring and metrics
- ✅ Automated backups
- ✅ SSL/HTTPS
- ✅ Rate limiting
- ✅ Error tracking

**Next steps:**
1. Test all functionality
2. Configure monitoring alerts
3. Set up regular backups
4. Monitor logs for first 24 hours
5. Load test if expecting high traffic

---

**Version**: 2.0.0  
**Last Updated**: 2026-04-25  
**Status**: Production Ready ✅
