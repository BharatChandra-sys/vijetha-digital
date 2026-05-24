"""
Deprecation middleware for marking legacy endpoints.
Adds deprecation headers to responses for endpoints that will be removed.
"""
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

# Legacy endpoints to deprecate
DEPRECATED_ENDPOINTS = {
    # Format: path -> (replacement, sunset_date, message)
    "/orders": (
        "/api/v1/admin/orders",
        "2024-06-30",
        "Use /api/v1/admin/orders instead"
    ),
    "/products": (
        "/api/v1/products",
        "2024-06-30",
        "Use /api/v1/products instead"
    ),
}


class DeprecationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to add deprecation warnings to legacy endpoints.

    Adds standard deprecation headers:
    - Deprecation: true
    - Sunset: <date>
    - Link: <new-endpoint>; rel="alternate"
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and add deprecation headers if needed.

        Args:
            request: Incoming request
            call_next: Next middleware/handler

        Returns:
            Response with deprecation headers if applicable
        """
        response = await call_next(request)

        # Check if endpoint is deprecated
        path = request.url.path
        if path in DEPRECATED_ENDPOINTS:
            replacement, sunset_date, message = DEPRECATED_ENDPOINTS[path]

            # Add deprecation headers
            response.headers["Deprecation"] = "true"
            response.headers["Sunset"] = sunset_date
            response.headers["Link"] = f'<{replacement}>; rel="alternate"'
            response.headers["X-Deprecation-Message"] = message

            # Add warning header (RFC 7234)
            response.headers["Warning"] = (
                f'299 - "Deprecated API: {message}. '
                f'This endpoint will be removed on {sunset_date}."'
            )

        return response


def is_endpoint_deprecated(path: str) -> bool:
    """
    Check if an endpoint is deprecated.

    Args:
        path: Request path

    Returns:
        True if deprecated
    """
    return path in DEPRECATED_ENDPOINTS


def get_deprecation_info(path: str) -> dict:
    """
    Get deprecation information for an endpoint.

    Args:
        path: Request path

    Returns:
        Dict with deprecation info or None
    """
    if path in DEPRECATED_ENDPOINTS:
        replacement, sunset_date, message = DEPRECATED_ENDPOINTS[path]
        return {
            "deprecated": True,
            "replacement": replacement,
            "sunset_date": sunset_date,
            "message": message,
        }
    return {"deprecated": False}
