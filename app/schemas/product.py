from pydantic import BaseModel, Field
from typing import Optional


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    base_price: float
    description: Optional[str] = Field(None, max_length=2000)
    unit: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=1000)


class ProductResponse(BaseModel):
    id: int
    name: str
    category: str
    description: Optional[str] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None
    base_price: float
    is_active: bool

    class Config:
        from_attributes = True
