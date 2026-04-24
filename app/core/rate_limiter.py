from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.security import decode_access_token


def get_rate_limit_key(request: Request) -> str:
    """Rate limit by IP and by authenticated user ID if logged in."""
    ip = get_remote_address(request)
    auth = request.headers.get("Authorization")
    if auth and auth.lower().startswith("bearer "):
        token = auth.split(" ", 1)[1]
        try:
            payload = decode_access_token(token)
            if payload and "sub" in payload:
                return f"{ip}:{payload['sub']}"
        except Exception:
            pass
    return ip

limiter = Limiter(
    key_func=get_rate_limit_key,
    default_limits=["60/minute"]  # global fallback
)
