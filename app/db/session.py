from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base  # IMPORTANT: import Base from base.py

# Database URL from settings
DATABASE_URL = settings.DATABASE_URL


def _to_async_database_url(url: str) -> str:
    if url.startswith("postgresql+psycopg2://"):
        return url.replace("postgresql+psycopg2://", "postgresql+asyncpg://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    return url


ASYNC_DATABASE_URL = _to_async_database_url(DATABASE_URL)

# Engine with production-grade pool settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # Detect stale connections
    pool_size=10,             # Number of persistent connections
    max_overflow=20,          # Extra connections beyond pool_size
    pool_timeout=30,          # Seconds to wait for a connection
    pool_recycle=1800,        # Recycle connections every 30 minutes
)

# Async engine/session (new paths can adopt this safely during staged migration)
try:
    async_engine = create_async_engine(
        ASYNC_DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
    )
except ModuleNotFoundError:
    async_engine = None

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

AsyncSessionLocal = (
    async_sessionmaker(
        bind=async_engine,
        class_=AsyncSession,
        expire_on_commit=False,
        autoflush=False,
        autocommit=False,
    )
    if async_engine is not None
    else None
)

# FastAPI dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


async def get_async_db():
    if AsyncSessionLocal is None:
        raise RuntimeError("Async DB session is unavailable. Install asyncpg to enable async DB paths.")
    db = AsyncSessionLocal()
    try:
        yield db
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    finally:
        await db.close()