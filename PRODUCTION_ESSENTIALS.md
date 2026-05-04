# Production Essentials - No AI, Just Solid Infrastructure

## 🎯 What You Actually Need

You have a working FastAPI backend. You need:
1. **Better monitoring** - Know when things break
2. **Business dashboards** - See revenue, orders, customers
3. **Better workflows** - Improve on Celery (optional)
4. **Performance testing** - Make sure it can handle traffic

**NO AI, NO complexity, just production-grade tools.**

---

## 1️⃣ MONITORING - SigNoz (MUST HAVE)

### What You Have Now:
- Prometheus (metrics only - numbers)
- Sentry (errors only)
- Logs in files

### The Problem:
```
Customer: "The checkout is slow"
You: Check Prometheus → nothing obvious
     Check Sentry → no errors
     Check logs → 10,000 lines to search
     Result: 2 hours wasted
```

### ⭐ Solution: SigNoz

**What it does:**
- Shows EVERY request from start to finish
- Shows which database query is slow
- Shows which API endpoint has errors
- Combines logs + metrics + traces in ONE place

**Real Example:**
```
Customer complains: "Order creation is slow"

With SigNoz (30 seconds):
1. Open dashboard
2. Click "Orders API"
3. See: Database query taking 4.5 seconds
4. See: Query is "SELECT * FROM products WHERE..."
5. Fix: Add database index
Done!

Without SigNoz (2 hours):
1. Check Prometheus → nothing
2. Check Sentry → no error
3. Add logging everywhere
4. Redeploy
5. Wait for issue to happen again
6. Check logs
7. Maybe find the issue
```

### Installation (10 minutes):

**Step 1: Install SigNoz**
```bash
cd ~/
git clone https://github.com/SigNoz/signoz.git
cd signoz/deploy/docker/clickhouse-setup
docker compose up -d
```

**Step 2: Add to your requirements.txt**
```bash
cat >> requirements.txt << EOF
opentelemetry-distro==0.45b0
opentelemetry-exporter-otlp==1.24.0
opentelemetry-instrumentation-fastapi==0.45b0
opentelemetry-instrumentation-sqlalchemy==0.45b0
opentelemetry-instrumentation-redis==0.45b0
opentelemetry-instrumentation-celery==0.45b0
EOF

pip install -r requirements.txt
```

**Step 3: Add to your app/main.py (at the top, before other imports)**
```python
# app/main.py - ADD THIS AT THE VERY TOP
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.celery import CeleryInstrumentor

# Configure OpenTelemetry
resource = Resource.create({"service.name": "vijetha-digital-api"})
provider = TracerProvider(resource=resource)
processor = BatchSpanProcessor(
    OTLPSpanExporter(endpoint="http://localhost:4317", insecure=True)
)
provider.add_span_processor(processor)
trace.set_tracer_provider(provider)

# ... rest of your imports ...
from fastapi import FastAPI
# ... etc ...

# After app = FastAPI(...), add:
FastAPIInstrumentor.instrument_app(app)

# After engine is created, add:
SQLAlchemyInstrumentor().instrument(engine=engine)

# For Redis (if you have redis client):
RedisInstrumentor().instrument()

# For Celery:
CeleryInstrumentor().instrument()
```

**Step 4: Update docker-compose.yml**
```yaml
# Add to your existing docker-compose.yml
services:
  # ... your existing services ...
  
  api:
    # ... your existing api config ...
    environment:
      # ... your existing env vars ...
      OTEL_EXPORTER_OTLP_ENDPOINT: http://signoz-otel-collector:4317
    depends_on:
      - db
      - redis
      - signoz-otel-collector
  
  # Add SigNoz services
  signoz-otel-collector:
    image: signoz/signoz-otel-collector:0.88.11
    command: ["--config=/etc/otel-collector-config.yaml"]
    volumes:
      - ./signoz-config.yaml:/etc/otel-collector-config.yaml
    ports:
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    networks:
      - backend

  signoz-query-service:
    image: signoz/query-service:0.38.0
    command: ["-config=/root/config/prometheus.yml"]
    ports:
      - "8080:8080"
    depends_on:
      - signoz-clickhouse
    networks:
      - backend

  signoz-frontend:
    image: signoz/frontend:0.38.0
    ports:
      - "3301:3301"
    depends_on:
      - signoz-query-service
    networks:
      - backend

  signoz-clickhouse:
    image: clickhouse/clickhouse-server:23.7-alpine
    volumes:
      - signoz_data:/var/lib/clickhouse/
    networks:
      - backend

volumes:
  signoz_data:

# ... rest of your config ...
```

**Step 5: Create signoz-config.yaml**
```yaml
# signoz-config.yaml
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

**Step 6: Restart everything**
```bash
docker compose down
docker compose up -d
```

**Step 7: Open SigNoz Dashboard**
```
http://localhost:3301
```

### What You'll See:
- All API requests with response times
- Slow database queries highlighted
- Error traces with full context
- Service dependency map
- Custom dashboards

### Set Up Alerts:
```
In SigNoz UI:
1. Go to "Alerts"
2. Create alert: "API response time > 2 seconds"
3. Create alert: "Error rate > 1%"
4. Create alert: "Database query > 1 second"
5. Send to: Email, Slack, PagerDuty
```

### Production Ready? ✅ YES
- Used by 5,000+ companies
- Self-hosted (your data stays private)
- Handles millions of requests
- Free forever

---

## 2️⃣ BUSINESS INTELLIGENCE - Metabase (HIGH VALUE)

### What You Have Now:
- Boss asks: "What's our revenue this month?"
- You: Write SQL query, export CSV, send email
- Boss asks: "Who are our top customers?"
- You: Write another SQL query...

### ⭐ Solution: Metabase

**What it does:**
- Connect to your PostgreSQL database
- Drag-and-drop to create charts
- Boss/team can create their own reports
- No coding required

### Installation (5 minutes):

**Add to docker-compose.yml:**
```yaml
services:
  # ... your existing services ...
  
  metabase:
    image: metabase/metabase:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      MB_DB_TYPE: postgres
      MB_DB_DBNAME: vijetha_db
      MB_DB_PORT: 5432
      MB_DB_USER: ${POSTGRES_USER:-vijetha}
      MB_DB_PASS: ${POSTGRES_PASSWORD:-vijetha_secret}
      MB_DB_HOST: db
    depends_on:
      - db
    volumes:
      - metabase_data:/metabase-data
    networks:
      - backend

volumes:
  metabase_data:
```

**Start Metabase:**
```bash
docker compose up -d metabase
```

**Setup (First Time):**
1. Open http://localhost:3000
2. Create admin account
3. Skip "Add your data" (already configured)
4. Start creating dashboards

### Example Dashboards to Create:

**Revenue Dashboard:**
```sql
-- Total Revenue Today
SELECT SUM(total_amount) as revenue
FROM orders
WHERE DATE(created_at) = CURRENT_DATE
AND status = 'completed';

-- Revenue by Day (Last 30 Days)
SELECT 
  DATE(created_at) as date,
  SUM(total_amount) as revenue
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
AND status = 'completed'
GROUP BY DATE(created_at)
ORDER BY date;

-- Revenue by Product Type
SELECT 
  p.name,
  SUM(oi.total_price) as revenue
FROM order_items oi
JOIN products p ON oi.product_id = p.id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'completed'
GROUP BY p.name
ORDER BY revenue DESC;
```

**Operations Dashboard:**
```sql
-- Orders by Status
SELECT status, COUNT(*) as count
FROM orders
GROUP BY status;

-- Average Order Value
SELECT AVG(total_amount) as avg_order_value
FROM orders
WHERE status = 'completed';

-- Orders Per Day (Last 7 Days)
SELECT 
  DATE(created_at) as date,
  COUNT(*) as orders
FROM orders
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Top 10 Customers by Revenue
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

**Customer Dashboard:**
```sql
-- New Customers Per Week
SELECT 
  DATE_TRUNC('week', created_at) as week,
  COUNT(*) as new_customers
FROM users
GROUP BY week
ORDER BY week DESC;

-- Customer Retention (Repeat Orders)
SELECT 
  CASE 
    WHEN order_count = 1 THEN 'One-time'
    WHEN order_count BETWEEN 2 AND 5 THEN 'Regular'
    WHEN order_count > 5 THEN 'Loyal'
  END as customer_type,
  COUNT(*) as customers
FROM (
  SELECT user_id, COUNT(*) as order_count
  FROM orders
  GROUP BY user_id
) subquery
GROUP BY customer_type;
```

### Create Dashboard in Metabase:
1. Click "New" → "Dashboard"
2. Add questions (queries above)
3. Arrange as cards
4. Set auto-refresh (every 5 minutes)
5. Share link with team

### Production Ready? ✅ YES
- Used by 50,000+ companies
- Self-hosted (your data stays private)
- No coding required after setup
- Free forever

---

## 3️⃣ PERFORMANCE TESTING - Locust (IMPORTANT)

### Why You Need This:
- Will your API handle 100 concurrent users?
- Will it handle Black Friday traffic?
- Which endpoint is the bottleneck?

### ⭐ Solution: Locust

**Installation:**
```bash
pip install locust
```

**Create test file:**
```python
# tests/load/locustfile.py
from locust import HttpUser, task, between
import random

class PrintShopUser(HttpUser):
    wait_time = between(1, 3)  # Wait 1-3 seconds between requests
    
    def on_start(self):
        """Login before starting tests"""
        response = self.client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "testpassword123"
        })
        if response.status_code == 200:
            self.token = response.json()["access_token"]
        else:
            self.token = None
    
    @task(5)  # 5x more likely than other tasks
    def browse_products(self):
        """Browse products (most common action)"""
        self.client.get(
            "/api/v1/products",
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task(3)
    def view_product_detail(self):
        """View specific product"""
        product_id = random.randint(1, 100)
        self.client.get(
            f"/api/v1/products/{product_id}",
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task(2)
    def calculate_price(self):
        """Calculate price for order"""
        self.client.post(
            "/api/v1/pricing/calculate",
            json={
                "product_id": random.randint(1, 10),
                "quantity": random.randint(100, 1000)
            },
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task(1)
    def create_order(self):
        """Create order (least common, most important)"""
        self.client.post(
            "/api/v1/orders",
            json={
                "items": [
                    {
                        "product_id": random.randint(1, 10),
                        "quantity": random.randint(100, 500)
                    }
                ]
            },
            headers={"Authorization": f"Bearer {self.token}"}
        )
    
    @task(2)
    def view_orders(self):
        """View user's orders"""
        self.client.get(
            "/api/v1/orders",
            headers={"Authorization": f"Bearer {self.token}"}
        )
```

**Run Load Test:**
```bash
# Test with 10 users
locust -f tests/load/locustfile.py --host=http://localhost:8000 --users 10 --spawn-rate 2

# Test with 100 users (production simulation)
locust -f tests/load/locustfile.py --host=http://localhost:8000 --users 100 --spawn-rate 10

# Headless mode (no UI, for CI/CD)
locust -f tests/load/locustfile.py --host=http://localhost:8000 \
  --users 100 --spawn-rate 10 --run-time 5m --headless
```

**Open Dashboard:**
```
http://localhost:8089
```

### What You'll See:
- Requests per second
- Response times (min, max, average, percentiles)
- Failure rate
- Which endpoints are slow

### Set Performance Goals:
```
✅ Good:
- 95% of requests < 500ms
- 99% of requests < 1000ms
- 0% failure rate

⚠️ Warning:
- 95% of requests < 1000ms
- 99% of requests < 2000ms
- < 1% failure rate

❌ Bad:
- 95% of requests > 1000ms
- Any failure rate > 1%
```

### Production Ready? ✅ YES
- Used by Spotify, Microsoft, etc.
- Free and open source
- Easy to integrate with CI/CD

---

## 4️⃣ WORKFLOW ORCHESTRATION - Prefect (OPTIONAL)

### Current Setup: Celery
**Pros:**
- Works fine for simple tasks
- You already have it

**Cons:**
- Hard to see what's running
- No automatic retry with backoff
- Can't visualize dependencies
- No easy pause/resume

### ⭐ Solution: Keep Celery + Add Prefect for Complex Workflows

**When to use what:**
```
Celery (keep for simple tasks):
- Send email
- Generate PDF
- Single background job

Prefect (add for complex workflows):
- Order fulfillment (10 steps)
- Batch processing
- Multi-step pipelines with dependencies
```

**Installation:**
```bash
pip install prefect
```

**Example: Order Fulfillment Workflow**
```python
# app/workflows/order_fulfillment.py
from prefect import flow, task
from datetime import timedelta
from app.services import order_service, payment_service, email_service

@task(retries=3, retry_delay_seconds=60)
async def validate_order(order_id: str) -> bool:
    """Validate order details"""
    order = await order_service.get_by_id(order_id)
    if not order:
        raise ValueError(f"Order {order_id} not found")
    return True

@task(retries=3, retry_delay_seconds=60)
async def charge_payment(order_id: str) -> str:
    """Charge customer payment"""
    payment = await payment_service.charge(order_id)
    return payment.id

@task(retries=5, retry_delay_seconds=120)
async def generate_invoice(order_id: str) -> str:
    """Generate PDF invoice"""
    from app.services.invoice_service import generate_invoice_pdf
    invoice_path = await generate_invoice_pdf(order_id)
    return invoice_path

@task(retries=3)
async def send_confirmation_email(order_id: str, invoice_path: str):
    """Send confirmation email"""
    await email_service.send_order_confirmation(order_id, invoice_path)

@task(retries=3)
async def update_inventory(order_id: str):
    """Update inventory levels"""
    await order_service.update_inventory(order_id)

@task
async def notify_production_team(order_id: str):
    """Notify production team"""
    from app.services.notification_service import notify_staff
    await notify_staff(order_id, "New order ready for production")

@flow(name="order-fulfillment", log_prints=True)
async def fulfill_order(order_id: str):
    """Complete order fulfillment workflow"""
    
    print(f"Starting fulfillment for order {order_id}")
    
    # Step 1: Validate
    await validate_order(order_id)
    print("✓ Order validated")
    
    # Step 2: Charge payment
    payment_id = await charge_payment(order_id)
    print(f"✓ Payment charged: {payment_id}")
    
    # Step 3: Update inventory
    await update_inventory(order_id)
    print("✓ Inventory updated")
    
    # Step 4: Generate invoice
    invoice_path = await generate_invoice(order_id)
    print(f"✓ Invoice generated: {invoice_path}")
    
    # Step 5 & 6: Send notifications (can run in parallel)
    await send_confirmation_email(order_id, invoice_path)
    await notify_production_team(order_id)
    print("✓ Notifications sent")
    
    return {
        "status": "completed",
        "payment_id": payment_id,
        "invoice_path": invoice_path
    }
```

**Use in your API:**
```python
# app/api/orders/router.py
from app.workflows.order_fulfillment import fulfill_order

@router.post("/{order_id}/fulfill")
async def fulfill_order_endpoint(
    order_id: str,
    current_user: User = Depends(require_admin)
):
    # Run workflow in background
    from prefect.deployments import run_deployment
    
    flow_run = await fulfill_order.serve(
        name="order-fulfillment",
        parameters={"order_id": order_id}
    )
    
    return {
        "message": "Order fulfillment started",
        "flow_run_id": flow_run.id
    }
```

**Start Prefect Server:**
```bash
# Terminal 1: Start Prefect server
prefect server start

# Terminal 2: Start Prefect worker
prefect worker start --pool default
```

**Dashboard:**
```
http://localhost:4200
```

### What You Get:
- See all running workflows
- Retry failed steps automatically
- Pause/resume workflows
- See execution history
- Better error messages

### Production Ready? ✅ YES
- Used by Netflix, Spotify, etc.
- Self-hosted (free forever)
- Better than Airflow for web apps

---

## 📋 IMPLEMENTATION CHECKLIST

### Week 1: Monitoring (CRITICAL)
- [ ] Install SigNoz
- [ ] Add OpenTelemetry to FastAPI
- [ ] Verify traces in dashboard
- [ ] Set up alerts (response time, errors)
- [ ] Train team on dashboard

### Week 1: Business Intelligence
- [ ] Install Metabase
- [ ] Connect to database
- [ ] Create revenue dashboard
- [ ] Create operations dashboard
- [ ] Share with team

### Week 2: Performance Testing
- [ ] Install Locust
- [ ] Create load test scenarios
- [ ] Run baseline test
- [ ] Document performance goals
- [ ] Add to CI/CD pipeline

### Week 3: Workflow Orchestration (Optional)
- [ ] Install Prefect
- [ ] Migrate one complex workflow
- [ ] Monitor in Prefect dashboard
- [ ] Decide: migrate more or keep Celery

---

## 💰 COST ANALYSIS

### Current Setup:
- Server: $100/month
- **Total: $100/month ($1,200/year)**

### With Recommended Tools:
- Server: $125/month (+$25 for extra resources)
- SigNoz: $0 (self-hosted)
- Metabase: $0 (self-hosted)
- Locust: $0 (self-hosted)
- Prefect: $0 (self-hosted)
- **Total: $125/month ($1,500/year)**

**Extra cost: $300/year**

### Value if You Paid for Commercial Alternatives:
- DataDog (monitoring): $5,000/year
- Tableau (BI): $8,400/year
- LoadImpact (testing): $2,400/year
- **Total: $15,800/year**

**You save: $14,300/year** 💰

---

## 🚀 QUICK START (30 Minutes)

### Step 1: Install SigNoz (10 min)
```bash
cd ~/
git clone https://github.com/SigNoz/signoz.git
cd signoz/deploy/docker/clickhouse-setup
docker compose up -d
```

### Step 2: Install Metabase (5 min)
```bash
# Add to your docker-compose.yml (see above)
docker compose up -d metabase
```

### Step 3: Install Locust (5 min)
```bash
pip install locust
# Create locustfile.py (see above)
```

### Step 4: Add OpenTelemetry (10 min)
```bash
pip install opentelemetry-distro opentelemetry-exporter-otlp \
  opentelemetry-instrumentation-fastapi \
  opentelemetry-instrumentation-sqlalchemy

# Add code to app/main.py (see above)
```

### Step 5: Restart Everything
```bash
docker compose down
docker compose up -d
```

### Step 6: Open Dashboards
- SigNoz: http://localhost:3301
- Metabase: http://localhost:3000
- Locust: http://localhost:8089 (after running locust command)

---

## ✅ FINAL RECOMMENDATION

**For Production (No AI), Use:**

1. **SigNoz** - Monitoring (MUST HAVE) ⭐⭐⭐⭐⭐
2. **Metabase** - Business Intelligence (HIGH VALUE) ⭐⭐⭐⭐
3. **Locust** - Performance Testing (IMPORTANT) ⭐⭐⭐
4. **Prefect** - Workflows (OPTIONAL) ⭐⭐

**Total Setup Time:** 1 week
**Total Cost:** $300/year extra
**Value:** $14,300/year (vs commercial alternatives)

---

## 📞 SUPPORT

### Documentation:
- [SigNoz Docs](https://signoz.io/docs/)
- [Metabase Docs](https://www.metabase.com/docs/)
- [Locust Docs](https://docs.locust.io/)
- [Prefect Docs](https://docs.prefect.io/)

### Community:
- SigNoz Slack: https://signoz.io/slack
- Metabase Forum: https://discourse.metabase.com/
- Locust Slack: https://locust.io/slack

---

**Start with SigNoz today. You can't improve what you can't measure.**

```bash
cd ~/
git clone https://github.com/SigNoz/signoz.git
cd signoz/deploy/docker/clickhouse-setup
docker compose up -d
```

Then open http://localhost:3301 and see your first traces!

Need help? I can write the exact code for your project.
