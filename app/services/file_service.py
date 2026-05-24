"""
File service — validation, S3 upload, and presigned URL generation.
"""
import hashlib
import mimetypes
import uuid
from datetime import datetime
from pathlib import Path

from app.core.config import settings
from app.core.exceptions import ValidationException

# Allowed file types and max sizes
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_DOCUMENT_TYPES = {"application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime"}

MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB
MAX_DOCUMENT_SIZE = 10 * 1024 * 1024  # 10 MB
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50 MB


def validate_file(
    content: bytes,
    content_type: str,
    allowed_types: set[str],
    max_size: int,
    filename: str | None = None,
) -> None:
    """
    Validate file content type and size.
    Raises ValidationException if validation fails.
    """
    if content_type not in allowed_types:
        raise ValidationException(
            f"File type '{content_type}' not allowed. Allowed types: {', '.join(allowed_types)}"
        )

    if len(content) > max_size:
        max_mb = max_size / (1024 * 1024)
        raise ValidationException(f"File size exceeds {max_mb:.1f} MB limit")

    if len(content) == 0:
        raise ValidationException("File is empty")


def generate_unique_filename(original_filename: str, prefix: str = "") -> str:
    """Generate a unique filename with timestamp and UUID."""
    ext = Path(original_filename).suffix.lower()
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    unique_id = uuid.uuid4().hex[:8]

    if prefix:
        return f"{prefix}_{timestamp}_{unique_id}{ext}"
    return f"{timestamp}_{unique_id}{ext}"


def compute_file_hash(content: bytes) -> str:
    """Compute SHA256 hash of file content."""
    return hashlib.sha256(content).hexdigest()


def save_file_locally(
    content: bytes,
    filename: str,
    subfolder: str = "uploads",
) -> str:
    """
    Save file to local filesystem.
    Returns the relative URL path.
    """
    upload_dir = Path(settings.UPLOAD_DIR) / subfolder
    upload_dir.mkdir(parents=True, exist_ok=True)

    file_path = upload_dir / filename
    with open(file_path, "wb") as f:
        f.write(content)

    return f"/{subfolder}/{filename}"


def upload_image(content: bytes, filename: str, subfolder: str = "images") -> str:
    """
    Validate and upload an image file.
    Returns the file URL.
    """
    # Detect content type from filename
    content_type, _ = mimetypes.guess_type(filename)
    if not content_type:
        content_type = "application/octet-stream"

    validate_file(content, content_type, ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE, filename)

    unique_filename = generate_unique_filename(filename, prefix="img")

    # For now, save locally. In production, upload to S3.
    if settings.USE_S3:
        return upload_to_s3(content, unique_filename, subfolder, content_type)
    else:
        return save_file_locally(content, unique_filename, subfolder)


def upload_document(content: bytes, filename: str, subfolder: str = "documents") -> str:
    """
    Validate and upload a document file (PDF, DOCX).
    Returns the file URL.
    """
    content_type, _ = mimetypes.guess_type(filename)
    if not content_type:
        content_type = "application/octet-stream"

    validate_file(content, content_type, ALLOWED_DOCUMENT_TYPES, MAX_DOCUMENT_SIZE, filename)

    unique_filename = generate_unique_filename(filename, prefix="doc")

    if settings.USE_S3:
        return upload_to_s3(content, unique_filename, subfolder, content_type)
    else:
        return save_file_locally(content, unique_filename, subfolder)


def upload_video(content: bytes, filename: str, subfolder: str = "videos") -> str:
    """
    Validate and upload a video file.
    Returns the file URL.
    """
    content_type, _ = mimetypes.guess_type(filename)
    if not content_type:
        content_type = "application/octet-stream"

    validate_file(content, content_type, ALLOWED_VIDEO_TYPES, MAX_VIDEO_SIZE, filename)

    unique_filename = generate_unique_filename(filename, prefix="vid")

    if settings.USE_S3:
        return upload_to_s3(content, unique_filename, subfolder, content_type)
    else:
        return save_file_locally(content, unique_filename, subfolder)


def upload_to_s3(content: bytes, filename: str, subfolder: str, content_type: str) -> str:
    """
    Upload file to S3 and return the public URL.
    Requires boto3 and AWS credentials configured.
    """
    try:
        import boto3
        from botocore.exceptions import ClientError
    except ImportError:
        raise RuntimeError("boto3 not installed. Install with: pip install boto3")

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )

    s3_key = f"{subfolder}/{filename}"
    bucket = settings.S3_BUCKET_NAME

    try:
        s3_client.put_object(
            Bucket=bucket,
            Key=s3_key,
            Body=content,
            ContentType=content_type,
            ACL="public-read",
        )

        # Return public URL
        return f"https://{bucket}.s3.{settings.AWS_REGION}.amazonaws.com/{s3_key}"

    except ClientError as e:
        raise RuntimeError(f"S3 upload failed: {str(e)}")


def generate_presigned_url(s3_key: str, expiration: int = 3600) -> str:
    """
    Generate a presigned URL for private S3 objects.
    Expiration in seconds (default 1 hour).
    """
    try:
        import boto3
        from botocore.exceptions import ClientError
    except ImportError:
        raise RuntimeError("boto3 not installed")

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )

    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": settings.S3_BUCKET_NAME, "Key": s3_key},
            ExpiresIn=expiration,
        )
        return url
    except ClientError as e:
        raise RuntimeError(f"Failed to generate presigned URL: {str(e)}")


def delete_file_from_s3(s3_key: str) -> bool:
    """Delete a file from S3. Returns True if successful."""
    try:
        import boto3
        from botocore.exceptions import ClientError
    except ImportError:
        return False

    s3_client = boto3.client(
        "s3",
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION,
    )

    try:
        s3_client.delete_object(Bucket=settings.S3_BUCKET_NAME, Key=s3_key)
        return True
    except ClientError:
        return False
