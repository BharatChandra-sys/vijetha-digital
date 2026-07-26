"""
Orders router — place, list, detail, cancel, timeline, invoice.
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.api.auth.dependencies import get_current_user
from app.db.session import get_db
from app.models.order import Order, OrderStatus
from app.models.order_timeline import OrderTimeline
from app.schemas.order import (
    OrderCreate,
    OrderItemResponse,
    OrderResponse,
)
from app.services.invoice_service import generate_invoice_pdf
from app.services.notification_service import notify_order_placed
from app.services.order_service import create_order, get_user_orders, update_order_status

router = APIRouter(prefix="/orders", tags=["orders"])


def _serialize_order(order) -> dict:
    """Serialize an Order ORM object into a full OrderResponse dict."""
    return OrderResponse(
        id=order.id,
        user_id=order.user_id,
        status=order.status.value if hasattr(order.status, "value") else str(order.status),
        payment_status=order.payment_status.value if hasattr(order.payment_status, "value") else str(order.payment_status),
        subtotal=float(order.subtotal),
        tax=float(order.tax) if order.tax else 0,
        shipping=float(order.shipping) if order.shipping else 0,
        discount=float(order.discount) if order.discount else 0,
        coupon_code=order.coupon_code,
        coupon_discount=float(order.coupon_discount) if order.coupon_discount else 0,
        total_price=float(order.total_price),
        delivery_address=order.delivery_address,
        delivery_city=order.delivery_city,
        delivery_state=order.delivery_state,
        delivery_postal_code=order.delivery_postal_code,
        tracking_number=order.tracking_number,
        tracking_url=order.tracking_url,
        created_at=order.created_at.isoformat() if order.created_at else None,
        confirmed_at=order.confirmed_at.isoformat() if order.confirmed_at else None,
        paid_at=order.paid_at.isoformat() if order.paid_at else None,
        shipped_at=order.shipped_at.isoformat() if order.shipped_at else None,
        delivered_at=order.delivered_at.isoformat() if order.delivered_at else None,
        cancelled_at=order.cancelled_at.isoformat() if order.cancelled_at else None,
        items=[OrderItemResponse.from_orm_with_product(item) for item in order.items],
    ).model_dump()


@router.post("")
def place_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Place a new order. Supports standard products and custom signage items."""
    order = create_order(db, user.id, data.items)

    # Persist delivery info if provided
    if data.delivery_address:
        order.delivery_address = data.delivery_address
    if data.delivery_city:
        order.delivery_city = data.delivery_city
    if data.delivery_state:
        order.delivery_state = data.delivery_state
    if data.delivery_postal_code:
        order.delivery_postal_code = data.delivery_postal_code
    if data.delivery_notes:
        order.delivery_notes = data.delivery_notes
    if data.coupon_code:
        order.coupon_code = data.coupon_code
    db.commit()
    db.refresh(order)

    # Fire notification (non-blocking — errors are logged)
    try:
        notify_order_placed(db, user.id, order.id)
    except Exception as e:
        from loguru import logger
        logger.error(
            f"Failed to send order notification: {e}",
            extra={"user_id": user.id, "order_id": order.id},
            exc_info=True
        )

    return _serialize_order(order)


@router.get("")
def my_orders(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """List all orders for the authenticated user."""
    orders = get_user_orders(db, user.id)
    return [_serialize_order(o) for o in orders]


@router.get("/{order_id}")
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Get a single order by ID (owner only)."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
        Order.is_deleted == False,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return _serialize_order(order)


@router.post("/{order_id}/cancel")
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """
    Cancel a placed order (owner only).
    Only allowed when status is 'placed' or 'confirmed'.
    """
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
        Order.is_deleted == False,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.status not in (OrderStatus.placed, OrderStatus.confirmed, OrderStatus.draft):
        raise HTTPException(
            status_code=400,
            detail=f"Cannot cancel order in '{order.status.value}' status",
        )

    try:
        updated = update_order_status(db, order_id, "cancelled", note="Cancelled by customer")
    except HTTPException:
        raise

    return {"message": "Order cancelled", "order_id": updated.id, "status": updated.status.value}


@router.get("/{order_id}/timeline")
def get_order_timeline(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Get the status timeline for an order (owner only)."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
        Order.is_deleted == False,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    entries = (
        db.query(OrderTimeline)
        .filter(OrderTimeline.order_id == order_id)
        .order_by(OrderTimeline.created_at.asc())
        .all()
    )
    return [
        {
            "status": e.to_status,
            "note": e.note,
            "created_at": e.created_at.isoformat() if e.created_at else None,
        }
        for e in entries
    ]


@router.get("/{order_id}/invoice")
def download_invoice(
    order_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    """Generate and stream a PDF invoice for the given order."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
        Order.is_deleted == False,
    ).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    pdf_bytes = generate_invoice_pdf(db, order)
    filename = f"Vijetha_Invoice_VJ{order.id:08d}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

