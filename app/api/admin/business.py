"""
Admin endpoints for business verification and management.
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin
from app.models.user import User
from app.services import business_service

router = APIRouter(prefix="/business", tags=["admin-business"])


class ApproveBusinessRequest(BaseModel):
    """Request to approve business verification."""
    credit_limit: float = 50000.0
    payment_terms_days: int = 30
    discount_percentage: float = 5.0


class RejectBusinessRequest(BaseModel):
    """Request to reject business verification."""
    rejection_reason: str


class UpdateCreditLimitRequest(BaseModel):
    """Request to update credit limit."""
    credit_limit: float


@router.get("/pending")
def list_pending_verifications(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    """
    List all pending business verifications.

    Returns list of business profiles awaiting verification.
    """
    profiles = business_service.list_pending_verifications(db)

    return [
        {
            "id": p.id,
            "user_id": p.user_id,
            "user_email": p.user.email,
            "user_name": p.user.full_name,
            "company_name": p.company_name,
            "gst_number": p.gst_number,
            "business_type": p.business_type,
            "address": p.address,
            "city": p.city,
            "state": p.state,
            "pincode": p.pincode,
            "phone": p.phone,
            "verification_status": p.verification_status.value,
            "created_at": p.created_at.isoformat() if p.created_at else None,
        }
        for p in profiles
    ]


@router.post("/{profile_id}/approve")
def approve_business(
    profile_id: int,
    data: ApproveBusinessRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Approve a business verification.

    Sets credit terms and sends approval email.
    """
    return business_service.approve_business_verification(
        db=db,
        profile_id=profile_id,
        admin_id=admin.id,
        credit_limit=data.credit_limit,
        payment_terms_days=data.payment_terms_days,
        discount_percentage=data.discount_percentage,
    )


@router.post("/{profile_id}/reject")
def reject_business(
    profile_id: int,
    data: RejectBusinessRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Reject a business verification.

    Sends rejection email with reason.
    """
    return business_service.reject_business_verification(
        db=db,
        profile_id=profile_id,
        admin_id=admin.id,
        rejection_reason=data.rejection_reason,
    )


@router.put("/{profile_id}/credit-limit")
def update_credit_limit(
    profile_id: int,
    data: UpdateCreditLimitRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    """
    Update credit limit for a verified business.
    """
    return business_service.update_credit_limit(
        db=db,
        profile_id=profile_id,
        credit_limit=data.credit_limit,
        admin_id=admin.id,
    )
