from sqlalchemy.orm import Session

from app.models.product import Product


def create_product(db: Session, name: str, category: str, base_price: float):
    product = Product(
        name=name,
        category=category,
        base_price=base_price,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_all_products(db: Session, active_only: bool = True):
    query = db.query(Product)
    if active_only:
        query = query.filter(Product.is_active == True)
    return query.all()


def delete_product(db: Session, product_id: int):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise ValueError("Product not found")

    db.delete(product)
    db.commit()
