"""
Coupon service — validation, usage tracking, and admin CRUD.
"""
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, NotFoundException
from app.models.coupon import Coupon, CouponUsage, DiscountType
from app.schemas.coupon import CouponCreate


def validate_coupon(
    db: Session,
    code: str,
    order_amount: float,
    user_id: int,
) -> dict[str, Any]:
    """
    Validate a coupon code and return the discount amount.
    Returns a dict with valid, discount_amount, and message.
    """
    coupon = db.query(Coupon).filter(
        Coupon.code == code.strip().upper(),
        Coupon.is_active,
    ).first()

    if not coupon:
        return {"valid": False, "discount_amount": 0.0, "message": "Invalid coupon code"}

    now = datetime.utcnow()

    if now < coupon.valid_from:
        return {"valid": False, "discount_amount": 0.0, "message": "Coupon is not yet active"}

    if coupon.valid_until and now > coupon.valid_until:
        return {"valid": False, "discount_amount": 0.0, "message": "Coupon has expired"}

    if order_amount < coupon.min_order_amount:
        return {
            "valid": False,
            "discount_amount": 0.0,
            "message": f"Minimum order amount ₹{coupon.min_order_amount:.0f} required",
        }

    # Check total usage cap
    if coupon.max_uses is not None:
        total_uses = db.query(CouponUsage).filter(CouponUsage.coupon_id == coupon.id).count()
        if total_uses >= coupon.max_uses:
            return {"valid": False, "discount_amount": 0.0, "message": "Coupon usage limit reached"}

    # Check per-user usage cap
    user_uses = db.query(CouponUsage).filter(
        CouponUsage.coupon_id == coupon.id,
        CouponUsage.user_id == user_id,
    ).count()
    if user_uses >= coupon.uses_per_user:
        return {"valid": False, "discount_amount": 0.0, "message": "You have already used this coupon"}

    # Calculate discount
    if coupon.discount_type == DiscountType.PERCENTAGE:
        discount = order_amount * (coupon.discount_value / 100)
        if coupon.max_discount_amount:
            discount = min(discount, coupon.max_discount_amount)
    else:
        discount = min(coupon.discount_value, order_amount)

    discount = round(discount, 2)

    return {
        "valid": True,
        "discount_amount": discount,
        "message": f"Coupon applied — ₹{discount:.2f} off",
        "coupon_code": coupon.code,
        "discount_type": coupon.discount_type.value,
        "discount_value": coupon.discount_value,
    }


def record_coupon_usage(
    db: Session,
    coupon_code: str,
    user_id: int,
    order_id: int,
    discount_applied: float,
) -> None:
    """Record that a coupon was used for an order."""
    coupon = db.query(Coupon).filter(Coupon.code == coupon_code.strip().upper()).first()
    if not coupon:
        return

    usage = CouponUsage(
        coupon_id=coupon.id,
        user_id=user_id,
        order_id=order_id,
        discount_applied=discount_applied,
    )
    db.add(usage)
    db.commit()


def create_coupon(db: Session, data: CouponCreate) -> Coupon:
    code = data.code.strip().upper()
    existing = db.query(Coupon).filter(Coupon.code == code).first()
    if existing:
        raise ConflictException(f"Coupon code '{code}' already exists")

    coupon = Coupon(
        code=code,
        description=data.description,
        discount_type=DiscountType(data.discount_type),
        discount_value=data.discount_value,
        max_discount_amount=data.max_discount_amount,
        min_order_amount=data.min_order_amount,
        max_uses=data.max_uses,
        uses_per_user=data.uses_per_user,
        valid_from=data.valid_from,
        valid_until=data.valid_until,
        is_active=data.is_active,
    )
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


def list_coupons(db: Session, active_only: bool = False) -> list[Coupon]:
    query = db.query(Coupon)
    if active_only:
        query = query.filter(Coupon.is_active)
    return query.order_by(Coupon.created_at.desc()).all()


def deactivate_coupon(db: Session, coupon_id: int) -> Coupon:
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise NotFoundException("Coupon", str(coupon_id))
    coupon.is_active = False
    db.commit()
    db.refresh(coupon)
    return coupon
