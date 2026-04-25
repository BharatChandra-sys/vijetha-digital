from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    base_price: float
    description: Optional[str] = Field(None, max_length=2000)
    unit: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=1000)
    slug: Optional[str] = Field(None, max_length=255)
    seo_title: Optional[str] = Field(None, max_length=255)
    seo_description: Optional[str] = None
    seo_tags: Optional[List[str]] = None
    specification_options: Optional[Dict[str, Any]] = None
    turnaround_options: Optional[List[Dict[str, Any]]] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    category: Optional[str] = Field(None, max_length=100)
    base_price: Optional[float] = None
    description: Optional[str] = Field(None, max_length=2000)
    unit: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=1000)
    is_active: Optional[bool] = None
    slug: Optional[str] = Field(None, max_length=255)
    seo_title: Optional[str] = Field(None, max_length=255)
    seo_description: Optional[str] = None
    seo_tags: Optional[List[str]] = None
    specification_options: Optional[Dict[str, Any]] = None
    turnaround_options: Optional[List[Dict[str, Any]]] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: Optional[str] = None
    category: str
    description: Optional[str] = None
    unit: Optional[str] = None
    image_url: Optional[str] = None
    base_price: float
    is_active: bool
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    seo_tags: Optional[List[str]] = None
    specification_options: Optional[Dict[str, Any]] = None
    turnaround_options: Optional[List[Dict[str, Any]]] = None

    model_config = ConfigDict(from_attributes=True)


# ── Pricing calculation ───────────────────────────────────────────────

class PriceCalculateRequest(BaseModel):
    width_ft: float = Field(..., gt=0)
    height_ft: float = Field(..., gt=0)
    material: str
    quantity: int = Field(..., ge=1)
    lamination: bool = False
    frame: bool = False


class PriceCalculateResponse(BaseModel):
    unit_price: float
    total_price: float
    area_sqft: float
    material: str
    quantity: int
    breakdown: Optional[Dict[str, Any]] = None
