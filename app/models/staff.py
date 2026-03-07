"""
Staff Model for Admin Dashboard
Stores information about team members
"""

from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

from app.db.base import Base

class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    position = Column(String(255), nullable=False)  # e.g., Manager, Operator, Designer
    phone = Column(String(20), nullable=False)  # Contact phone number
    email = Column(String(255), nullable=True)  # Optional email
    department = Column(String(100), nullable=True)  # production, design, sales, admin, delivery
    status = Column(String(50), default="active")  # active, inactive, on_leave
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f"<Staff {self.id}: {self.name} - {self.position}>"
