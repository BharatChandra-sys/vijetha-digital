"""
Test configuration — sets required env vars BEFORE any app module is imported.
This prevents pydantic-settings from raising ValidationError on missing fields.
"""
import os

# ── Minimal env contract required by app/core/config.py ──────────────
os.environ.setdefault("DATABASE_URL",            "postgresql+psycopg2://postgres:postgres@localhost:5432/vijetha_test")
os.environ.setdefault("FRONTEND_URL",            "http://localhost:5173")
os.environ.setdefault("JWT_SECRET_KEY",          "test-secret-key-for-ci")
os.environ.setdefault("ADMIN_EMAIL",             "admin@example.com")
os.environ.setdefault("ADMIN_PASSWORD",          "Admin123!")
os.environ.setdefault("CLOUDINARY_CLOUD_NAME",   "test")
os.environ.setdefault("CLOUDINARY_API_KEY",      "test")
os.environ.setdefault("CLOUDINARY_API_SECRET",   "test")
os.environ.setdefault("RAZORPAY_KEY_ID",         "test")
os.environ.setdefault("RAZORPAY_KEY_SECRET",     "test")
os.environ.setdefault("RAZORPAY_WEBHOOK_SECRET", "test")
os.environ.setdefault("REDIS_URL",               "redis://localhost:6379/0")
