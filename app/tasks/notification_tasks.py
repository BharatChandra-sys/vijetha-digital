"""
Notification delivery tasks for background processing.
"""
from celery import Task
from sqlalchemy.orm import Session

from app.celery_app import celery_app
from app.db.session import SessionLocal


class DatabaseTask(Task):
    """Base task with database session management."""

    _db: Session = None

    def after_return(self, *args, **kwargs):
        if self._db is not None:
            self._db.close()

    @property
    def db(self) -> Session:
        if self._db is None:
            self._db = SessionLocal()
        return self._db


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.notification_tasks.send_notification_task",
    max_retries=3,
    default_retry_delay=30,
)
def send_notification_task(
    self,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "info",
):
    """
    Create and send a notification to a user.

    Args:
        user_id: Target user ID
        title: Notification title
        message: Notification message
        notification_type: Type of notification (info, success, warning, error)
    """
    try:
        from app.models.notification import Notification

        notification = Notification(
            user_id=user_id,
            title=title,
            message=message,
            type=notification_type,
            is_read=False,
        )

        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)

        # Send via WebSocket if user is connected
        try:
            import asyncio

            from app.api.websocket import manager

            asyncio.run(manager.send_personal_message(
                {
                    "type": "notification",
                    "data": {
                        "id": notification.id,
                        "title": notification.title,
                        "message": notification.message,
                        "type": notification.type,
                        "created_at": notification.created_at.isoformat() if notification.created_at else None,
                    }
                },
                user_id
            ))
        except Exception:
            # WebSocket delivery failed, notification is still in DB
            pass

    except Exception as exc:
        self.db.rollback()
        raise self.retry(exc=exc, countdown=30 * (2 ** self.request.retries))


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.notification_tasks.send_bulk_notifications_task",
    max_retries=2,
)
def send_bulk_notifications_task(
    self,
    user_ids: list[int],
    title: str,
    message: str,
    notification_type: str = "info",
):
    """
    Send notifications to multiple users.

    Args:
        user_ids: List of target user IDs
        title: Notification title
        message: Notification message
        notification_type: Type of notification
    """
    try:
        from app.models.notification import Notification

        notifications = [
            Notification(
                user_id=user_id,
                title=title,
                message=message,
                type=notification_type,
                is_read=False,
            )
            for user_id in user_ids
        ]

        self.db.bulk_save_objects(notifications)
        self.db.commit()

    except Exception as exc:
        self.db.rollback()
        raise self.retry(exc=exc, countdown=60)
