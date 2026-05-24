from sqlalchemy.orm import Session

from app.models.pricing import ExtraRate, MaterialRate

# Quantity break tiers (quantity: discount_percentage)
QUANTITY_BREAKS = {
    10: 5.0,   # 5% off for 10+ items
    25: 10.0,  # 10% off for 25+ items
    50: 15.0,  # 15% off for 50+ items
    100: 20.0, # 20% off for 100+ items
}


def _get_quantity_discount(quantity: int) -> float:
    """
    Calculate quantity discount percentage based on quantity breaks.

    Args:
        quantity: Number of items

    Returns:
        Discount percentage (0-100)
    """
    discount = 0.0
    for qty_threshold, discount_pct in sorted(QUANTITY_BREAKS.items(), reverse=True):
        if quantity >= qty_threshold:
            discount = discount_pct
            break
    return discount


def _get_business_discount(db: Session, user_id: int = None) -> float:
    """
    Get business discount for a user if they have a verified business profile.

    Args:
        db: Database session
        user_id: User ID

    Returns:
        Discount percentage (0-100)
    """
    if not user_id:
        return 0.0

    from app.models.business_profile import BusinessProfile, BusinessStatus

    profile = db.query(BusinessProfile).filter(
        BusinessProfile.user_id == user_id,
        BusinessProfile.status == BusinessStatus.VERIFIED,
    ).first()

    if profile and profile.discount_percentage:
        return float(profile.discount_percentage)

    return 0.0


def calculate_price(
    *,
    db: Session,
    width_ft: float,
    height_ft: float,
    material: str,
    quantity: int,
    lamination: bool = False,
    frame: bool = False,
    user_id: int = None,
    coupon_code: str = None,
):
    """
    Production-grade pricing engine with quantity breaks and business discounts.

    Args:
        db: Database session
        width_ft: Width in feet
        height_ft: Height in feet
        material: Material name
        quantity: Quantity
        lamination: Include lamination
        frame: Include frame
        user_id: User ID for business discount
        coupon_code: Coupon code for additional discount

    Returns:
        Dict with pricing breakdown
    """

    # 1️⃣ Area
    area = width_ft * height_ft
    if area <= 0 or quantity <= 0:
        raise ValueError("Invalid dimensions or quantity")

    # 2️⃣ Material rate (single source of truth)
    material_rate = (
        db.query(MaterialRate)
        .filter(MaterialRate.name == material)
        .first()
    )

    if not material_rate:
        raise ValueError("Material rate not configured")

    base_unit_price = area * float(material_rate.rate_per_sqft)

    # 3️⃣ Extras (flat price)
    extras_unit_price = 0.0

    if lamination:
        extra = db.query(ExtraRate).filter(ExtraRate.name == "lamination").first()
        if extra:
            extras_unit_price += float(extra.price)

    if frame:
        extra = db.query(ExtraRate).filter(ExtraRate.name == "frame").first()
        if extra:
            extras_unit_price += float(extra.price)

    # 4️⃣ Base pricing
    unit_price = base_unit_price + extras_unit_price
    subtotal = unit_price * quantity

    # 5️⃣ Quantity discount
    quantity_discount_pct = _get_quantity_discount(quantity)
    quantity_discount_amount = subtotal * (quantity_discount_pct / 100)

    # 6️⃣ Business discount (applied after quantity discount)
    business_discount_pct = _get_business_discount(db, user_id)
    business_discount_amount = (subtotal - quantity_discount_amount) * (business_discount_pct / 100)

    # 7️⃣ Coupon discount (applied last)
    coupon_discount_amount = 0.0
    coupon_discount_pct = 0.0
    if coupon_code:
        from app.services.coupon_service import validate_coupon
        try:
            coupon_result = validate_coupon(db, coupon_code, user_id)
            if coupon_result["valid"]:
                coupon = coupon_result["coupon"]
                if coupon.discount_type == "percentage":
                    coupon_discount_pct = float(coupon.discount_value)
                    coupon_discount_amount = (
                        subtotal - quantity_discount_amount - business_discount_amount
                    ) * (coupon_discount_pct / 100)
                else:  # fixed
                    coupon_discount_amount = min(
                        float(coupon.discount_value),
                        subtotal - quantity_discount_amount - business_discount_amount
                    )
        except Exception:
            # Invalid coupon, skip discount
            pass

    # 8️⃣ Final price
    total_discount = quantity_discount_amount + business_discount_amount + coupon_discount_amount
    total_price = max(subtotal - total_discount, 0)

    return {
        "unit_price": round(unit_price, 2),
        "subtotal": round(subtotal, 2),
        "quantity_discount": round(quantity_discount_amount, 2),
        "quantity_discount_pct": quantity_discount_pct,
        "business_discount": round(business_discount_amount, 2),
        "business_discount_pct": business_discount_pct,
        "coupon_discount": round(coupon_discount_amount, 2),
        "coupon_code": coupon_code if coupon_discount_amount > 0 else None,
        "total_discount": round(total_discount, 2),
        "total_price": round(total_price, 2),
        "breakdown": {
            "base_unit_price": round(base_unit_price, 2),
            "extras_unit_price": round(extras_unit_price, 2),
            "quantity": quantity,
        }
    }
