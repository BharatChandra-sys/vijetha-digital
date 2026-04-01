from datetime import datetime, timedelta
import secrets
import hashlib
from sqlalchemy.orm import Session

from app.models.user import User
from app.services.email_service import send_email
from app.core.security import hash_password


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def request_password_reset(db: Session, email: str):
    user = db.query(User).filter(User.email == email).first()

    # Security: do not reveal if email exists
    if not user:
        return

    raw_token = secrets.token_urlsafe(32)

    user.reset_token = _hash_token(raw_token)
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)

    db.commit()

    from app.core.config import settings
    FRONTEND_URL = settings.FRONTEND_URL

    # ✅ Route matches frontend (query param format)
    reset_link = f"{FRONTEND_URL}/reset-password?token={raw_token}"

    send_email(
        to_email=user.email,
        subject="Reset your Vijetha Digital password",
        html_content=f"""
        <p>You requested a password reset.</p>
        <p>
          <a href="{reset_link}">
            Click here to reset your password
          </a>
        </p>
        <p>This link expires in 1 hour.</p>
        """
    )


def reset_password(db: Session, token: str, new_password: str):
    hashed_token = _hash_token(token)

    user = db.query(User).filter(
        User.reset_token == hashed_token,
        User.reset_token_expiry > datetime.utcnow()
    ).first()

    if not user:
        raise ValueError("Invalid or expired token")

    user.hashed_password = hash_password(new_password)
    user.reset_token = None
    user.reset_token_expiry = None

    db.commit()
