from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.db.base import Base


class TokenBlacklist(Base):
    __tablename__ = "token_blacklist"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(500), unique=True, index=True, nullable=False)
    blacklisted_at = Column(DateTime, default=datetime.utcnow, nullable=False)
