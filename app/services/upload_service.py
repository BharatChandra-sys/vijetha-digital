import cloudinary
import cloudinary.uploader

from app.core.config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)


def upload_file(file):
    result = cloudinary.uploader.upload(
        file,
        resource_type="auto",
        folder="printing_orders",
    )
    return result["secure_url"]
