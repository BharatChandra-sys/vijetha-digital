from typing import Any


class AppException(Exception):
    def __init__(self, message: str, status_code: int = 500, detail: Any | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.detail = detail


class NotFoundException(AppException):
    def __init__(self, resource: str, identifier: str | None = None):
        msg = f"{resource} not found" if identifier is None else f"{resource} '{identifier}' not found"
        super().__init__(msg, status_code=404)


class ConflictException(AppException):
    def __init__(self, message: str):
        super().__init__(message, status_code=409)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class ForbiddenException(AppException):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, status_code=403)


class ValidationException(AppException):
    def __init__(self, message: str, detail: Any | None = None):
        super().__init__(message, status_code=422, detail=detail)


class PaymentException(AppException):
    def __init__(self, message: str, detail: Any | None = None):
        super().__init__(message, status_code=402, detail=detail)


class FileException(AppException):
    def __init__(self, message: str):
        super().__init__(message, status_code=400)


class RateLimitException(AppException):
    def __init__(self):
        super().__init__("Rate limit exceeded", status_code=429)


class OrderStateException(AppException):
    def __init__(self, current: str, attempted: str):
        super().__init__(
            message=f"Invalid order state transition: {current} -> {attempted}",
            status_code=400,
            detail={"current": current, "attempted": attempted},
        )
