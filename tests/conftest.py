"""
Test configuration.

Uses the real PostgreSQL DB (vijetha_db) — same as dev.
Sets required env vars BEFORE any app module is imported, then provides:
  - A TestClient with dependency overrides for get_db and get_current_user
  - Fixtures: db_session, client, auth_client, admin_client
"""
import os

# ── Env vars must be set before any app import ────────────────────────
os.environ.setdefault("DATABASE_URL",            "postgresql+psycopg2://postgres:admin123@localhost:5432/vijetha_db")
os.environ.setdefault("FRONTEND_URL",            "http://localhost:5173")
os.environ.setdefault("JWT_SECRET_KEY",          "supersecretkeychangeit")
os.environ.setdefault("ADMIN_EMAIL",             "admin@vijetha.com")
os.environ.setdefault("ADMIN_PASSWORD",          "admin123")
os.environ.setdefault("CLOUDINARY_CLOUD_NAME",   "dypdndqyc")
os.environ.setdefault("CLOUDINARY_API_KEY",      "422831496725844")
os.environ.setdefault("CLOUDINARY_API_SECRET",   "MZ4J-RAcbCG-n8v1jghGJoCAJ9g")
os.environ.setdefault("RAZORPAY_KEY_ID",         "rzp_test_SCuTCVzXpfP3aD")
os.environ.setdefault("RAZORPAY_KEY_SECRET",     "K4IEpb6wiGwnw11T2skGYp16")
os.environ.setdefault("RAZORPAY_WEBHOOK_SECRET", "K4IEpb6wiGwnw11T2skGYp16")
os.environ.setdefault("REDIS_URL",               "redis://localhost:6379/0")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# ── PostgreSQL test engine (same DB as dev) ───────────────────────────
_DB_URL = os.environ["DATABASE_URL"]

_test_engine = create_engine(
    _DB_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=_test_engine,
)


# ── DB availability guard ─────────────────────────────────────────────
def _db_available() -> bool:
    try:
        with _test_engine.connect() as conn:
            from sqlalchemy import text
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False


requires_db = pytest.mark.skipif(
    not _db_available(),
    reason="PostgreSQL not reachable — skipped",
)


# ── Fixtures ──────────────────────────────────────────────────────────

@pytest.fixture()
def db_session():
    """
    Provide a DB session that rolls back after each test.
    Keeps tests isolated without dropping/recreating tables.
    """
    connection = _test_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db_session):
    """
    TestClient with get_db overridden to use the test session.
    No authentication — for public endpoint tests.
    """
    from app.db.session import get_db
    from app.main import app

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, raise_server_exceptions=False) as c:
        yield c
    app.dependency_overrides.pop(get_db, None)


def _make_test_user(db_session, role: str = "customer", email: str = "test@example.com"):
    """Helper — create or fetch a test user in the DB."""
    from app.core.security import hash_password
    from app.models.user import User, UserRole, UserStatus

    user = db_session.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email=email,
            full_name="Test User",
            hashed_password=hash_password("Test1234!"),
            role=UserRole(role),
            status=UserStatus.ACTIVE,
            failed_login_attempts=0,
            is_deleted=False,
        )
        db_session.add(user)
        db_session.commit()
        db_session.refresh(user)
    return user


@pytest.fixture()
def auth_client(db_session):
    """TestClient authenticated as a regular customer."""
    from app.api.auth.dependencies import get_current_user
    from app.db.session import get_db
    from app.main import app

    user = _make_test_user(db_session, role="customer", email="customer_test@vijetha.com")

    def override_get_db():
        yield db_session

    def override_get_current_user():
        return user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    with TestClient(app, raise_server_exceptions=False) as c:
        yield c

    app.dependency_overrides.pop(get_db, None)
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture()
def admin_client(db_session):
    """TestClient authenticated as an admin user."""
    from app.api.auth.dependencies import get_current_user
    from app.db.session import get_db
    from app.main import app

    user = _make_test_user(db_session, role="admin", email="admin_test@vijetha.com")

    def override_get_db():
        yield db_session

    def override_get_current_user():
        return user

    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = override_get_current_user

    with TestClient(app, raise_server_exceptions=False) as c:
        yield c

    app.dependency_overrides.pop(get_db, None)
    app.dependency_overrides.pop(get_current_user, None)
