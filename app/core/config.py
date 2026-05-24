from typing import List
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
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Admin bootstrap
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str
    FIRST_ADMIN_EMAIL: str | None = None
    FIRST_ADMIN_PASSWORD: str | None = None
    FIRST_ADMIN_NAME: str | None = None

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # Brevo (Email Service)
    BREVO_API_KEY: str | None = None
    BREVO_FROM_EMAIL: str = "noreply@vijetha.com"
    BREVO_FROM_NAME: str = "Vijetha Digital"

    # Razorpay
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str

    # Optional AWS S3
    AWS_ACCESS_KEY_ID: str | None = None
    AWS_SECRET_ACCESS_KEY: str | None = None
    AWS_S3_BUCKET: str | None = None
    AWS_REGION: str = "ap-south-1"
    AWS_S3_BASE_URL: str | None = None

    # Email Service (Brevo HTTP API - more reliable than SMTP)
    BREVO_API_KEY: str | None = None
    BREVO_FROM_EMAIL: str = "noreply@vijetha.com"
    BREVO_FROM_NAME: str = "Vijetha Digital"

    # SMTP (legacy - optional, Brevo recommended)
    SMTP_HOST: str | None = None
    SMTP_PORT: int = 587
    SMTP_USER: str | None = None
    SMTP_PASSWORD: str | None = None
    MAIL_USERNAME: str | None = None
    MAIL_PASSWORD: str | None = None
    MAIL_FROM: str | None = None
    MAIL_SERVER: str | None = None
    MAIL_PORT: int = 587
    MAIL_TLS: bool = True

    # Google OAuth (optional — fill in before deploying)
    GOOGLE_CLIENT_ID: str | None = None
    GOOGLE_CLIENT_SECRET: str | None = None
    GOOGLE_REDIRECT_URI: str | None = None

    # Runtime/infra
    REDIS_URL: str = "redis://localhost:6379/0"
    SENTRY_DSN: str | None = None
    TRUSTED_HOSTS: str = "*"

    # Business configuration
    GST_PERCENTAGE: float = 18.0
    MIN_ORDER_AMOUNT: float = 100.0
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_FILE_TYPES: str = "pdf,jpg,jpeg,png,tiff,ai,psd,eps,cdr"

    @property
    def allowed_file_types_list(self) -> list[str]:
        return [v.strip().lower() for v in self.ALLOWED_FILE_TYPES.split(",") if v.strip()]

    # File uploads directory
    UPLOAD_DIR: str = "uploads"

    model_config = {"env_file": ".env", "extra": "ignore"}

    @property
    def trusted_hosts_list(self) -> List[str]:
        """Convert TRUSTED_HOSTS string to list."""
        if self.TRUSTED_HOSTS == "*":
            return ["*"]
        return [h.strip() for h in self.TRUSTED_HOSTS.split(",") if h.strip()]


settings = Settings()
