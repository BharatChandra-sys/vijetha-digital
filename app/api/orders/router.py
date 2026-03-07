from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.schemas.order import OrderCreate, OrderResponse, OrderItemResponse
from app.services.order_service import create_order, get_user_orders
from app.services.invoice_service import generate_invoice_pdf
from app.models.order import Order
from app.db.session import get_db
from app.api.auth.dependencies import get_current_user

router = APIRouter(prefix="/orders", tags=["orders"])


def _serialize_order(order) -> dict:
    """Serialize an Order ORM object into OrderResponse dict with product info."""
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        status=order.status.value if hasattr(order.status, "value") else str(order.status),
        payment_status=order.payment_status.value if hasattr(order.payment_status, "value") else str(order.payment_status),
        subtotal=float(order.subtotal),
        tax=float(order.tax) if order.tax else 0,
        shipping=float(order.shipping) if order.shipping else 0,
        discount=float(order.discount) if order.discount else 0,
        total_price=float(order.total_price),
        created_at=order.created_at.isoformat() if order.created_at else None,
        paid_at=order.paid_at.isoformat() if order.paid_at else None,
        items=[OrderItemResponse.from_orm_with_product(item) for item in order.items],
    ).model_dump()


@router.post("")
def place_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    order = create_order(db, user.id, data.items)
    return _serialize_order(order)


@router.get("")
def my_orders(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    orders = get_user_orders(db, user.id)
    return [_serialize_order(o) for o in orders]


@router.get("/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _serialize_order(order)


@router.get("/{order_id}/invoice")
def download_invoice(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Generate and return a PDF invoice for the given order."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    pdf_bytes = generate_invoice_pdf(db, order)
    filename = f"Vijetha_Invoice_VJ{order.id:08d}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
        },
    )
