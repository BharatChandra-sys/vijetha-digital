from datetime import datetime

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.order_item import OrderItem
from app.models.order_timeline import OrderTimeline
from app.models.product import Product
from app.services.pricing_service import calculate_price


def _record_timeline(db: Session, order_id: int, status: str, note: str = "") -> None:
    """Append a timeline entry for an order status change."""
    entry = OrderTimeline(
        order_id=order_id,
        to_status=status,
        note=note,
        created_at=datetime.utcnow(),
    )
    db.add(entry)


# ---------------- CREATE ORDER ----------------
def create_order(db: Session, user_id: int, items):
    """
    Create order for logged-in user (id-based ownership)
    Supports both standard product items and custom signage items.
    """

    order = Order(
        user_id=user_id,
        status=OrderStatus.placed,
        payment_status=PaymentStatus.pending,
        subtotal=0,
        tax=0,
        discount=0,
        shipping=0,
        total_price=0,
    )

    db.add(order)
    db.flush()  # get order.id without commit

    grand_total = 0.0

    for item in items:
        if item.product_id is not None:
            # Standard product — look up price from DB (never trust client)
            product = db.query(Product).filter(
                Product.id == item.product_id,
                Product.is_active == True,
            ).first()
            if not product:
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")

            unit_price = float(product.base_price)
            total_price = round(unit_price * item.quantity, 2)

            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                product_name=product.name,
                product_category=product.category,
                quantity=item.quantity,
                unit_price=unit_price,
                total_price=total_price,
            )
        else:
            # Custom signage item — use pricing engine
            price = calculate_price(
                db=db,
                width_ft=item.width_ft,
                height_ft=item.height_ft,
                material=item.material,
                quantity=item.quantity,
                lamination=item.lamination,
                frame=item.frame,
            )

            order_item = OrderItem(
                order_id=order.id,
                width_ft=item.width_ft,
                height_ft=item.height_ft,
                material=item.material,
                quantity=item.quantity,
                unit_price=price["unit_price"],
                total_price=price["total_price"],
                print_specs={
                    "lamination": item.lamination,
                    "frame": item.frame,
                },
            )

        db.add(order_item)
        grand_total += float(order_item.total_price)

    order.subtotal = round(grand_total, 2)
    order.total_price = round(grand_total, 2)

    _record_timeline(db, order.id, OrderStatus.placed.value, "Order placed")

    db.commit()
    db.refresh(order)
    return order


# ---------------- USER ORDERS ----------------
def get_user_orders(db: Session, user_id: int):
    return (
        db.query(Order)
        .filter(Order.user_id == user_id, Order.is_deleted == False)
        .order_by(Order.id.desc())
        .all()
    )


# ---------------- ADMIN ORDERS ----------------
def get_all_orders(db: Session):
    return db.query(Order).filter(Order.is_deleted == False).order_by(Order.id.desc()).all()


# ---------------- SAFE STATUS UPDATE (CRITICAL FIX) ----------------

# Allowed state transitions map
_ALLOWED_TRANSITIONS = {
    OrderStatus.draft:          [OrderStatus.placed, OrderStatus.cancelled],
    OrderStatus.placed:         [OrderStatus.confirmed, OrderStatus.cancelled],
    OrderStatus.confirmed:      [OrderStatus.printing, OrderStatus.cancelled],
    OrderStatus.printing:       [OrderStatus.quality_check, OrderStatus.cancelled],
    OrderStatus.quality_check:  [OrderStatus.shipped, OrderStatus.cancelled],
    OrderStatus.shipped:        [OrderStatus.delivered],
    OrderStatus.delivered:      [OrderStatus.refunded],
    OrderStatus.cancelled:      [],
    OrderStatus.refunded:       [],
}

# Timestamp fields to set on transition
_TRANSITION_TIMESTAMPS = {
    OrderStatus.confirmed: "confirmed_at",
    OrderStatus.shipped:   "shipped_at",
    OrderStatus.delivered: "delivered_at",
    OrderStatus.cancelled: "cancelled_at",
}


def update_order_status(
    db: Session,
    order_id: int,
    new_status: str,
    note: str = "",
    admin_id: int = None,
    tracking_number: str = None,
    tracking_url: str = None,
) -> Order:
    """
    Update order status with admin notes and tracking information.
    
    Args:
        db: Database session
        order_id: Order ID
        new_status: New status value
        note: Admin note for the transition
        admin_id: ID of admin making the change
        tracking_number: Tracking number for shipment
        tracking_url: Tracking URL for shipment
        
    Returns:
        Updated order
    """
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    current_status = order.status

    try:
        target_status = OrderStatus(new_status)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status value: {new_status}",
        )

    if target_status not in _ALLOWED_TRANSITIONS.get(current_status, []):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status transition: {current_status} → {new_status}",
        )

    order.status = target_status

    # Set audit timestamp if applicable
    ts_field = _TRANSITION_TIMESTAMPS.get(target_status)
    if ts_field and hasattr(order, ts_field):
        setattr(order, ts_field, datetime.utcnow())
    
    # Update tracking information if provided
    if tracking_number:
        order.tracking_number = tracking_number
    if tracking_url:
        order.tracking_url = tracking_url

    # Record timeline with admin info
    timeline_note = note or f"Status changed to {target_status.value}"
    if admin_id:
        timeline_note += f" (by admin #{admin_id})"
    
    _record_timeline(db, order.id, target_status.value, timeline_note)
    
    # Create audit log entry
    from app.models.audit_log import AuditLog
    if admin_id:
        audit_entry = AuditLog(
            user_id=admin_id,
            action="order_status_update",
            resource_type="order",
            resource_id=order.id,
            details={
                "old_status": current_status.value,
                "new_status": target_status.value,
                "note": note,
                "tracking_number": tracking_number,
                "tracking_url": tracking_url,
            },
        )
        db.add(audit_entry)

    db.commit()
    db.refresh(order)
    return order


def add_admin_note(db: Session, order_id: int, admin_id: int, note: str) -> dict:
    """
    Add an admin note to an order without changing status.
    
    Args:
        db: Database session
        order_id: Order ID
        admin_id: Admin user ID
        note: Note content
        
    Returns:
        Success message
    """
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Add timeline entry with note
    _record_timeline(db, order.id, order.status.value, f"Admin note: {note}")
    
    # Create audit log
    from app.models.audit_log import AuditLog
    audit_entry = AuditLog(
        user_id=admin_id,
        action="order_note_added",
        resource_type="order",
        resource_id=order.id,
        details={"note": note},
    )
    db.add(audit_entry)
    
    db.commit()
    
    return {"message": "Note added successfully", "order_id": order_id}


def update_tracking_info(
    db: Session,
    order_id: int,
    tracking_number: str,
    tracking_url: str = None,
    admin_id: int = None,
) -> Order:
    """
    Update tracking information for an order.
    
    Args:
        db: Database session
        order_id: Order ID
        tracking_number: Tracking number
        tracking_url: Optional tracking URL
        admin_id: Admin user ID
        
    Returns:
        Updated order
    """
    order = db.query(Order).filter(Order.id == order_id, Order.is_deleted == False).first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.tracking_number = tracking_number
    if tracking_url:
        order.tracking_url = tracking_url
    
    # Add timeline entry
    note = f"Tracking updated: {tracking_number}"
    if admin_id:
        note += f" (by admin #{admin_id})"
    _record_timeline(db, order.id, order.status.value, note)
    
    # Send notification to user
    from app.tasks.notification_tasks import send_notification_task
    send_notification_task.delay(
        user_id=order.user_id,
        title="Tracking Information Updated",
        message=f"Your order #{order.id} tracking has been updated: {tracking_number}",
        notification_type="info",
    )
    
    # Send email if order is shipped
    if order.status == OrderStatus.shipped:
        from app.tasks.email_tasks import send_order_shipped_email_task
        send_order_shipped_email_task.delay(
            to_email=order.user.email,
            user_name=order.user.full_name,
            order_id=order.id,
            tracking_number=tracking_number,
            tracking_url=tracking_url or f"https://tracking.example.com/{tracking_number}",
        )
    
    db.commit()
    db.refresh(order)
    return order
