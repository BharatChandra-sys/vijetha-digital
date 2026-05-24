"""
Notifications router — list, mark-read, unread count.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.auth.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.services.notification_service import (
    get_unread_count,
    get_user_notifications,
    mark_all_read,
    mark_read,
)

router = APIRouter(prefix="/notifications", tags=["notifications"])


@router.get("")
def list_notifications(
    unread_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """List notifications for the authenticated user."""
    notifications = get_user_notifications(
        db, user.id, unread_only=unread_only, limit=limit, offset=offset
    )
    return [
        {
            "id": n.id,
            "type": n.type.value,
            "title": n.title,
            "message": n.message,
            "data": n.data,
            "is_read": n.is_read,
            "read_at": n.read_at.isoformat() if n.read_at else None,
            "created_at": n.created_at.isoformat() if n.created_at else None,
        }
        for n in notifications
    ]


@router.get("/unread-count")
def unread_count(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Return the count of unread notifications."""
    return {"unread_count": get_unread_count(db, user.id)}


@router.post("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Mark a single notification as read."""
    success = mark_read(db, notification_id, user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Marked as read"}


@router.post("/read-all")
def mark_all_notifications_read(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Mark all notifications as read."""
    count = mark_all_read(db, user.id)
    return {"message": f"{count} notifications marked as read"}
