"""
Access log service — records login attempts, OTP events,
and sensitive actions with full device/IP context.
"""

import re
import logging
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Session

from app.models.access_log import AccessLog

logger = logging.getLogger("access_log")

_UA_PATTERNS = {
    "device": [
        (r"(mobile|android|iphone|ipad)", "mobile"),
        (r"tablet", "tablet"),
    ],
    "browser": [
        (r"edg/", "Edge"),
        (r"chrome/", "Chrome"),
        (r"firefox/", "Firefox"),
        (r"safari/", "Safari"),
    ],
    "os": [
        (r"windows", "Windows"),
        (r"mac os|macos", "macOS"),
        (r"android", "Android"),
        (r"iphone|ipad", "iOS"),
        (r"linux", "Linux"),
    ],
}


def _parse_ua(ua: str) -> dict:
    ua_lower = (ua or "").lower()
    result = {"device": "desktop", "browser": "Other", "os": "Unknown"}
    for key, patterns in _UA_PATTERNS.items():
        for pattern, label in patterns:
            if re.search(pattern, ua_lower):
                result[key] = label
                break
    return result


def log_event(
    db: Session,
    action: str,
    success: bool = True,
    user_id: Optional[int] = None,
    email: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    endpoint: Optional[str] = None,
    method: Optional[str] = None,
    detail: Optional[str] = None,
) -> None:
    """
    Write an access log entry. Never raises — failures are logged to console only.
    """
    try:
        ua_info = _parse_ua(user_agent or "")
        entry = AccessLog(
            user_id=user_id,
            email=email,
            action=action,
            success=success,
            detail=detail,
            ip_address=ip_address,
            user_agent=(user_agent or "")[:500],
            device_type=ua_info["device"],
            browser=ua_info["browser"],
            os_name=ua_info["os"],
            endpoint=endpoint,
            method=method,
        )
        db.add(entry)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to write access log: {e}")


def get_user_access_history(
    db: Session,
    user_id: int,
    limit: int = 50,
):
    """Return recent access log entries for a user."""
    return (
        db.query(AccessLog)
        .filter(AccessLog.user_id == user_id)
        .order_by(AccessLog.created_at.desc())
        .limit(limit)
        .all()
    )


def get_failed_logins(
    db: Session,
    hours: int = 24,
    limit: int = 100,
):
    """Return recent failed login attempts (admin monitoring)."""
    from datetime import timedelta
    since = datetime.utcnow() - timedelta(hours=hours)
    return (
        db.query(AccessLog)
        .filter(
            AccessLog.action == "login_failed",
            AccessLog.created_at >= since,
        )
        .order_by(AccessLog.created_at.desc())
        .limit(limit)
        .all()
    )
