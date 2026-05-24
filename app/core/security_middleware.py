"""
Production security middleware.
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Request audit logging (IP, device, endpoint, response time)
- Suspicious request detection
"""

import logging
import re
import time
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger("security")

# ── Patterns that indicate attack attempts ──────────────────────────
SUSPICIOUS_PATTERNS = [
    r"(\.\./){2,}",                    # Path traversal
    r"<script[^>]*>",                  # XSS
    r"(union|select|insert|drop|delete|update|exec|execute)\s+",  # SQLi
    r"(eval|base64_decode|system|passthru|shell_exec)\s*\(",       # RCE
    r"(\%27|\%22|\%3C|\%3E|\%00)",     # Encoded injection chars
    r"(etc/passwd|etc/shadow|win\.ini|boot\.ini)",  # File inclusion
]
SUSPICIOUS_RE = [re.compile(p, re.IGNORECASE) for p in SUSPICIOUS_PATTERNS]

# Endpoints that should never be cached
NO_CACHE_PATHS = {"/auth/", "/orders/", "/payments/", "/admin/"}


def _get_real_ip(request: Request) -> str:
    """Extract real client IP, respecting proxy headers."""
    # Check common proxy headers in order of trust
    for header in ("x-real-ip", "x-forwarded-for", "cf-connecting-ip"):
        value = request.headers.get(header)
        if value:
            # x-forwarded-for can be a comma-separated list; take the first
            return value.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _get_user_agent_info(ua: str) -> dict:
    """Parse basic device/browser info from User-Agent string."""
    ua_lower = ua.lower()

    # Device type
    if any(x in ua_lower for x in ("mobile", "android", "iphone", "ipad")):
        device = "mobile"
    elif "tablet" in ua_lower:
        device = "tablet"
    else:
        device = "desktop"

    # Browser
    if "edg/" in ua_lower:
        browser = "Edge"
    elif "chrome/" in ua_lower:
        browser = "Chrome"
    elif "firefox/" in ua_lower:
        browser = "Firefox"
    elif "safari/" in ua_lower:
        browser = "Safari"
    else:
        browser = "Other"

    # OS
    if "windows" in ua_lower:
        os_name = "Windows"
    elif "mac os" in ua_lower or "macos" in ua_lower:
        os_name = "macOS"
    elif "android" in ua_lower:
        os_name = "Android"
    elif "iphone" in ua_lower or "ipad" in ua_lower:
        os_name = "iOS"
    elif "linux" in ua_lower:
        os_name = "Linux"
    else:
        os_name = "Unknown"

    return {"device": device, "browser": browser, "os": os_name}


def _is_suspicious(request: Request) -> bool:
    """Check URL and query params for attack patterns."""
    target = str(request.url)
    for pattern in SUSPICIOUS_RE:
        if pattern.search(target):
            return True
    return False


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Adds security headers to every response and logs all requests
    with IP, device, timing, and status code.
    """

    def __init__(self, app: ASGIApp, env: str = "dev"):
        super().__init__(app)
        self.env = env
        self.is_prod = env == "production"

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start = time.perf_counter()

        # ── Suspicious request detection ──
        if _is_suspicious(request):
            ip = _get_real_ip(request)
            logger.warning(
                f"SUSPICIOUS_REQUEST ip={ip} method={request.method} "
                f"url={request.url.path} query={str(request.query_params)}"
            )

        # ── Process request ──
        response: Response = await call_next(request)
        duration_ms = round((time.perf_counter() - start) * 1000, 1)

        # ── Security headers ──
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = (
            "geolocation=(), microphone=(), camera=(), payment=(self)"
        )
        response.headers["X-DNS-Prefetch-Control"] = "off"

        if self.is_prod:
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )

        # Content-Security-Policy
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://accounts.google.com; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https://images.unsplash.com https://res.cloudinary.com; "
            "connect-src 'self' https://api.razorpay.com; "
            "frame-src https://checkout.razorpay.com https://accounts.google.com; "
            "object-src 'none'; "
            "base-uri 'self';"
        )
        response.headers["Content-Security-Policy"] = csp

        # No-cache for sensitive endpoints
        path = request.url.path
        if any(path.startswith(p) for p in NO_CACHE_PATHS):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
            response.headers["Pragma"] = "no-cache"

        # Remove server fingerprinting headers
        if "server" in response.headers:
            del response.headers["server"]
        if "x-powered-by" in response.headers:
            del response.headers["x-powered-by"]

        # ── Request audit log ──
        ip = _get_real_ip(request)
        ua = request.headers.get("user-agent", "")
        ua_info = _get_user_agent_info(ua)
        status = response.status_code

        log_level = logging.WARNING if status >= 400 else logging.INFO
        logger.log(
            log_level,
            f"REQUEST "
            f"method={request.method} "
            f"path={path} "
            f"status={status} "
            f"ip={ip} "
            f"device={ua_info['device']} "
            f"browser={ua_info['browser']} "
            f"os={ua_info['os']} "
            f"duration={duration_ms}ms"
        )

        return response
