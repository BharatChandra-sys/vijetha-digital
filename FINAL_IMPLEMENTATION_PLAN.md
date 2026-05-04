# Final Implementation Plan - Complete Setup for Low-End Laptop

**Strategy**: Everything runs on production server, you access via browser  
**Your Laptop**: Just code editor + browser  
**Server**: Handles all heavy lifting (SigNoz, Metabase, Docker, etc.)

---

## 🎯 THE PLAN

### Your Laptop (Lightweight):
- ✅ VS Code for editing code
- ✅ Browser to access dashboards
- ✅ Git for version control
- ✅ SSH terminal
- **Total RAM needed**: ~1GB
- **Total CPU**: <10%

### Production Server (Heavy Work):
- ✅ FastAPI application
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ SigNoz (monitoring)
- ✅ Metabase (analytics)
- ✅ Nginx (reverse proxy)
- **Minimum Server**: 4GB RAM, 2 CPU cores
- **Recommended**: 8GB RAM, 4 CPU cores

---

## 💰 SERVER REQUIREMENTS & COSTS

### Option 1: DigitalOcean (Recommended)
**Droplet: 4GB RAM, 2 CPUs, 80GB SSD**
- Cost: $24/month
- Easy setup
- Good support
- Managed backups: +$4.80/month

### Option 2: Hetzner Cloud (Cheapest)
**CX31: 4GB RAM, 2 CPUs, 80GB SSD**
- Cost: €9.90/month (~$11/month)
- Best price/performance
- EU data centers

### Option 3: AWS EC2 (Most Scalable)
**t3.medium: 4GB RAM, 2 CPUs**
- Cost: ~$30/month
- Free tier: 12 months free (t3.micro)
- Most flexible

**Recommendation**: Start with Hetzner (cheapest) or DigitalOcean (easiest)

---

## 📋 PHASE 1: CODE PREPARATION (Your Laptop - 1 hour)

### 1.1 Fix Critical Issues (30 minutes)

#### A. Fix Hardcoded Secrets
```bash
# Create .env.test.example
cat > .env.test.example << 'EOF'
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=change_me
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=change_me
EOF

# Add to .gitignore
echo ".env.test" >> .gitignore
```

#### B. Update Test Files
Create `scripts/fix_test_files.py`:
```python
#!/usr/bin/env python3
import os
import re

files_to_fix = [
    'test_login.py',
    'test_logout.py', 
    'test_auth_endpoints.py'
]

for filename in files_to_fix:
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            content = f.read()
        
        # Add env loading at top
        if 'load_dotenv' not in content:
            content = 'import os\nfrom dotenv import load_dotenv\nload_dotenv(".env.test")\n\n' + content
        
        # Replace hardcoded passwords
        content = re.sub(
            r'TEST_PASSWORD\s*=\s*["\'].*?["\']',
            'TEST_PASSWORD = os.getenv("TEST_USER_PASSWORD", "SecureTest123!")',
            content
        )
        
        with open(filename, 'w') as f:
            f.write(content)
        
        print(f"✓ Fixed {filename}")
```

Run: `python scripts/fix_test_files.py`

#### C. Fix Error Handling
Update `app/api/orders/router.py`:
```python
# Line 58-60, replace:
try:
    notify_order_placed(db, user.id, order.id)
except Exception:
    pass

# With:
try:
    notify_order_placed(db, user.id, order.id)
except Exception as e:
    from loguru import logger
    logger.error(f"Failed to send order notification: {e}", 
                 extra={"user_id": user.id, "order_id": order.id})
```

#### D. Pin Dependencies
```bash
pip freeze > requirements-locked.txt
# Review and clean, then:
mv requirements-locked.txt requirements.txt
```

**Commit everything**:
```bash
git add .
git commit -m "Production improvements: fix secrets, error handling, pin deps"
git push origin main
```

---

### 1.2 Prepare Production Docker Compose (30 minutes)

Create `docker-compose.prod.yml`:
```yaml
version: "3.9"

services:
  # ── PostgreSQL ──────────────────────────────────────────────────────
  db:
    image: postgres:15-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-vijetha}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB:-vijetha_db}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-vijetha}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── Redis ───────────────────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    networks:
      - backend
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── API (FastAPI) ───────────────────────────────────────────────────
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    restart: unless-stopped
    env_file: .env
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-vijetha}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-vijetha_db}
      REDIS_URL: redis://redis:6379/0
      OTEL_EXPORTER_OTLP_ENDPOINT: http://signoz-otel-collector:4317
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    expose:
      - "8000"
    networks:
      - backend
      - frontend
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s

  # ── Celery Worker ───────────────────────────────────────────────────
  worker:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    restart: unless-stopped
    command: ["celery", "-A", "app.celery_app", "worker", "--loglevel=info", "--concurrency=2"]
    env_file: .env
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-vijetha}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-vijetha_db}
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - db
      - redis
    networks:
      - backend

  # ── Celery Beat ─────────────────────────────────────────────────────
  beat:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    restart: unless-stopped
    command: ["celery", "-A", "app.celery_app", "beat", "--loglevel=info"]
    env_file: .env
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-vijetha}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-vijetha_db}
      REDIS_URL: redis://redis:6379/0
    depends_on:
      - redis
    networks:
      - backend

  # ── SigNoz (Monitoring) ─────────────────────────────────────────────
  signoz-clickhouse:
    image: clickhouse/clickhouse-server:23.7-alpine
    restart: unless-stopped
    volumes:
      - signoz_data:/var/lib/clickhouse/
    networks:
      - backend

  signoz-otel-collector:
    image: signoz/signoz-otel-collector:0.88.11
    restart: unless-stopped
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./signoz-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    depends_on:
      - signoz-clickhouse
    networks:
      - backend

  signoz-query-service:
    image: signoz/query-service:0.38.0
    restart: unless-stopped
    command: ["-config=/root/config/prometheus.yml"]
    environment:
      - ClickHouseUrl=tcp://signoz-clickhouse:9000
    depends_on:
      - signoz-clickhouse
    networks:
      - backend
      - frontend
    expose:
      - "8080"

  signoz-frontend:
    image: signoz/frontend:0.38.0
    restart: unless-stopped
    depends_on:
      - signoz-query-service
    networks:
      - frontend
    expose:
      - "3301"

  # ── Metabase (Analytics) ────────────────────────────────────────────
  metabase:
    image: metabase/metabase:latest
    restart: unless-stopped
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: ${POSTGRES_DB:-vijetha_db}
      MB_DB_PORT: 5432
      MB_DB_USER: ${POSTGRES_USER:-vijetha}
      MB_DB_PASS: ${POSTGRES_PASSWORD}
      MB_DB_HOST: db
    depends_on:
      - db
    volumes:
      - metabase_data:/metabase-data
    networks:
      - backend
      - frontend
    expose:
      - "3000"

  # ── Nginx (Reverse Proxy) ───────────────────────────────────────────
  nginx:
    image: nginx:1.25-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - certbot_www:/var/www/certbot:ro
      - certbot_certs:/etc/letsencrypt:ro
    depends_on:
      - api
      - signoz-frontend
      - metabase
    networks:
      - frontend

volumes:
  postgres_data:
  redis_data:
  signoz_data:
  metabase_data:
  certbot_www:
  certbot_certs:

networks:
  backend:
    driver: bridge
  frontend:
    driver: bridge
```

Create `signoz-config.yaml`:
```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024

exporters:
  clickhouse:
    endpoint: tcp://signoz-clickhouse:9000
    database: signoz_traces
    ttl: 168h  # 7 days

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [clickhouse]
```

Create `nginx/conf.d/vijetha.conf`:
```nginx
# API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://api:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# SigNoz
server {
    listen 80;
    server_name signoz.yourdomain.com;
    
    location / {
        proxy_pass http://signoz-frontend:3301;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Metabase
server {
    listen 80;
    server_name metabase.yourdomain.com;
    
    location / {
        proxy_pass http://metabase:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Commit**:
```bash
git add docker-compose.prod.yml signoz-config.yaml nginx/
git commit -m "Add production docker compose with SigNoz and Metabase"
git push origin main
```

---

## 📋 PHASE 2: SERVER SETUP (1 hour)

### 2.1 Provision Server (10 minutes)

**DigitalOcean**:
1. Go to digitalocean.com
2. Create Droplet
3. Choose: Ubuntu 22.04 LTS
4. Size: 4GB RAM / 2 CPUs ($24/month)
5. Add SSH key
6. Create

**Hetzner** (Cheaper):
1. Go to hetzner.com/cloud
2. Create server
3. Choose: Ubuntu 22.04
4. Type: CX31 (4GB RAM, €9.90/month)
5. Add SSH key
6. Create

**Note your server IP**: _______________

---

### 2.2 Initial Server Setup (20 minutes)

SSH into server:
```bash
ssh root@YOUR_SERVER_IP
```

Run setup script:
```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Install useful tools
apt install -y git curl htop nano

# Create app directory
mkdir -p /opt/vijetha-digital
cd /opt/vijetha-digital

# Clone repository
git clone YOUR_REPO_URL .

# Create .env file
nano .env
```

**Production `.env`** (paste this):
```bash
# App
ENV=production
APP_NAME=Vijetha Digital Backend

# Database
POSTGRES_USER=vijetha
POSTGRES_PASSWORD=CHANGE_THIS_STRONG_PASSWORD_123
POSTGRES_DB=vijetha_db
DATABASE_URL=postgresql://vijetha:CHANGE_THIS_STRONG_PASSWORD_123@db:5432/vijetha_db

# Frontend
FRONTEND_URL=https://yourdomain.com

# JWT (generate: openssl rand -hex 32)
JWT_SECRET_KEY=PASTE_GENERATED_SECRET_HERE
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=CHANGE_THIS_ADMIN_PASSWORD

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (PRODUCTION)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Redis
REDIS_URL=redis://redis:6379/0

# Sentry (optional)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# Trusted hosts
TRUSTED_HOSTS=yourdomain.com,api.yourdomain.com,signoz.yourdomain.com,metabase.yourdomain.com
```

Save (Ctrl+X, Y, Enter)

---

### 2.3 Deploy Application (30 minutes)

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# This will take 5-10 minutes on first run
# Watch progress:
docker-compose -f docker-compose.prod.yml logs -f
```

**Wait for all services to start**. You'll see:
- ✓ db started
- ✓ redis started
- ✓ api started
- ✓ worker started
- ✓ beat started
- ✓ signoz-clickhouse started
- ✓ signoz-otel-collector started
- ✓ signoz-query-service started
- ✓ signoz-frontend started
- ✓ metabase started
- ✓ nginx started

**Check status**:
```bash
docker-compose -f docker-compose.prod.yml ps
```

All should show "Up" and "healthy".

**Test health**:
```bash
curl http://localhost:8000/health
```

Expected:
```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "ok"
}
```

---

## 📋 PHASE 3: CONFIGURE MONITORING (30 minutes)

### 3.1 Add OpenTelemetry to Application

On your laptop, update `requirements.txt`:
```bash
# Add these lines
opentelemetry-distro==0.45b0
opentelemetry-exporter-otlp==1.24.0
opentelemetry-instrumentation-fastapi==0.45b0
opentelemetry-instrumentation-sqlalchemy==0.45b0
opentelemetry-instrumentation-redis==0.45b0
opentelemetry-instrumentation-celery==0.45b0
```

Update `app/main.py` (add at the very top, before other imports):
```python
# OpenTelemetry instrumentation
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

# Configure OpenTelemetry
resource = Resource.create({"service.name": "vijetha-digital-api"})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(
    OTLPSpanExporter(
        endpoint=os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4317"),
        insecure=True
    )
)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

# ... rest of your imports ...
```

After `app = FastAPI(...)`, add:
```python
# Instrument FastAPI
FastAPIInstrumentor.instrument_app(app)

# Instrument SQLAlchemy (after engine is created)
SQLAlchemyInstrumentor().instrument(engine=engine)
```

**Commit and push**:
```bash
git add .
git commit -m "Add OpenTelemetry instrumentation"
git push origin main
```

**On server, update**:
```bash
cd /opt/vijetha-digital
git pull
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

### 3.2 Configure DNS (15 minutes)

In your domain registrar (Namecheap, GoDaddy, etc.):

Add A records:
```
api.yourdomain.com      → YOUR_SERVER_IP
signoz.yourdomain.com   → YOUR_SERVER_IP
metabase.yourdomain.com → YOUR_SERVER_IP
```

Wait 5-10 minutes for DNS propagation.

Test:
```bash
ping api.yourdomain.com
ping signoz.yourdomain.com
ping metabase.yourdomain.com
```

---

### 3.3 Setup SSL (15 minutes)

On server:
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificates
certbot --nginx -d api.yourdomain.com
certbot --nginx -d signoz.yourdomain.com
certbot --nginx -d metabase.yourdomain.com

# Auto-renewal
certbot renew --dry-run
```

---

## 📋 PHASE 4: ACCESS DASHBOARDS (From Your Laptop)

### 4.1 Access SigNoz (Monitoring)

Open browser: `https://signoz.yourdomain.com`

**First time setup**:
1. Create admin account
2. Skip team invitation
3. You'll see the dashboard

**What you'll see**:
- All API requests with timing
- Slow database queries
- Error traces
- Service dependency map

**Create alerts**:
1. Go to "Alerts"
2. Create alert: "API response time > 2 seconds"
3. Create alert: "Error rate > 1%"
4. Add your email for notifications

---

### 4.2 Access Metabase (Analytics)

Open browser: `https://metabase.yourdomain.com`

**First time setup**:
1. Create admin account
2. Skip "Add your data" (already connected)
3. Click "Ask a question"

**Create Revenue Dashboard**:

Query 1 - Total Revenue Today:
```sql
SELECT SUM(total_amount) as revenue
FROM orders
WHERE DATE(created_at) = CURRENT_DATE
AND status = 'completed';
```

Query 2 - Revenue by Day (Last 30 Days):
```sql
SELECT 
  DATE(created_at) as date,
  SUM(total_amount) as revenue
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
AND status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date;
```

Query 3 - Top 10 Customers:
```sql
SELECT 
  u.email,
  u.full_name,
  COUNT(o.id) as order_count,
  SUM(o.total_amount) as total_revenue
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.email, u.full_name
ORDER BY total_revenue DESC
LIMIT 10;
```

**Save as dashboard** and share with team.

---

## 📋 PHASE 5: MONITORING & MAINTENANCE

### 5.1 Daily Checks (2 minutes)

From your laptop browser:

1. **Check SigNoz**: `https://signoz.yourdomain.com`
   - Any errors?
   - Any slow queries?
   - Response times normal?

2. **Check Metabase**: `https://metabase.yourdomain.com`
   - Revenue today?
   - New orders?
   - Any anomalies?

3. **Check API Health**: `https://api.yourdomain.com/health`
   - Should return `{"status": "ok"}`

---

### 5.2 Weekly Tasks (10 minutes)

SSH to server:
```bash
ssh root@YOUR_SERVER_IP

# Check disk space
df -h

# Check memory
free -h

# Check logs
cd /opt/vijetha-digital
docker-compose -f docker-compose.prod.yml logs --tail=100 api

# Check backups
ls -lh /opt/backups/

# Update system
apt update && apt upgrade -y

# Restart if needed
docker-compose -f docker-compose.prod.yml restart
```

---

## 📊 RESOURCE USAGE

### Your Laptop:
- **RAM**: ~1GB (VS Code + Browser)
- **CPU**: <10%
- **Disk**: <500MB (code only)
- **Network**: Minimal

### Production Server (4GB RAM):
- **API**: ~300MB
- **Database**: ~500MB
- **Redis**: ~100MB
- **SigNoz**: ~1GB
- **Metabase**: ~800MB
- **Nginx**: ~50MB
- **Total**: ~2.8GB (comfortable on 4GB server)

---

## 💰 TOTAL COST

### Monthly:
- **Server** (Hetzner CX31): €9.90 (~$11)
- **Domain**: $1/month ($12/year)
- **SSL**: Free (Let's Encrypt)
- **SigNoz**: Free (self-hosted)
- **Metabase**: Free (self-hosted)
- **Total**: ~$12/month

### One-time:
- **Domain registration**: $12/year
- **Setup time**: 3 hours

---

## ✅ SUCCESS CHECKLIST

### After Phase 1:
- [ ] Code fixes committed
- [ ] Docker compose ready
- [ ] Nginx config ready

### After Phase 2:
- [ ] Server provisioned
- [ ] Application deployed
- [ ] Health check passing

### After Phase 3:
- [ ] OpenTelemetry working
- [ ] DNS configured
- [ ] SSL certificates installed

### After Phase 4:
- [ ] SigNoz accessible via browser
- [ ] Metabase accessible via browser
- [ ] Dashboards created

### After Phase 5:
- [ ] Monitoring alerts configured
- [ ] Daily check routine established
- [ ] Team trained

---

## 🚀 QUICK START COMMANDS

### On Your Laptop (One-time setup):
```bash
# 1. Fix code issues
python scripts/fix_test_files.py
git add .
git commit -m "Production improvements"
git push origin main
```

### On Production Server (One-time setup):
```bash
# 2. Setup server
ssh root@YOUR_SERVER_IP
curl -fsSL https://get.docker.com | sh
apt install -y docker-compose git
mkdir -p /opt/vijetha-digital
cd /opt/vijetha-digital
git clone YOUR_REPO_URL .

# 3. Configure and deploy
nano .env  # Paste production config
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Check status
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:8000/health
```

### Daily (From Your Laptop):
```bash
# Just open browser:
# - https://signoz.yourdomain.com (monitoring)
# - https://metabase.yourdomain.com (analytics)
# - https://api.yourdomain.com/health (health check)
```

---

## 🆘 TROUBLESHOOTING

### If services won't start:
```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check specific service
docker-compose -f docker-compose.prod.yml logs api
docker-compose -f docker-compose.prod.yml logs signoz-frontend

# Restart everything
docker-compose -f docker-compose.prod.yml restart
```

### If out of memory:
```bash
# Check memory
free -h

# Reduce Celery workers
# Edit docker-compose.prod.yml:
# Change: --concurrency=2
# To: --concurrency=1

# Restart
docker-compose -f docker-compose.prod.yml restart worker
```

### If can't access dashboards:
```bash
# Check DNS
ping signoz.yourdomain.com

# Check nginx
docker-compose -f docker-compose.prod.yml logs nginx

# Check firewall
ufw status
ufw allow 80
ufw allow 443
```

---

## 📞 READY TO START?

**Total time**: 3 hours  
**Your laptop load**: Minimal (just browser + code editor)  
**Server does**: All heavy work  
**Result**: Full monitoring + analytics accessible from anywhere

**Start with Phase 1** (code fixes) - it's just 1 hour of editing files on your laptop!

Would you like me to help you start Phase 1 right now?
