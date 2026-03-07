from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.core.deps import get_current_user, get_current_user_optional
from app.models.user import User
from app.models.product import Product
from app.schemas.review import ReviewCreate, ReviewResponse, ReviewSummary
from app.services.review_service import (
    create_review,
    get_reviews_for_product,
    get_review_summary,
    get_user_review,
)
from app.services.upload_service import upload_file

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

router = APIRouter(prefix="/products/{product_id}/reviews", tags=["reviews"])


@router.get("", response_model=list[ReviewResponse])
def list_reviews(
    product_id: int,
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    reviews = get_reviews_for_product(db, product_id, page, per_page)
    return [
        ReviewResponse(
            id=r.id,
            product_id=r.product_id,
            user_id=r.user_id,
            user_name=r.user.full_name if r.user else "Anonymous",
            rating=r.rating,
            title=r.title,
            body=r.body,
            image_urls=r.image_urls,
            is_verified_purchase=r.is_verified_purchase,
            created_at=r.created_at,
        )
        for r in reviews
    ]


@router.get("/summary", response_model=ReviewSummary)
def review_summary(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return get_review_summary(db, product_id)


@router.get("/mine")
def my_review(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    review = get_user_review(db, product_id, current_user.id)
    if not review:
        return None
    return ReviewResponse(
        id=review.id,
        product_id=review.product_id,
        user_id=review.user_id,
        user_name=current_user.full_name,
        rating=review.rating,
        title=review.title,
        body=review.body,
        image_urls=review.image_urls,
        is_verified_purchase=review.is_verified_purchase,
        created_at=review.created_at,
    )


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def post_review(
    product_id: int,
    data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    try:
        review = create_review(
            db,
            product_id=product_id,
            user_id=current_user.id,
            rating=data.rating,
            title=data.title,
            body=data.body,
            image_urls=data.image_urls,
        )
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

    return ReviewResponse(
        id=review.id,
        product_id=review.product_id,
        user_id=review.user_id,
        user_name=current_user.full_name,
        rating=review.rating,
        title=review.title,
        body=review.body,
        image_urls=review.image_urls,
        is_verified_purchase=review.is_verified_purchase,
        created_at=review.created_at,
    )


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_review_media(
    product_id: int,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload up to 5 images/videos for a review. Returns list of URLs."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    if len(files) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 files allowed")

    urls: list[str] = []
    for f in files:
        if f.content_type not in ALLOWED_TYPES:
            raise HTTPException(
                status_code=400,
                detail=f"File type '{f.content_type}' not allowed. Accepted: JPEG, PNG, WebP, GIF, MP4, WebM",
            )
        content = await f.read()
        if len(content) > MAX_FILE_SIZE:
            raise HTTPException(status_code=400, detail=f"File '{f.filename}' exceeds 10 MB limit")
        url = upload_file(content)
        urls.append(url)

    return {"urls": urls}
