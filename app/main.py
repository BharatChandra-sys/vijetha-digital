from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler

from app.core.config import settings
from app.core.rate_limiter import limiter
from app.core.security_middleware import SecurityHeadersMiddleware
from app.core.maintenance import MaintenanceModeMiddleware
from app.db.init_db import init_db

from app.api.health import router as health_router
from app.api.auth.router import router as auth_router
from app.api.admin.router import router as admin_router
from app.api.products.router import router as product_router
from app.api.orders.router import router as order_router
from app.api.pricing.router import router as pricing_router
from app.api.payments.router import router as payment_router
from app.api.reviews.router import router as review_router

app = FastAPI(
    title=settings.APP_NAME,
    # Hide API docs in production
    docs_url="/docs" if settings.ENV != "production" else None,
    redoc_url="/redoc" if settings.ENV != "production" else None,
    openapi_url="/openapi.json" if settings.ENV != "production" else None,
)

# ---- CORS (MUST BE FIRST) ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

# ---- SECURITY HEADERS + REQUEST AUDIT LOGGING ----
app.add_middleware(SecurityHeadersMiddleware, env=settings.ENV)

# ---- MAINTENANCE MODE ----
app.add_middleware(MaintenanceModeMiddleware)

# ---- RATE LIMITING ----
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

@app.on_event("startup")
def on_startup():
    init_db()
    # Ensure access_logs table and indexes exist — fully idempotent
    from app.db.session import engine
    from sqlalchemy import text

    with engine.begin() as conn:
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS access_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                email VARCHAR(255),
                action VARCHAR(100) NOT NULL,
                success BOOLEAN NOT NULL DEFAULT TRUE,
                detail TEXT,
                ip_address VARCHAR(50),
                user_agent VARCHAR(500),
                device_type VARCHAR(20),
                browser VARCHAR(50),
                os_name VARCHAR(50),
                endpoint VARCHAR(255),
                method VARCHAR(10),
                created_at TIMESTAMP NOT NULL DEFAULT NOW()
            )
        """))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_access_logs_user_id ON access_logs (user_id)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_access_logs_action ON access_logs (action)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_access_logs_ip ON access_logs (ip_address)"))
        conn.execute(text("CREATE INDEX IF NOT EXISTS ix_access_logs_created_at ON access_logs (created_at)"))

# ---- ROUTES ----
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(admin_router)
app.include_router(admin_router, prefix="/api/v1")
app.include_router(product_router)
app.include_router(order_router)
app.include_router(pricing_router)
app.include_router(payment_router)
app.include_router(review_router)
