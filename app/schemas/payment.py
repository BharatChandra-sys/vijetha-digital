from typing import Optional

from pydantic import BaseModel, ConfigDict


class CreatePaymentRequest(BaseModel):
    amount_percent: int = 100  # 50 or 100


class CreatePaymentResponse(BaseModel):
    order_id: int
    razorpay_order_id: str
    amount: int          # paise
    amount_percent: int
    currency: str = "INR"
    key: str             # Razorpay public key


class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class VerifyPaymentResponse(BaseModel):
    status: str          # "paid" | "already_paid"
    order_id: int


class RefundRequest(BaseModel):
    amount: Optional[float] = None   # None = full refund
    reason: Optional[str] = None


class RefundResponse(BaseModel):
    refund_id: str
    order_id: int
    amount_refunded: float
    status: str


class PaymentStateResponse(BaseModel):
    id: int
    order_id: int
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    amount: float
    amount_refunded: float
    currency: str
    state: str
    method: Optional[str] = None
    failure_reason: Optional[str] = None
    created_at: Optional[str] = None
    captured_at: Optional[str] = None
    refunded_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
