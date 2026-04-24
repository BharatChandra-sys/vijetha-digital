import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String


class UUIDMixin:
    uuid = Column(
        "uuid",
        String(36),
        nullable=True,
        unique=True,
        index=True,
    )

    @staticmethod
    def generate_uuid() -> str:
        return str(uuid.uuid4())


class TimestampMixin:
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SoftDeleteMixin:
    is_deleted = Column(Boolean, default=False, nullable=False)
    deleted_at = Column(DateTime, nullable=True)


class IntegerPKMixin:
    id = Column(Integer, primary_key=True)
