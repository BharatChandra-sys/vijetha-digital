from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str = "Vijetha Digital Backend"
    ENV: str = "dev"

    # Database (MANDATORY)
    DATABASE_URL: str

    # Schema management
    # Keep False when using Alembic migrations (recommended)
    AUTO_CREATE_SCHEMA_ON_STARTUP: bool = False

    # Frontend URL for CORS
    FRONTEND_URL: str

    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"

    # Admin bootstrap
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # Razorpay
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str

    # SMTP (optional — required only for password reset emails)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None

    # Google OAuth (optional — fill in before deploying)
    GOOGLE_CLIENT_ID: Optional[str] = None

    # File uploads directory
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
