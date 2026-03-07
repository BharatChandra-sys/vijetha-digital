from pydantic import BaseModel
from typing import Optional


class ProductCreate(BaseModel):
    name: str
    category: str
    base_price: float
    description: Optional[str] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None


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
