from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class CouponValidateRequest(BaseModel):
    code: str = Field(..., min_length=1, max_length=64)
    order_amount: float = Field(..., gt=0)


class CouponValidateResponse(BaseModel):
    valid: bool
    discount_amount: float = 0.0
    message: str
    coupon_code: Optional[str] = None
    discount_type: Optional[str] = None
    discount_value: Optional[float] = None


class CouponCreate(BaseModel):
    code: str = Field(..., min_length=1, max_length=64)
    description: str = Field(..., max_length=500)
    discount_type: str          # "percentage" | "fixed"
    discount_value: float = Field(..., gt=0)
    max_discount_amount: Optional[float] = None
    min_order_amount: float = 0.0
    max_uses: Optional[int] = None
    uses_per_user: int = 1
    valid_from: datetime
    valid_until: Optional[datetime] = None
    is_active: bool = True


class CouponResponse(BaseModel):
    id: int
    code: str
    description: str
    discount_type: str
    discount_value: float
    max_discount_amount: Optional[float] = None
    min_order_amount: float
    max_uses: Optional[int] = None
    uses_per_user: int
    valid_from: str
    valid_until: Optional[str] = None
    is_active: bool

    model_config = ConfigDict(from_attributes=True)
