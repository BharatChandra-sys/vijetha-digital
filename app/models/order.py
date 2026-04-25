import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.db.base import Base

# =========================
# ENUM DEFINITIONS
# =========================

class OrderStatus(str, enum.Enum):
    draft = "draft"
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
    partial = "partial"
    paid = "paid"
    failed = "failed"
    refunded = "refunded"
    refund_pending = "refund_pending"


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

    # Coupon
    coupon_code = Column(String(50), nullable=True)
    coupon_discount = Column(Numeric(12, 2), nullable=False, default=0)

    # Delivery info
    delivery_address = Column(Text, nullable=True)
    delivery_city = Column(String(100), nullable=True)
    delivery_state = Column(String(100), nullable=True)
    delivery_postal_code = Column(String(20), nullable=True)
    delivery_notes = Column(Text, nullable=True)

    # Admin notes (internal)
    admin_notes = Column(Text, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    confirmed_at = Column(DateTime, nullable=True)
    paid_at = Column(DateTime, nullable=True)
    shipped_at = Column(DateTime, nullable=True)
    delivered_at = Column(DateTime, nullable=True)
    cancelled_at = Column(DateTime, nullable=True)

    # Tracking & Invoice fields
    tracking_number = Column(String(100), nullable=True)
    tracking_url = Column(String(500), nullable=True)
    invoice_url = Column(String(500), nullable=True)

    # Razorpay reference
    razorpay_order_id = Column(String(100), nullable=True, index=True)

    # Soft delete
    is_deleted = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="orders")

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        Index("ix_orders_user_created", "user_id", "created_at"),
        Index("ix_orders_razorpay", "razorpay_order_id"),
        CheckConstraint("subtotal >= 0", name="chk_orders_subtotal_non_negative"),
        CheckConstraint("tax >= 0", name="chk_orders_tax_non_negative"),
        CheckConstraint("shipping >= 0", name="chk_orders_shipping_non_negative"),
        CheckConstraint("discount >= 0", name="chk_orders_discount_non_negative"),
        CheckConstraint("total_price >= 0", name="chk_orders_total_non_negative"),
    )