"""
Maintenance mode middleware.
When enabled, all non-admin requests return 503.
Toggle via environment variable or runtime flag.
"""

import os
import logging
from typing import Callable
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

logger = logging.getLogger("maintenance")

# In-memory flag — can be toggled via admin API without restart
_maintenance_active = False
_maintenance_message = "We're performing scheduled maintenance. We'll be back shortly."

# Paths that bypass maintenance mode (API routes only)
# Paths that bypass maintenance mode (API routes only)
BYPASS_PREFIXES = (
    "/health",
    "/status",
    "/auth/",          # all auth endpoints
    "/admin",          # all /admin/* routes bypass
    "/api/v1/admin",   # all /api/v1/admin/* routes bypass
    "/docs",
    "/redoc",
    "/openapi.json",
    "/products",       # products still accessible (frontend handles overlay)
    "/pricing",        # pricing still accessible
)


def is_maintenance_active() -> bool:
    return _maintenance_active or os.getenv("MAINTENANCE_MODE", "false").lower() == "true"


def set_maintenance(active: bool, message: str = None) -> None:
    global _maintenance_active, _maintenance_message
    _maintenance_active = active
    if message:
        _maintenance_message = message
    logger.warning(f"Maintenance mode {'ENABLED' if active else 'DISABLED'}")


def get_maintenance_message() -> str:
    return _maintenance_message


class MaintenanceModeMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Maintenance mode is handled purely on the frontend.
        # The backend stays fully operational — only the /status endpoint
        # is used by the frontend to decide whether to show the overlay.
        # This ensures all APIs (products, orders, etc.) continue to work
        # for admin/staff even during maintenance.
        return await call_next(request)
