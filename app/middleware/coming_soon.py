"""
Coming Soon middleware - blocks certain endpoints before public launch.
"""
import os
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class ComingSoonMiddleware(BaseHTTPMiddleware):
    """
    Middleware to block checkout and payment endpoints with 'Coming Soon' message.
    Enable by setting LAUNCH_MODE=coming_soon in environment.
    """
    
    # Endpoints to block during coming soon mode
    BLOCKED_PATHS = [
        "/orders",
        "/payments",
        "/checkout",
        "/cart",
    ]
    
    # Admin paths that should always work
    ADMIN_PATHS = [
        "/api/v1/admin",
        "/admin",
    ]
    
    async def dispatch(self, request: Request, call_next):
        # Check if coming soon mode is enabled
        launch_mode = os.getenv("LAUNCH_MODE", "").lower()
        
        if launch_mode != "coming_soon":
            # Normal mode - allow all requests
            return await call_next(request)
        
        path = request.url.path
        
        # Always allow admin paths
        if any(path.startswith(admin_path) for admin_path in self.ADMIN_PATHS):
            return await call_next(request)
        
        # Always allow health, docs, auth
        if path in ["/health", "/docs", "/redoc", "/openapi.json"] or path.startswith("/auth"):
            return await call_next(request)
        
        # Block checkout/payment paths
        if any(blocked in path for blocked in self.BLOCKED_PATHS):
            return JSONResponse(
                status_code=503,
                content={
                    "detail": "Coming Soon! We're preparing to launch. Check back soon!",
                    "status": "coming_soon",
                    "message": "This feature will be available when we officially launch."
                }
            )
        
        # Allow everything else (products, reviews, etc.)
        return await call_next(request)
