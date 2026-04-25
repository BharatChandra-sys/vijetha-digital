"""
Business profile schemas for registration, verification, and management.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class BusinessProfileCreate(BaseModel):
    """Schema for creating a new business profile."""
    company_name: str = Field(..., min_length=2, max_length=255)
    gst_number: Optional[str] = Field(None, max_length=32)
    pan_number: Optional[str] = Field(None, max_length=32)
    business_type: str = Field(..., max_length=64)
    industry: Optional[str] = Field(None, max_length=128)
    website: Optional[str] = Field(None, max_length=255)
    
    registered_address: str = Field(..., min_length=10, max_length=500)
    city: str = Field(..., min_length=2, max_length=100)
    state: str = Field(..., min_length=2, max_length=100)
    pincode: str = Field(..., min_length=4, max_length=20)
    country: str = Field(default="India", max_length=100)
    
    gst_certificate_url: Optional[str] = None
    pan_card_url: Optional[str] = None


class BusinessProfileUpdate(BaseModel):
    """Schema for updating business profile details."""
    company_name: Optional[str] = Field(None, min_length=2, max_length=255)
    business_type: Optional[str] = Field(None, max_length=64)
    industry: Optional[str] = Field(None, max_length=128)
    website: Optional[str] = Field(None, max_length=255)
    
    registered_address: Optional[str] = Field(None, min_length=10, max_length=500)
    city: Optional[str] = Field(None, min_length=2, max_length=100)
    state: Optional[str] = Field(None, min_length=2, max_length=100)
    pincode: Optional[str] = Field(None, min_length=4, max_length=20)
    
    gst_certificate_url: Optional[str] = None
    pan_card_url: Optional[str] = None


class BusinessProfileResponse(BaseModel):
    """Schema for business profile response."""
    id: int
    user_id: int
    company_name: str
    gst_number: Optional[str]
    pan_number: Optional[str]
    business_type: str
    industry: Optional[str]
    website: Optional[str]
    
    registered_address: str
    city: str
    state: str
    pincode: str
    country: str
    
    status: str
    verified_at: Optional[datetime]
    rejection_reason: Optional[str]
    
    gst_certificate_url: Optional[str]
    pan_card_url: Optional[str]
    
    credit_limit: float
    credit_used: float
    payment_terms_days: int
    pricing_tier: str
    discount_percentage: float
    
    created_at: datetime
    updated_at: Optional[datetime]
    
    model_config = ConfigDict(from_attributes=True)


class BusinessVerificationRequest(BaseModel):
    """Schema for admin business verification action."""
    action: str = Field(..., pattern="^(approve|reject)$")
    rejection_reason: Optional[str] = Field(None, max_length=500)
    credit_limit: Optional[float] = Field(None, ge=0)
    payment_terms_days: Optional[int] = Field(None, ge=0, le=365)
    pricing_tier: Optional[str] = Field(None, max_length=32)
    discount_percentage: Optional[float] = Field(None, ge=0, le=100)


class BusinessCreditUpdate(BaseModel):
    """Schema for updating business credit terms."""
    credit_limit: Optional[float] = Field(None, ge=0)
    payment_terms_days: Optional[int] = Field(None, ge=0, le=365)
    pricing_tier: Optional[str] = Field(None, max_length=32)
    discount_percentage: Optional[float] = Field(None, ge=0, le=100)


class BusinessListResponse(BaseModel):
    """Schema for paginated business list."""
    items: list[BusinessProfileResponse]
    total: int
    page: int
    page_size: int
    pages: int
