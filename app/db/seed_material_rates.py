from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.pricing import MaterialRate


def seed_material_rates():
    db: Session = SessionLocal()

    materials = {
        "flex": 50,
        "star_flex": 70,
        "eco_flex": 90,
    }

    for name, rate_per_sqft in materials.items():
        existing = (
            db.query(MaterialRate)
            .filter(MaterialRate.name == name)
            .first()
        )

        if existing:
            existing.rate_per_sqft = rate_per_sqft
        else:
            db.add(
                MaterialRate(
                    name=name,
                    rate_per_sqft=rate_per_sqft,
                )
            )

    db.commit()
    db.close()
    print("✅ Material rates seeded successfully")


if __name__ == "__main__":
    seed_material_rates()
