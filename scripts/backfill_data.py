"""
Data backfill script for production database upgrades.
Ensures backward compatibility when adding new non-null fields.
"""
from datetime import datetime

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.order import Order, OrderStatus, PaymentStatus
from app.models.user import User, UserStatus


def backfill_user_fields(db: Session) -> dict:
    """
    Backfill new user fields with safe defaults.
    
    Fields:
    - failed_login_attempts: default to 0
    - status: default to ACTIVE for existing users
    - is_deleted: default to False
    """
    print("Backfilling user fields...")
    
    # Update users with NULL failed_login_attempts
    result = db.execute(
        text("""
            UPDATE users 
            SET failed_login_attempts = 0 
            WHERE failed_login_attempts IS NULL
        """)
    )
    users_updated = result.rowcount
    
    # Update users with NULL status
    db.execute(
        text(f"""
            UPDATE users 
            SET status = '{UserStatus.ACTIVE.value}' 
            WHERE status IS NULL
        """)
    )
    
    # Update users with NULL is_deleted
    db.execute(
        text("""
            UPDATE users 
            SET is_deleted = FALSE 
            WHERE is_deleted IS NULL
        """)
    )
    
    db.commit()
    
    return {
        "table": "users",
        "users_updated": users_updated,
        "message": "User fields backfilled successfully"
    }


def backfill_order_fields(db: Session) -> dict:
    """
    Backfill new order fields with safe defaults.
    
    Fields:
    - is_deleted: default to False
    - subtotal: calculate from total_price if NULL
    - tax: default to 0
    - discount: default to 0
    - shipping: default to 0
    """
    print("Backfilling order fields...")
    
    # Update orders with NULL is_deleted
    result = db.execute(
        text("""
            UPDATE orders 
            SET is_deleted = FALSE 
            WHERE is_deleted IS NULL
        """)
    )
    orders_updated = result.rowcount
    
    # Update orders with NULL subtotal (use total_price)
    db.execute(
        text("""
            UPDATE orders 
            SET subtotal = total_price 
            WHERE subtotal IS NULL AND total_price IS NOT NULL
        """)
    )
    
    # Update orders with NULL tax/discount/shipping
    db.execute(
        text("""
            UPDATE orders 
            SET tax = 0, discount = 0, shipping = 0 
            WHERE tax IS NULL OR discount IS NULL OR shipping IS NULL
        """)
    )
    
    db.commit()
    
    return {
        "table": "orders",
        "orders_updated": orders_updated,
        "message": "Order fields backfilled successfully"
    }


def backfill_product_fields(db: Session) -> dict:
    """
    Backfill new product fields with safe defaults.
    
    Fields:
    - is_active: default to True for existing products
    - slug: generate from name if NULL
    """
    print("Backfilling product fields...")
    
    from app.models.product import Product
    
    # Update products with NULL is_active
    result = db.execute(
        text("""
            UPDATE products 
            SET is_active = TRUE 
            WHERE is_active IS NULL
        """)
    )
    products_updated = result.rowcount
    
    # Generate slugs for products without them
    products = db.query(Product).filter(Product.slug == None).all()
    for product in products:
        # Simple slug generation
        slug = product.name.lower().replace(" ", "-").replace("_", "-")
        # Remove special characters
        slug = "".join(c for c in slug if c.isalnum() or c == "-")
        product.slug = slug
    
    db.commit()
    
    return {
        "table": "products",
        "products_updated": products_updated,
        "slugs_generated": len(products),
        "message": "Product fields backfilled successfully"
    }


def backfill_payment_fields(db: Session) -> dict:
    """
    Backfill new payment fields with safe defaults.
    
    Fields:
    - state: default to 'captured' for paid orders
    - currency: default to 'INR'
    """
    print("Backfilling payment fields...")
    
    from app.models.payment import PaymentState
    
    # Update payments with NULL state (assume captured if exists)
    result = db.execute(
        text(f"""
            UPDATE payments 
            SET state = '{PaymentState.captured.value}' 
            WHERE state IS NULL
        """)
    )
    payments_updated = result.rowcount
    
    # Update payments with NULL currency
    db.execute(
        text("""
            UPDATE payments 
            SET currency = 'INR' 
            WHERE currency IS NULL
        """)
    )
    
    db.commit()
    
    return {
        "table": "payments",
        "payments_updated": payments_updated,
        "message": "Payment fields backfilled successfully"
    }


def run_all_backfills() -> dict:
    """
    Run all backfill operations.
    
    Returns:
        Summary of all backfill operations
    """
    db = SessionLocal()
    results = []
    
    try:
        print("=" * 60)
        print("Starting data backfill operations...")
        print("=" * 60)
        
        # Run backfills
        results.append(backfill_user_fields(db))
        results.append(backfill_order_fields(db))
        results.append(backfill_product_fields(db))
        results.append(backfill_payment_fields(db))
        
        print("=" * 60)
        print("All backfill operations completed successfully!")
        print("=" * 60)
        
        return {
            "success": True,
            "timestamp": datetime.utcnow().isoformat(),
            "results": results,
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error during backfill: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.utcnow().isoformat(),
        }
    
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    print("\n" + "=" * 60)
    print("Vijetha Digital - Data Backfill Script")
    print("=" * 60)
    print("\nThis script will backfill new fields with safe defaults.")
    print("It's safe to run multiple times (idempotent).\n")
    
    response = input("Continue? (yes/no): ")
    
    if response.lower() in ["yes", "y"]:
        result = run_all_backfills()
        
        if result["success"]:
            print("\n✅ Backfill completed successfully!")
            for r in result["results"]:
                print(f"  - {r['table']}: {r['message']}")
            sys.exit(0)
        else:
            print(f"\n❌ Backfill failed: {result['error']}")
            sys.exit(1)
    else:
        print("\nBackfill cancelled.")
        sys.exit(0)
