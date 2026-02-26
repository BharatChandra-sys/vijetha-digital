from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    Numeric,
    Enum,
    Index,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
import enum


# -------------------------
# ENUM DEFINITIONS
# -------------------------

class OrderStatus(str, enum.Enum):
    placed = "placed"
    confirmed = "confirmed"
    printing = "printing"
    quality_check = "quality_check"
    shipped = "shipped"
    delivered = "delivered"
    cancelled = "cancelled"
    refunded = "refunded"


class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"


# -------------------------
# ORDER MODEL
# -------------------------

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    total_price = Column(Numeric(12, 2), nullable=False)

    status = Column(
        Enum(OrderStatus, name="order_status_enum"),
        nullable=False,
        default=OrderStatus.placed,
    )

    payment_status = Column(
        Enum(PaymentStatus, name="payment_status_enum"),
        nullable=False,
        default=PaymentStatus.pending,
    )

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete")

    # Performance index for dashboard queries
    __table_args__ = (
        Index("ix_orders_user_created", "user_id", "created_at"),
    )