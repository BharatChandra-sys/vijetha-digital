from sqlalchemy import func

from app.models.order import Order, PaymentStatus


def get_total_revenue(db):
    return db.query(
        func.coalesce(func.sum(Order.total_price), 0)
    ).filter(
        Order.payment_status == PaymentStatus.paid
    ).scalar()


def get_today_revenue(db):
    return db.query(
        func.coalesce(func.sum(Order.total_price), 0)
    ).filter(
        Order.payment_status == PaymentStatus.paid,
        func.date(Order.created_at) == func.current_date()
    ).scalar()


def get_month_revenue(db):
    return db.query(
        func.coalesce(func.sum(Order.total_price), 0)
    ).filter(
        Order.payment_status == PaymentStatus.paid,
        func.date_trunc("month", Order.created_at) ==
        func.date_trunc("month", func.current_date())
    ).scalar()


def get_year_revenue(db):
    return db.query(
        func.coalesce(func.sum(Order.total_price), 0)
    ).filter(
        Order.payment_status == PaymentStatus.paid,
        func.date_trunc("year", Order.created_at) ==
        func.date_trunc("year", func.current_date())
    ).scalar()
