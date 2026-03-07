from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.order import OrderCreate
from app.services.order_service import create_order, get_user_orders
from app.db.session import get_db
from app.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("")
def place_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return create_order(db, user.id, data.items)


@router.get("")
def my_orders(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return get_user_orders(db, user.id)
