"""
Unit tests for app/core/security.py — no DB required.
"""
import pytest

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_access_token,
    decode_refresh_token,
    hash_password,
    is_strong_password,
    verify_password,
)


class TestPasswordHashing:
    def test_hash_and_verify(self):
        pw = "MySecret123!"
        hashed = hash_password(pw)
        assert hashed != pw
        assert verify_password(pw, hashed)

    def test_wrong_password_fails(self):
        hashed = hash_password("correct")
        assert not verify_password("wrong", hashed)

    def test_hash_is_unique(self):
        h1 = hash_password("same")
        h2 = hash_password("same")
        assert h1 != h2  # bcrypt salts differ


class TestPasswordStrength:
    def test_strong_password(self):
        assert is_strong_password("Secure1!")

    def test_too_short(self):
        assert not is_strong_password("Ab1!")

    def test_no_uppercase(self):
        assert not is_strong_password("secure1!")

    def test_no_lowercase(self):
        assert not is_strong_password("SECURE1!")

    def test_no_digit(self):
        assert not is_strong_password("SecurePass!")

    def test_no_special(self):
        assert not is_strong_password("Secure123")


class TestJWTTokens:
    def test_access_token_roundtrip(self):
        token = create_access_token(user_id=42, role="customer")
        payload = decode_access_token(token)
        assert payload is not None
        assert payload["sub"] == "42"
        assert payload["role"] == "customer"
        assert payload["type"] == "access"

    def test_refresh_token_roundtrip(self):
        token = create_refresh_token(user_id=7, role="admin")
        payload = decode_refresh_token(token)
        assert payload is not None
        assert payload["sub"] == "7"
        assert payload["type"] == "refresh"
        assert "jti" in payload

    def test_access_token_rejected_as_refresh(self):
        token = create_access_token(user_id=1, role="customer")
        assert decode_refresh_token(token) is None

    def test_refresh_token_rejected_as_access(self):
        token = create_refresh_token(user_id=1, role="customer")
        assert decode_access_token(token) is None

    def test_invalid_token_returns_none(self):
        assert decode_access_token("not.a.token") is None
        assert decode_refresh_token("garbage") is None
