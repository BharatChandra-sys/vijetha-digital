from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

import redis
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.admin.router import router as admin_router
from app.api.auth.router import router as auth_router
from app.api.health import router as health_router
from app.api.orders.router import router as order_router
from app.api.payments.router import router as payment_router
from app.api.pricing.router import router as pricing_router
from app.api.products.router import router as product_router
from app.api.reviews.router import router as review_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.core.maintenance import MaintenanceModeMiddleware
from app.core.rate_limiter import limiter
from app.core.security_middleware import SecurityHeadersMiddleware
from app.db.init_db import init_db
from app.db.session import engine
from app.middleware.logging import RequestLoggingMiddleware


def _ensure_access_logs_table() -> None:
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


def _db_ok() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except SQLAlchemyError:
        return False


def _redis_ok() -> bool:
    try:
        client = redis.from_url(settings.REDIS_URL, socket_connect_timeout=1, socket_timeout=1)
        client.ping()
        client.close()
        return True
    except Exception:
        return False


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    _ensure_access_logs_table()
    app.state.redis_status = "ok" if _redis_ok() else "error"
    app.state.db_status = "ok" if _db_ok() else "error"
    yield


app = FastAPI(
    title=settings.APP_NAME,
    docs_url="/docs" if settings.ENV != "production" else None,
    redoc_url="/redoc" if settings.ENV != "production" else None,
    openapi_url="/openapi.json" if settings.ENV != "production" else None,
    lifespan=lifespan,
)

# ---- CORS (MUST BE FIRST) ----
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.TRUSTED_HOSTS,
)

# ---- SECURITY HEADERS + REQUEST AUDIT LOGGING ----
app.add_middleware(SecurityHeadersMiddleware, env=settings.ENV)

# ---- REQUEST LOGGING HEADERS ----
app.add_middleware(RequestLoggingMiddleware)

# ---- MAINTENANCE MODE ----
app.add_middleware(MaintenanceModeMiddleware)

# ---- RATE LIMITING ----
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(AppException)
async def app_exception_handler(_, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message, "detail": exc.detail},
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(_, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"error": "Validation error", "detail": exc.errors()},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(_, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "detail": None},
    )


@app.get("/health")
def health_check():
    db_state = "ok" if _db_ok() else "error"
    redis_state = "ok" if _redis_ok() else "error"
    app.state.db_status = db_state
    app.state.redis_status = redis_state
    return {
        "status": "ok" if db_state == "ok" and redis_state == "ok" else "degraded",
        "version": "2.0.0",
        "db": db_state,
        "redis": redis_state,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }

# ---- ROUTES ----
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(admin_router, prefix="/api/v1")
app.include_router(product_router)
app.include_router(order_router)
app.include_router(pricing_router)
app.include_router(payment_router)
app.include_router(review_router)
