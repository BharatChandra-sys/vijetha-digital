from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class OrderTimeline(Base):
    __tablename__ = "order_timeline"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    changed_by = Column(Integer, ForeignKey("users.id"), nullable=True)

    from_status = Column(String(64), nullable=True)
    to_status = Column(String(64), nullable=False)
    note = Column(String(1000), nullable=True)
    internal_note = Column(String(1000), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    order = relationship("Order", foreign_keys=[order_id])
