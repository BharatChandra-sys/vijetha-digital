from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.exceptions import ConflictException, NotFoundException
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def create_product(
    db: Session,
    name: str,
    category: str,
    base_price: float,
    description: Optional[str] = None,
    unit: Optional[str] = None,
    image_url: Optional[str] = None,
    slug: Optional[str] = None,
) -> Product:
    if slug:
        existing = db.query(Product).filter(Product.slug == slug).first()
        if existing:
            raise ConflictException(f"Product slug '{slug}' already exists")

    product = Product(
        name=name,
        category=category,
        base_price=base_price,
        description=description,
        unit=unit,
        image_url=image_url,
        slug=slug,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def create_product_from_schema(db: Session, data: ProductCreate) -> Product:
    if data.slug:
        existing = db.query(Product).filter(Product.slug == data.slug).first()
        if existing:
            raise ConflictException(f"Product slug '{data.slug}' already exists")

    product = Product(
        name=data.name,
        category=data.category,
        base_price=data.base_price,
        description=data.description,
        unit=data.unit,
        image_url=data.image_url,
        slug=data.slug,
        seo_title=data.seo_title,
        seo_description=data.seo_description,
        seo_tags=data.seo_tags,
        specification_options=data.specification_options,
        turnaround_options=data.turnaround_options,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def get_all_products(db: Session, active_only: bool = True) -> List[Product]:
    query = db.query(Product)
    if active_only:
        query = query.filter(Product.is_active == True)
    return query.order_by(Product.id.asc()).all()


def get_product_by_id(db: Session, product_id: int) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise NotFoundException("Product", str(product_id))
    return product


def get_product_by_slug(db: Session, slug: str) -> Product:
    product = db.query(Product).filter(Product.slug == slug, Product.is_active == True).first()
    if not product:
        raise NotFoundException("Product", slug)
    return product


def update_product(db: Session, product_id: int, data: ProductUpdate) -> Product:
    product = get_product_by_id(db, product_id)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> None:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise NotFoundException("Product", str(product_id))
    db.delete(product)
    db.commit()
