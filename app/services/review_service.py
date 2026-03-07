from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.review import Review
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.order_item import OrderItem


def create_review(
    db: Session,
    product_id: int,
    user_id: int,
    rating: int,
    title: str | None = None,
    body: str | None = None,
    image_urls: list[str] | None = None,
) -> Review:
    # Check if user already reviewed this product
    existing = (
        db.query(Review)
        .filter(Review.product_id == product_id, Review.user_id == user_id)
        .first()
    )
    if existing:
        raise ValueError("You have already reviewed this product")

    # Check if user has purchased this product (verified purchase)
    is_verified = (
        db.query(Order)
        .join(OrderItem, OrderItem.order_id == Order.id)
        .filter(
            Order.user_id == user_id,
            OrderItem.product_id == product_id,
            Order.payment_status == PaymentStatus.paid,
        )
        .first()
        is not None
    )

    review = Review(
        product_id=product_id,
        user_id=user_id,
        rating=rating,
        title=title,
        body=body,
        image_urls=image_urls or [],
        is_verified_purchase=is_verified,
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


def get_reviews_for_product(
    db: Session, product_id: int, page: int = 1, per_page: int = 10
) -> list[Review]:
    return (
        db.query(Review)
        .filter(Review.product_id == product_id, Review.is_visible == True)
        .order_by(Review.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )


def get_review_summary(db: Session, product_id: int) -> dict:
    rows = (
        db.query(Review.rating, func.count(Review.id))
        .filter(Review.product_id == product_id, Review.is_visible == True)
        .group_by(Review.rating)
        .all()
    )
    distribution = {i: 0 for i in range(1, 6)}
    total = 0
    weighted = 0
    for rating, count in rows:
        distribution[rating] = count
        total += count
        weighted += rating * count
    return {
        "average_rating": round(weighted / total, 1) if total else 0,
        "total_reviews": total,
        "distribution": distribution,
    }


def get_user_review(db: Session, product_id: int, user_id: int) -> Review | None:
    return (
        db.query(Review)
        .filter(Review.product_id == product_id, Review.user_id == user_id)
        .first()
    )
