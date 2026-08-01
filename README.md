# Vijetha Digital

A production-grade e-commerce platform for digital printing services, built on FastAPI and React. The system handles the full order lifecycle from product browsing through payment processing, with role-based access for customers, business accounts, and administrators.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
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
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Vijetha Digital replaces manual order workflows (WhatsApp messages, phone calls, spreadsheets) with a structured digital platform. Core capabilities:

- Full order lifecycle management: Placed, Confirmed, Printing, Quality Check, Shipped, Delivered
- Dynamic pricing engine with GST, quantity breaks, and business-tier discounts
- Coupon and promotion system
- Integrated Razorpay payment gateway with webhook processing
- JWT authentication with refresh token rotation and Redis-backed token blacklist
- Role-based access control: Customer, Business, Admin
- Transactional email via Brevo HTTP API
- Asynchronous task processing via Celery
- Admin dashboard with metrics, user management, and order oversight
- Containerised for consistent deployment across environments

---

## Architecture

```
                          +-------------------------+
                          |      Client Layer        |
                          |  Browser / Mobile / App  |
                          +------------+------------+
                                       |
                          +------------v------------+
                          |     Nginx (SSL/TLS)      |
                          |  Rate Limiting, Caching  |
                          +------------+------------+
                                       |
               +-----------------------+-----------------------+
               |                       |                       |
    +----------v----------+ +----------v----------+ +----------v----------+
    |   FastAPI Worker 1  | |   FastAPI Worker 2  | |   FastAPI Worker N  |
    |  Gunicorn/Uvicorn   | |  Gunicorn/Uvicorn   | |  Gunicorn/Uvicorn   |
    +----------+----------+ +----------+----------+ +----------+----------+
               |                       |                       |
               +-----------+-----------+-----------+-----------+
                           |                       |
              +------------v-----------+ +---------v-----------+
              |    PostgreSQL 15        | |      Redis 7         |
              |    Primary Database     | |   Cache / Sessions   |
              |    Alembic Migrations   | |   Celery Broker      |
              +------------------------+ +---------------------+
                                                  |
                           +-----------------------+
                           |
              +------------v-----------+       +------------------------+
              |    Celery Workers       |       |    External Services    |
              |  Email / Notifications  +-----> |  Brevo (Email)         |
              |  Background Tasks       |       |  Razorpay (Payments)   |
              +------------------------+       |  Cloudinary (Storage)  |
                                               +------------------------+
```

### Request Flow

```
Request
  -> Nginx: SSL termination, rate limiting, static file serving
  -> FastAPI middleware: CORS, security headers, request ID injection, logging
  -> Authentication: JWT validation, token blacklist check
  -> Authorization: Role and permission check
  -> Service layer: Business logic, external API calls
  -> Repository layer: SQLAlchemy ORM queries
  -> PostgreSQL
  <- JSON response with standardised envelope
```

---

## Tech Stack

### Backend

| Component       | Technology                          |
|-----------------|-------------------------------------|
| Framework       | FastAPI 0.109.0 (Python 3.11+)      |
| Database        | PostgreSQL 15, SQLAlchemy 2.0       |
| Cache / Broker  | Redis 7                             |
| Migrations      | Alembic                             |
| Auth            | python-jose (JWT), bcrypt           |
| Validation      | Pydantic v2                         |
| Task Queue      | Celery                              |
| Email           | Brevo HTTP API                      |
| Payments        | Razorpay                            |
| Storage         | Cloudinary / AWS S3                 |
| Server          | Gunicorn + Uvicorn workers          |
| Linting         | Ruff                                |
| Testing         | Pytest, pytest-asyncio              |

### Frontend (Legacy — React)

| Component  | Technology                          |
|------------|-------------------------------------|
| Framework  | React 19.2.0 (Vite 7.2.4)          |
| Routing    | React Router DOM 7.13.0             |
| Styling    | Tailwind CSS 3.4.17                 |
| HTTP       | Axios 1.13.4                        |
| OAuth      | @react-oauth/google 0.13.4          |

### Frontend (New — Next.js)

| Component  | Technology                          |
|------------|-------------------------------------|
| Framework  | Next.js 15 (App Router)             |
| Styling    | Tailwind CSS                        |
| Language   | TypeScript                          |

### Infrastructure

| Component        | Technology               |
|------------------|--------------------------|
| Containerisation | Docker, Docker Compose   |
| Reverse Proxy    | Nginx                    |
| CI/CD            | GitHub Actions           |
| Monitoring       | Prometheus, Sentry       |
| Logging          | Loguru, JSON structured  |

---

## Project Structure

```
vijetha-digital-backend/
├── app/                          # Backend application root
│   ├── api/                      # Route handlers
│   │   ├── admin/                # Admin-only endpoints
│   │   ├── auth/                 # Registration, login, token refresh
│   │   ├── orders/               # Order CRUD and lifecycle
│   │   ├── payments/             # Razorpay integration and webhooks
│   │   └── products/             # Product catalog
│   ├── core/
│   │   ├── config.py             # Settings via Pydantic BaseSettings
│   │   ├── dependencies.py       # Dependency injection
│   │   ├── exceptions.py         # Custom exception types
│   │   └── security.py           # JWT utilities, password hashing
│   ├── db/
│   │   ├── session.py            # SQLAlchemy engine and session factory
│   │   └── init_db.py            # Database initialisation
│   ├── middleware/               # CORS, logging, security headers
│   ├── models/                   # SQLAlchemy ORM models
│   ├── schemas/                  # Pydantic request/response schemas
│   ├── services/                 # Business logic layer
│   │   ├── brevo_email_service.py
│   │   ├── business_service.py
│   │   └── payment_service.py
│   ├── tasks/                    # Celery async tasks
│   └── main.py                   # Application entry point
├── alembic/                      # Database migration scripts
│   └── versions/
├── frontend/                     # React (Vite) frontend
│   └── src/
├── frontend1/                    # Next.js frontend (in development)
│   ├── app/
│   ├── components/
│   └── public/
├── nginx/                        # Nginx configuration
├── scripts/                      # Operational scripts
│   ├── seed_products.py
│   ├── deploy.sh
│   └── rollback.sh
├── tests/                        # Test suite
│   ├── unit/
│   └── integration/
├── .github/workflows/            # CI/CD pipeline definitions
│   ├── ci.yml
│   └── deploy.yml
├── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── render.yaml                   # Render.com deployment manifest
├── alembic.ini
├── pyproject.toml
├── requirements.txt
├── requirements-pinned.txt       # Pinned dependencies for reproducibility
└── .env.example                  # Environment variable template
```

---

## Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- PostgreSQL 15 or higher
- Redis 7 or higher
- Docker and Docker Compose (for containerised deployment)

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/vijetha-digital-backend.git
cd vijetha-digital-backend
```

### 2. Backend setup

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# Install pinned dependencies
pip install -r requirements-pinned.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your database, Redis, and third-party credentials

# Apply database migrations
alembic upgrade head

# Seed initial product data (optional)
python scripts/seed_products.py

# Start the development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend available at: `http://localhost:8000`
Interactive API docs: `http://localhost:8000/docs`

### 3. Frontend setup (React)

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

Frontend available at: `http://localhost:5173`

### 4. Frontend setup (Next.js)

```bash
cd frontend1
npm install
npm run dev
```

Frontend available at: `http://localhost:3000`

### 5. Default admin credentials

```
Email:    admin@vijetha.com
Password: admin123
```

Change the admin password immediately after first login.

---

## Environment Variables

### Backend (`.env`)

```bash
# Application
ENV=development
APP_NAME=Vijetha Digital Backend
SECRET_KEY=<64-character-random-string>

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/vijetha_db

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=<64-character-random-string>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin bootstrap
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>

# Brevo (transactional email)
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=Vijetha Digital

# Cloudinary (media storage)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay (payments)
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Google OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# CORS
FRONTEND_URL=http://localhost:5173
```

See `.env.example` for the complete list including optional variables.

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
# Apply all pending migrations
alembic upgrade head

# Create a new migration after model changes
alembic revision --autogenerate -m "description_of_change"

# Downgrade one revision
alembic downgrade -1

# View current revision
alembic current

# View migration history
alembic history
```

---

## API Reference

### Base URLs

```
Development:  http://localhost:8000
Production:   https://your-domain.com
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Endpoints

#### Auth

```
POST  /auth/register           Register a new user account
POST  /auth/login              Authenticate and receive tokens
POST  /auth/refresh            Rotate access token using refresh token
POST  /auth/logout             Invalidate current session
POST  /auth/forgot-password    Initiate password reset flow
POST  /auth/reset-password     Complete password reset
```

#### Products

```
GET    /products               List products with pagination and filters
GET    /products/{id}          Retrieve a single product
POST   /products               Create a product (Admin)
PUT    /products/{id}          Update a product (Admin)
DELETE /products/{id}          Delete a product (Admin)
```

#### Orders

```
GET   /orders                  List authenticated user's orders
GET   /orders/{id}             Retrieve order details
POST  /orders                  Create a new order
PUT   /orders/{id}/status      Update order status (Admin)
GET   /orders/{id}/invoice     Download PDF invoice
```

#### Payments

```
POST  /payments/create         Initiate a Razorpay payment
POST  /payments/verify         Verify payment signature
POST  /payments/webhook        Razorpay webhook receiver
```

#### Admin

```
GET   /api/v1/admin/users      List all users
GET   /api/v1/admin/orders     List all orders with filters
GET   /api/v1/admin/metrics    Business metrics summary
```

### Response Envelope

Success:

```json
{
  "status": "success",
  "data": {},
  "message": "Operation completed"
}
```

Error:

```json
{
  "error": "Validation error",
  "detail": "Field 'email' is required",
  "status_code": 422
}
```

---

## Deployment

### Render + Vercel (Recommended for Staging)

**Backend on Render:**

1. Push to GitHub
2. Create a PostgreSQL database on Render
3. Create a Web Service pointing to this repository
4. Set all required environment variables from `.env.example`
5. Render will run `uvicorn app.main:app` automatically via `render.yaml`

**Frontend on Vercel:**

1. Import repository in Vercel
2. Set root directory to `frontend`
3. Add `VITE_API_BASE_URL` pointing to your Render service URL
4. Deploy

### Docker (Production)

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f api

# Stop all services
docker-compose -f docker-compose.prod.yml down

# Deploy with rollback capability
./scripts/deploy.sh
./scripts/rollback.sh   # if issues arise
```

Refer to `COMPLETE_DEPLOYMENT_MANUAL.md` for detailed server provisioning steps.

---

## Testing

```bash
# Run full test suite
pytest tests/ -v

# Run with coverage report
pytest tests/ --cov=app --cov-report=html

# Run only unit tests
pytest tests/unit/ -v

# Run only integration tests
pytest tests/integration/ -v

# Test email service connectivity
python test_email_service.py
```

### Manual smoke test

```bash
# Health check
curl http://localhost:8000/health

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

### Health check

```bash
curl https://your-api.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "ok",
  "timestamp": "2026-08-01T00:00:00Z"
}
```

### Prometheus metrics

```
GET /metrics
```

Exposes request counts, latency histograms, error rates, and custom business metrics. Scrape interval: 15 seconds.

### Structured logging

All requests emit JSON log lines including:

- `request_id` (injected by middleware, propagated to all log statements in the request context)
- `method`, `path`, `status_code`, `duration_ms`
- `user_id` (when authenticated)
- `level`, `timestamp`

Log output goes to stdout for collection by the container orchestrator or a log aggregation service.

### Error tracking

Sentry DSN is configured via `SENTRY_DSN` environment variable. All unhandled exceptions and 5xx responses are captured automatically.

---

## Security

- All secrets are loaded from environment variables. No credentials are committed to the repository.
- JWT access tokens expire in 30 minutes. Refresh tokens expire in 7 days. Invalidated tokens are stored in Redis.
- Passwords are hashed using bcrypt with a work factor of 12.
- Failed login attempts are tracked. Accounts are locked after repeated failures.
- Rate limiting is applied at the Nginx layer and per-endpoint in FastAPI.
- CORS origins are explicitly configured. Wildcard origins are not permitted in production.
- Security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options) are set by middleware.
- Razorpay webhook payloads are verified using HMAC-SHA256 signature validation before processing.
- SQL injection is prevented by using SQLAlchemy parameterised queries exclusively.
- File uploads are validated by MIME type and size before storage.

---

## Contributing

1. Fork the repository and create a feature branch from `main`:

```bash
git checkout -b feature/your-feature-name
```

2. Make changes following the code style conventions:
   - Python: PEP 8, enforced by Ruff
   - TypeScript/JavaScript: ESLint

3. Write or update tests for any changed behaviour.

4. Verify the test suite passes locally before opening a pull request.

5. Open a pull request against `main` with a clear description of the change and the reasoning behind it.

---

## License

Proprietary. All rights reserved.

Copyright 2026 Vijetha Digital. Unauthorised copying, distribution, or modification of this software is prohibited.
