from datetime import datetime
import enum

from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship

from app.db.base import Base


class DiscountType(str, enum.Enum):
    PERCENTAGE = "percentage"
    FIXED = "fixed"


class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True)
    code = Column(String(64), nullable=False, unique=True, index=True)
    description = Column(String(500), nullable=False)

    discount_type = Column(Enum(DiscountType, name="discount_type_enum"), nullable=False)
    discount_value = Column(Float, nullable=False)
    max_discount_amount = Column(Float, nullable=True)

    min_order_amount = Column(Float, default=0.0, nullable=False)
    max_uses = Column(Integer, nullable=True)
    uses_per_user = Column(Integer, default=1, nullable=False)

    applicable_roles = Column(JSONB, default=list, nullable=False)
    applicable_product_categories = Column(JSONB, default=list, nullable=False)

    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    usages = relationship("CouponUsage", back_populates="coupon", cascade="all, delete-orphan")


class CouponUsage(Base):
    __tablename__ = "coupon_usages"

    id = Column(Integer, primary_key=True)
    coupon_id = Column(Integer, ForeignKey("coupons.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    discount_applied = Column(Float, nullable=False)
    used_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    coupon = relationship("Coupon", back_populates="usages")
