from sqlalchemy.orm import Session

from app.models.pricing import ExtraRate, MaterialRate


def calculate_price(
    *,
    db: Session,
    width_ft: float,
    height_ft: float,
    material: str,
    quantity: int,
    lamination: bool = False,
    frame: bool = False,
):
    """
    Production-grade pricing engine
    - Material: price per sqft
    - Extras: flat price per item
    - Quantity applied exactly once
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

    # 4️⃣ Final price
    unit_price = base_unit_price + extras_unit_price
    total_price = unit_price * quantity

    return {
        "unit_price": round(unit_price, 2),
        "total_price": round(total_price, 2),
    }
