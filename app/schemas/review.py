from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=100)
    body: Optional[str] = Field(None, max_length=1500)
    image_urls: Optional[List[str]] = Field(None, max_length=5)


class ReviewResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    user_name: str
    rating: int
    title: Optional[str] = None
    body: Optional[str] = None
    image_urls: Optional[List[str]] = None
    is_verified_purchase: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewSummary(BaseModel):
    average_rating: float
    total_reviews: int
    distribution: dict  # {5: count, 4: count, ...}
