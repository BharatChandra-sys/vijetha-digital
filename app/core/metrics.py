"""
Prometheus metrics for monitoring and observability.

Metrics exposed:
- HTTP request duration
- HTTP request count by status code
- Active requests
- Database connection pool stats
- Order metrics (created, paid, cancelled)
- Payment metrics (success, failure)
"""
from prometheus_client import Counter, Gauge, Histogram, generate_latest
from prometheus_client.core import CollectorRegistry

# Create custom registry to avoid conflicts
registry = CollectorRegistry()

# ── HTTP Metrics ──────────────────────────────────────────────────────

http_request_duration_seconds = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["method", "endpoint", "status_code"],
    registry=registry,
    buckets=(0.01, 0.05, 0.1, 0.5, 1.0, 2.5, 5.0, 10.0),
)

http_requests_total = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"],
    registry=registry,
)

http_requests_in_progress = Gauge(
    "http_requests_in_progress",
    "Number of HTTP requests in progress",
    ["method", "endpoint"],
    registry=registry,
)

# ── Database Metrics ──────────────────────────────────────────────────

db_connections_total = Gauge(
    "db_connections_total",
    "Total database connections in pool",
    registry=registry,
)

db_connections_in_use = Gauge(
    "db_connections_in_use",
    "Database connections currently in use",
    registry=registry,
)

db_connections_available = Gauge(
    "db_connections_available",
    "Available database connections in pool",
    registry=registry,
)

# ── Business Metrics ──────────────────────────────────────────────────

orders_created_total = Counter(
    "orders_created_total",
    "Total orders created",
    ["status"],
    registry=registry,
)

orders_paid_total = Counter(
    "orders_paid_total",
    "Total orders paid",
    registry=registry,
)

orders_cancelled_total = Counter(
    "orders_cancelled_total",
    "Total orders cancelled",
    registry=registry,
)

payments_success_total = Counter(
    "payments_success_total",
    "Total successful payments",
    ["method"],
    registry=registry,
)

payments_failed_total = Counter(
    "payments_failed_total",
    "Total failed payments",
    registry=registry,
)

revenue_total = Counter(
    "revenue_total_inr",
    "Total revenue in INR",
    registry=registry,
)

# ── User Metrics ──────────────────────────────────────────────────────

users_registered_total = Counter(
    "users_registered_total",
    "Total users registered",
    ["role"],
    registry=registry,
)

users_active_total = Gauge(
    "users_active_total",
    "Total active users",
    registry=registry,
)

login_attempts_total = Counter(
    "login_attempts_total",
    "Total login attempts",
    ["status"],
    registry=registry,
)

# ── Celery Metrics ────────────────────────────────────────────────────

celery_tasks_total = Counter(
    "celery_tasks_total",
    "Total Celery tasks executed",
    ["task_name", "status"],
    registry=registry,
)

celery_task_duration_seconds = Histogram(
    "celery_task_duration_seconds",
    "Celery task duration in seconds",
    ["task_name"],
    registry=registry,
    buckets=(0.1, 0.5, 1.0, 5.0, 10.0, 30.0, 60.0, 120.0),
)


def get_metrics() -> bytes:
    """
    Generate Prometheus metrics in text format.
    
    Returns:
        Metrics in Prometheus text format
    """
    return generate_latest(registry)


def update_db_pool_metrics(engine):
    """
    Update database connection pool metrics.
    
    Args:
        engine: SQLAlchemy engine
    """
    try:
        pool = engine.pool
        db_connections_total.set(pool.size())
        db_connections_in_use.set(pool.checkedout())
        db_connections_available.set(pool.size() - pool.checkedout())
    except Exception:
        # Silently fail if pool stats unavailable
        pass
