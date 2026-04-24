from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.pricing import ExtraRate, MaterialRate


def add_material(db: Session, name: str, rate: float):
    name = name.lower()

    if db.query(MaterialRate).filter(MaterialRate.name == name).first():
        raise HTTPException(status_code=400, detail=f"Material '{name}' already exists")

    material = MaterialRate(name=name, rate_per_sqft=rate)
    db.add(material)
    db.commit()
    db.refresh(material)
    return material


def add_extra(db: Session, name: str, price: float):
    name = name.lower()

    if db.query(ExtraRate).filter(ExtraRate.name == name).first():
        raise HTTPException(status_code=400, detail=f"Extra '{name}' already exists")

    extra = ExtraRate(name=name, price=price)
    db.add(extra)
    db.commit()
    db.refresh(extra)
    return extra
