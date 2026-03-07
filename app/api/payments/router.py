import hmac
import hashlib
import json

import razorpay
from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.order import Order, OrderStatus, PaymentStatus
from app.core.config import settings
from app.services.payment_service import create_payment_order
from app.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

# ======================================================
# CREATE PAYMENT (SECURED)
# ======================================================
@router.post("/create/{order_id}")
def create_payment(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),  # 🔒 AUTH REQUIRED
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,  # 🔒 OWNER CHECK
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return create_payment_order(
        db=db,
        order_id=order.id,
        user_id=user.id,
    )


# ======================================================
# RAZORPAY WEBHOOK
# ======================================================
@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None),
    db: Session = Depends(get_db),
):
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing signature")

    body = await request.body()

    # 1️⃣ Verify webhook signature
    expected_signature = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid signature")

    payload = json.loads(body)
    event = payload.get("event")

    if event != "payment.captured":
        return {"status": "ignored"}

    # 2️⃣ Extract payment entity
    payment_entity = payload["payload"]["payment"]["entity"]
    razorpay_order_id = payment_entity.get("order_id")
    paid_amount = payment_entity.get("amount")  # amount in paise

    if not razorpay_order_id:
        return {"status": "razorpay_order_id_missing"}

    # 3️⃣ Fetch Razorpay order
    try:
        rz_order = razorpay_client.order.fetch(razorpay_order_id)
    except Exception:
        return {"status": "razorpay_order_fetch_failed"}

    receipt = rz_order.get("receipt")
    if not receipt or not receipt.startswith("order_"):
        return {"status": "invalid_receipt"}

    try:
        order_id = int(receipt.replace("order_", ""))
    except ValueError:
        return {"status": "invalid_order_id"}

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        return {"status": "order_not_found"}

    # 🔒 4️⃣ VERIFY AMOUNT MATCHES ORDER
    expected_amount = int(float(order.total_price) * 100)

    if paid_amount != expected_amount:
        return {"status": "amount_mismatch"}

    # 5️⃣ IDEMPOTENT UPDATE
    if order.payment_status != PaymentStatus.paid:
        order.payment_status = PaymentStatus.paid
        order.status = OrderStatus.confirmed
        db.commit()

    return {"status": "ok"}
