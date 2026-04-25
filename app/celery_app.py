"""
Celery application for background task processing.

Tasks:
- Email sending (welcome, password reset, order notifications)
- Invoice generation
- Notification delivery
- Scheduled cleanup jobs
"""
from celery import Celery
from celery.schedules import crontab

from app.core.config import settings

# Initialize Celery with Redis as broker and result backend
celery_app = Celery(
    "vijetha_digital",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "app.tasks.email_tasks",
        "app.tasks.notification_tasks",
        "app.tasks.cleanup_tasks",
    ],
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,  # 5 minutes max per task
    task_soft_time_limit=240,  # 4 minutes soft limit
    worker_prefetch_multiplier=1,  # Fetch one task at a time for fair distribution
    worker_max_tasks_per_child=1000,  # Restart worker after 1000 tasks to prevent memory leaks
    result_expires=3600,  # Results expire after 1 hour
)

# Scheduled tasks (Celery Beat)
celery_app.conf.beat_schedule = {
    "cleanup-expired-tokens": {
        "task": "app.tasks.cleanup_tasks.cleanup_expired_tokens",
        "schedule": crontab(hour=2, minute=0),  # Daily at 2 AM
    },
    "cleanup-old-access-logs": {
        "task": "app.tasks.cleanup_tasks.cleanup_old_access_logs",
        "schedule": crontab(hour=3, minute=0),  # Daily at 3 AM
    },
    "cleanup-expired-password-resets": {
        "task": "app.tasks.cleanup_tasks.cleanup_expired_password_resets",
        "schedule": crontab(hour=1, minute=30),  # Daily at 1:30 AM
    },
}

if __name__ == "__main__":
    celery_app.start()
