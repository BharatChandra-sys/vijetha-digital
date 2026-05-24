"""
Admin review moderation endpoints — list, hide/show, flag.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.auth.dependencies import admin_required
from app.db.session import get_db
from app.models.review import Review
from app.models.user import User

router = APIRouter(prefix="/reviews", tags=["admin-reviews"])


@router.get("")
def list_reviews(
    product_id: int | None = Query(None),
    flagged_only: bool = Query(False),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """List all reviews with optional filters."""
    query = db.query(Review)
    if product_id:
        query = query.filter(Review.product_id == product_id)
    if flagged_only:
        query = query.filter(Review.is_flagged)

    total = query.count()
    reviews = (
        query.order_by(Review.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": [
            {
                "id": r.id,
                "product_id": r.product_id,
                "user_id": r.user_id,
                "rating": r.rating,
                "title": r.title,
                "body": r.body,
                "is_visible": r.is_visible,
                "is_flagged": r.is_flagged,
                "flagged_reason": r.flagged_reason,
                "is_verified_purchase": r.is_verified_purchase,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in reviews
        ],
    }


@router.patch("/{review_id}/visibility")
def set_review_visibility(
    review_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Show or hide a review."""
    from datetime import datetime
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_visible = bool(data.get("is_visible", True))
    review.moderated_by = current_user.id
    review.moderated_at = datetime.utcnow()
    db.commit()
    return {"message": "Review visibility updated", "is_visible": review.is_visible}


@router.patch("/{review_id}/flag")
def flag_review(
    review_id: int,
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Flag or unflag a review."""
    from datetime import datetime
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Review not found")

    review.is_flagged = bool(data.get("is_flagged", True))
    review.flagged_reason = data.get("reason")
    review.moderated_by = current_user.id
    review.moderated_at = datetime.utcnow()
    db.commit()
    return {"message": "Review flag updated", "is_flagged": review.is_flagged}
