"""
Email sending tasks for background processing.
All email operations should be queued through these tasks.
"""
from celery import Task
from sqlalchemy.orm import Session

from app.celery_app import celery_app
from app.db.session import SessionLocal
from app.services.brevo_email_service import brevo_email_service


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
    name="app.tasks.email_tasks.send_welcome_email_task",
    max_retries=3,
    default_retry_delay=60,
)
def send_welcome_email_task(self, to_email: str, user_name: str):
    """Send welcome email to new user."""
    try:
        brevo_email_service.send_welcome_email(to_email, user_name)
    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.email_tasks.send_password_reset_email_task",
    max_retries=3,
    default_retry_delay=60,
)
def send_password_reset_email_task(
    self,
    to_email: str,
    user_name: str,
    otp_code: str,
    expiry_minutes: int = 10,
):
    """Send password reset OTP email."""
    try:
        send_password_reset_email(to_email, user_name, otp_code, expiry_minutes)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.email_tasks.send_order_confirmation_email_task",
    max_retries=3,
    default_retry_delay=60,
)
def send_order_confirmation_email_task(
    self,
    to_email: str,
    user_name: str,
    order_id: int,
    order_total: float,
):
    """Send order confirmation email."""
    try:
        send_order_confirmation_email(to_email, user_name, order_id, order_total)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.email_tasks.send_order_shipped_email_task",
    max_retries=3,
    default_retry_delay=60,
)
def send_order_shipped_email_task(
    self,
    to_email: str,
    user_name: str,
    order_id: int,
    tracking_number: str,
    tracking_url: str,
    expected_delivery: str = "3-5 business days",
):
    """Send order shipped notification email."""
    try:
        send_order_shipped_email(
            to_email,
            user_name,
            order_id,
            tracking_number,
            tracking_url,
            expected_delivery,
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.email_tasks.send_business_approved_email_task",
    max_retries=3,
    default_retry_delay=60,
)
def send_business_approved_email_task(
    self,
    to_email: str,
    user_name: str,
    company_name: str,
    credit_limit: float,
    payment_terms_days: int,
    discount_percentage: float,
):
    """Send business verification approved email."""
    try:
        send_business_approved_email(
            to_email,
            user_name,
            company_name,
            credit_limit,
            payment_terms_days,
            discount_percentage,
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(
    bind=True,
    base=DatabaseTask,
    name="app.tasks.email_tasks.send_business_rejected_email_task",
    max_retries=3,
    default_retry_delay=60,
)
def send_business_rejected_email_task(
    self,
    to_email: str,
    user_name: str,
    company_name: str,
    rejection_reason: str,
):
    """Send business verification rejected email."""
    try:
        send_business_rejected_email(
            to_email,
            user_name,
            company_name,
            rejection_reason,
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
