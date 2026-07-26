<div align="center">

# VIJETHA DIGITAL

### Professional Printing Services Platform

<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />

**A modern, production-ready e-commerce platform for digital printing services**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Deployment](#-deployment) • [Documentation](#-documentation)

---

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**Vijetha Digital** is a comprehensive full-stack e-commerce platform designed specifically for digital printing businesses. It replaces manual order handling with a structured, trackable digital workflow, enabling businesses to manage orders, payments, and customer relationships efficiently.

### Problem Statement

Traditional printing shops rely on WhatsApp messages, phone calls, and manual calculations for order management. This creates:
- ❌ Confusion and delays
- ❌ Poor order tracking
- ❌ Manual pricing errors
- ❌ Limited scalability

### Our Solution

✅ **Structured Order Management** - Complete order lifecycle tracking  
✅ **Automated Pricing** - Dynamic calculations with GST, discounts, and quantity breaks  
✅ **Secure Payments** - Integrated Razorpay payment gateway  
✅ **Real-time Tracking** - Order status updates and notifications  
✅ **Role-based Access** - Customer, Business, and Admin roles  
✅ **Professional Emails** - Branded transactional emails via Brevo  

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with access/refresh tokens
- Role-based access control (Customer / Business / Admin)
- Token blacklist with Redis
- Rate limiting (per-endpoint and global)
- Password strength validation
- Google OAuth integration
- Failed login tracking and account lockout

### 📦 Order Management
- Complete order lifecycle (Placed → Confirmed → Printing → Quality Check → Shipped → Delivered)
- Order timeline with status history
- Invoice generation (PDF)
- File attachments for custom designs
- Business account support for bulk orders
- Order status transitions with validation

### 💳 Payment Processing
- Razorpay integration with webhook support
- Payment verification and refund handling
- Idempotent payment operations
- Payment state machine (Created → Authorized → Captured)
- Financial breakdown (subtotal, tax, discount, shipping)

### 🏷️ Product & Pricing
- Product catalog with SEO optimization
- Dynamic pricing calculations
- Coupon system with validation
- Quantity breaks and business-tier discounts
- Image management (Cloudinary/S3)

### 📧 Notifications & Communication
- Professional branded email templates
- Brevo HTTP API integration (more reliable than SMTP)
- Welcome, order confirmation, shipping, payment emails
- Real-time notifications via WebSocket
- Background task processing with Celery

### 👨‍💼 Admin Dashboard
- Business metrics and analytics
- User management (list, status, roles)
- Product moderation
- Order management and tracking
- Review moderation
- Revenue reports and exports

### 🛡️ Infrastructure
- Docker containerization
- Automated deployment with rollback
- Prometheus metrics
- Structured logging with request ID tracking
- Health checks with DB/Redis status
- Security headers and CORS
- Nginx reverse proxy with SSL

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI 0.109.0 (Python 3.11+)
- **Database**: PostgreSQL 15 with SQLAlchemy 2.0
- **Cache**: Redis 7
- **Authentication**: JWT (python-jose) + Bcrypt
- **Migrations**: Alembic
- **Validation**: Pydantic
- **Task Queue**: Celery with Redis broker
- **Email**: Brevo HTTP API
- **Payments**: Razorpay
- **Storage**: Cloudinary / AWS S3
- **Server**: Gunicorn + Uvicorn workers

### Frontend
- **Framework**: React 19.2.0 with Vite 7.2.4
- **Routing**: React Router DOM 7.13.0
- **Styling**: Tailwind CSS 3.4.17
- **HTTP Client**: Axios 1.13.4
- **OAuth**: @react-oauth/google 0.13.4
- **Notifications**: React Hot Toast 2.6.0
- **Icons**: Lucide React 0.563.0

### DevOps & Monitoring
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Sentry
- **Logging**: Loguru + JSON structured logs
- **Testing**: Pytest + Pytest-asyncio
- **Linting**: Ruff

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Desktop    │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼─────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Nginx (SSL)   │
                    │  Rate Limiting  │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐     ┌─────▼─────┐     ┌─────▼─────┐
    │  FastAPI  │     │  FastAPI  │     │  FastAPI  │
    │  Worker 1 │     │  Worker 2 │     │  Worker N │
    └─────┬─────┘     └─────┬─────┘     └─────┬─────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼─────┐     ┌─────▼─────┐     ┌─────▼─────┐
    │PostgreSQL │     │   Redis   │     │  Celery   │
    │  Primary  │     │   Cache   │     │  Workers  │
    └───────────┘     └───────────┘     └─────┬─────┘
                                               │
          ┌────────────────────────────────────┤
          │                                    │
    ┌─────▼─────┐                       ┌─────▼─────┐
    │   Brevo   │                       │ Razorpay  │
    │   Email   │                       │  Payment  │
    └───────────┘                       └───────────┘
```

### Request Flow

```
1. Client Request
   ↓
2. Nginx (SSL, Rate Limit, Static Files)
   ↓
3. FastAPI Middleware (CORS, Security Headers, Logging)
   ↓
4. Authentication (JWT Validation, Token Blacklist Check)
   ↓
5. Authorization (Role-Based Access Control)
   ↓
6. Business Logic (Services Layer)
   ↓
7. Database (SQLAlchemy ORM)
   ↓
8. Response (JSON with proper status codes)
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+ (optional for development)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/vijetha-digital-backend.git
cd vijetha-digital-backend
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements-pinned.txt

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Run migrations
alembic upgrade head

# Seed products (optional)
python scripts/seed_products.py

# Start backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

### 4. Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Health**: http://localhost:8000/health
- **Admin Panel**: http://localhost:5173/admin

**Default Admin Credentials:**
- Email: `admin@vijetha.com`
- Password: `admin123` (change immediately!)

---

## 📁 Project Structure

```
vijetha-digital-backend/
├── app/                          # Backend application
│   ├── api/                      # API endpoints
│   │   ├── admin/               # Admin routes
│   │   ├── auth/                # Authentication
│   │   ├── orders/              # Order management
│   │   ├── products/            # Product catalog
│   │   ├── payments/            # Payment processing
│   │   └── ...
│   ├── core/                     # Core utilities
│   │   ├── config.py            # Configuration
│   │   ├── security.py          # Security utilities
│   │   ├── dependencies.py      # DI container
│   │   └── exceptions.py        # Custom exceptions
│   ├── db/                       # Database
│   │   ├── session.py           # DB sessions
│   │   └── init_db.py           # Initialization
│   ├── models/                   # SQLAlchemy models
│   ├── schemas/                  # Pydantic schemas
│   ├── services/                 # Business logic
│   │   ├── brevo_email_service.py  # Email service
│   │   ├── payment_service.py      # Payments
│   │   └── ...
│   ├── tasks/                    # Celery tasks
│   ├── middleware/               # Custom middleware
│   └── main.py                   # Application entry
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   ├── pages/               # Page components
│   │   ├── api/                 # API client
│   │   ├── styles/              # CSS files
│   │   └── main.jsx             # Entry point
│   ├── public/                  # Static assets
│   └── package.json
├── alembic/                      # Database migrations
│   └── versions/                # Migration files
├── scripts/                      # Utility scripts
│   ├── seed_products.py         # Product seeding
│   ├── deploy.sh                # Deployment
│   └── rollback.sh              # Rollback
├── tests/                        # Test suite
│   ├── unit/                    # Unit tests
│   └── integration/             # Integration tests
├── docs/                         # Documentation
├── nginx/                        # Nginx config
├── .github/workflows/            # CI/CD pipelines
├── Dockerfile                    # Docker image
├── docker-compose.yml            # Service orchestration
├── requirements-pinned.txt       # Python dependencies
├── .env.example                  # Environment template
├── alembic.ini                   # Alembic config
└── README.md                     # This file
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:8000
Production: https://your-domain.com
```

### Authentication

All authenticated endpoints require a Bearer token:

```bash
Authorization: Bearer <access_token>
```

### Key Endpoints

#### Authentication
```
POST   /auth/register          # Register new user
POST   /auth/login             # Login
POST   /auth/refresh           # Refresh token
POST   /auth/logout            # Logout
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password
```

#### Products
```
GET    /products               # List all products
GET    /products/{id}          # Get product details
POST   /products               # Create product (admin)
PUT    /products/{id}          # Update product (admin)
DELETE /products/{id}          # Delete product (admin)
```

#### Orders
```
GET    /orders                 # List user orders
GET    /orders/{id}            # Get order details
POST   /orders                 # Create order
PUT    /orders/{id}/status     # Update status (admin)
GET    /orders/{id}/invoice    # Download invoice
```

#### Payments
```
POST   /payments/create        # Create payment
POST   /payments/verify        # Verify payment
POST   /payments/webhook       # Razorpay webhook
```

#### Admin
```
GET    /api/v1/admin/users     # List users
GET    /api/v1/admin/orders    # List all orders
GET    /api/v1/admin/metrics   # Business metrics
```

### Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "detail": "Detailed error information",
  "status_code": 400
}
```

---

## 🚀 Deployment

### Quick Deploy (Recommended)

We provide comprehensive deployment guides for production:

1. **[COMPLETE_DEPLOYMENT_MANUAL.md](COMPLETE_DEPLOYMENT_MANUAL.md)** - Full step-by-step guide
2. **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Quick reference
3. **[BREVO_OAUTH_SETUP_GUIDE.md](BREVO_OAUTH_SETUP_GUIDE.md)** - Email & OAuth setup

### Deploy to Render + Vercel (Free Tier)

**Backend (Render):**
```bash
# 1. Push to GitHub
git push origin main

# 2. Create Render account and PostgreSQL database
# 3. Create Web Service from GitHub repo
# 4. Add environment variables (see .env.example)
# 5. Deploy!
```

**Frontend (Vercel):**
```bash
# 1. Create Vercel account
# 2. Import GitHub repository
# 3. Set root directory to 'frontend'
# 4. Add environment variables
# 5. Deploy!
```

**Total Time**: ~20 minutes  
**Cost**: $0/month (free tier)

### Docker Deployment

```bash
# Production build
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment

See [COMPLETE_DEPLOYMENT_MANUAL.md](COMPLETE_DEPLOYMENT_MANUAL.md) for detailed instructions.

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Application
ENV=production
APP_NAME=Vijetha Digital Backend

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT
JWT_SECRET_KEY=<64-char-random-string>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<strong-password>

# Brevo Email
BREVO_API_KEY=xkeysib-...
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_FROM_NAME=Vijetha Digital

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Razorpay
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=your-secret
RAZORPAY_WEBHOOK_SECRET=webhook-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env)

```bash
# Backend API
VITE_API_BASE_URL=https://your-api.onrender.com

# WhatsApp
VITE_WHATSAPP_NUMBER=919876543210

# Razorpay
VITE_RAZORPAY_KEY_ID=rzp_live_...

# Google OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your-client-id
```

See `.env.example` files for complete configuration.

---

## 🧪 Testing

### Run All Tests

```bash
# Backend tests
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html

# Specific test file
pytest tests/integration/test_auth_api.py -v
```

### Test Email Service

```bash
python test_email_service.py
```

### Manual Testing

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"Test123!@#"}'

# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

---

## 📊 Monitoring

### Health Checks

```bash
# Backend health
curl https://your-api.onrender.com/health

# Expected response
{
  "status": "ok",
  "version": "2.0.0",
  "db": "ok",
  "redis": "error",  # Normal on free tier
  "timestamp": "2026-05-05T..."
}
```

### Metrics

```bash
# Prometheus metrics
curl https://your-api.onrender.com/metrics
```

### Logs

```bash
# Docker logs
docker-compose logs -f api

# Render logs
# View in Render dashboard → Service → Logs

# Vercel logs
# View in Vercel dashboard → Project → Deployments
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📄 License

This project is proprietary software. All rights reserved.

© 2026 Vijetha Digital. Unauthorized copying, distribution, or modification is prohibited.

---

## 🙏 Acknowledgments

Built with modern best practices and production-ready patterns for enterprise applications.

### Key Technologies

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Brevo](https://www.brevo.com/) - Email service
- [Razorpay](https://razorpay.com/) - Payment gateway
- [Cloudinary](https://cloudinary.com/) - Media management

---

## 📞 Support

### Documentation
- [Complete Deployment Manual](COMPLETE_DEPLOYMENT_MANUAL.md)
- [Deployment Summary](DEPLOYMENT_SUMMARY.md)
- [Brevo & OAuth Setup](BREVO_OAUTH_SETUP_GUIDE.md)
- [Security Reminder](SECURITY_REMINDER.md)

### Contact
- **Email**: support@vijetha.com
- **WhatsApp**: +91 9876543210
- **Website**: https://vijetha.com

### Troubleshooting

For common issues, check:
1. [COMPLETE_DEPLOYMENT_MANUAL.md](COMPLETE_DEPLOYMENT_MANUAL.md#troubleshooting)
2. GitHub Issues
3. Render/Vercel logs

---

<div align="center">

**Made with ❤️ by Vijetha Digital Team**

⭐ Star us on GitHub if you find this project useful!

[Report Bug](https://github.com/yourusername/vijetha-digital-backend/issues) • [Request Feature](https://github.com/yourusername/vijetha-digital-backend/issues)

</div>
#   V e r c e l   d e p l o y m e n t  
 