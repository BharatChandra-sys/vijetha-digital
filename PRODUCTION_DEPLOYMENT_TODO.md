# Production Deployment TODO - Lightweight & Practical

**Target**: Deploy to production server (not local laptop)  
**Philosophy**: Fix critical issues, deploy to cloud, monitor remotely  
**Laptop**: Minimal resource usage - code editing only

---

## 🎯 STRATEGY

### What We'll Do:
1. ✅ Fix critical code issues (lightweight - just editing files)
2. ✅ Deploy to production server (cloud handles heavy lifting)
3. ✅ Add monitoring tools ON THE SERVER (not your laptop)
4. ✅ Access dashboards remotely via browser

### What We WON'T Do:
- ❌ Run heavy services locally (SigNoz, Metabase, etc.)
- ❌ Run load tests on your laptop
- ❌ Run multiple Docker containers locally
- ❌ Use memory-intensive tools

---

## 📋 PHASE 1: CODE FIXES (Local - Lightweight)

### 1.1 Fix Hardcoded Secrets (15 minutes)
**What**: Remove hardcoded passwords from test files  
**Where**: Your laptop (just editing text files)  
**Resources**: Minimal (text editor only)

**Tasks**:
- [ ] Create `.env.test.example`:
  ```bash
  # .env.test.example
  TEST_ADMIN_EMAIL=admin@example.com
  TEST_ADMIN_PASSWORD=change_me
  TEST_USER_EMAIL=test@example.com
  TEST_USER_PASSWORD=change_me
  ```

- [ ] Update `test_login.py`:
  ```python
  import os
  from dotenv import load_dotenv
  
  load_dotenv('.env.test')
  
  login_data = {
      "email": os.getenv("TEST_ADMIN_EMAIL", "admin@vijetha.com"),
      "password": os.getenv("TEST_ADMIN_PASSWORD", "admin123")
  }
  ```

- [ ] Update `test_auth_endpoints.py` (same pattern)
- [ ] Update `test_logout.py` (same pattern)
- [ ] Add `.env.test` to `.gitignore`
- [ ] Commit changes

**Impact**: Security improvement  
**Laptop Load**: None (just text editing)

---

### 1.2 Fix Silent Error Handling (10 minutes)
**What**: Add proper logging to exception handlers  
**Where**: Your laptop (editing Python files)

**Tasks**:
- [ ] Update `app/api/orders/router.py` line 58-60:
  ```python
  # Before
  try:
      notify_order_placed(db, user.id, order.id)
  except Exception:
      pass
  
  # After
  try:
      notify_order_placed(db, user.id, order.id)
  except Exception as e:
      import logging
      logging.error(f"Failed to send order notification: {e}", exc_info=True)
  ```

- [ ] Commit changes

**Impact**: Better error visibility  
**Laptop Load**: None

---

### 1.3 Pin Dependencies (5 minutes)
**What**: Lock dependency versions for stability  
**Where**: Your laptop

**Tasks**:
- [ ] Run: `pip freeze > requirements-locked.txt`
- [ ] Review and clean up (remove unnecessary packages)
- [ ] Rename to `requirements.txt`
- [ ] Commit changes

**Impact**: Prevent dependency conflicts  
**Laptop Load**: Minimal (one command)

---

### 1.4 Add Environment Validation (10 minutes)
**What**: Validate config on startup  
**Where**: Your laptop

**Tasks**:
- [ ] Add to `app/core/config.py`:
  ```python
  def validate_production_config(self):
      """Validate critical production settings"""
      if self.ENV == "production":
          errors = []
          
          if not self.DATABASE_URL or "localhost" in self.DATABASE_URL:
              errors.append("DATABASE_URL must point to production database")
          
          if not self.SENTRY_DSN:
              errors.append("SENTRY_DSN required in production")
          
          if self.FRONTEND_URL == "*":
              errors.append("FRONTEND_URL must be specific in production")
          
          if len(self.JWT_SECRET_KEY) < 32:
              errors.append("JWT_SECRET_KEY must be at least 32 characters")
          
          if errors:
              raise ValueError(f"Production config errors: {', '.join(errors)}")
  ```

- [ ] Call in `app/main.py` startup:
  ```python
  @asynccontextmanager
  async def lifespan(app: FastAPI):
      if settings.ENV == "production":
          settings.validate_production_config()
      init_db()
      # ... rest of startup
  ```

- [ ] Commit changes

**Impact**: Catch config errors early  
**Laptop Load**: None

---

## 📋 PHASE 2: PRODUCTION SERVER SETUP

### 2.1 Choose Cloud Provider (5 minutes)
**Options** (pick one based on budget):

**Option A: DigitalOcean Droplet** (Recommended)
- Cost: $12/month (2GB RAM, 1 CPU)
- Easy setup
- Good for small-medium traffic

**Option B: AWS EC2 t3.small**
- Cost: ~$15/month
- More scalable
- Free tier available (12 months)

**Option C: Hetzner Cloud**
- Cost: €4.5/month (~$5)
- Cheapest option
- Good performance

**Decision**: [ ] Choose provider: _______________

---

### 2.2 Server Setup (30 minutes)
**What**: Prepare production server  
**Where**: Cloud server (SSH from your laptop)

**Tasks**:
- [ ] Create server instance (2GB RAM minimum)
- [ ] SSH into server: `ssh root@your-server-ip`
- [ ] Update system:
  ```bash
  apt update && apt upgrade -y
  ```

- [ ] Install Docker:
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  ```

- [ ] Install Docker Compose:
  ```bash
  apt install docker-compose -y
  ```

- [ ] Create app directory:
  ```bash
  mkdir -p /opt/vijetha-digital
  cd /opt/vijetha-digital
  ```

- [ ] Clone repository:
  ```bash
  git clone <your-repo-url> .
  ```

**Laptop Load**: Minimal (just SSH terminal)

---

### 2.3 Configure Production Environment (15 minutes)
**What**: Set up production `.env` file  
**Where**: Production server

**Tasks**:
- [ ] Create `.env` on server:
  ```bash
  nano .env
  ```

- [ ] Add production values:
  ```bash
  # App
  ENV=production
  APP_NAME=Vijetha Digital Backend
  
  # Database (use managed database or local)
  DATABASE_URL=postgresql://user:pass@localhost:5432/vijetha_prod
  
  # Frontend
  FRONTEND_URL=https://yourdomain.com
  
  # JWT (generate strong secret)
  JWT_SECRET_KEY=<generate-with: openssl rand -hex 32>
  JWT_ALGORITHM=HS256
  ACCESS_TOKEN_EXPIRE_MINUTES=30
  REFRESH_TOKEN_EXPIRE_DAYS=7
  
  # Admin
  ADMIN_EMAIL=admin@yourdomain.com
  ADMIN_PASSWORD=<strong-password>
  
  # Cloudinary
  CLOUDINARY_CLOUD_NAME=your-cloud
  CLOUDINARY_API_KEY=your-key
  CLOUDINARY_API_SECRET=your-secret
  
  # Razorpay (PRODUCTION keys)
  RAZORPAY_KEY_ID=rzp_live_xxxxx
  RAZORPAY_KEY_SECRET=xxxxx
  RAZORPAY_WEBHOOK_SECRET=xxxxx
  
  # Redis
  REDIS_URL=redis://redis:6379/0
  
  # Sentry (optional but recommended)
  SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
  
  # Trusted hosts
  TRUSTED_HOSTS=yourdomain.com,www.yourdomain.com
  ```

- [ ] Save and exit (Ctrl+X, Y, Enter)

**Laptop Load**: None (editing on server)

---

### 2.4 Deploy Application (10 minutes)
**What**: Start production services  
**Where**: Production server

**Tasks**:
- [ ] Build and start:
  ```bash
  docker-compose up -d --build
  ```

- [ ] Check status:
  ```bash
  docker-compose ps
  ```

- [ ] Check logs:
  ```bash
  docker-compose logs -f api
  ```

- [ ] Test health endpoint:
  ```bash
  curl http://localhost:8000/health
  ```

**Expected Output**:
```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "ok",
  "timestamp": "2026-05-04T..."
}
```

**Laptop Load**: None (server does the work)

---

## 📋 PHASE 3: MONITORING SETUP (On Server)

### 3.1 Add Lightweight Monitoring (20 minutes)
**What**: Simple monitoring without heavy tools  
**Where**: Production server

**Option A: Simple Bash Monitoring Script**
- [ ] Create `scripts/monitor.sh` on server:
  ```bash
  #!/bin/bash
  # Simple health monitoring
  
  while true; do
      # Check API health
      response=$(curl -s http://localhost:8000/health)
      status=$(echo $response | jq -r '.status')
      
      if [ "$status" != "ok" ]; then
          echo "[$(date)] ALERT: API unhealthy - $response"
          # Send alert (email, Slack, etc.)
      fi
      
      # Check disk space
      disk_usage=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
      if [ $disk_usage -gt 80 ]; then
          echo "[$(date)] ALERT: Disk usage at ${disk_usage}%"
      fi
      
      # Check memory
      mem_usage=$(free | awk 'NR==2 {printf "%.0f", $3/$2 * 100}')
      if [ $mem_usage -gt 85 ]; then
          echo "[$(date)] ALERT: Memory usage at ${mem_usage}%"
      fi
      
      sleep 60  # Check every minute
  done
  ```

- [ ] Make executable: `chmod +x scripts/monitor.sh`
- [ ] Run in background: `nohup ./scripts/monitor.sh > monitor.log 2>&1 &`

**Option B: Use Existing Prometheus + Grafana Cloud (Free)**
- [ ] Sign up for Grafana Cloud (free tier)
- [ ] Get remote write URL
- [ ] Update `docker-compose.yml` to send metrics to Grafana Cloud
- [ ] Access dashboards at grafana.com (no local resources)

**Laptop Load**: None (monitoring runs on server)

---

### 3.2 Set Up Log Aggregation (10 minutes)
**What**: Centralized logging  
**Where**: Production server

**Tasks**:
- [ ] Configure log rotation:
  ```bash
  cat > /etc/logrotate.d/vijetha-digital << EOF
  /opt/vijetha-digital/logs/*.log {
      daily
      rotate 7
      compress
      delaycompress
      missingok
      notifempty
  }
  EOF
  ```

- [ ] Create log viewing script:
  ```bash
  # scripts/view-logs.sh
  #!/bin/bash
  docker-compose logs -f --tail=100 api
  ```

**Laptop Load**: None

---

### 3.3 Set Up Automated Backups (15 minutes)
**What**: Daily database backups  
**Where**: Production server

**Tasks**:
- [ ] Create backup script `scripts/backup.sh`:
  ```bash
  #!/bin/bash
  BACKUP_DIR="/opt/backups"
  DATE=$(date +%Y%m%d_%H%M%S)
  
  mkdir -p $BACKUP_DIR
  
  # Backup database
  docker-compose exec -T db pg_dump -U vijetha vijetha_db | gzip > $BACKUP_DIR/db_$DATE.sql.gz
  
  # Keep only last 7 days
  find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
  
  echo "Backup completed: db_$DATE.sql.gz"
  ```

- [ ] Make executable: `chmod +x scripts/backup.sh`
- [ ] Add to crontab:
  ```bash
  crontab -e
  # Add line:
  0 2 * * * /opt/vijetha-digital/scripts/backup.sh >> /var/log/backup.log 2>&1
  ```

**Laptop Load**: None

---

## 📋 PHASE 4: OPTIONAL ENHANCEMENTS

### 4.1 Add Uptime Monitoring (5 minutes)
**What**: External monitoring service  
**Where**: Cloud service (free tier)

**Options**:
- [ ] **UptimeRobot** (free, 50 monitors)
  - Sign up at uptimerobot.com
  - Add monitor for https://yourdomain.com/health
  - Set alert email

- [ ] **Pingdom** (free tier)
- [ ] **StatusCake** (free tier)

**Laptop Load**: None (external service)

---

### 4.2 Add Simple Analytics (Optional)
**What**: Track API usage  
**Where**: Production server

**Tasks**:
- [ ] Add simple request counter to `app/middleware/metrics.py`
- [ ] Create daily stats endpoint
- [ ] View stats via API: `curl https://yourdomain.com/api/stats`

**Laptop Load**: None

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All code changes committed and pushed
- [ ] `.env` file configured on server
- [ ] Database migrations ready
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] Domain DNS configured

### Deployment
- [ ] SSH into server
- [ ] Pull latest code: `git pull`
- [ ] Run migrations: `docker-compose exec api alembic upgrade head`
- [ ] Restart services: `docker-compose restart`
- [ ] Check health: `curl http://localhost:8000/health`
- [ ] Check logs: `docker-compose logs -f api`

### Post-Deployment
- [ ] Test critical endpoints
- [ ] Verify database connection
- [ ] Verify Redis connection
- [ ] Check Sentry for errors
- [ ] Monitor for 1 hour

---

## 🚀 QUICK DEPLOYMENT COMMANDS

### On Your Laptop (Lightweight)
```bash
# 1. Make code changes
git add .
git commit -m "Production improvements"
git push origin main
```

### On Production Server (Heavy lifting)
```bash
# 2. SSH to server
ssh root@your-server-ip

# 3. Update code
cd /opt/vijetha-digital
git pull

# 4. Rebuild and restart
docker-compose down
docker-compose up -d --build

# 5. Check status
docker-compose ps
docker-compose logs -f api

# 6. Test
curl http://localhost:8000/health
```

---

## 💰 COST BREAKDOWN

### Minimum Setup (Recommended)
- **Server**: $12/month (DigitalOcean 2GB)
- **Domain**: $12/year (Namecheap)
- **SSL**: $0 (Let's Encrypt)
- **Monitoring**: $0 (UptimeRobot free tier)
- **Total**: ~$13/month

### With Managed Database (Optional)
- **Server**: $12/month
- **Managed PostgreSQL**: $15/month (DigitalOcean)
- **Domain**: $12/year
- **Total**: ~$28/month

---

## 📊 RESOURCE USAGE

### Your Laptop
- **CPU**: <5% (just code editing)
- **RAM**: <500MB (VS Code + terminal)
- **Disk**: <100MB (code only)
- **Network**: Minimal (git push/pull)

### Production Server
- **CPU**: 30-50% (Docker + services)
- **RAM**: 1.5GB (API + DB + Redis)
- **Disk**: 5GB (app + logs + backups)
- **Network**: Variable (depends on traffic)

---

## ✅ SUCCESS CRITERIA

### Week 1: Basic Deployment
- [ ] Code fixes committed
- [ ] Server provisioned
- [ ] Application deployed
- [ ] Health check passing
- [ ] Basic monitoring active

### Week 2: Stability
- [ ] No critical errors in logs
- [ ] Backups running daily
- [ ] Uptime > 99%
- [ ] Response time < 500ms

### Week 3: Optimization
- [ ] Logs reviewed and cleaned
- [ ] Performance baseline documented
- [ ] Monitoring alerts configured
- [ ] Team trained on deployment

---

## 🆘 TROUBLESHOOTING

### If Server Runs Out of Memory
```bash
# Check memory usage
free -h

# Restart services
docker-compose restart

# Reduce worker count in docker-compose.yml
# Change: --workers 2
# To: --workers 1
```

### If Deployment Fails
```bash
# Check logs
docker-compose logs api

# Check disk space
df -h

# Clean up old images
docker system prune -a
```

### If Database Connection Fails
```bash
# Check database status
docker-compose ps db

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

---

## 📞 NEXT STEPS

1. **Today**: Fix code issues (Phase 1) - 40 minutes on your laptop
2. **This Week**: Deploy to server (Phase 2) - 1 hour on cloud
3. **Next Week**: Add monitoring (Phase 3) - 45 minutes on cloud
4. **Ongoing**: Monitor and optimize

**Total Time**: ~3 hours  
**Laptop Load**: Minimal (just code editing)  
**Server Load**: Handled by cloud

---

**Ready to start?** Begin with Phase 1 (code fixes) - it's just editing files on your laptop, no heavy services needed.

Would you like me to help you with Phase 1 right now?
