"""
Notification service — create, list, mark-read, and unread count.
"""
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.models.notification import Notification, NotificationType


def create_notification(
    db: Session,
    user_id: int,
    notification_type: NotificationType,
    title: str,
    message: str,
    data: Optional[Dict[str, Any]] = None,
) -> Notification:
    """Create and persist a notification for a user."""
    notif = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        data=data or {},
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif


def get_user_notifications(
    db: Session,
    user_id: int,
    unread_only: bool = False,
    limit: int = 50,
    offset: int = 0,
) -> List[Notification]:
    query = db.query(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        query = query.filter(Notification.is_read == False)
    return (
        query.order_by(Notification.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .count()
    )


def mark_read(db: Session, notification_id: int, user_id: int) -> bool:
    from datetime import datetime
    notif = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id,
    ).first()
    if not notif:
        return False
    notif.is_read = True
    notif.read_at = datetime.utcnow()
    db.commit()
    return True


def mark_all_read(db: Session, user_id: int) -> int:
    from datetime import datetime
    now = datetime.utcnow()
    updated = (
        db.query(Notification)
        .filter(Notification.user_id == user_id, Notification.is_read == False)
        .all()
    )
    for n in updated:
        n.is_read = True
        n.read_at = now
    db.commit()
    return len(updated)


# ── Order event helpers ───────────────────────────────────────────────

def notify_order_placed(db: Session, user_id: int, order_id: int) -> None:
    create_notification(
        db, user_id, NotificationType.ORDER_PLACED,
        title="Order Placed",
        message=f"Your order #{order_id} has been placed successfully.",
        data={"order_id": order_id},
    )


def notify_order_confirmed(db: Session, user_id: int, order_id: int) -> None:
    create_notification(
        db, user_id, NotificationType.ORDER_CONFIRMED,
        title="Order Confirmed",
        message=f"Your order #{order_id} has been confirmed and is being processed.",
        data={"order_id": order_id},
    )


def notify_order_shipped(db: Session, user_id: int, order_id: int, tracking_number: Optional[str] = None) -> None:
    msg = f"Your order #{order_id} has been shipped."
    if tracking_number:
        msg += f" Tracking: {tracking_number}"
    create_notification(
        db, user_id, NotificationType.ORDER_SHIPPED,
        title="Order Shipped",
        message=msg,
        data={"order_id": order_id, "tracking_number": tracking_number},
    )


def notify_payment_received(db: Session, user_id: int, order_id: int, amount: float) -> None:
    create_notification(
        db, user_id, NotificationType.PAYMENT_RECEIVED,
        title="Payment Received",
        message=f"Payment of ₹{amount:.2f} received for order #{order_id}.",
        data={"order_id": order_id, "amount": amount},
    )
