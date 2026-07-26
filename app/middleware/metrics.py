"""
Middleware for collecting Prometheus metrics on HTTP requests.
"""
import time
from collections.abc import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.metrics import (
    http_request_duration_seconds,
    http_requests_in_progress,
    http_requests_total,
)


class MetricsMiddleware(BaseHTTPMiddleware):
    """Middleware to collect HTTP request metrics."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request and collect metrics.

        Args:
            request: Incoming request
            call_next: Next middleware/handler

        Returns:
            Response from handler
        """
        # Skip metrics collection for /metrics endpoint itself
        if request.url.path == "/metrics":
            return await call_next(request)

        method = request.method
        path = request.url.path

        # Normalize path to avoid high cardinality
        # Replace IDs with placeholders
        normalized_path = self._normalize_path(path)

        # Track in-progress requests
        http_requests_in_progress.labels(method=method, endpoint=normalized_path).inc()

        start_time = time.time()
        status_code = 500  # default in case of exception

        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception as exc:
            status_code = 500
            raise exc
        finally:
            # Record metrics
            duration = time.time() - start_time

            http_request_duration_seconds.labels(
                method=method,
                endpoint=normalized_path,
                status_code=status_code,
            ).observe(duration)

            http_requests_total.labels(
                method=method,
                endpoint=normalized_path,
                status_code=status_code,
            ).inc()

            http_requests_in_progress.labels(
                method=method,
                endpoint=normalized_path,
            ).dec()

        return response

    @staticmethod
    def _normalize_path(path: str) -> str:
        """
        Normalize path to reduce cardinality.
        Replace numeric IDs with {id} placeholder.

        Args:
            path: Original request path

        Returns:
            Normalized path
        """
        parts = path.split("/")
        normalized_parts = []

        for part in parts:
            # Replace numeric IDs
            if part.isdigit():
                normalized_parts.append("{id}")
            # Replace UUIDs (simple check)
            elif len(part) == 36 and part.count("-") == 4:
                normalized_parts.append("{uuid}")
            else:
                normalized_parts.append(part)

        return "/".join(normalized_parts)
