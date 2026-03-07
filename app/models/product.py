from sqlalchemy import Column, Integer, String, Boolean, Numeric, Text
from sqlalchemy.orm import relationship
from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    unit = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    base_price = Column(Numeric(12, 2), nullable=False)

    is_active = Column(Boolean, default=True)

    reviews = relationship("Review", back_populates="product", cascade="all, delete-orphan")