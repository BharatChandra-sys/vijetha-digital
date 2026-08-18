<div align="center">
  <img src="frontend/public/vd-logo.jpeg" alt="Vijetha Digital" width="140" />
  <h1>Vijetha Digital</h1>
  <p><strong>Production-Grade E-Commerce Platform for Digital Printing Services</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Redis-7-DC382D?style=flat-square&logo=redis&logoColor=white" alt="Redis" />
    <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
    <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" alt="License" />
  </p>

  <p>
    <a href="#overview">Overview</a> &nbsp;|&nbsp;
    <a href="#architecture">Architecture</a> &nbsp;|&nbsp;
    <a href="#tech-stack">Tech Stack</a> &nbsp;|&nbsp;
    <a href="#local-development">Quick Start</a> &nbsp;|&nbsp;
    <a href="#deployment">Deployment</a> &nbsp;|&nbsp;
    <a href="#api-reference">API Reference</a>
  </p>
</div>

---

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Testing](#testing)
- [Monitoring and Observability](#monitoring-and-observability)
- [Security Model](#security-model)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Vijetha Digital is a full-stack commerce platform built for digital printing businesses. It replaces fragmented manual workflows — WhatsApp orders, phone-based pricing, spreadsheet tracking — with a structured, auditable system that scales.
static is live with seo https://vijethadigital.com/

### Core Capabilities

**Order Management**
Complete order lifecycle tracking: Placed, Confirmed, Printing, Quality Check, Shipped, Delivered. Every status transition is timestamped and logged with the acting user. PDF invoices generated on demand.

**Dynamic Pricing Engine**
Calculates final order price accounting for base price, quantity breaks, business-tier discounts, coupons, GST, and configurable shipping rules. All calculations are deterministic and server-side.

**Payment Processing**
Integrated Razorpay gateway with webhook-based payment verification. All webhook payloads are HMAC-SHA256 verified before processing. Payment state machine prevents double-capture and double-refund.

**Identity and Access**
JWT authentication with access/refresh token rotation. Token blacklist backed by Redis. Role-based access control across three roles: Customer, Business, Admin. Google OAuth supported as an alternative login path.

**Async Notifications**
Transactional email via Brevo HTTP API. Background task processing via Celery so email delivery never blocks a request. Templates cover welcome, order confirmation, shipping update, payment receipt, and password reset.

**Administration**
Full admin dashboard with user management, product moderation, order oversight, coupon management, and business metrics with revenue reporting.

---

## System Architecture

```
+------------------------------------------------------------------+
|                         CLIENT LAYER                             |
|  Browser (React / Next.js)    Mobile Browser    Third-party API  |
+----------------------------+------------------------------------+-+
                             |
             +---------------v---------------+
             |         Nginx (SSL/TLS)        |
             |   Rate Limiting  |  Caching    |
             |   Static Assets  |  Proxying   |
             +---------------+---------------+
                             |
         +-------------------+-------------------+
         |                   |                   |
+--------v-------+  +--------v-------+  +--------v-------+
| FastAPI Worker |  | FastAPI Worker |  | FastAPI Worker |
| Gunicorn/Uvicorn  | Gunicorn/Uvicorn  | Gunicorn/Uvicorn  |
+--------+-------+  +--------+-------+  +--------+-------+
         |                   |                   |
         +-------------------+-------------------+
                    |                   |
       +------------v---------+ +-------v---------+
       |    PostgreSQL 15      | |    Redis 7       |
       |    Primary Database   | |  Token Blacklist |
       |    Alembic Migrations | |  Session Cache   |
       +----------------------+ |  Celery Broker   |
                                +---------+--------+
                                          |
                         +----------------v---------------+
                         |         Celery Workers         |
                         |  Email Tasks | Notifications  |
                         |  Background Jobs | Exports    |
                         +----------------+---------------+
                                          |
                   +-----------------------+-----------------------+
                   |                       |                       |
         +---------v--------+  +----------v--------+  +----------v---------+
         |  Brevo HTTP API  |  |  Razorpay Gateway |  | Cloudinary / S3    |
         |  Transactional   |  |  Payments         |  | Media Storage      |
         |  Email Delivery  |  |  Webhooks         |  | Image CDN          |
         +------------------+  +-------------------+  +--------------------+
```

### Request Lifecycle

```
1.  Incoming HTTPS request
     -> Nginx: SSL termination, rate limit check, static file short-circuit

2.  FastAPI middleware chain
     -> CORS validation
     -> Request ID injection (UUID, propagated through all log lines)
     -> Security header attachment (HSTS, CSP, X-Frame-Options, etc.)
     -> Structured access log emission

3.  Route handler
     -> JWT validation (signature, expiry, algorithm)
     -> Token blacklist check against Redis
     -> Role/permission assertion
     -> Request body validation via Pydantic v2

4.  Service layer
     -> Business logic execution
     -> External API calls (Razorpay, Brevo, Cloudinary)
     -> Celery task dispatch for async work

5.  Repository layer
     -> SQLAlchemy ORM queries (parameterised, no raw SQL)
     -> PostgreSQL read/write

6.  Response
     -> Standardised JSON envelope
     -> HTTP status code aligned to RFC 9110
```

---

## Tech Stack

### Backend

| Component        | Technology                              | Version    |
|------------------|-----------------------------------------|------------|
| Language         | Python                                  | 3.11+      |
| Framework        | FastAPI                                 | 0.109.0    |
| ASGI Server      | Gunicorn + Uvicorn workers              | latest     |
| Database         | PostgreSQL + SQLAlchemy ORM             | 15, 2.0    |
| Cache / Broker   | Redis                                   | 7          |
| Migrations       | Alembic                                 | latest     |
| Auth             | python-jose (JWT) + bcrypt              | latest     |
| Validation       | Pydantic                                | v2         |
| Task Queue       | Celery                                  | latest     |
| Email            | Brevo HTTP API                          | v3         |
| Payments         | Razorpay Python SDK                     | latest     |
| Media Storage    | Cloudinary / AWS S3                     | —          |
| Monitoring       | Prometheus client, Sentry SDK           | latest     |
| Logging          | Loguru (JSON structured output)         | latest     |
| Linting          | Ruff                                    | 0.15.x     |
| Testing          | Pytest + pytest-asyncio                 | latest     |

### Frontend — React (Current Production)

| Component  | Technology                | Version    |
|------------|---------------------------|------------|
| Framework  | React + Vite              | 19.2, 7.2  |
| Routing    | React Router DOM          | 7.13.0     |
| Styling    | Tailwind CSS              | 3.4.17     |
| HTTP       | Axios                     | 1.13.4     |
| OAuth      | @react-oauth/google       | 0.13.4     |

### Frontend — Next.js (In Development)

| Component  | Technology                | Version    |
|------------|---------------------------|------------|
| Framework  | Next.js (App Router)      | 15         |
| Language   | TypeScript                | 5          |
| Styling    | Tailwind CSS              | 4          |

### Infrastructure

| Component         | Technology                        |
|-------------------|-----------------------------------|
| Containerisation  | Docker + Docker Compose           |
| Reverse Proxy     | Nginx                             |
| CI/CD             | GitHub Actions                    |
| PaaS (Staging)    | Render (backend), Vercel (frontend)|
| IaC               | render.yaml                       |

---

## Project Structure

```
vijetha-digital-backend/
│
├── app/                              # Backend application
│   ├── api/                          # HTTP route handlers
│   │   ├── admin/                    # Admin-scoped endpoints
│   │   ├── auth/                     # Registration, login, OAuth, tokens
│   │   ├── orders/                   # Order CRUD and lifecycle transitions
│   │   ├── payments/                 # Razorpay integration and webhooks
│   │   └── products/                 # Product catalogue
│   │
│   ├── core/
│   │   ├── config.py                 # Pydantic BaseSettings — all config here
│   │   ├── dependencies.py           # FastAPI dependency injection
│   │   ├── exceptions.py             # Typed exception hierarchy
│   │   └── security.py               # JWT encode/decode, password hashing
│   │
│   ├── db/
│   │   ├── session.py                # Engine, sessionmaker, get_db dependency
│   │   └── init_db.py                # First-run database bootstrap
│   │
│   ├── middleware/                   # CORS, logging, security headers
│   ├── models/                       # SQLAlchemy declarative models
│   ├── schemas/                      # Pydantic v2 request/response schemas
│   │
│   ├── services/                     # Business logic — no ORM queries here
│   │   ├── brevo_email_service.py    # Email delivery via Brevo HTTP API
│   │   ├── business_service.py       # Business account logic
│   │   ├── payment_service.py        # Razorpay payment orchestration
│   │   └── ...
│   │
│   ├── tasks/                        # Celery async task definitions
│   └── main.py                       # FastAPI app factory and startup
│
├── alembic/                          # Alembic migration environment
│   └── versions/                     # Timestamped migration scripts
│
├── frontend/                         # React (Vite) — production frontend
│   ├── public/
│   │   ├── vd-logo.jpeg              # Brand logo
│   │   └── products/                 # Product images
│   └── src/
│       ├── api/                      # Axios API client modules
│       ├── components/               # Shared UI components
│       ├── layouts/                  # Page layout wrappers
│       ├── pages/                    # Route-level page components
│       └── styles/                   # Global and component CSS
│
├── frontend1/                        # Next.js — in-development frontend
│   ├── app/                          # App Router pages and layouts
│   ├── components/                   # Server and client components
│   └── public/                       # Static assets
│
├── nginx/                            # Nginx server configuration
├── scripts/                          # Operational and maintenance scripts
│   ├── seed_products.py              # Initial product catalogue seed
│   ├── deploy.sh                     # Zero-downtime production deploy
│   └── rollback.sh                   # Deployment rollback
│
├── tests/
│   ├── unit/                         # Isolated unit tests
│   └── integration/                  # API-level integration tests
│
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, type-check on every PR
│       └── deploy.yml                # Deploy to Render on merge to main
│
├── Dockerfile
├── docker-compose.yml                # Local development stack
├── docker-compose.prod.yml           # Production stack
├── render.yaml                       # Render deployment manifest
├── alembic.ini
├── pyproject.toml
├── requirements.txt                  # Unpinned (for flexibility)
├── requirements-pinned.txt           # Pinned (for reproducibility)
└── .env.example                      # Full environment variable reference
```

---

## Prerequisites

| Requirement        | Minimum Version |
|--------------------|-----------------|
| Python             | 3.11            |
| Node.js            | 18              |
| PostgreSQL         | 15              |
| Redis              | 7               |
| Docker             | 24 (optional)   |
| Docker Compose     | 2.x (optional)  |

---

## Local Development

### 1. Clone

```bash
git clone https://github.com/BharatChandra-sys/vijetha-digital-backend.git
cd vijetha-digital-backend
```

### 2. Backend

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate          # macOS / Linux
venv\Scripts\activate             # Windows

# Install pinned dependencies
pip install -r requirements-pinned.txt

# Configure environment
cp .env.example .env
# Open .env and fill in DATABASE_URL, REDIS_URL, JWT_SECRET_KEY,
# BREVO_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

# Apply database schema
alembic upgrade head

# Seed product catalogue (optional)
python scripts/seed_products.py

# Start API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

| Endpoint            | URL                            |
|---------------------|-------------------------------|
| API Base            | http://localhost:8000          |
| Interactive Docs    | http://localhost:8000/docs     |
| ReDoc               | http://localhost:8000/redoc    |
| Health              | http://localhost:8000/health   |

### 3. React Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Available at: http://localhost:5173

### 4. Next.js Frontend

```bash
cd frontend1
npm install
npm run dev
```

Available at: http://localhost:3000

### Default Admin Credentials

```
Email:     admin@vijetha.com
Password:  admin123
```

Change the admin password immediately after the first login.

---

## Environment Variables

### Backend (`.env`)

```bash
# ── Application ──────────────────────────────────────────────────
ENV=development
APP_NAME=Vijetha Digital Backend
SECRET_KEY=<64-character-random-string>

# ── Database ─────────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@localhost:5432/vijetha_db

# ── Redis ────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379/0

# ── JWT ──────────────────────────────────────────────────────────
JWT_SECRET_KEY=<64-character-random-string>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# ── Admin Bootstrap ───────────────────────────────────────────────
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>

# ── Email — Brevo HTTP API ────────────────────────────────────────
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=Vijetha Digital

# ── Media Storage — Cloudinary ────────────────────────────────────
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ── Payments — Razorpay ───────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# ── Google OAuth (optional) ───────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ── CORS ─────────────────────────────────────────────────────────
FRONTEND_URL=http://localhost:5173

# ── Monitoring ───────────────────────────────────────────────────
SENTRY_DSN=
```

See `.env.example` for the complete annotated reference including all optional variables.

### Frontend (`.env`)

```bash
VITE_API_BASE_URL=http://localhost:8000
VITE_WHATSAPP_NUMBER=919876543210
VITE_RAZORPAY_KEY_ID=rzp_live_...
VITE_GOOGLE_CLIENT_ID=
```

---

## Database Migrations

```bash
# Apply all pending migrations to the latest revision
alembic upgrade head

# Generate a new migration after model changes
alembic revision --autogenerate -m "describe_the_change"

# View current applied revision
alembic current

# View full migration history
alembic history --verbose

# Downgrade one revision (use with caution in production)
alembic downgrade -1
```

Migration files live in `alembic/versions/`. Every migration must be reviewed before applying to a production database.

---

## API Reference

### Base URLs

```
Development:  http://localhost:8000
Production:   https://vijetha-digital.onrender.com
```

### Authentication Header

```
Authorization: Bearer <access_token>
```

### Endpoints

#### Authentication

| Method | Path                    | Description                         | Auth     |
|--------|-------------------------|-------------------------------------|----------|
| POST   | /auth/register          | Register a new user account         | Public   |
| POST   | /auth/login             | Authenticate and receive tokens     | Public   |
| POST   | /auth/refresh           | Rotate access token                 | Public   |
| POST   | /auth/logout            | Invalidate current session          | Required |
| POST   | /auth/forgot-password   | Initiate password reset             | Public   |
| POST   | /auth/reset-password    | Complete password reset             | Public   |

#### Products

| Method | Path             | Description                   | Auth     |
|--------|------------------|-------------------------------|----------|
| GET    | /products        | List products (paginated)     | Public   |
| GET    | /products/{id}   | Retrieve single product       | Public   |
| POST   | /products        | Create product                | Admin    |
| PUT    | /products/{id}   | Update product                | Admin    |
| DELETE | /products/{id}   | Delete product                | Admin    |

#### Orders

| Method | Path                     | Description                   | Auth     |
|--------|--------------------------|-------------------------------|----------|
| GET    | /orders                  | List current user's orders    | Required |
| GET    | /orders/{id}             | Retrieve order details        | Required |
| POST   | /orders                  | Create a new order            | Required |
| PUT    | /orders/{id}/status      | Update order status           | Admin    |
| GET    | /orders/{id}/invoice     | Download PDF invoice          | Required |

#### Payments

| Method | Path                  | Description                      | Auth     |
|--------|-----------------------|----------------------------------|----------|
| POST   | /payments/create      | Initiate a Razorpay payment      | Required |
| POST   | /payments/verify      | Verify payment signature         | Required |
| POST   | /payments/webhook     | Razorpay event webhook receiver  | HMAC     |

#### Admin

| Method | Path                        | Description              | Auth  |
|--------|-----------------------------|--------------------------|-------|
| GET    | /api/v1/admin/users         | List all users           | Admin |
| GET    | /api/v1/admin/orders        | List all orders          | Admin |
| GET    | /api/v1/admin/metrics       | Business metrics summary | Admin |

### Response Envelope

All responses follow a consistent structure:

```json
// Success
{
  "status": "success",
  "data": { },
  "message": "Operation completed"
}

// Error
{
  "error": "Validation error",
  "detail": "Field 'email' is required",
  "status_code": 422
}
```

---

## Deployment

### Render + Vercel (Recommended for Staging / Free Tier)

**Backend on Render**

1. Push to the `main` branch on GitHub.
2. Create a PostgreSQL database on Render (free tier available).
3. Create a Web Service from the repository root. Render reads `render.yaml` automatically.
4. Add all required environment variables from `.env.example` to the Render service.
5. Render runs `alembic upgrade head` as a pre-deploy job, then starts Gunicorn.

**Frontend on Vercel**

1. Import the repository in Vercel.
2. Set the root directory to `frontend`.
3. Add `VITE_API_BASE_URL` pointing to your Render service URL.
4. Deploy. Vercel runs `npm run build` automatically.

Estimated setup time: 20 minutes. Cost: $0/month on free tiers.

### Docker (Production)

```bash
# Start all services (API, Postgres, Redis, Nginx, Celery)
docker-compose -f docker-compose.prod.yml up -d

# Tail logs
docker-compose -f docker-compose.prod.yml logs -f api

# Run migrations against the running container
docker-compose -f docker-compose.prod.yml exec api alembic upgrade head

# Graceful shutdown
docker-compose -f docker-compose.prod.yml down

# Deploy with automated rollback support
./scripts/deploy.sh

# Roll back to previous release if needed
./scripts/rollback.sh
```

Refer to `COMPLETE_DEPLOYMENT_MANUAL.md` for full server provisioning, SSL certificate setup, and post-deploy verification steps.

---

## Testing

```bash
# Run full test suite
pytest tests/ -v

# Run with HTML coverage report
pytest tests/ --cov=app --cov-report=html
open htmlcov/index.html

# Run unit tests only
pytest tests/unit/ -v

# Run integration tests only
pytest tests/integration/ -v

# Test Brevo email connectivity
python test_email_service.py
```

### Manual Smoke Tests

```bash
# Health check
curl https://your-api.onrender.com/health

# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "Test123!@#"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test123!@#"}'
```

---

## Monitoring and Observability

### Health Check

```
GET /health
```

```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "ok",
  "timestamp": "2026-08-01T00:00:00Z"
}
```

### Prometheus Metrics

```
GET /metrics
```

Exposes: request counts, latency histograms (p50/p95/p99), error rates by endpoint, database connection pool utilisation, Celery queue depths, and custom business metrics (orders per minute, payment success rate).

Recommended scrape interval: 15 seconds.

### Structured Logging

Every log line is JSON with the following guaranteed fields:

| Field          | Description                                    |
|----------------|------------------------------------------------|
| `timestamp`    | ISO 8601 UTC                                   |
| `level`        | DEBUG, INFO, WARNING, ERROR, CRITICAL          |
| `request_id`   | UUID injected at middleware, spans full request|
| `method`       | HTTP verb                                      |
| `path`         | Request path                                   |
| `status_code`  | HTTP response code                             |
| `duration_ms`  | Request processing time                        |
| `user_id`      | Present on authenticated requests              |

Logs are written to stdout for capture by Docker, systemd, or a log aggregation agent (Datadog, Loki, CloudWatch).

### Error Tracking

Sentry is configured via `SENTRY_DSN`. All unhandled exceptions, 5xx responses, and Celery task failures are captured automatically with full stack traces and request context.

---

## Security Model

| Control                      | Implementation                                               |
|------------------------------|--------------------------------------------------------------|
| Transport security           | TLS 1.2+ enforced at Nginx, HSTS header set                  |
| Authentication               | JWT HS256, 30-minute access tokens, 7-day refresh tokens     |
| Token revocation             | Redis-backed blacklist, checked on every authenticated request |
| Password storage             | bcrypt with work factor 12                                   |
| Account lockout              | Consecutive failed login tracking, configurable threshold    |
| Role enforcement             | RBAC checked in FastAPI dependencies before handler executes |
| SQL injection                | SQLAlchemy parameterised queries exclusively, no raw SQL      |
| Webhook integrity            | Razorpay payloads verified with HMAC-SHA256 before processing|
| File upload safety           | MIME type validation and size limits enforced server-side     |
| CORS                         | Explicit allow-list, no wildcard origins in production        |
| Security headers             | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy|
| Rate limiting                | Per-endpoint limits in FastAPI, global limits at Nginx        |
| Secrets management           | All secrets via environment variables, never committed        |
| Dependency pinning           | `requirements-pinned.txt` used for all production deployments|

---

## Contributing

1. Fork the repository.

2. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Follow code style conventions:
   - Python: PEP 8, enforced by Ruff (`ruff check .`)
   - TypeScript / JavaScript: ESLint

4. Write tests covering any new or changed behaviour. The CI pipeline enforces test passage.

5. Verify locally before opening a pull request:
   ```bash
   ruff check .
   pytest tests/ -v
   ```

6. Open a pull request against `main` with a clear title and description. Link any relevant issue.

Pull request titles must follow Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

---

## Documentation Index

| Document                        | Purpose                                          |
|---------------------------------|--------------------------------------------------|
| `README.md`                     | This file — project overview and quick reference |
| `COMPLETE_DEPLOYMENT_MANUAL.md` | Step-by-step production server setup             |
| `DEPLOYMENT_GUIDE.md`           | Concise deployment reference                     |
| `BREVO_OAUTH_SETUP_GUIDE.md`    | Email service and Google OAuth configuration     |
| `SECURITY_REMINDER.md`          | Pre-deployment security checklist                |
| `DEPLOYMENT_STATUS.md`          | Current live environment status                  |

---

## License

Proprietary software. All rights reserved.

Copyright 2026 Vijetha Digital. Unauthorised copying, distribution, modification, or use of this software, in whole or in part, without prior written permission is strictly prohibited.
