"""
Access log model — stores every login attempt and sensitive action
with full context: IP, device, browser, OS, location hint.
"""

from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Index, Integer, String, Text

from app.db.base import Base


class AccessLog(Base):
    __tablename__ = "access_logs"

    id = Column(Integer, primary_key=True)

    # Who
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    email = Column(String(255), nullable=True)  # Store even if user not found

    # What
    action = Column(String(100), nullable=False, index=True)
    # e.g. "login_success", "login_failed", "password_reset", "otp_sent",
    #      "order_placed", "admin_action", "suspicious_request"

    success = Column(Boolean, default=True, nullable=False)
    detail = Column(Text, nullable=True)  # Extra context / error message

    # Where from
    ip_address = Column(String(50), nullable=True, index=True)
    user_agent = Column(String(500), nullable=True)
    device_type = Column(String(20), nullable=True)   # mobile / desktop / tablet
    browser = Column(String(50), nullable=True)
    os_name = Column(String(50), nullable=True)

    # Request context
    endpoint = Column(String(255), nullable=True)
    method = Column(String(10), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    __table_args__ = (
        # Indexes already defined in Column definitions:
        # - user_id (line 19): index=True
        # - action (line 23): index=True
        # - ip_address (line 31): index=True
        # - created_at (line 42): index=True
    )
