from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    Numeric,
    Enum,
    Index,
    CheckConstraint,
)
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
import enum


# =========================
# ENUM DEFINITIONS
# =========================

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


# =========================
# ORDER MODEL
# =========================

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    subtotal = Column(Numeric(12, 2), nullable=False)
    tax = Column(Numeric(12, 2), nullable=False, default=0)
    discount = Column(Numeric(12, 2), nullable=False, default=0)
    shipping = Column(Numeric(12, 2), nullable=False, default=0)

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

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    paid_at = Column(
        DateTime,
        nullable=True,
    )

    user = relationship("User", back_populates="orders")

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_orders_user_created", "user_id", "created_at"),
        CheckConstraint("subtotal >= 0", name="chk_orders_subtotal_non_negative"),
        CheckConstraint("tax >= 0", name="chk_orders_tax_non_negative"),
        CheckConstraint("shipping >= 0", name="chk_orders_shipping_non_negative"),
        CheckConstraint("discount >= 0", name="chk_orders_discount_non_negative"),
        CheckConstraint("total_price >= 0", name="chk_orders_total_non_negative"),
        CheckConstraint(
            "total_price = subtotal + tax + shipping - discount",
            name="chk_orders_total_consistency",
        ),
    )