from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.admin import business as business_routes
from app.api.admin import coupons as coupons_routes
from app.api.admin import reviews_mod as reviews_mod_routes
from app.api.admin import roles as roles_routes

# Import IAM routers
from app.api.admin import users as users_routes
from app.api.admin import users_mgmt as users_mgmt_routes

# the original admin_guard module was removed; the logic now lives in auth dependencies
from app.api.auth.dependencies import admin_required, get_current_user

# Import Dashboard router
from app.api.v1.admin import dashboard_router
from app.db.session import get_db
from app.models.pricing import ExtraRate, MaterialRate
from app.models.user import User
from app.schemas.admin_pricing import ExtraCreate, MaterialCreate
from app.schemas.product import ProductCreate, ProductResponse
from app.services import admin_service
from app.services.admin_pricing_service import add_extra, add_material
from app.services.order_service import get_all_orders, update_order_status
from app.services.product_service import create_product, delete_product
from app.services.revenue_service import (
    get_month_revenue,
    get_today_revenue,
    get_total_revenue,
    get_year_revenue,
)

# 🔒 ADMIN ROUTER
router = APIRouter(
    prefix="/admin",
    tags=["admin"],
)

# Include IAM routes
router.include_router(users_routes.router)
router.include_router(roles_routes.router)

# Include user management routes
router.include_router(users_mgmt_routes.router)

# Include coupon management routes
router.include_router(coupons_routes.router)

# Include review moderation routes
router.include_router(reviews_mod_routes.router)

# Include business verification routes
router.include_router(business_routes.router)

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


# ── Enhanced Dashboard Endpoints ──────────────────────────────────────

@router.get("/dashboard/stats")
def get_dashboard_stats_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Get comprehensive dashboard statistics."""
    return admin_service.get_dashboard_stats(db)


@router.get("/revenue/trend")
def get_revenue_trend_endpoint(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Get daily revenue trend."""
    return admin_service.get_revenue_trend(db, days)


@router.get("/dashboard/order-distribution")
def get_order_distribution_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Get order status distribution."""
    return admin_service.get_order_status_distribution(db)


@router.get("/dashboard/top-products")
def get_top_products_endpoint(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Get top-selling products."""
    return admin_service.get_top_products(db, limit)


@router.get("/exports/orders")
def export_orders_endpoint(
    start_date: str = None,
    end_date: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Export orders to CSV."""
    from datetime import datetime

    from fastapi.responses import StreamingResponse

    start = datetime.fromisoformat(start_date) if start_date else None
    end = datetime.fromisoformat(end_date) if end_date else None

    csv_data = admin_service.export_orders_csv(db, start, end)

    return StreamingResponse(
        iter([csv_data]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=orders_export_{datetime.utcnow().date()}.csv"
        },
    )


# ---------- ACCESS LOGS (Security Monitoring) ----------
@router.get("/access-logs")
def get_access_logs(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
    action: str = None,
    ip: str = None,
    limit: int = 100,
):
    """View access logs for security monitoring. Admin only."""
    from app.models.access_log import AccessLog
    query = db.query(AccessLog).order_by(AccessLog.created_at.desc())
    if action:
        query = query.filter(AccessLog.action == action)
    if ip:
        query = query.filter(AccessLog.ip_address == ip)
    logs = query.limit(min(limit, 500)).all()
    return [
        {
            "id": log.id,
            "action": log.action,
            "success": log.success,
            "email": log.email,
            "ip_address": log.ip_address,
            "device": log.device_type,
            "browser": log.browser,
            "os": log.os_name,
            "endpoint": log.endpoint,
            "detail": log.detail,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]


@router.get("/access-logs/failed-logins")
def get_failed_logins(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
    hours: int = 24,
):
    """View recent failed login attempts. Admin only."""
    from app.services.access_log_service import get_failed_logins as _get
    logs = _get(db, hours=hours)
    return [
        {
            "email": log.email,
            "ip_address": log.ip_address,
            "device": log.device_type,
            "browser": log.browser,
            "os": log.os_name,
            "detail": log.detail,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]


# ---------- MAINTENANCE MODE ----------
@router.get("/maintenance")
def get_maintenance_status(
    current_user: User = Depends(admin_required),
):
    """Get current maintenance mode status."""
    from app.core.maintenance import get_maintenance_message, is_maintenance_active
    return {
        "active": is_maintenance_active(),
        "message": get_maintenance_message(),
    }


@router.post("/maintenance")
def set_maintenance_mode(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Enable or disable maintenance mode. Admin only."""
    from app.core.maintenance import set_maintenance
    active = bool(data.get("active", False))
    message = data.get("message", "")
    set_maintenance(active, message or None)
    return {
        "active": active,
        "message": message or "Maintenance mode updated",
    }
