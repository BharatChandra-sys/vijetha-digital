"""
Production-grade security utilities.
JWT token management, password hashing, and token helpers.
"""

import re
import uuid
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext
from app.core.config import settings

# Password hashing context
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# JWT configuration
ALGORITHM = settings.JWT_ALGORITHM
SECRET_KEY = settings.JWT_SECRET_KEY

ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Short-lived access tokens
REFRESH_TOKEN_EXPIRE_DAYS = 7     # Longer-lived refresh tokens


# ============================================================================
# PASSWORD HASHING
# ============================================================================

def hash_password(password: str) -> str:
    """
    Hash a plaintext password using bcrypt.
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


# ============================================================================
# JWT TOKEN CREATION
# ============================================================================

def create_access_token(user_id: int, role: str) -> str:
    """
    Create a short-lived access token (15 minutes).
    
    Args:
        user_id: User's database ID
        role: User's role (for backward compatibility)
        
    Returns:
        JWT access token string
    """
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    payload: Dict[str, Any] = {
        "sub": str(user_id),  # Subject: user ID as string
        "role": role,         # Legacy role field
        "type": "access",     # Token type
        "exp": expire,        # Expiration timestamp
        "iat": datetime.utcnow(),  # Issued at
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(user_id: int, role: str) -> str:
    """
    Create a long-lived refresh token (7 days) with a unique jti for revocation.
    """
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)

    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "role": role,
        "type": "refresh",
        "jti": str(uuid.uuid4()),
        "exp": expire,
        "iat": datetime.utcnow(),
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# ============================================================================
# JWT TOKEN DECODING
# ============================================================================

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate an access token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload dict if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Ensure this is an access token
        if payload.get("type") != "access":
            return None
            
        return payload
    
    except JWTError:
        return None


def decode_refresh_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and validate a refresh token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded payload dict if valid, None otherwise
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Ensure this is a refresh token
        if payload.get("type") != "refresh":
            return None
            
        return payload
    
    except JWTError:
        return None


# ============================================================================
# GENERIC TOKEN DECODER
# ============================================================================

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode any JWT token without type enforcement."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None


# ============================================================================
# PASSWORD STRENGTH
# ============================================================================

def is_strong_password(password: str) -> bool:
    """
    Validate password strength:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    - At least one special character
    """
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True


# ============================================================================
# EMAIL VERIFICATION TOKEN HELPERS
# ============================================================================

EMAIL_VERIFY_TOKEN_EXPIRE_HOURS = 24


def create_email_verification_token(user_id: int, email: str) -> str:
    """Create a short-lived token for email address verification."""
    expire = datetime.utcnow() + timedelta(hours=EMAIL_VERIFY_TOKEN_EXPIRE_HOURS)
    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "email": email,
        "type": "email_verify",
        "jti": str(uuid.uuid4()),
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_email_verification_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate an email verification token."""
    payload = decode_token(token)
    if payload and payload.get("type") == "email_verify":
        return payload
    return None


# ============================================================================
# PASSWORD RESET TOKEN HELPERS
# ============================================================================

PASSWORD_RESET_TOKEN_EXPIRE_HOURS = 1


def create_password_reset_token(user_id: int, email: str) -> str:
    """Create a short-lived token for password reset."""
    expire = datetime.utcnow() + timedelta(hours=PASSWORD_RESET_TOKEN_EXPIRE_HOURS)
    payload: Dict[str, Any] = {
        "sub": str(user_id),
        "email": email,
        "type": "password_reset",
        "jti": str(uuid.uuid4()),
        "exp": expire,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_password_reset_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and validate a password reset token."""
    payload = decode_token(token)
    if payload and payload.get("type") == "password_reset":
        return payload
    return None
