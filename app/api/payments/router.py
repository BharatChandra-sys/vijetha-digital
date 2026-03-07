import hmac
import hashlib
import json
from datetime import datetime

import razorpay
from fastapi import APIRouter, Request, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.session import get_db
from app.models.order import Order, OrderStatus, PaymentStatus
from app.core.config import settings
from app.services.payment_service import create_payment_order
from app.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/payments", tags=["payments"])


class CreatePaymentRequest(BaseModel):
    amount_percent: int = 100

razorpay_client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

# ======================================================
# CREATE PAYMENT (SECURED)
# ======================================================
@router.post("/create/{order_id}")
def create_payment(
    order_id: int,
    payload: CreatePaymentRequest | None = None,
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
        amount_percent=payload.amount_percent if payload else 100,
    )


# ======================================================
# VERIFY PAYMENT (client-side callback → server check)
# ======================================================
class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


@router.post("/verify/{order_id}")
def verify_payment(
    order_id: int,
    payload: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Already paid — idempotent
    if order.payment_status == PaymentStatus.paid:
        return {"status": "already_paid", "order_id": order.id}

    # Verify Razorpay signature
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": payload.razorpay_order_id,
            "razorpay_payment_id": payload.razorpay_payment_id,
            "razorpay_signature": payload.razorpay_signature,
        })
    except razorpay.errors.SignatureVerificationError:
        order.payment_status = PaymentStatus.failed
        db.commit()
        raise HTTPException(status_code=400, detail="Payment verification failed")

    # Mark paid
    order.payment_status = PaymentStatus.paid
    order.status = OrderStatus.confirmed
    order.paid_at = datetime.utcnow()
    db.commit()

    return {"status": "paid", "order_id": order.id}


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

    # Handle payment.failed events
    if event == "payment.failed":
        payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
        razorpay_order_id = payment_entity.get("order_id")
        if razorpay_order_id:
            try:
                rz_order = razorpay_client.order.fetch(razorpay_order_id)
                receipt = rz_order.get("receipt", "")
                if receipt.startswith("order_"):
                    oid = int(receipt.replace("order_", ""))
                    order = db.query(Order).filter(Order.id == oid).first()
                    if order and order.payment_status != PaymentStatus.paid:
                        order.payment_status = PaymentStatus.failed
                        db.commit()
            except Exception:
                pass
        return {"status": "failed_recorded"}

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

    # 🔒 4️⃣ VERIFY AMOUNT MATCHES CREATED RAZORPAY ORDER
    expected_amount = rz_order.get("amount")

    if paid_amount != expected_amount:
        return {"status": "amount_mismatch"}

    # 5️⃣ IDEMPOTENT UPDATE
    if order.payment_status != PaymentStatus.paid:
        order.payment_status = PaymentStatus.paid
        order.status = OrderStatus.confirmed
        order.paid_at = datetime.utcnow()
        db.commit()

    return {"status": "ok"}
