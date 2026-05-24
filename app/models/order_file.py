import enum
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base import Base


class FileType(enum.StrEnum):
    DESIGN_FILE = "design_file"
    PROOF = "proof"
    INVOICE = "invoice"
    DELIVERY_PROOF = "delivery_proof"


class OrderFile(Base):
    __tablename__ = "order_files"

    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    order_item_id = Column(Integer, ForeignKey("order_items.id", ondelete="CASCADE"), nullable=True, index=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    file_type = Column(Enum(FileType, name="order_file_type_enum"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    mime_type = Column(String(120), nullable=False)

    is_approved = Column(Boolean, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    review_notes = Column(String(1000), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    order = relationship("Order", foreign_keys=[order_id])
    order_item = relationship("OrderItem", foreign_keys=[order_item_id])
