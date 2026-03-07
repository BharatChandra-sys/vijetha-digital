from pydantic import BaseModel
from typing import List


class OrderItemCreate(BaseModel):
    width_ft: float
    height_ft: float
    material: str
    quantity: int
    lamination: bool = False
    frame: bool = False


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]


class OrderItemResponse(BaseModel):
    width_ft: float
    height_ft: float
    material: str
    quantity: int
    unit_price: float
    total_price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    status: str
    payment_status: str
    subtotal: float
    total_price: float
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True
