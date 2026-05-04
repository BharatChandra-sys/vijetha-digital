# Vijetha Digital – Backend

Vijetha Digital is a backend system developed for managing a printing shop’s online orders and business operations.  
The purpose of this project is to replace manual order handling with a structured and trackable digital workflow.

## Problem Statement

Many local printing shops depend on WhatsApp messages, phone confirmations, and manual calculations for handling orders.  
This creates confusion, delays, and poor tracking.

This system was designed to introduce:

- Structured order management
- Clear order lifecycle tracking
- Separate roles for customers, business clients, and admin
- Secure authentication
- Online payment handling

## 🚀 Quick Start

Get started in under 30 minutes! See **[QUICK_START.md](QUICK_START.md)** for rapid deployment.

```bash
# Clone and configure
git clone <repository-url>
cd vijetha-digital-backend
cp .env.example .env

# Edit .env with your configuration
nano .env

# Validate and deploy
python3 scripts/validate_production.py
./scripts/deploy.sh
```

## ✨ Core Features

### Authentication & Security
- 🔐 JWT-based authentication with access/refresh tokens
- 🛡️ Role-based access control (Individual / Business / Admin)
- 🔒 Token blacklist with Redis
- 🚫 Rate limiting (per-endpoint and global)
- 🔑 Password strength validation
- 📧 Email verification and password reset
- 🚨 Failed login attempt tracking and account lockout

### Order Management
- 📦 Complete order lifecycle tracking
- 📋 Order timeline with status history
- 📄 Invoice generation and storage
- 📎 File attachments for orders
- 💼 Business account support for bulk orders
- 🎯 Order status transitions with validation
- 📊 Admin order moderation and tracking

### Payment Processing
- 💳 Razorpay integration with webhook support
- 💰 Payment verification and refund handling
- 🔄 Idempotent payment operations
- 📈 Payment state machine (created → authorized → captured)
- 🧾 Financial breakdown (subtotal, tax, discount, shipping)

### Product & Pricing
- 🏷️ Product catalog with SEO optimization
- 💵 Dynamic pricing calculations
- 🎟️ Coupon system with validation
- 📊 Quantity breaks and business-tier discounts
- 🖼️ Image management with Cloudinary/S3

### Notifications & Communication
- 🔔 Real-time notifications via WebSocket
- 📧 Email notifications with templates
- 📱 Background task processing with Celery
- 🔄 Notification read/unread tracking

### Admin Dashboard
- 📊 Business metrics and analytics
- 👥 User management (list, status, roles)
- 🛍️ Product moderation
- 📦 Order management and tracking
- ⭐ Review moderation
- 📈 Revenue reports and exports

### Infrastructure
- 🐳 Docker containerization
- 🔄 Automated deployment with rollback
- 📊 Prometheus metrics
- 🔍 Structured logging with request ID tracking
- 🏥 Health checks with DB/Redis status
- 🔐 Security headers and CORS
- 🚦 Nginx reverse proxy with SSL

## 🏗️ Architecture

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Nginx     │ ← SSL/TLS, Rate Limiting, Static Files
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  FastAPI    │ ← Authentication, Business Logic, API
└──────┬──────┘
       │
       ├──────────────┐
       ▼              ▼
┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │    Redis    │ ← Sessions, Cache, Rate Limiting
└─────────────┘  └─────────────┘
       │
       ▼
┌─────────────┐
│   Celery    │ ← Background Tasks (Email, Notifications)
└─────────────┘
```

### System Flow

```
Client Request
    ↓
Nginx (SSL, Rate Limit)
    ↓
FastAPI Middleware (CORS, Security Headers, Logging)
    ↓
Authentication (JWT Validation, Token Blacklist Check)
    ↓
Authorization (Role-Based Access Control)
    ↓
Business Logic (Services Layer)
    ↓
Database (SQLAlchemy ORM)
    ↓
Response (JSON with proper status codes)
```

## Order Lifecycle Design

The order status follows a structured flow:

PLACED → CONFIRMED → PRINTING → QUALITY_CHECK → SHIPPED → DELIVERED → CANCELLED

This was implemented to reflect real production workflow instead of a simple “completed” status.

## 📁 Project Structure

```
vijetha-digital-backend/
├── app/
│   ├── api/              # API endpoints (routers)
│   │   ├── auth/         # Authentication endpoints
│   │   ├── admin/        # Admin endpoints
│   │   ├── orders/       # Order management
│   │   ├── products/     # Product catalog
│   │   ├── payments/     # Payment processing
│   │   └── ...
│   ├── core/             # Core utilities
│   │   ├── config.py     # Configuration management
│   │   ├── security.py   # Security utilities
│   │   ├── dependencies.py # Dependency injection
│   │   └── exceptions.py # Custom exceptions
│   ├── db/               # Database setup
│   │   ├── session.py    # Database sessions
│   │   └── init_db.py    # Database initialization
│   ├── models/           # SQLAlchemy models
│   │   ├── user.py       # User model
│   │   ├── order.py      # Order model
│   │   ├── product.py    # Product model
│   │   └── ...
│   ├── schemas/          # Pydantic schemas
│   │   ├── auth.py       # Auth schemas
│   │   ├── order.py      # Order schemas
│   │   └── ...
│   ├── services/         # Business logic
│   │   ├── auth_service.py
│   │   ├── order_service.py
│   │   └── ...
│   ├── tasks/            # Celery tasks
│   │   ├── email_tasks.py
│   │   └── notification_tasks.py
│   ├── middleware/       # Custom middleware
│   └── main.py           # Application entry point
├── alembic/              # Database migrations
│   └── versions/         # Migration files
├── tests/                # Test suite
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
├── scripts/              # Deployment scripts
│   ├── deploy.sh         # Deployment script
│   ├── rollback.sh       # Rollback script
│   └── validate_production.py
├── nginx/                # Nginx configuration
│   ├── nginx.conf        # Main config
│   └── conf.d/           # Site configs
├── .github/workflows/    # CI/CD pipelines
│   ├── ci.yml            # Continuous integration
│   └── deploy.yml        # Deployment workflow
├── Dockerfile            # Docker image definition
├── docker-compose.yml    # Service orchestration
├── requirements.txt      # Python dependencies
├── .env.example          # Environment template
└── README.md             # This file
```

### Design Principles

- **Separation of Concerns**: Routes, services, models, and schemas are separated
- **Dependency Injection**: Centralized dependencies for easy testing
- **Service Layer**: Business logic isolated from API layer
- **Repository Pattern**: Database access through ORM
- **Clean Architecture**: Independent layers with clear boundaries

## 🛠️ Tech Stack

### Core
- **Python 3.11+** - Modern Python with type hints
- **FastAPI** - High-performance async web framework
- **SQLAlchemy 2.0** - Powerful ORM with async support
- **Alembic** - Database migration tool
- **Pydantic** - Data validation with type hints

### Database & Caching
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching, sessions, rate limiting

### Authentication & Security
- **JWT** - Token-based authentication
- **Bcrypt** - Password hashing
- **SlowAPI** - Rate limiting
- **python-jose** - JWT encoding/decoding

### Background Tasks
- **Celery** - Distributed task queue
- **Redis** - Message broker for Celery

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and load balancer
- **Gunicorn** - WSGI HTTP server
- **Uvicorn** - ASGI server

### Integrations
- **Razorpay** - Payment gateway
- **Cloudinary** - Image storage and CDN
- **AWS S3** - File storage (optional)
- **SMTP** - Email delivery

### Monitoring & Observability
- **Prometheus** - Metrics collection
- **Sentry** - Error tracking (optional)
- **Structured Logging** - JSON logs with request IDs

### Development Tools
- **Pytest** - Testing framework
- **Ruff** - Fast Python linter
- **Pre-commit** - Git hooks for code quality
- **GitHub Actions** - CI/CD pipelines

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 30 minutes
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete deployment guide
- **[PRODUCTION_READINESS_CHECKLIST.md](PRODUCTION_READINESS_CHECKLIST.md)** - Pre-deployment checklist
- **[PRODUCTION_UPGRADE_SUMMARY.md](PRODUCTION_UPGRADE_SUMMARY.md)** - Upgrade summary
- **[UPGRADE_TODO_10_TO_100.md](UPGRADE_TODO_10_TO_100.md)** - Upgrade tracking

## 🧪 Testing

```bash
# Run all tests
make test

# Run with coverage
pytest tests --cov=app --cov-report=term --cov-report=html

# Run specific test file
pytest tests/integration/test_auth_api.py -v

# Run critical path tests
pytest tests/integration/test_critical_paths.py -v
```

**Test Coverage**: >70%

## 🚀 Deployment

### Prerequisites
- Ubuntu 20.04+ server
- Docker and Docker Compose
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

### Quick Deploy

```bash
# 1. Validate configuration
python3 scripts/validate_production.py

# 2. Deploy
./scripts/deploy.sh

# 3. Verify
curl https://yourdomain.com/health
```

### Rollback

```bash
# List backups
ls -lh backups/

# Rollback to specific timestamp
./scripts/rollback.sh 20260425_120000
```

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** for detailed instructions.

## 📊 Monitoring

### Health Check
```bash
curl https://yourdomain.com/health
```

Response:
```json
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "ok",
  "timestamp": "2026-04-25T12:00:00Z"
}
```

### Metrics
```bash
curl https://yourdomain.com/metrics
```

Returns Prometheus-formatted metrics including:
- HTTP request counts and durations
- Database connection pool stats
- Redis connection stats
- Custom business metrics

### Logs
```bash
# View all logs
docker compose logs -f

# View API logs
docker compose logs -f api

# View last 100 lines
docker compose logs --tail=100 api
```

## 🔐 Security

- ✅ JWT authentication with refresh tokens
- ✅ Token blacklist in Redis
- ✅ Password strength validation
- ✅ Rate limiting (per-endpoint and global)
- ✅ CORS configuration
- ✅ Security headers (CSP, HSTS, X-Frame-Options)
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ XSS protection
- ✅ Input validation (Pydantic)
- ✅ Failed login attempt tracking
- ✅ Account lockout policy
- ✅ Audit logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Clone repository
git clone <repository-url>
cd vijetha-digital-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up pre-commit hooks
pre-commit install

# Run development server
make dev
```

## 📝 License

This project is proprietary software. All rights reserved.

## 🙏 Acknowledgments

Built with modern best practices and production-ready patterns for enterprise applications.

## 📞 Support

For issues, questions, or contributions:
- Check documentation in `docs/` directory
- Run diagnostics: `python scripts/diagnostic_report.py`
- Check health: `curl https://yourdomain.com/health`
- View logs: `docker compose logs -f api`

---

**Version**: 2.0.0  
**Status**: Production Ready ✅  
**Last Updated**: 2026-04-25

