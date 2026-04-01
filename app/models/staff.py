"""Staff model for admin dashboard and IAM-linked workforce identity."""

from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.db.base import Base

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, unique=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    position = Column(String(255), nullable=False)  # e.g., Manager, Operator, Designer
    phone = Column(String(20), nullable=False)  # Contact phone number
    email = Column(String(255), nullable=True)  # Optional email
    department = Column(String(100), nullable=True)  # production, design, sales, admin, delivery
    status = Column(String(50), default="active")  # invited, active, suspended, offboarded
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="staff_profile", lazy="joined")
    
    def __repr__(self):
        return f"<Staff {self.id}: {self.name} - {self.position}>"
