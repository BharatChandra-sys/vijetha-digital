from sqlalchemy import JSON, Column, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)

    # Product snapshot (captured at order time so price history is preserved)
    product_name = Column(String(255), nullable=True)
    product_category = Column(String(100), nullable=True)

    # Custom signage / print dimensions
    width_ft = Column(Numeric(10, 2), nullable=True)
    height_ft = Column(Numeric(10, 2), nullable=True)
    material = Column(String(100), nullable=True)

    # Print specifications (JSON: {"lamination": "matte", "frame": "none", ...})
    print_specs = Column(JSON, nullable=True)

    # Custom specifications (free-form JSON for any extra options)
    custom_specs = Column(JSON, nullable=True)

    # Special instructions from customer
    special_instructions = Column(Text, nullable=True)

    quantity = Column(Integer, nullable=False)

    unit_price = Column(Numeric(12, 2), nullable=False)
    total_price = Column(Numeric(12, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", lazy="joined")
