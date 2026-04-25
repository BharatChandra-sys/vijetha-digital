from typing import Any, Dict, List, Literal, Optional

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
    iam_roles: List[IAMRoleInfo] = []
    status: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: Optional[UserInToken] = None


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
    phone: Optional[str] = None
    role: str
    iam_roles: List[str] = []
    status: str
    avatar_url: Optional[str] = None
    email_verified: bool = False
    created_at: Optional[str] = None
    last_login_at: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=150)
    phone: Optional[str] = Field(None, max_length=20)
    avatar_url: Optional[str] = Field(None, max_length=500)
    address: Optional[str] = Field(None, max_length=500)
    city: Optional[str] = Field(None, max_length=100)
    state: Optional[str] = Field(None, max_length=100)
    postal_code: Optional[str] = Field(None, max_length=20)


# ── Admin user management views ───────────────────────────────────────

class AdminUserView(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    status: str
    email_verified: bool = False
    failed_login_attempts: int = 0
    account_locked_until: Optional[str] = None
    created_at: Optional[str] = None
    last_login_at: Optional[str] = None
    last_login_ip: Optional[str] = None
    is_deleted: bool = False

    model_config = ConfigDict(from_attributes=True)


class AdminUserListResponse(BaseModel):
    items: List[AdminUserView]
    total: int
    page: int
    page_size: int
    pages: int
