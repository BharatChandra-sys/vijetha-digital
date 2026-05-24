"""
Business profile schemas for registration, verification, and management.
"""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BusinessProfileCreate(BaseModel):
    """Schema for creating a new business profile."""
    company_name: str = Field(..., min_length=2, max_length=255)
    gst_number: str | None = Field(None, max_length=32)
    pan_number: str | None = Field(None, max_length=32)
    business_type: str = Field(..., max_length=64)
    industry: str | None = Field(None, max_length=128)
    website: str | None = Field(None, max_length=255)

    registered_address: str = Field(..., min_length=10, max_length=500)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    pincode: str = Field(..., min_length=4, max_length=20)
    country: str = Field(default="India", max_length=100)

    gst_certificate_url: str | None = None
    pan_card_url: str | None = None


class BusinessProfileUpdate(BaseModel):
    """Schema for updating business profile details."""
    company_name: str | None = Field(None, min_length=2, max_length=255)
    business_type: str | None = Field(None, max_length=64)
    industry: str | None = Field(None, max_length=128)
    website: str | None = Field(None, max_length=255)

    registered_address: str | None = Field(None, min_length=10, max_length=500)
    city: str | None = Field(None, min_length=2, max_length=100)
    state: str | None = Field(None, min_length=2, max_length=100)
    pincode: str | None = Field(None, min_length=4, max_length=20)

    gst_certificate_url: str | None = None
    pan_card_url: str | None = None


class BusinessProfileResponse(BaseModel):
    """Schema for business profile response."""
    id: int
    user_id: int
    company_name: str
    gst_number: str | None
    pan_number: str | None
    business_type: str
    industry: str | None
    website: str | None

    registered_address: str
    city: str
    state: str
    pincode: str
    country: str

    status: str
    verified_at: datetime | None
    rejection_reason: str | None

    gst_certificate_url: str | None
    pan_card_url: str | None

    credit_limit: float
    credit_used: float
    payment_terms_days: int
    pricing_tier: str
    discount_percentage: float

    created_at: datetime
    updated_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class BusinessVerificationRequest(BaseModel):
    """Schema for admin business verification action."""
    action: str = Field(..., pattern="^(approve|reject)$")
    rejection_reason: str | None = Field(None, max_length=500)
    credit_limit: float | None = Field(None, ge=0)
    payment_terms_days: int | None = Field(None, ge=0, le=365)
    pricing_tier: str | None = Field(None, max_length=32)
    discount_percentage: float | None = Field(None, ge=0, le=100)


class BusinessCreditUpdate(BaseModel):
    """Schema for updating business credit terms."""
    credit_limit: float | None = Field(None, ge=0)
    payment_terms_days: int | None = Field(None, ge=0, le=365)
    pricing_tier: str | None = Field(None, max_length=32)
    discount_percentage: float | None = Field(None, ge=0, le=100)


class BusinessListResponse(BaseModel):
    """Schema for paginated business list."""
    items: list[BusinessProfileResponse]
    total: int
    page: int
    page_size: int
    pages: int
