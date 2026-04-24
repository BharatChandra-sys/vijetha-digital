from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.rate_limiter import limiter
from app.db.session import get_db
from app.schemas.pricing import PriceRequest, PriceResponse
from app.services.pricing_service import calculate_price

router = APIRouter(
    prefix="/pricing",
    tags=["pricing"],
)


@router.post("/calculate", response_model=PriceResponse)
@limiter.limit("30/minute")
def calculate_pricing(
    request: Request,  # ✅ REQUIRED
    data: PriceRequest,
    db: Session = Depends(get_db),
):
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

        return {
            "unit_price": result["unit_price"],
            "total_price": result["total_price"],
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )
