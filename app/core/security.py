# app/core/security.py

from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext

from app.core.config import settings

# =========================
# PASSWORD (bcrypt)
# =========================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password: str) -> str:
    return pwd_context.hash(password[:72])

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password[:72], hashed_password)


# =========================
# JWT CONFIG
# =========================

SECRET_KEY = settings.JWT_SECRET_KEY
ALGORITHM = settings.JWT_ALGORITHM

ACCESS_TOKEN_EXPIRE_MINUTES = 1
REFRESH_TOKEN_EXPIRE_DAYS = 7


# =========================
# ACCESS TOKEN
# =========================

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({
        "exp": expire,
        "type": "access"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        if payload.get("type") != "access":
            return None
        return payload
    except JWTError:
        return None


# =========================
# REFRESH TOKEN
# =========================

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        days=REFRESH_TOKEN_EXPIRE_DAYS
    )
    to_encode.update({
        "exp": expire,
        "type": "refresh"
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_refresh_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        if payload.get("type") != "refresh":
            return None
        return payload
    except JWTError:
        return None