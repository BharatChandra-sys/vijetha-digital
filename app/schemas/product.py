from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    name: str = Field(..., max_length=255)
    category: str = Field(..., max_length=100)
    base_price: float
    description: str | None = Field(None, max_length=2000)
    unit: str | None = Field(None, max_length=50)
    image_url: str | None = Field(None, max_length=1000)
    slug: str | None = Field(None, max_length=255)
    seo_title: str | None = Field(None, max_length=255)
    seo_description: str | None = None
    seo_tags: list[str] | None = None
    specification_options: dict[str, Any] | None = None
    turnaround_options: list[dict[str, Any]] | None = None


class ProductUpdate(BaseModel):
    name: str | None = Field(None, max_length=255)
    category: str | None = Field(None, max_length=100)
    base_price: float | None = None
    description: str | None = Field(None, max_length=2000)
    unit: str | None = Field(None, max_length=50)
    image_url: str | None = Field(None, max_length=1000)
    is_active: bool | None = None
    slug: str | None = Field(None, max_length=255)
    seo_title: str | None = Field(None, max_length=255)
    seo_description: str | None = None
    seo_tags: list[str] | None = None
    specification_options: dict[str, Any] | None = None
    turnaround_options: list[dict[str, Any]] | None = None


class ProductResponse(BaseModel):
    id: int
    name: str
    slug: str | None = None
    category: str
    description: str | None = None
    unit: str | None = None
    image_url: str | None = None
    base_price: float
    is_active: bool
    seo_title: str | None = None
    seo_description: str | None = None
    seo_tags: list[str] | None = None
    specification_options: dict[str, Any] | None = None
    turnaround_options: list[dict[str, Any]] | None = None

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
    breakdown: dict[str, Any] | None = None
