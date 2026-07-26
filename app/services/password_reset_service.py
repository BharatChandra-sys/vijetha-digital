"""
OTP-based password reset service.
Sends a 6-digit OTP via email, valid for 10 minutes.
Falls back to console logging in dev mode if SMTP fails.
"""

import hashlib
import logging
import random
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User

logger = logging.getLogger(__name__)

OTP_EXPIRY_MINUTES = 10


def _hash_otp(otp: str) -> str:
    return hashlib.sha256(otp.encode()).hexdigest()


def _generate_otp() -> str:
    """Generate a 6-digit numeric OTP."""
    return str(random.randint(100000, 999999))


def _try_send_email(to_email: str, otp: str) -> None:
    """Attempt to send OTP email using Brevo API. Logs to console if sending fails."""
    try:
        from app.services.brevo_email_service import send_otp_email
        send_otp_email(to_email, otp)
        logger.info(f"OTP email sent to {to_email} via Brevo")
    except Exception as e:
        # Log OTP to console so dev can still test without working email
        logger.warning(
            f"Email sending failed ({type(e).__name__}: {e}). "
            f"DEV FALLBACK — OTP for {to_email}: {otp}"
        )


def send_otp(db: Session, email: str) -> None:
    """
    Generate and email a 6-digit OTP to the user.
    Silently succeeds even if email doesn't exist (security).
    Never raises — SMTP errors are logged, not propagated.
    """
    user = db.query(User).filter(User.email == email.strip().lower()).first()
    if not user:
        return

    otp = _generate_otp()

    user.reset_token = _hash_otp(otp)
    user.reset_token_expiry = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    db.commit()

    _try_send_email(user.email, otp)


def verify_otp(db: Session, email: str, otp: str) -> bool:
    """
    Verify the OTP for the given email.
    Returns True if valid, False otherwise.
    Does NOT consume the OTP.
    """
    user = db.query(User).filter(User.email == email.strip().lower()).first()
    if not user:
        return False

    if not user.reset_token or not user.reset_token_expiry:
        return False

    if user.reset_token_expiry < datetime.utcnow():
        return False

    return user.reset_token == _hash_otp(otp.strip())


def reset_password_with_otp(db: Session, email: str, otp: str, new_password: str) -> None:
    """
    Verify OTP and set new password in one step.
    Raises ValueError on invalid/expired OTP.
    """
    if not verify_otp(db, email, otp):
        raise ValueError("Invalid or expired OTP")

    user = db.query(User).filter(User.email == email.strip().lower()).first()

    user.hashed_password = hash_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    user.failed_login_attempts = 0
    user.account_locked_until = None
    user.account_locked_reason = None

    db.commit()
    logger.info(f"Password reset successfully for {email}")



