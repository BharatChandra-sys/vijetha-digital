"""
Payment model — full Razorpay/refund lifecycle.
Tracks every payment attempt and refund against an order.
"""
import enum
from datetime import datetime

from sqlalchemy import (
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


class PaymentMethod(enum.StrEnum):
    razorpay = "razorpay"
    upi = "upi"
    card = "card"
    netbanking = "netbanking"
    wallet = "wallet"
    cod = "cod"


class PaymentState(enum.StrEnum):
    created = "created"
    attempted = "attempted"
    authorized = "authorized"
    captured = "captured"
    failed = "failed"
    refund_initiated = "refund_initiated"
    refunded = "refunded"
    partially_refunded = "partially_refunded"


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Razorpay identifiers
    razorpay_order_id = Column(String(100), nullable=True, unique=True, index=True)
    razorpay_payment_id = Column(String(100), nullable=True, unique=True, index=True)
    razorpay_signature = Column(String(255), nullable=True)

    # Refund tracking
    razorpay_refund_id = Column(String(100), nullable=True, index=True)

    # Amount in INR (not paise)
    amount = Column(Numeric(12, 2), nullable=False)
    amount_refunded = Column(Numeric(12, 2), nullable=False, default=0)
    currency = Column(String(10), nullable=False, default="INR")

    state = Column(
        Enum(PaymentState, name="payment_state_enum"),
        nullable=False,
        default=PaymentState.created,
    )

    method = Column(
        Enum(PaymentMethod, name="payment_method_enum"),
        nullable=True,
    )

    # Webhook / gateway response (raw JSON stored as text for audit)
    gateway_response = Column(Text, nullable=True)

    # Failure reason
    failure_reason = Column(String(500), nullable=True)

    # Idempotency key to prevent duplicate processing
    idempotency_key = Column(String(100), nullable=True, unique=True, index=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    captured_at = Column(DateTime, nullable=True)
    refunded_at = Column(DateTime, nullable=True)

    order = relationship("Order", backref="payments")

    __table_args__ = (
        # Indexes already defined in Column definitions:
        # - order_id (line 56): index=True
        # - razorpay_order_id (line 60): index=True
        # - razorpay_payment_id (line 61): index=True
        # - razorpay_refund_id (line 65): index=True
        # - idempotency_key (line 91): index=True
        # Additional index:
        Index("ix_payments_state", "state"),
    )
