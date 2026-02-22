from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
)
from app.services.auth_service import (
    register_user,
    login_user,
)
from app.services.password_reset_service import (
    request_password_reset,
    reset_password,
)
from app.core.security import (
    decode_refresh_token,
    create_access_token,
)
from app.core.rate_limiter import limiter

router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)

# =========================
# AUTH
# =========================

@router.post("/register")
@limiter.limit("3/minute")
def register(
    request: Request,
    data: RegisterRequest,
    db: Session = Depends(get_db),
):
    return register_user(db, data)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
def login(
    request: Request,
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    # login_user must return:
    # {
    #   access_token,
    #   refresh_token,
    #   token_type
    # }
    return login_user(db, data)


# =========================
# REFRESH TOKEN
# =========================

@router.post("/refresh")
def refresh_token(data: dict):

    refresh_token = data.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token required")

    payload = decode_refresh_token(refresh_token)

    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    email = payload.get("sub")

    new_access_token = create_access_token({
        "sub": email,
        "role": payload.get("role")
    })

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }


# =========================
# PASSWORD RESET
# =========================

@router.post("/forgot-password")
@limiter.limit("2/minute")
def forgot_password(
    request: Request,
    data: dict,
    db: Session = Depends(get_db),
):
    email = data.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    request_password_reset(db, email)

    return {
        "message": "If the email exists, a reset link was sent"
    }


@router.post("/reset-password")
@limiter.limit("3/minute")
def reset_user_password(
    request: Request,
    data: dict,
    db: Session = Depends(get_db),
):
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        raise HTTPException(
            status_code=400,
            detail="Token and new_password are required"
        )

    try:
        reset_password(db, token, new_password)
        return {"message": "Password updated successfully"}
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired token"
        )