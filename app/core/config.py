from typing import Optional, List
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
    FIRST_ADMIN_EMAIL: Optional[str] = None
    FIRST_ADMIN_PASSWORD: Optional[str] = None
    FIRST_ADMIN_NAME: Optional[str] = None

    # Cloudinary
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str

    # Razorpay
    RAZORPAY_KEY_ID: str
    RAZORPAY_KEY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str

    # Optional AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_S3_BUCKET: Optional[str] = None
    AWS_REGION: str = "ap-south-1"
    AWS_S3_BASE_URL: Optional[str] = None

    # SMTP (optional — required only for password reset emails)
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    MAIL_SERVER: Optional[str] = None
    MAIL_PORT: int = 587
    MAIL_TLS: bool = True

    # Google OAuth (optional — fill in before deploying)
    GOOGLE_CLIENT_ID: Optional[str] = None

    # Runtime/infra
    REDIS_URL: str = "redis://localhost:6379/0"
    SENTRY_DSN: Optional[str] = None
    TRUSTED_HOSTS: List[str] = ["*"]

    # Business configuration
    GST_PERCENTAGE: float = 18.0
    MIN_ORDER_AMOUNT: float = 100.0
    MAX_FILE_SIZE_MB: int = 50
    ALLOWED_FILE_TYPES: str = "pdf,jpg,jpeg,png,tiff,ai,psd,eps,cdr"

    @property
    def allowed_file_types_list(self) -> List[str]:
        return [v.strip().lower() for v in self.ALLOWED_FILE_TYPES.split(",") if v.strip()]

    # File uploads directory
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
