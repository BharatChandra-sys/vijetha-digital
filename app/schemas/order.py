
from pydantic import BaseModel, ConfigDict, Field, model_validator


class OrderItemCreate(BaseModel):
    # Standard product item
    product_id: int | None = None
    # Custom signage item
    width_ft: float | None = None
    height_ft: float | None = None
    material: str | None = Field(None, max_length=100)
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
    items: list[OrderItemCreate]
    delivery_address: str | None = None
    delivery_city: str | None = None
    delivery_state: str | None = None
    delivery_postal_code: str | None = None
    delivery_notes: str | None = None
    coupon_code: str | None = None


class OrderItemResponse(BaseModel):
    product_id: int | None = None
    product_name: str | None = None
    product_image: str | None = None
    product_category: str | None = None
    width_ft: float | None = None
    height_ft: float | None = None
    material: str | None = None
    quantity: int
    unit_price: float
    total_price: float

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm_with_product(cls, item):
        data = {
            "product_id": item.product_id,
            "product_name": item.product_name,
            "product_category": item.product_category,
            "width_ft": float(item.width_ft) if item.width_ft is not None else None,
            "height_ft": float(item.height_ft) if item.height_ft is not None else None,
            "material": item.material,
            "quantity": item.quantity,
            "unit_price": float(item.unit_price),
            "total_price": float(item.total_price),
        }
        # Prefer snapshot fields; fall back to joined product relation
        if not data["product_name"] and item.product_id and hasattr(item, "product") and item.product:
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
    coupon_code: str | None = None
    coupon_discount: float = 0
    total_price: float
    delivery_address: str | None = None
    delivery_city: str | None = None
    delivery_state: str | None = None
    delivery_postal_code: str | None = None
    tracking_number: str | None = None
    tracking_url: str | None = None
    created_at: str | None = None
    confirmed_at: str | None = None
    paid_at: str | None = None
    shipped_at: str | None = None
    delivered_at: str | None = None
    cancelled_at: str | None = None
    items: list[OrderItemResponse]

    model_config = ConfigDict(from_attributes=True)


class OrderStatusUpdateRequest(BaseModel):
    status: str
    note: str | None = None


class OrderTimelineEntry(BaseModel):
    to_status: str
    note: str | None = None
    created_at: str | None = None

    model_config = ConfigDict(from_attributes=True)


class AdminOrderView(BaseModel):
    """Extended order view for admin — includes customer info."""
    id: int
    user_id: int
    customer_email: str | None = None
    customer_name: str | None = None
    status: str
    payment_status: str
    subtotal: float
    tax: float = 0
    shipping: float = 0
    discount: float = 0
    total_price: float
    coupon_code: str | None = None
    delivery_address: str | None = None
    delivery_city: str | None = None
    admin_notes: str | None = None
    tracking_number: str | None = None
    created_at: str | None = None
    paid_at: str | None = None
    items: list[OrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
