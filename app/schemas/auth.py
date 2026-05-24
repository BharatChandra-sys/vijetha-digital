from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class IAMRoleInfo(BaseModel):
    """IAM Role information for responses"""
    id: int
    name: str  # slug like "manager", "driver"
    display_name: str  # human-readable like "Operations Manager"


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=128)
    login_portal: Literal["customer", "staff", "admin"] = "customer"


class UserInToken(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    iam_roles: list[IAMRoleInfo] = []
    status: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserInToken | None = None


# ── Refresh / token flows ─────────────────────────────────────────────

class RefreshRequest(BaseModel):
    refresh_token: str


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Password reset / OTP flows ────────────────────────────────────────

class SendOTPRequest(BaseModel):
    email: EmailStr


class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


class ResetPasswordOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)
    new_password: str = Field(..., min_length=6, max_length=128)


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., max_length=128)
    new_password: str = Field(..., min_length=8, max_length=128)


# ── User profile views ────────────────────────────────────────────────

class UserProfileResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: str | None = None
    role: str
    iam_roles: list[str] = []
    status: str
    avatar_url: str | None = None
    email_verified: bool = False
    created_at: str | None = None
    last_login_at: str | None = None

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdateRequest(BaseModel):
    full_name: str | None = Field(None, min_length=2, max_length=150)
    phone: str | None = Field(None, max_length=20)
    avatar_url: str | None = Field(None, max_length=500)
    address: str | None = Field(None, max_length=500)
    city: str | None = Field(None, max_length=100)
    state: str | None = Field(None, max_length=100)
    postal_code: str | None = Field(None, max_length=20)


# ── Admin user management views ───────────────────────────────────────

class AdminUserView(BaseModel):
    id: int
    email: str
    full_name: str
    phone: str | None = None
    role: str
    status: str
    email_verified: bool = False
    failed_login_attempts: int = 0
    account_locked_until: str | None = None
    created_at: str | None = None
    last_login_at: str | None = None
    last_login_ip: str | None = None
    is_deleted: bool = False

    model_config = ConfigDict(from_attributes=True)


class AdminUserListResponse(BaseModel):
    items: list[AdminUserView]
    total: int
    page: int
    page_size: int
    pages: int
