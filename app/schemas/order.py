from typing import List, Optional

from pydantic import BaseModel, Field, model_validator


class OrderItemCreate(BaseModel):
    # Standard product item
    product_id: Optional[int] = None
    # Custom signage item
    width_ft: Optional[float] = None
    height_ft: Optional[float] = None
    material: Optional[str] = Field(None, max_length=100)
    lamination: bool = False
    frame: bool = False
    # Common
    quantity: int

    @model_validator(mode="after")
    def check_item_type(self):
        has_product = self.product_id is not None
        has_custom = all(v is not None for v in [self.width_ft, self.height_ft, self.material])
        if not has_product and not has_custom:
            raise ValueError("Provide either product_id or (width_ft, height_ft, material)")
        return self


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    product_id: Optional[int] = None
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    product_category: Optional[str] = None
    width_ft: Optional[float] = None
    height_ft: Optional[float] = None
    material: Optional[str] = None
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_product(cls, item):
        data = {
            "product_id": item.product_id,
            "width_ft": float(item.width_ft) if item.width_ft is not None else None,
            "height_ft": float(item.height_ft) if item.height_ft is not None else None,
            "material": item.material,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price),
            "total_price": float(item.total_price),
        }
        if item.product_id and hasattr(item, "product") and item.product:
            data["product_name"] = item.product.name
            data["product_image"] = item.product.image_url
            data["product_category"] = item.product.category
        return cls(**data)


class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    payment_status: str
    subtotal: float
    tax: float = 0
    shipping: float = 0
    discount: float = 0
    total_price: float
    created_at: Optional[str] = None
    paid_at: Optional[str] = None
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
