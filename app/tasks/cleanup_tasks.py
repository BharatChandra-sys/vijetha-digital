"""
Scheduled cleanup tasks for database maintenance.
Run by Celery Beat on a schedule.
"""
from datetime import datetime, timedelta

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
    name="app.tasks.cleanup_tasks.cleanup_expired_tokens",
)
def cleanup_expired_tokens(self):
    """
    Remove expired tokens from the blacklist.
    Runs daily at 2 AM.
    """
    try:
        from app.models.token_blacklist import TokenBlacklist
        
        # Delete tokens older than 8 days (refresh token expiry + 1 day buffer)
        cutoff_date = datetime.utcnow() - timedelta(days=8)
        
        deleted_count = (
            self.db.query(TokenBlacklist)
            .filter(TokenBlacklist.blacklisted_at < cutoff_date)
            .delete()
        )
        
        self.db.commit()
        
        return {
            "task": "cleanup_expired_tokens",
            "deleted_count": deleted_count,
            "cutoff_date": cutoff_date.isoformat(),
        }
        
    except Exception as exc:
        self.db.rollback()
        raise exc


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.cleanup_tasks.cleanup_old_access_logs",
)
def cleanup_old_access_logs(self):
    """
    Archive or delete old access logs.
    Runs daily at 3 AM.
    Keeps last 90 days of logs.
    """
    try:
        from app.models.access_log import AccessLog
        
        # Delete logs older than 90 days
        cutoff_date = datetime.utcnow() - timedelta(days=90)
        
        deleted_count = (
            self.db.query(AccessLog)
            .filter(AccessLog.timestamp < cutoff_date)
            .delete()
        )
        
        self.db.commit()
        
        return {
            "task": "cleanup_old_access_logs",
            "deleted_count": deleted_count,
            "cutoff_date": cutoff_date.isoformat(),
        }
        
    except Exception as exc:
        self.db.rollback()
        raise exc


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.cleanup_tasks.cleanup_expired_password_resets",
)
def cleanup_expired_password_resets(self):
    """
    Remove expired password reset tokens.
    Runs daily at 1:30 AM.
    """
    try:
        from app.models.password_reset import PasswordReset
        
        # Delete tokens older than 1 day
        cutoff_date = datetime.utcnow() - timedelta(days=1)
        
        deleted_count = (
            self.db.query(PasswordReset)
            .filter(PasswordReset.created_at < cutoff_date)
            .delete()
        )
        
        self.db.commit()
        
        return {
            "task": "cleanup_expired_password_resets",
            "deleted_count": deleted_count,
            "cutoff_date": cutoff_date.isoformat(),
        }
        
    except Exception as exc:
        self.db.rollback()
        raise exc


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.cleanup_tasks.cleanup_unread_notifications",
)
def cleanup_unread_notifications(self):
    """
    Delete old unread notifications (older than 30 days).
    Runs weekly.
    """
    try:
        from app.models.notification import Notification
        
        cutoff_date = datetime.utcnow() - timedelta(days=30)
        
        deleted_count = (
            self.db.query(Notification)
            .filter(
                Notification.is_read == False,
                Notification.created_at < cutoff_date,
            )
            .delete()
        )
        
        self.db.commit()
        
        return {
            "task": "cleanup_unread_notifications",
            "deleted_count": deleted_count,
            "cutoff_date": cutoff_date.isoformat(),
        }
        
    except Exception as exc:
        self.db.rollback()
        raise exc
