"""
Coupons router — validate coupon for authenticated users.
Admin coupon CRUD lives in the admin router.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.auth.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.coupon import CouponValidateRequest, CouponValidateResponse
from app.services.coupon_service import validate_coupon

router = APIRouter(prefix="/coupons", tags=["coupons"])


@router.post("/validate", response_model=CouponValidateResponse)
def validate_coupon_endpoint(
    data: CouponValidateRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """
    Validate a coupon code against an order amount.
    Returns discount amount and validity status.
    """
    result = validate_coupon(
        db=db,
        code=data.code,
        order_amount=data.order_amount,
        user_id=user.id,
    )
    return CouponValidateResponse(**result)
