from sqlalchemy import JSON, Boolean, Column, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    slug = Column(String(255), unique=True, nullable=True, index=True)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    unit = Column(String, nullable=True)
    
    # Legacy single image (kept for backward compatibility)
    image_url = Column(String, nullable=True)
    
    # New: Multiple images gallery (array of URLs)
    images = Column(JSON, nullable=True)  # ["url1.jpg", "url2.jpg", "url3.jpg"]
    
    # New: Videos (array of video objects)
    videos = Column(JSON, nullable=True)  # [{"url": "video.mp4", "thumbnail": "thumb.jpg", "title": "Product Demo"}]

    base_price = Column(Numeric(12, 2), nullable=False)

    is_active = Column(Boolean, default=True)

    # SEO
    seo_title = Column(String(255), nullable=True)
    seo_description = Column(Text, nullable=True)
    seo_tags = Column(JSON, nullable=True)  # list of strings

    # Specification options (e.g. paper types, sizes)
    specification_options = Column(JSON, nullable=True)

    # Turnaround options (e.g. [{"label": "Standard 3-5 days", "extra_cost": 0}])
    turnaround_options = Column(JSON, nullable=True)

    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")
