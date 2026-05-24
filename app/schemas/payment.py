
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
    amount: float | None = None   # None = full refund
    reason: str | None = None


class RefundResponse(BaseModel):
    refund_id: str
    order_id: int
    amount_refunded: float
    status: str


class PaymentStateResponse(BaseModel):
    id: int
    order_id: int
    razorpay_order_id: str | None = None
    razorpay_payment_id: str | None = None
    amount: float
    amount_refunded: float
    currency: str
    state: str
    method: str | None = None
    failure_reason: str | None = None
    created_at: str | None = None
    captured_at: str | None = None
    refunded_at: str | None = None

    model_config = ConfigDict(from_attributes=True)
