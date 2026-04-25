"""
Products public router — list, detail, calculate price.
Admin CRUD lives in app/api/admin/router.py.
"""
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from sqlalchemy.orm import Session

from app.core.rate_limiter import limiter
from app.db.session import get_db
from app.schemas.product import PriceCalculateRequest, PriceCalculateResponse, ProductResponse
from app.services.pricing_service import calculate_price
from app.services.product_service import get_all_products, get_product_by_id, get_product_by_slug

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[ProductResponse])
def list_products(
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all active products, optionally filtered by category."""
    products = get_all_products(db, active_only=True)
    if category:
        products = [p for p in products if p.category.lower() == category.lower()]
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID."""
    try:
        return get_product_by_id(db, product_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Product not found")


@router.get("/slug/{slug}", response_model=ProductResponse)
def get_product_by_slug_route(slug: str, db: Session = Depends(get_db)):
    """Get a single active product by slug."""
    try:
        return get_product_by_slug(db, slug)
    except Exception:
        raise HTTPException(status_code=404, detail="Product not found")


@router.post("/calculate-price", response_model=PriceCalculateResponse)
@limiter.limit("30/minute")
def calculate_product_price(
    request: Request,
    data: PriceCalculateRequest,
    db: Session = Depends(get_db),
):
    """
    Calculate price for a custom signage item.
    Uses the canonical pricing engine (material rates + extras).
    """
    try:
        result = calculate_price(
            db=db,
            width_ft=data.width_ft,
            height_ft=data.height_ft,
            material=data.material,
            quantity=data.quantity,
            lamination=data.lamination,
            frame=data.frame,
        )
        area = round(data.width_ft * data.height_ft, 4)
        return PriceCalculateResponse(
            unit_price=result["unit_price"],
            total_price=result["total_price"],
            area_sqft=area,
            material=data.material,
            quantity=data.quantity,
            breakdown={
                "width_ft": data.width_ft,
                "height_ft": data.height_ft,
                "lamination": data.lamination,
                "frame": data.frame,
            },
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
