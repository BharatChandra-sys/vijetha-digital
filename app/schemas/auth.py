from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, EmailStr, Field


class IAMRoleInfo(BaseModel):
    """IAM Role information for responses"""
    id: int
    name: str  # slug like "manager", "driver"
    display_name: str  # human-readable like "Operations Manager"


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
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
