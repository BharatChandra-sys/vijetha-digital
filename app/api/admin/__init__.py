"""
Admin module for user management and system administration.
"""

from app.api.admin import coupons, reviews_mod, roles, users, users_mgmt

__all__ = ["users", "roles", "users_mgmt", "coupons", "reviews_mod"]
