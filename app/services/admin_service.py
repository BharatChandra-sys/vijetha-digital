"""
Admin service for dashboard metrics, reports, and exports.
"""
from datetime import datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.payment import Payment, PaymentState
from app.models.product import Product
from app.models.review import Review
from app.models.user import User, UserStatus


def get_dashboard_stats(db: Session) -> dict:
    """
    Get comprehensive dashboard statistics.

    Returns:
        Dict with key metrics for admin dashboard
    """
    # User stats
    total_users = db.query(User).filter(not User.is_deleted).count()
    active_users = db.query(User).filter(
        User.status == UserStatus.ACTIVE,
        not User.is_deleted,
    ).count()
    new_users_today = db.query(User).filter(
        User.created_at >= datetime.utcnow().date(),
        not User.is_deleted,
    ).count()

    # Order stats
    total_orders = db.query(Order).filter(Order.is_deleted == False).count()
    pending_orders = db.query(Order).filter(
        Order.status.in_([OrderStatus.placed, OrderStatus.confirmed]),
        Order.is_deleted == False,
    ).count()
    completed_orders = db.query(Order).filter(
        Order.status == OrderStatus.delivered,
        Order.is_deleted == False,
    ).count()

    # Revenue stats
    total_revenue = db.query(func.sum(Order.total_price)).filter(
        Order.payment_status == PaymentStatus.paid,
        Order.is_deleted == False,
    ).scalar() or 0.0

    revenue_today = db.query(func.sum(Order.total_price)).filter(
        Order.payment_status == PaymentStatus.paid,
        Order.paid_at >= datetime.utcnow().date(),
        Order.is_deleted == False,
    ).scalar() or 0.0

    revenue_this_month = db.query(func.sum(Order.total_price)).filter(
        Order.payment_status == PaymentStatus.paid,
        Order.paid_at >= datetime.utcnow().replace(day=1, hour=0, minute=0, second=0),
        Order.is_deleted == False,
    ).scalar() or 0.0

    # Product stats
    total_products = db.query(Product).filter(Product.is_active).count()

    # Review stats
    total_reviews = db.query(Review).count()
    pending_reviews = db.query(Review).filter(not Review.is_visible).count()

    # Payment stats
    successful_payments = db.query(Payment).filter(
        Payment.state == PaymentState.captured
    ).count()
    failed_payments = db.query(Payment).filter(
        Payment.state == PaymentState.failed
    ).count()

    return {
        "users": {
            "total": total_users,
            "active": active_users,
            "new_today": new_users_today,
        },
        "orders": {
            "total": total_orders,
            "pending": pending_orders,
            "completed": completed_orders,
        },
        "revenue": {
            "total": float(total_revenue),
            "today": float(revenue_today),
            "this_month": float(revenue_this_month),
        },
        "products": {
            "total": total_products,
        },
        "reviews": {
            "total": total_reviews,
            "pending_moderation": pending_reviews,
        },
        "payments": {
            "successful": successful_payments,
            "failed": failed_payments,
            "success_rate": (
                round(successful_payments / (successful_payments + failed_payments) * 100, 2)
                if (successful_payments + failed_payments) > 0
                else 0.0
            ),
        },
    }


def get_revenue_trend(db: Session, days: int = 30) -> list[dict]:
    """
    Get daily revenue trend for the last N days.

    Args:
        db: Database session
        days: Number of days to include

    Returns:
        List of daily revenue data
    """
    start_date = datetime.utcnow().date() - timedelta(days=days)

    # Query daily revenue
    daily_revenue = (
        db.query(
            func.date(Order.paid_at).label("date"),
            func.sum(Order.total_price).label("revenue"),
            func.count(Order.id).label("order_count"),
        )
        .filter(
            Order.payment_status == PaymentStatus.paid,
            Order.paid_at >= start_date,
            Order.is_deleted == False,
        )
        .group_by(func.date(Order.paid_at))
        .order_by(func.date(Order.paid_at))
        .all()
    )

    return [
        {
            "date": str(row.date),
            "revenue": float(row.revenue),
            "order_count": row.order_count,
        }
        for row in daily_revenue
    ]


def get_order_status_distribution(db: Session) -> dict:
    """
    Get distribution of orders by status.

    Returns:
        Dict with count per status
    """
    status_counts = (
        db.query(
            Order.status,
            func.count(Order.id).label("count"),
        )
        .filter(Order.is_deleted == False)
        .group_by(Order.status)
        .all()
    )

    return {
        row.status.value: row.count
        for row in status_counts
    }


def get_top_products(db: Session, limit: int = 10) -> list[dict]:
    """
    Get top-selling products by order count.

    Args:
        db: Database session
        limit: Number of products to return

    Returns:
        List of top products with sales data
    """
    from app.models.order_item import OrderItem

    top_products = (
        db.query(
            Product.id,
            Product.name,
            Product.category,
            func.count(OrderItem.id).label("order_count"),
            func.sum(OrderItem.quantity).label("total_quantity"),
            func.sum(OrderItem.total_price).label("total_revenue"),
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .filter(
            Order.payment_status == PaymentStatus.paid,
            Order.is_deleted == False,
        )
        .group_by(Product.id, Product.name, Product.category)
        .order_by(func.count(OrderItem.id).desc())
        .limit(limit)
        .all()
    )

    return [
        {
            "id": row.id,
            "name": row.name,
            "category": row.category,
            "order_count": row.order_count,
            "total_quantity": row.total_quantity,
            "total_revenue": float(row.total_revenue),
        }
        for row in top_products
    ]


def get_user_growth(db: Session, days: int = 30) -> list[dict]:
    """
    Get daily user registration trend.

    Args:
        db: Database session
        days: Number of days to include

    Returns:
        List of daily user registration data
    """
    start_date = datetime.utcnow().date() - timedelta(days=days)

    daily_users = (
        db.query(
            func.date(User.created_at).label("date"),
            func.count(User.id).label("user_count"),
        )
        .filter(
            User.created_at >= start_date,
            not User.is_deleted,
        )
        .group_by(func.date(User.created_at))
        .order_by(func.date(User.created_at))
        .all()
    )

    return [
        {
            "date": str(row.date),
            "user_count": row.user_count,
        }
        for row in daily_users
    ]


def get_payment_method_distribution(db: Session) -> dict:
    """
    Get distribution of payments by method.

    Returns:
        Dict with count per payment method
    """
    method_counts = (
        db.query(
            Payment.method,
            func.count(Payment.id).label("count"),
            func.sum(Payment.amount).label("total_amount"),
        )
        .filter(Payment.state == PaymentState.captured)
        .group_by(Payment.method)
        .all()
    )

    return {
        str(row.method.value if row.method else "unknown"): {
            "count": row.count,
            "total_amount": float(row.total_amount),
        }
        for row in method_counts
    }


def export_orders_csv(db: Session, start_date: datetime = None, end_date: datetime = None) -> str:
    """
    Export orders to CSV format.

    Args:
        db: Database session
        start_date: Optional start date filter
        end_date: Optional end date filter

    Returns:
        CSV string
    """
    import csv
    from io import StringIO

    query = db.query(Order).filter(Order.is_deleted == False)

    if start_date:
        query = query.filter(Order.created_at >= start_date)
    if end_date:
        query = query.filter(Order.created_at <= end_date)

    orders = query.order_by(Order.created_at.desc()).all()

    output = StringIO()
    writer = csv.writer(output)

    # Header
    writer.writerow([
        "Order ID",
        "User Email",
        "Status",
        "Payment Status",
        "Subtotal",
        "Tax",
        "Discount",
        "Shipping",
        "Total",
        "Created At",
        "Paid At",
    ])

    # Data
    for order in orders:
        writer.writerow([
            order.id,
            order.user.email if order.user else "N/A",
            order.status.value,
            order.payment_status.value,
            order.subtotal,
            order.tax,
            order.discount,
            order.shipping,
            order.total_price,
            order.created_at.isoformat(),
            order.paid_at.isoformat() if order.paid_at else "N/A",
        ])

    return output.getvalue()

