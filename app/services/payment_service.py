import razorpay
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.order import Order, OrderStatus, PaymentStatus

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

MIN_RAZORPAY_AMOUNT = 1  # INR


def create_payment_order(
    db: Session,
    order_id: int,
    user_id: int,
    amount_percent: int = 100,
):
    # 1️⃣ Fetch order
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.user_id == user_id,
        )
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 2️⃣ Validate state
    if order.payment_status == PaymentStatus.paid:
        raise HTTPException(status_code=400, detail="Order already paid")

    if order.status == OrderStatus.cancelled:
        raise HTTPException(status_code=400, detail="Cannot pay for a cancelled order")

    if order.total_price < MIN_RAZORPAY_AMOUNT:
        raise HTTPException(
            status_code=400,
            detail="Order amount too low for payment",
        )

    if amount_percent not in (50, 100):
        raise HTTPException(
            status_code=400,
            detail="amount_percent must be either 50 or 100",
        )

    # 3️⃣ Create Razorpay order
    payable_amount = float(order.total_price) * (amount_percent / 100)
    amount_paise = int(round(payable_amount * 100))
    if amount_paise < 100:
        raise HTTPException(
            status_code=400,
            detail="Payable amount too low for payment",
        )

    try:
        razorpay_order = client.order.create({
            "amount": amount_paise,  # paise
            "currency": "INR",
            "receipt": f"order_{order.id}",
            "payment_capture": 1,
        })
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Payment gateway error: {str(e)}",
        )

    # 4️⃣ Update payment status to track payment attempt
    # Status remains 'placed' until payment is confirmed via webhook
    db.commit()
    db.refresh(order)

    # 5️⃣ Frontend payload
    return {
        "order_id": order.id,
        "razorpay_order_id": razorpay_order["id"],
        "amount": amount_paise,  # paise
        "amount_percent": amount_percent,
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID,
    }
