"""
Enhanced token lifecycle management with Redis JTI store.
Provides token tracking, revocation, and blacklist management.
"""
import secrets
from datetime import datetime

import redis

from app.core.config import settings

# Redis client for token management
_redis_client: redis.Redis | None = None


def get_redis_client() -> redis.Redis:
    """Get or create Redis client for token management."""
    global _redis_client
    if _redis_client is None:
        _redis_client = redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=5,
            socket_timeout=5,
        )
    return _redis_client


class TokenManager:
    """Manages token lifecycle with Redis-backed JTI store."""

    # Redis key prefixes
    JTI_PREFIX = "token:jti:"
    BLACKLIST_PREFIX = "token:blacklist:"
    REFRESH_PREFIX = "token:refresh:"

    @staticmethod
    def generate_jti() -> str:
        """Generate a unique JWT ID (JTI)."""
        return secrets.token_urlsafe(32)

    @staticmethod
    def store_jti(jti: str, user_id: int, token_type: str, expires_in: int) -> bool:
        """
        Store JTI in Redis for tracking.

        Args:
            jti: JWT ID
            user_id: User ID
            token_type: 'access' or 'refresh'
            expires_in: Expiration time in seconds

        Returns:
            True if stored successfully
        """
        try:
            redis_client = get_redis_client()
            key = f"{TokenManager.JTI_PREFIX}{jti}"
            value = f"{user_id}:{token_type}:{datetime.utcnow().isoformat()}"
            redis_client.setex(key, expires_in, value)
            return True
        except Exception:
            return False

    @staticmethod
    def is_jti_valid(jti: str) -> bool:
        """
        Check if JTI exists and is not blacklisted.

        Args:
            jti: JWT ID

        Returns:
            True if valid, False if blacklisted or not found
        """
        try:
            redis_client = get_redis_client()

            # Check if blacklisted
            blacklist_key = f"{TokenManager.BLACKLIST_PREFIX}{jti}"
            if redis_client.exists(blacklist_key):
                return False

            # Check if JTI exists
            jti_key = f"{TokenManager.JTI_PREFIX}{jti}"
            return redis_client.exists(jti_key) > 0

        except Exception:
            # If Redis is down, allow token (fail open for availability)
            return True

    @staticmethod
    def blacklist_token(jti: str, expires_in: int) -> bool:
        """
        Add token to blacklist.

        Args:
            jti: JWT ID
            expires_in: How long to keep in blacklist (seconds)

        Returns:
            True if blacklisted successfully
        """
        try:
            redis_client = get_redis_client()
            key = f"{TokenManager.BLACKLIST_PREFIX}{jti}"
            redis_client.setex(key, expires_in, datetime.utcnow().isoformat())
            return True
        except Exception:
            return False

    @staticmethod
    def revoke_all_user_tokens(user_id: int) -> int:
        """
        Revoke all tokens for a user.

        Args:
            user_id: User ID

        Returns:
            Number of tokens revoked
        """
        try:
            redis_client = get_redis_client()
            pattern = f"{TokenManager.JTI_PREFIX}*"
            revoked = 0

            for key in redis_client.scan_iter(match=pattern):
                value = redis_client.get(key)
                if value and value.startswith(f"{user_id}:"):
                    # Extract JTI from key
                    jti = key.replace(TokenManager.JTI_PREFIX, "")
                    # Get TTL and blacklist
                    ttl = redis_client.ttl(key)
                    if ttl > 0:
                        TokenManager.blacklist_token(jti, ttl)
                        revoked += 1

            return revoked
        except Exception:
            return 0

    @staticmethod
    def store_refresh_token(
        refresh_token: str,
        user_id: int,
        jti: str,
        expires_in: int
    ) -> bool:
        """
        Store refresh token for rotation tracking.

        Args:
            refresh_token: Refresh token string
            user_id: User ID
            jti: JWT ID
            expires_in: Expiration time in seconds

        Returns:
            True if stored successfully
        """
        try:
            redis_client = get_redis_client()
            key = f"{TokenManager.REFRESH_PREFIX}{user_id}:{jti}"
            value = f"{refresh_token}:{datetime.utcnow().isoformat()}"
            redis_client.setex(key, expires_in, value)
            return True
        except Exception:
            return False

    @staticmethod
    def is_refresh_token_valid(user_id: int, jti: str) -> bool:
        """
        Check if refresh token is valid and not used.

        Args:
            user_id: User ID
            jti: JWT ID

        Returns:
            True if valid
        """
        try:
            redis_client = get_redis_client()
            key = f"{TokenManager.REFRESH_PREFIX}{user_id}:{jti}"
            return redis_client.exists(key) > 0
        except Exception:
            return True  # Fail open

    @staticmethod
    def invalidate_refresh_token(user_id: int, jti: str) -> bool:
        """
        Invalidate a refresh token after use (token rotation).

        Args:
            user_id: User ID
            jti: JWT ID

        Returns:
            True if invalidated
        """
        try:
            redis_client = get_redis_client()
            key = f"{TokenManager.REFRESH_PREFIX}{user_id}:{jti}"
            redis_client.delete(key)
            return True
        except Exception:
            return False

    @staticmethod
    def get_user_active_tokens(user_id: int) -> list:
        """
        Get all active tokens for a user.

        Args:
            user_id: User ID

        Returns:
            List of token info dicts
        """
        try:
            redis_client = get_redis_client()
            pattern = f"{TokenManager.JTI_PREFIX}*"
            tokens = []

            for key in redis_client.scan_iter(match=pattern):
                value = redis_client.get(key)
                if value and value.startswith(f"{user_id}:"):
                    parts = value.split(":")
                    jti = key.replace(TokenManager.JTI_PREFIX, "")
                    tokens.append({
                        "jti": jti,
                        "type": parts[1] if len(parts) > 1 else "unknown",
                        "created_at": parts[2] if len(parts) > 2 else None,
                        "ttl": redis_client.ttl(key),
                    })

            return tokens
        except Exception:
            return []

    @staticmethod
    def cleanup_expired_tokens() -> int:
        """
        Cleanup expired tokens from Redis.
        This is handled automatically by Redis TTL, but can be called manually.

        Returns:
            Number of keys cleaned (always 0 as Redis handles this)
        """
        # Redis automatically removes expired keys
        # This method exists for compatibility and manual cleanup if needed
        return 0


# Convenience functions for backward compatibility
def generate_jti() -> str:
    """Generate a unique JWT ID."""
    return TokenManager.generate_jti()


def store_token_jti(jti: str, user_id: int, token_type: str, expires_in: int) -> bool:
    """Store token JTI in Redis."""
    return TokenManager.store_jti(jti, user_id, token_type, expires_in)


def is_token_valid(jti: str) -> bool:
    """Check if token JTI is valid."""
    return TokenManager.is_jti_valid(jti)


def blacklist_token(jti: str, expires_in: int) -> bool:
    """Blacklist a token."""
    return TokenManager.blacklist_token(jti, expires_in)


def revoke_all_user_tokens(user_id: int) -> int:
    """Revoke all tokens for a user."""
    return TokenManager.revoke_all_user_tokens(user_id)
