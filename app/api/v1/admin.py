"""
Admin Dashboard API Routes
Handles: Products, Orders, Staff Management for Admin Panel
"""

import os
import uuid
from datetime import date, datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload

from app.api.auth.dependencies import admin_required
from app.core.config import settings
from app.db.session import get_db
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User
from app.services.iam_readiness_service import IAMReadinessService
from app.services.order_service import update_order_status as safe_update_order_status

dashboard_router = APIRouter(prefix="/dashboard", tags=["admin-dashboard"])


def _ensure_staff_table(db: Session) -> None:
    """Create the staff table on demand if it doesn't exist yet."""
    from sqlalchemy import inspect as sqlalchemy_inspect

    from app.models.staff import Staff

    # Get engine from session
    engine = db.get_bind()
    inspector = sqlalchemy_inspect(engine)
    if not inspector.has_table(Staff.__tablename__):
        Staff.__table__.create(bind=engine, checkfirst=True)


class OrderStatusUpdateRequest(BaseModel):
    status: str


class OrderTrackingUpdateRequest(BaseModel):
    tracking_number: Optional[str] = None
    tracking_url: Optional[str] = None


class StaffCreateRequest(BaseModel):
    name: str
    position: str
    phone: str
    user_id: Optional[int] = None
    email: Optional[str] = None
    department: Optional[str] = None
    status: str = "active"


class StaffUpdateRequest(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    user_id: Optional[int] = None
    unlink_user: bool = False
    email: Optional[str] = None
    department: Optional[str] = None
    status: Optional[str] = None


def _validate_staff_status(status_value: Optional[str]) -> Optional[str]:
    if status_value is None:
        return None
    allowed = {"invited", "active", "suspended", "offboarded"}
    if status_value not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid staff status '{status_value}'. Allowed: {', '.join(sorted(allowed))}",
        )
    return status_value


def _resolve_staff_user(db: Session, user_id: Optional[int]) -> Optional[User]:
    if user_id is None:
        return None
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Linked user not found")
    return user

# ============================================
# DASHBOARD ENDPOINTS
# ============================================
@dashboard_router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Fetch comprehensive dashboard statistics with time-based analytics"""
    now = datetime.utcnow()
    
    # Time periods
    thirty_days_ago = now - timedelta(days=30)
    ninety_days_ago = now - timedelta(days=90)
    
    # Total counts
    total_orders = db.query(Order).count()
    total_products = db.query(Product).count()
    pending_orders = db.query(Order).filter(
        Order.status.in_([
            OrderStatus.placed,
            OrderStatus.confirmed,
            OrderStatus.printing,
            OrderStatus.quality_check,
        ])
    ).count()
    shipped_orders = db.query(Order).filter(Order.status == OrderStatus.shipped).count()
    
    # Revenue calculations
    completed_orders = db.query(Order).filter(Order.status == OrderStatus.delivered).all()
    total_revenue = sum([float(order.total_price) for order in completed_orders]) if completed_orders else 0
    
    # 30-day revenue
    revenue_30days_orders = db.query(Order).filter(
        Order.status == OrderStatus.delivered,
        Order.created_at >= thirty_days_ago
    ).all()
    revenue_30days = sum([float(order.total_price) for order in revenue_30days_orders]) if revenue_30days_orders else 0
    
    # 90-day revenue
    revenue_90days_orders = db.query(Order).filter(
        Order.status == OrderStatus.delivered,
        Order.created_at >= ninety_days_ago
    ).all()
    revenue_90days = sum([float(order.total_price) for order in revenue_90days_orders]) if revenue_90days_orders else 0
    
    # Cancelled/returned orders (losses)
    cancelled_orders = db.query(Order).filter(Order.status == OrderStatus.cancelled).all()
    returned_orders = db.query(Order).filter(Order.status == OrderStatus.refunded).all()
    
    total_cancelled = len(cancelled_orders)
    total_returned = len(returned_orders)
    loss_from_cancelled = sum([float(order.total_price) for order in cancelled_orders]) if cancelled_orders else 0
    loss_from_returned = sum([float(order.total_price) for order in returned_orders]) if returned_orders else 0
    total_losses = loss_from_cancelled + loss_from_returned
    
    # Product model currently has no stock column
    low_stock_products = 0
    
    return {
        "totalOrders": total_orders,
        "totalProducts": total_products,
        "pendingOrders": pending_orders,
        "shippedOrders": shipped_orders,
        "totalRevenue": round(total_revenue, 2),
        "revenue30Days": round(revenue_30days, 2),
        "revenue90Days": round(revenue_90days, 2),
        "cancelledOrders": total_cancelled,
        "returnedOrders": total_returned,
        "totalLosses": round(total_losses, 2),
        "lossFromCancelled": round(loss_from_cancelled, 2),
        "lossFromReturned": round(loss_from_returned, 2),
        "lowStockProducts": low_stock_products,
        "averageOrderValue": round(total_revenue / total_orders, 2) if total_orders > 0 else 0
    }


@dashboard_router.get("/revenue-trend")
def get_revenue_trend(
    days: int = Query(30, ge=7, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Return day-wise delivered-order revenue trend for graph plotting."""
    start_dt = datetime.utcnow() - timedelta(days=days - 1)

    rows = (
        db.query(
            func.date(Order.created_at).label("day"),
            func.count(Order.id).label("orders"),
            func.coalesce(func.sum(Order.total_price), 0).label("revenue"),
        )
        .filter(
            Order.status == OrderStatus.delivered,
            Order.created_at >= start_dt,
        )
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
        .all()
    )

    by_day = {
        str(row.day): {
            "orders": int(row.orders or 0),
            "revenue": float(row.revenue or 0),
        }
        for row in rows
    }

    points = []
    for i in range(days):
        current_day = (start_dt + timedelta(days=i)).date()
        key = current_day.isoformat()
        values = by_day.get(key, {"orders": 0, "revenue": 0.0})
        points.append(
            {
                "date": key,
                "orders": values["orders"],
                "revenue": round(values["revenue"], 2),
            }
        )

    return {
        "days": days,
        "points": points,
    }


@dashboard_router.get("/iam/readiness")
def get_iam_readiness(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required),
):
    """Operational IAM readiness report used before role-based staff rollout."""
    return IAMReadinessService.build_report(db)

# ============================================
# PRODUCT MANAGEMENT ENDPOINTS
# ============================================
@dashboard_router.post("/products")
async def create_product_endpoint(
    name: str = Form(...),
    description: str = Form(""),
    base_price: float = Form(...),
    category: str = Form(...),
    unit: Optional[str] = Form(None),
    is_active: bool = Form(True),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Create a new product (Admin only)"""
    try:
        if base_price < 0:
            raise HTTPException(status_code=400, detail="base_price must be non-negative")

        # Handle image upload
        image_url = None
        if image:
            if not image.filename:
                raise HTTPException(status_code=400, detail="Invalid image filename")
            
            if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
                raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed")
            
            image_content = await image.read()
            if len(image_content) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Image size must be less than 5MB")

            file_ext = image.filename.split('.')[-1]
            unique_filename = f"product_{uuid.uuid4()}.{file_ext}"
            file_path = os.path.join(settings.UPLOAD_DIR, "products", unique_filename)
            
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(image_content)
            
            image_url = f"/uploads/products/{unique_filename}"
        
        # Create product
        new_product = Product(
            name=name,
            description=description,
            base_price=base_price,
            category=category,
            image_url=image_url,
            unit=unit,
            is_active=is_active,
        )
        
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        
        return {"id": new_product.id, "message": "Product created successfully"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@dashboard_router.get("/products")
def list_all_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """List all products for admin"""
    products = db.query(Product).all()
    return [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "basePrice": float(p.base_price),
            "category": p.category,
            "unit": p.unit,
            "isActive": p.is_active,
            "imageUrl": p.image_url,
        }
        for p in products
    ]

@dashboard_router.put("/products/{product_id}")
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    base_price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    unit: Optional[str] = Form(None),
    is_active: Optional[bool] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Update product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    try:
        if base_price is not None and base_price < 0:
            raise HTTPException(status_code=400, detail="base_price must be non-negative")

        if name:
            product.name = name
        if description:
            product.description = description
        if base_price is not None:
            product.base_price = base_price
        if category:
            product.category = category
        if unit is not None:
            product.unit = unit
        if is_active is not None:
            product.is_active = is_active
        
        if image:
            if not image.filename:
                raise HTTPException(status_code=400, detail="Invalid image filename")
            
            if image.content_type not in ["image/jpeg", "image/png", "image/webp"]:
                raise HTTPException(status_code=400, detail="Only JPEG, PNG, and WebP images are allowed")
            
            image_content = await image.read()
            if len(image_content) > 5 * 1024 * 1024:
                raise HTTPException(status_code=400, detail="Image size must be less than 5MB")

            file_ext = image.filename.split('.')[-1]
            unique_filename = f"product_{uuid.uuid4()}.{file_ext}"
            file_path = os.path.join(settings.UPLOAD_DIR, "products", unique_filename)
            
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, "wb") as f:
                f.write(image_content)
            
            product.image_url = f"/uploads/products/{unique_filename}"
        
        product.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Product updated successfully"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@dashboard_router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Delete product (Admin only)"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    
    return {"message": "Product deleted successfully"}

# ============================================
# ORDER MANAGEMENT ENDPOINTS
# ============================================
@dashboard_router.get("/orders")
def list_all_orders(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """List all orders for admin"""
    query = db.query(Order)

    if start_date:
        from datetime import time as dt_time
        query = query.filter(Order.created_at >= datetime.combine(start_date, dt_time.min))

    if end_date:
        # Inclusive end_date filter: include the whole day
        from datetime import time as dt_time
        end_exclusive = datetime.combine(end_date + timedelta(days=1), dt_time.min)
        query = query.filter(Order.created_at < end_exclusive)

    orders = query.order_by(Order.created_at.desc()).all()
    return [
        {
            "id": o.id,
            "customerName": (o.user.full_name if o.user and o.user.full_name else (o.user.email if o.user else "Guest")),
            "customerEmail": (o.user.email if o.user else "-"),
            "customerPhone": (o.user.phone if o.user and hasattr(o.user, "phone") else "-"),
            "totalAmount": float(o.total_price),
            "status": o.status.value if hasattr(o.status, "value") else str(o.status),
            "createdAt": o.created_at.isoformat() if o.created_at else None,
            "trackingNumber": o.tracking_number or None,
            "trackingUrl": o.tracking_url or None,
            "invoiceUrl": o.invoice_url or None,
            "items": [
                {
                    "productName": oi.product.name if oi.product else "Custom Item",
                    "quantity": oi.quantity,
                    "price": float(oi.unit_price)
                }
                for oi in o.items
            ]
        }
        for o in orders
    ]

@dashboard_router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Update order status (Admin only)"""
    try:
        updated_order = safe_update_order_status(db, order_id, payload.status)
        return {
            "message": f"Order status updated to {payload.status}",
            "orderId": updated_order.id,
            "status": updated_order.status.value if hasattr(updated_order.status, "value") else str(updated_order.status),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@dashboard_router.get("/orders/{order_id}/details")
def get_order_details(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Get complete order details with all related information"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "id": order.id,
        "customerName": order.user.full_name if order.user and order.user.full_name else (order.user.email if order.user else "Guest"),
        "customerEmail": order.user.email if order.user else "-",
        "customerPhone": order.user.phone if order.user and hasattr(order.user, "phone") else "-",
        "subtotal": float(order.subtotal),
        "tax": float(order.tax),
        "discount": float(order.discount),
        "shipping": float(order.shipping),
        "totalAmount": float(order.total_price),
        "status": order.status.value if hasattr(order.status, "value") else str(order.status),
        "paymentStatus": order.payment_status.value if hasattr(order.payment_status, "value") else str(order.payment_status),
        "createdAt": order.created_at.isoformat() if order.created_at else None,
        "updatedAt": order.updated_at.isoformat() if order.updated_at else None,
        "paidAt": order.paid_at.isoformat() if order.paid_at else None,
        "trackingNumber": order.tracking_number or None,
        "trackingUrl": order.tracking_url or None,
        "invoiceUrl": order.invoice_url or None,
        "items": [
            {
                "productName": oi.product.name if oi.product else "Custom Item",
                "quantity": oi.quantity,
                "price": float(oi.unit_price),
                "subtotal": float(oi.quantity * oi.unit_price)
            }
            for oi in order.items
        ]
    }


@dashboard_router.put("/orders/{order_id}/tracking")
def update_order_tracking(
    order_id: int,
    payload: OrderTrackingUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Update order tracking information"""
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        if payload.tracking_number is not None:
            order.tracking_number = payload.tracking_number
        if payload.tracking_url is not None:
            order.tracking_url = payload.tracking_url
        
        order.updated_at = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Tracking information updated",
            "orderId": order.id,
            "trackingNumber": order.tracking_number,
            "trackingUrl": order.tracking_url
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@dashboard_router.post("/orders/{order_id}/invoice")
async def upload_invoice(
    order_id: int,
    invoice: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Upload invoice for an order"""
    try:
        order = db.query(Order).filter(Order.id == order_id).first()
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        
        # Validate file
        if not invoice.filename:
            raise HTTPException(status_code=400, detail="Invalid invoice file")
        
        if invoice.content_type not in ["application/pdf", "image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Only PDF, PNG, JPG files allowed")
        
        invoice_content = await invoice.read()
        if len(invoice_content) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Invoice size must be less than 5MB")
        
        file_ext = invoice.filename.split('.')[-1]
        
        unique_filename = f"invoice_{order.id}_{uuid.uuid4()}.{file_ext}"
        file_path = os.path.join(settings.UPLOAD_DIR, "invoices", unique_filename)
        
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(invoice_content)
        
        order.invoice_url = f"/uploads/invoices/{unique_filename}"
        order.updated_at = datetime.utcnow()
        db.commit()
        
        return {
            "message": "Invoice uploaded successfully",
            "orderId": order.id,
            "invoiceUrl": order.invoice_url
        }
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

# ============================================
# STAFF MANAGEMENT ENDPOINTS (New Table)
# ============================================
@dashboard_router.post("/staff")
def create_staff_member(
    payload: StaffCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Add new staff member"""
    try:
        from app.models.staff import Staff
        _ensure_staff_table(db)
        _validate_staff_status(payload.status)

        linked_user = _resolve_staff_user(db, payload.user_id)
        if payload.user_id is not None:
            existing = db.query(Staff).filter(Staff.user_id == payload.user_id).first()
            if existing:
                raise HTTPException(status_code=400, detail="This user is already linked to another staff profile")
        
        new_staff = Staff(
            user_id=payload.user_id,
            name=payload.name,
            position=payload.position,
            phone=payload.phone,
            email=payload.email or (linked_user.email if linked_user else None),
            department=payload.department,
            status=payload.status,
            created_at=datetime.utcnow()
        )
        
        db.add(new_staff)
        db.commit()
        db.refresh(new_staff)
        
        return {"id": new_staff.id, "message": "Staff member added successfully"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create staff member: {e}")

@dashboard_router.get("/staff")
def list_staff(
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """List all staff members"""
    try:
        from app.models.staff import Staff
        _ensure_staff_table(db)
        
        staff_members = db.query(Staff).options(selectinload(Staff.user).selectinload(User.roles_assigned)).all()
        return [
            {
                "id": s.id,
                "userId": s.user_id,
                "userEmail": s.user.email if s.user else None,
                "userFullName": s.user.full_name if s.user else None,
                "userStatus": s.user.status.value if s.user and s.user.status else None,
                "iamRoles": [r.slug for r in s.user.roles_assigned] if s.user else [],
                "name": s.name,
                "position": s.position,
                "phone": s.phone,
                "email": s.email,
                "department": s.department,
                "status": s.status
            }
            for s in staff_members
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list staff members: {e}")

@dashboard_router.put("/staff/{staff_id}")
def update_staff(
    staff_id: int,
    payload: StaffUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Update staff member info"""
    try:
        from app.models.staff import Staff
        _ensure_staff_table(db)
        
        staff = db.query(Staff).filter(Staff.id == staff_id).first()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff member not found")

        _validate_staff_status(payload.status)

        if payload.unlink_user and payload.user_id is not None:
            raise HTTPException(status_code=400, detail="Provide either user_id or unlink_user, not both")

        if payload.unlink_user:
            staff.user_id = None

        if payload.user_id is not None:
            linked_user = _resolve_staff_user(db, payload.user_id)
            existing = db.query(Staff).filter(Staff.user_id == payload.user_id, Staff.id != staff_id).first()
            if existing:
                raise HTTPException(status_code=400, detail="This user is already linked to another staff profile")
            staff.user_id = payload.user_id
            if payload.email is None:
                staff.email = linked_user.email
        
        if payload.name is not None:
            staff.name = payload.name
        if payload.position is not None:
            staff.position = payload.position
        if payload.phone is not None:
            staff.phone = payload.phone
        if payload.email is not None:
            staff.email = payload.email
        if payload.department is not None:
            staff.department = payload.department
        if payload.status is not None:
            staff.status = payload.status
        
        staff.updated_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Staff member updated successfully"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update staff member: {e}")

@dashboard_router.delete("/staff/{staff_id}")
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(admin_required)
):
    """Delete staff member"""
    try:
        from app.models.staff import Staff
        _ensure_staff_table(db)
        
        staff = db.query(Staff).filter(Staff.id == staff_id).first()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff member not found")
        
        db.delete(staff)
        db.commit()
        
        return {"message": "Staff member deleted successfully"}
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete staff member: {e}")
