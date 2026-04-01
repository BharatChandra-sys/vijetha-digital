from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

# the original admin_guard module was removed; the logic now lives in auth dependencies
from app.api.auth.dependencies import admin_required, get_current_user
from app.db.session import get_db

from app.schemas.product import ProductCreate, ProductResponse
from app.schemas.admin_pricing import MaterialCreate, ExtraCreate

from app.services.product_service import create_product, delete_product
from app.services.order_service import get_all_orders, update_order_status
from app.services.admin_pricing_service import add_material, add_extra
from app.services.revenue_service import (
    get_total_revenue,
    get_today_revenue,
    get_month_revenue,
    get_year_revenue,
)

from app.models.pricing import MaterialRate, ExtraRate
from app.models.user import User

# Import IAM routers
from app.api.admin import users as users_routes
from app.api.admin import roles as roles_routes

# Import Dashboard router
from app.api.v1.admin import dashboard_router

# 🔒 ADMIN ROUTER
router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

# Include IAM routes
router.include_router(users_routes.router)
router.include_router(roles_routes.router)

# Include Dashboard routes (Products, Orders, Staff Management)
router.include_router(dashboard_router)

# ---------- ADMIN DASHBOARD ----------
@router.get("/dashboard")
def admin_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.services.rbac_service import RBACService
    
    # Check if user has admin-level permissions
    is_admin = RBACService.has_any_role(
        db,
        current_user.id,
        ["super_admin", "admin", "manager"]
    )
    
    if not is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return {
        "message": "Welcome to Admin Dashboard",
        "admin_email": current_user.email,
        "user_id": current_user.id,
        "roles": [r.name for r in current_user.roles_assigned],
    }


# ---------- PRODUCT MANAGEMENT ----------
@router.post("/products", response_model=ProductResponse)
def add_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return create_product(
        db,
        data.name,
        data.category,
        data.base_price,
    )


@router.delete("/products/{product_id}")
def remove_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    try:
        delete_product(db, product_id)
        return {"message": "Product deleted"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---------- ORDER MANAGEMENT ----------
@router.get("/orders")
def all_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return get_all_orders(db)


class OrderStatusUpdate(BaseModel):
    status: str

@router.patch("/orders/{order_id}")
def change_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    try:
        return update_order_status(db, order_id, payload.status)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# ---------- PRICING MANAGEMENT ----------
@router.post("/materials")
def create_material(
    data: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return add_material(db, data.name, data.rate_per_sqft)


@router.get("/materials")
def list_materials(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return db.query(MaterialRate).all()


@router.delete("/materials/{material_id}")
def delete_material(
    material_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    material = db.get(MaterialRate, material_id)
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")

    db.delete(material)
    db.commit()
    return {"message": "Deleted"}


@router.post("/extras")
def create_extra(
    data: ExtraCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return add_extra(db, data.name, data.price)


@router.get("/extras")
def list_extras(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return db.query(ExtraRate).all()


@router.delete("/extras/{extra_id}")
def delete_extra(
    extra_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    extra = db.get(ExtraRate, extra_id)
    if not extra:
        raise HTTPException(status_code=404, detail="Extra not found")

    db.delete(extra)
    db.commit()
    return {"message": "Deleted"}

@router.get("/revenue")
def revenue_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    return {
        "total_revenue": float(get_total_revenue(db)),
        "today_revenue": float(get_today_revenue(db)),
        "month_revenue": float(get_month_revenue(db)),
        "year_revenue": float(get_year_revenue(db)),
    }