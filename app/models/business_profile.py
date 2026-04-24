from datetime import datetime
import enum

from sqlalchemy import Column, Integer, String, DateTime, Enum, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base import Base


class BusinessStatus(str, enum.Enum):
    PENDING_VERIFICATION = "pending_verification"
    VERIFIED = "verified"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class BusinessProfile(Base):
    __tablename__ = "business_profiles"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)

    company_name = Column(String(255), nullable=False)
    gst_number = Column(String(32), nullable=True, unique=True)
    pan_number = Column(String(32), nullable=True)
    business_type = Column(String(64), nullable=False)
    industry = Column(String(128), nullable=True)
    website = Column(String(255), nullable=True)

    registered_address = Column(String(500), nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=False)
    country = Column(String(100), nullable=False, default="India")

    status = Column(Enum(BusinessStatus, name="business_status_enum"), default=BusinessStatus.PENDING_VERIFICATION, nullable=False)
    verified_at = Column(DateTime, nullable=True)
    verified_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    rejection_reason = Column(String(500), nullable=True)

    gst_certificate_url = Column(String(500), nullable=True)
    pan_card_url = Column(String(500), nullable=True)

    credit_limit = Column(Float, default=0.0, nullable=False)
    credit_used = Column(Float, default=0.0, nullable=False)
    payment_terms_days = Column(Integer, default=0, nullable=False)
    pricing_tier = Column(String(32), default="standard", nullable=False)
    discount_percentage = Column(Float, default=0.0, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", foreign_keys=[user_id])
