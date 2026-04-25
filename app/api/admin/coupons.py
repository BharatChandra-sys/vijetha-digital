"""
Admin coupon management endpoints — CRUD + deactivate.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.auth.dependencies import admin_required
from app.db.session import get_db
from app.models.user import User
from app.schemas.coupon import CouponCreate, CouponResponse
from app.services.coupon_service import create_coupon, deactivate_coupon, list_coupons

router = APIRouter(prefix="/coupons", tags=["admin-coupons"])


@router.get("", response_model=list[CouponResponse])
def list_all_coupons(
    active_only: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """List all coupons."""
    coupons = list_coupons(db, active_only=active_only)
    return [
        CouponResponse(
            id=c.id,
            code=c.code,
            description=c.description,
            discount_type=c.discount_type.value,
            discount_value=c.discount_value,
            max_discount_amount=c.max_discount_amount,
            min_order_amount=c.min_order_amount,
            max_uses=c.max_uses,
            uses_per_user=c.uses_per_user,
            valid_from=c.valid_from.isoformat(),
            valid_until=c.valid_until.isoformat() if c.valid_until else None,
            is_active=c.is_active,
        )
        for c in coupons
    ]


@router.post("", response_model=CouponResponse)
def create_coupon_endpoint(
    data: CouponCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Create a new coupon."""
    c = create_coupon(db, data)
    return CouponResponse(
        id=c.id,
        code=c.code,
        description=c.description,
        discount_type=c.discount_type.value,
        discount_value=c.discount_value,
        max_discount_amount=c.max_discount_amount,
        min_order_amount=c.min_order_amount,
        max_uses=c.max_uses,
        uses_per_user=c.uses_per_user,
        valid_from=c.valid_from.isoformat(),
        valid_until=c.valid_until.isoformat() if c.valid_until else None,
        is_active=c.is_active,
    )


@router.post("/{coupon_id}/deactivate")
def deactivate_coupon_endpoint(
    coupon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Deactivate a coupon."""
    deactivate_coupon(db, coupon_id)
    return {"message": "Coupon deactivated", "coupon_id": coupon_id}
