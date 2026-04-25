"""
Payments router — create, verify, and webhook endpoints.
Uses the upgraded payment_service with idempotency and Payment model tracking.
"""
import json

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.auth.dependencies import get_current_user
from app.core.exceptions import AppException
from app.db.session import get_db
from app.schemas.payment import (
    CreatePaymentRequest,
    CreatePaymentResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse,
)
from app.services.payment_service import (
    create_payment_order,
    process_webhook_captured,
    process_webhook_failed,
    verify_and_capture_payment,
    verify_webhook_signature,
)

router = APIRouter(prefix="/payments", tags=["payments"])


# ── Create payment order ──────────────────────────────────────────────

@router.post("/create/{order_id}", response_model=CreatePaymentResponse)
def create_payment(
    order_id: int,
    payload: CreatePaymentRequest = CreatePaymentRequest(),
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Initiate a Razorpay payment for an order. Auth required."""
    try:
        return create_payment_order(
            db=db,
            order_id=order_id,
            user_id=user.id,
            amount_percent=payload.amount_percent,
        )
    except AppException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Payment gateway error: {str(e)}")


# ── Verify payment (client callback) ─────────────────────────────────

@router.post("/verify/{order_id}", response_model=VerifyPaymentResponse)
def verify_payment(
    order_id: int,
    payload: VerifyPaymentRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Verify Razorpay signature after client-side payment completion."""
    try:
        return verify_and_capture_payment(
            db=db,
            order_id=order_id,
            user_id=user.id,
            razorpay_order_id=payload.razorpay_order_id,
            razorpay_payment_id=payload.razorpay_payment_id,
            razorpay_signature=payload.razorpay_signature,
        )
    except AppException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Razorpay webhook ──────────────────────────────────────────────────

@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: str = Header(None),
    db: Session = Depends(get_db),
):
    """
    Razorpay webhook endpoint.
    Handles payment.captured and payment.failed events.
    """
    if not x_razorpay_signature:
        raise HTTPException(status_code=400, detail="Missing webhook signature")

    body = await request.body()

    if not verify_webhook_signature(body, x_razorpay_signature):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event = payload.get("event")
    payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})

    if event == "payment.captured":
        status = process_webhook_captured(db, payment_entity)
        return {"status": status}

    if event == "payment.failed":
        status = process_webhook_failed(db, payment_entity)
        return {"status": status}

    return {"status": "ignored", "event": event}
