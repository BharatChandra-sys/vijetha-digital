from contextlib import asynccontextmanager
from datetime import datetime
from pathlib import Path

import redis
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

# Initialize Sentry if DSN is configured
from app.core.config import settings

if settings.SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.fastapi import FastApiIntegration
    from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration

    sentry_sdk.init(
        dsn=settings.SENTRY_DSN,
        environment=settings.ENV,
        traces_sample_rate=0.1 if settings.ENV == "production" else 1.0,
        integrations=[
            FastApiIntegration(),
            SqlalchemyIntegration(),
        ],
    )

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.api.admin.router import router as admin_router
from app.api.auth.router import router as auth_router
from app.api.coupons.router import router as coupon_router
from app.api.health import router as health_router
from app.api.notifications.router import router as notification_router
from app.api.orders.router import router as order_router
from app.api.payments.router import router as payment_router
from app.api.pricing.router import router as pricing_router
from app.api.products.router import router as product_router
from app.api.reviews.router import router as review_router
from app.api.websocket import router as websocket_router
from app.core.config import settings
from app.core.exceptions import AppException
from app.core.maintenance import MaintenanceModeMiddleware
from app.core.metrics import get_metrics, update_db_pool_metrics
from app.core.rate_limiter import limiter
from app.core.security_middleware import SecurityHeadersMiddleware
from app.db.init_db import init_db
from app.db.session import engine
from app.middleware.deprecation import DeprecationMiddleware
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.metrics import MetricsMiddleware


def _db_ok() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except SQLAlchemyError:
        return False


def _redis_ok() -> bool:
    """Check Redis connection. Returns False if Redis is disabled."""
    if not settings.REDIS_URL or settings.REDIS_URL == "":
        return False  # Redis disabled
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
    app.state.db_status = "ok" if _db_ok() else "error"
    app.state.redis_status = "ok" if _redis_ok() else "error"
    yield


app = FastAPI(
    title=settings.APP_NAME,
    docs_url=None,  # Disabled for security
    redoc_url=None,  # Disabled for security
    openapi_url=None,  # Disabled for security
    lifespan=lifespan,
)

# ---- CORS (MUST BE FIRST) ----
# Build allowed origins list from FRONTEND_URL (may be comma-separated)
_raw_origins = settings.FRONTEND_URL or ""
_allowed_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

# Always include these dev/fallback origins
_always_allowed = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://vijetha-digital-store.vercel.app",
]
for _o in _always_allowed:
    if _o not in _allowed_origins:
        _allowed_origins.append(_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_origin_regex=r"https://vijetha-digital-store.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.trusted_hosts_list,
)

# ---- SECURITY HEADERS ----
app.add_middleware(SecurityHeadersMiddleware, env=settings.ENV)

# ---- COMING SOON MODE (disabled - payments are live) ----
# from app.middleware.coming_soon import ComingSoonMiddleware
# app.add_middleware(ComingSoonMiddleware)

# ---- METRICS COLLECTION ----
app.add_middleware(MetricsMiddleware)

# ---- DEPRECATION WARNINGS ----
app.add_middleware(DeprecationMiddleware)

# ---- REQUEST LOGGING (request-id + response-time headers) ----
app.add_middleware(RequestLoggingMiddleware)

# ---- MAINTENANCE MODE ----
app.add_middleware(MaintenanceModeMiddleware)

# ---- RATE LIMITING ----
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


# ---- EXCEPTION HANDLERS ----
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


# ---- STATIC FILES (for uploads) ----
upload_dir = BASE_DIR / settings.UPLOAD_DIR
upload_dir.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")


# ---- ROUTES ----
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(admin_router, prefix="/api/v1")
app.include_router(product_router)
app.include_router(order_router)
app.include_router(pricing_router)
app.include_router(payment_router)
app.include_router(review_router)
app.include_router(coupon_router)
app.include_router(notification_router)
app.include_router(websocket_router)


@app.get("/health", tags=["health"])
def health_check():
    """Detailed health check with DB and Redis status."""
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


@app.get("/metrics", tags=["monitoring"])
def metrics():
    """
    Prometheus metrics endpoint.
    Returns metrics in Prometheus text format.
    """
    from fastapi.responses import PlainTextResponse

    # Update DB pool metrics before returning
    update_db_pool_metrics(engine)

    return PlainTextResponse(
        content=get_metrics().decode("utf-8"),
        media_type="text/plain; version=0.0.4",
    )
