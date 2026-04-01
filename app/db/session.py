from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.db.base import Base  # IMPORTANT: import Base from base.py

# Database URL from settings
DATABASE_URL = settings.DATABASE_URL

# Engine with production-grade pool settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # Detect stale connections
    pool_size=10,             # Number of persistent connections
    max_overflow=20,          # Extra connections beyond pool_size
    pool_timeout=30,          # Seconds to wait for a connection
    pool_recycle=1800,        # Recycle connections every 30 minutes
)

# Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# FastAPI dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()