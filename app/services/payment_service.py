"""
Payment service — Razorpay order creation, signature verification,
webhook processing, and refund flow with idempotency.
"""
import hashlib
import hmac
from datetime import datetime

import razorpay
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import NotFoundException, PaymentException, ValidationException
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.payment import Payment, PaymentMethod, PaymentState

client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)

MIN_RAZORPAY_AMOUNT_PAISE = 100  # ₹1 minimum


def create_payment_order(
    db: Session,
    order_id: int,
    user_id: int,
    amount_percent: int = 100,
) -> dict:
    """
    Create a Razorpay order for the given app order.
    Idempotent — returns existing Razorpay order if already created.
    """
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user_id,
        Order.is_deleted == False,
    ).first()

    if not order:
        raise NotFoundException("Order", str(order_id))

    if order.payment_status == PaymentStatus.paid:
        raise ValidationException("Order is already paid")

    if order.status == OrderStatus.cancelled:
        raise ValidationException("Cannot pay for a cancelled order")

    if amount_percent not in (50, 100):
        raise ValidationException("amount_percent must be 50 or 100")

    payable_amount = float(order.total_price) * (amount_percent / 100)
    amount_paise = int(round(payable_amount * 100))

    if amount_paise < MIN_RAZORPAY_AMOUNT_PAISE:
        raise ValidationException("Payable amount too low for payment gateway")

    # Idempotency key based on order + percent
    idempotency_key = f"order_{order_id}_pct_{amount_percent}"

    # Check if a Payment record already exists for this idempotency key
    existing_payment = db.query(Payment).filter(
        Payment.idempotency_key == idempotency_key,
    ).first()

    if existing_payment and existing_payment.razorpay_order_id:
        return {
            "order_id": order.id,
            "razorpay_order_id": existing_payment.razorpay_order_id,
            "amount": amount_paise,
            "amount_percent": amount_percent,
            "currency": "INR",
            "key": settings.RAZORPAY_KEY_ID,
        }

    # Create Razorpay order
    try:
        rz_order = client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": f"order_{order.id}",
            "payment_capture": 1,
        })
    except Exception as e:
        raise PaymentException(f"Payment gateway error: {str(e)}")

    # Persist Payment record
    payment = Payment(
        order_id=order.id,
        razorpay_order_id=rz_order["id"],
        amount=payable_amount,
        currency="INR",
        state=PaymentState.created,
        idempotency_key=idempotency_key,
    )
    db.add(payment)

    # Store razorpay_order_id on the order for webhook lookup
    order.razorpay_order_id = rz_order["id"]
    db.commit()

    return {
        "order_id": order.id,
        "razorpay_order_id": rz_order["id"],
        "amount": amount_paise,
        "amount_percent": amount_percent,
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID,
    }


def verify_and_capture_payment(
    db: Session,
    order_id: int,
    user_id: int,
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> dict:
    """
    Verify Razorpay signature and mark order as paid.
    Idempotent — safe to call multiple times.
    """
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user_id,
        Order.is_deleted == False,
    ).first()

    if not order:
        raise NotFoundException("Order", str(order_id))

    # Already paid — idempotent success
    if order.payment_status == PaymentStatus.paid:
        return {"status": "already_paid", "order_id": order.id}

    # Verify signature
    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature,
        })
    except Exception:
        # Mark payment as failed
        payment = db.query(Payment).filter(
            Payment.razorpay_order_id == razorpay_order_id
        ).first()
        if payment:
            payment.state = PaymentState.failed
            payment.razorpay_payment_id = razorpay_payment_id
            payment.razorpay_signature = razorpay_signature
            db.commit()
        order.payment_status = PaymentStatus.failed
        db.commit()
        raise PaymentException("Payment signature verification failed")

    # Update Payment record
    payment = db.query(Payment).filter(
        Payment.razorpay_order_id == razorpay_order_id
    ).first()
    if payment:
        payment.state = PaymentState.captured
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.captured_at = datetime.utcnow()

    # Update Order
    order.payment_status = PaymentStatus.paid
    order.status = OrderStatus.confirmed
    order.paid_at = datetime.utcnow()
    db.commit()

    return {"status": "paid", "order_id": order.id}


def verify_webhook_signature(body: bytes, signature: str) -> bool:
    """Verify Razorpay webhook HMAC-SHA256 signature."""
    expected = hmac.new(
        settings.RAZORPAY_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


def process_webhook_captured(db: Session, payment_entity: dict) -> str:
    """
    Handle payment.captured webhook event.
    Returns status string for response.
    """
    razorpay_order_id = payment_entity.get("order_id")
    paid_amount_paise = payment_entity.get("amount")
    razorpay_payment_id = payment_entity.get("id")
    method_str = payment_entity.get("method")

    if not razorpay_order_id:
        return "razorpay_order_id_missing"

    # Fetch Razorpay order to get receipt
    try:
        rz_order = client.order.fetch(razorpay_order_id)
    except Exception:
        return "razorpay_order_fetch_failed"

    receipt = rz_order.get("receipt", "")
    if not receipt.startswith("order_"):
        return "invalid_receipt"

    try:
        order_id = int(receipt.replace("order_", ""))
    except ValueError:
        return "invalid_order_id"

    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if not order:
        return "order_not_found"

    # Amount integrity check
    expected_amount = rz_order.get("amount")
    if paid_amount_paise != expected_amount:
        return "amount_mismatch"

    # Idempotent update
    if order.payment_status != PaymentStatus.paid:
        order.payment_status = PaymentStatus.paid
        order.status = OrderStatus.confirmed
        order.paid_at = datetime.utcnow()

        # Update Payment record
        payment = db.query(Payment).filter(
            Payment.razorpay_order_id == razorpay_order_id
        ).first()
        if payment:
            payment.state = PaymentState.captured
            payment.razorpay_payment_id = razorpay_payment_id
            payment.captured_at = datetime.utcnow()
            if method_str:
                try:
                    payment.method = PaymentMethod(method_str)
                except ValueError:
                    pass

        db.commit()

    return "ok"


def process_webhook_failed(db: Session, payment_entity: dict) -> str:
    """Handle payment.failed webhook event."""
    razorpay_order_id = payment_entity.get("order_id")
    if not razorpay_order_id:
        return "razorpay_order_id_missing"

    try:
        rz_order = client.order.fetch(razorpay_order_id)
    except Exception:
        return "razorpay_order_fetch_failed"

    receipt = rz_order.get("receipt", "")
    if not receipt.startswith("order_"):
        return "invalid_receipt"

    try:
        order_id = int(receipt.replace("order_", ""))
    except ValueError:
        return "invalid_order_id"

    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    if order and order.payment_status != PaymentStatus.paid:
        order.payment_status = PaymentStatus.failed

        payment = db.query(Payment).filter(
            Payment.razorpay_order_id == razorpay_order_id
        ).first()
        if payment:
            payment.state = PaymentState.failed
            payment.failure_reason = payment_entity.get("error_description", "")

        db.commit()

    return "failed_recorded"

