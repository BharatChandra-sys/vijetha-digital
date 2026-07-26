#!/usr/bin/env python3
"""
Complete seeding script for Neon database.
Creates demo users, products, and sample data.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from datetime import datetime, timedelta

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.product import Product
from app.models.user import User, UserRole, UserStatus
from app.models.iam import Role, Permission, RoleType, PermissionCategory, ResourceType, ActionType
from app.core.security import hash_password

DATABASE_URL = "postgresql://neondb_owner:npg_BD9tgcHrxvm1@ep-icy-forest-az3dzjjc.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

def seed_products(db: Session):
    """Seed products."""
    print("🌱 Seeding products...")
    
    products_data = [
        # Business Cards & Cards
        {"name": "Business Cards - Standard", "category": "cards", "base_price": 500.00, "description": "Professional business cards with premium finish, 350 GSM art card", "unit": "box", "slug": "business-cards-standard", "is_active": True},
        {"name": "Business Cards - Premium", "category": "cards", "base_price": 800.00, "description": "Premium business cards with spot UV and embossing", "unit": "box", "slug": "business-cards-premium", "is_active": True},
        {"name": "Visiting Cards", "category": "cards", "base_price": 450.00, "description": "High-quality visiting cards for professionals", "unit": "box", "slug": "visiting-cards", "is_active": True},
        {"name": "ID Cards", "category": "cards", "base_price": 600.00, "description": "Durable PVC ID cards with custom printing", "unit": "piece", "slug": "id-cards", "is_active": True},
        
        # Marketing Materials
        {"name": "Flyers - A5", "category": "marketing", "base_price": 800.00, "description": "A5 promotional flyers, 170 GSM art paper", "unit": "piece", "slug": "flyers-a5", "is_active": True},
        {"name": "Flyers - A4", "category": "marketing", "base_price": 1200.00, "description": "A4 promotional flyers, full color both sides", "unit": "piece", "slug": "flyers-a4", "is_active": True},
        {"name": "Brochures - Bi-fold", "category": "marketing", "base_price": 1500.00, "description": "Professional bi-fold brochures, A4 size", "unit": "piece", "slug": "brochures-bifold", "is_active": True},
        {"name": "Brochures - Tri-fold", "category": "marketing", "base_price": 1800.00, "description": "Professional tri-fold brochures with lamination", "unit": "piece", "slug": "brochures-trifold", "is_active": True},
        {"name": "Posters - A3", "category": "marketing", "base_price": 800.00, "description": "Eye-catching A3 advertising posters", "unit": "piece", "slug": "posters-a3", "is_active": True},
        {"name": "Posters - A2", "category": "marketing", "base_price": 1200.00, "description": "Large A2 posters for high-impact advertising", "unit": "piece", "slug": "posters-a2", "is_active": True},
        {"name": "Catalogs", "category": "marketing", "base_price": 2000.00, "description": "Professional product catalogs with perfect binding", "unit": "piece", "slug": "catalogs", "is_active": True},
        {"name": "Stickers - Vinyl", "category": "marketing", "base_price": 300.00, "description": "Waterproof vinyl stickers for outdoor use", "unit": "piece", "slug": "stickers-vinyl", "is_active": True},
        {"name": "Stickers - Paper", "category": "marketing", "base_price": 200.00, "description": "Custom paper stickers for indoor branding", "unit": "piece", "slug": "stickers-paper", "is_active": True},
        
        # Large Format Printing
        {"name": "Banners - Flex", "category": "large-format", "base_price": 2500.00, "description": "Large format flex banners for outdoor events", "unit": "sqft", "slug": "banners-flex", "is_active": True},
        {"name": "Banners - Vinyl", "category": "large-format", "base_price": 3000.00, "description": "Premium vinyl banners with grommets", "unit": "sqft", "slug": "banners-vinyl", "is_active": True},
        {"name": "Standees - Roll-up", "category": "large-format", "base_price": 3500.00, "description": "Portable roll-up standees with carrying case", "unit": "piece", "slug": "standees-rollup", "is_active": True},
        {"name": "Standees - X-stand", "category": "large-format", "base_price": 2800.00, "description": "Economical X-stand banners for events", "unit": "piece", "slug": "standees-xstand", "is_active": True},
        {"name": "Hoarding Boards", "category": "large-format", "base_price": 5000.00, "description": "Large outdoor hoarding boards", "unit": "sqft", "slug": "hoarding-boards", "is_active": True},
        
        # Stationery
        {"name": "Letterheads", "category": "stationery", "base_price": 600.00, "description": "Professional letterheads on premium paper", "unit": "piece", "slug": "letterheads", "is_active": True},
        {"name": "Envelopes - Standard", "category": "stationery", "base_price": 400.00, "description": "Custom printed standard envelopes", "unit": "piece", "slug": "envelopes-standard", "is_active": True},
        {"name": "Envelopes - Window", "category": "stationery", "base_price": 500.00, "description": "Window envelopes for official correspondence", "unit": "piece", "slug": "envelopes-window", "is_active": True},
        {"name": "Notepads", "category": "stationery", "base_price": 350.00, "description": "Custom branded notepads, 50 sheets", "unit": "piece", "slug": "notepads", "is_active": True},
        {"name": "Folders - Presentation", "category": "stationery", "base_price": 800.00, "description": "Professional presentation folders", "unit": "piece", "slug": "folders-presentation", "is_active": True},
        {"name": "Invoice Books", "category": "stationery", "base_price": 450.00, "description": "Customized invoice books with carbon copy", "unit": "book", "slug": "invoice-books", "is_active": True},
        {"name": "Receipt Books", "category": "stationery", "base_price": 400.00, "description": "Custom receipt books, 50 sheets per book", "unit": "book", "slug": "receipt-books", "is_active": True},
        
        # Packaging
        {"name": "Packaging Boxes - Corrugated", "category": "packaging", "base_price": 1200.00, "description": "Sturdy corrugated packaging boxes", "unit": "piece", "slug": "packaging-boxes-corrugated", "is_active": True},
        {"name": "Packaging Boxes - Rigid", "category": "packaging", "base_price": 1800.00, "description": "Premium rigid packaging boxes", "unit": "piece", "slug": "packaging-boxes-rigid", "is_active": True},
        {"name": "Paper Bags", "category": "packaging", "base_price": 600.00, "description": "Eco-friendly custom printed paper bags", "unit": "piece", "slug": "paper-bags", "is_active": True},
        {"name": "Labels - Product", "category": "packaging", "base_price": 250.00, "description": "Custom product labels, waterproof", "unit": "piece", "slug": "labels-product", "is_active": True},
        {"name": "Stickers - Packaging", "category": "packaging", "base_price": 200.00, "description": "Branded packaging stickers", "unit": "piece", "slug": "stickers-packaging", "is_active": True},
        
        # Books & Binding
        {"name": "Notebooks - Spiral", "category": "books", "base_price": 500.00, "description": "Custom spiral bound notebooks", "unit": "piece", "slug": "notebooks-spiral", "is_active": True},
        {"name": "Notebooks - Hardcover", "category": "books", "base_price": 800.00, "description": "Premium hardcover notebooks", "unit": "piece", "slug": "notebooks-hardcover", "is_active": True},
        {"name": "Diaries", "category": "books", "base_price": 700.00, "description": "Custom corporate diaries", "unit": "piece", "slug": "diaries", "is_active": True},
        {"name": "Calendars - Wall", "category": "books", "base_price": 600.00, "description": "Custom wall calendars, 12 months", "unit": "piece", "slug": "calendars-wall", "is_active": True},
        {"name": "Calendars - Table", "category": "books", "base_price": 400.00, "description": "Desk calendars with custom branding", "unit": "piece", "slug": "calendars-table", "is_active": True},
    ]
    
    for product_data in products_data:
        existing = db.query(Product).filter(Product.slug == product_data["slug"]).first()
        if not existing:
            product = Product(**product_data)
            db.add(product)
            print(f"  ✅ Added '{product_data['name']}'")
    
    db.commit()
    print(f"✅ Products seeded!\n")


def seed_roles(db: Session):
    """Seed IAM roles."""
    print("🔐 Seeding roles...")
    
    roles_data = [
        {"name": "Super Admin", "slug": "super_admin", "description": "Full system access", "is_system_role": True, "priority": 100},
        {"name": "Admin", "slug": "admin", "description": "Administrative access", "is_system_role": True, "priority": 80},
        {"name": "Staff", "slug": "staff", "description": "Staff member access", "is_system_role": True, "priority": 50},
        {"name": "Reception", "slug": "reception", "description": "Reception desk access", "is_system_role": True, "priority": 40},
        {"name": "Customer", "slug": "customer", "description": "Customer access", "is_system_role": True, "priority": 10},
    ]
    
    for role_data in roles_data:
        existing = db.query(Role).filter(Role.slug == role_data["slug"]).first()
        if not existing:
            role = Role(**role_data)
            db.add(role)
            print(f"  ✅ Added role '{role_data['name']}'")
    
    db.commit()
    print(f"✅ Roles seeded!\n")


def seed_users(db: Session):
    """Seed demo users."""
    print("👥 Seeding demo users...")
    
    # Get roles
    admin_role = db.query(Role).filter(Role.slug == "admin").first()
    staff_role = db.query(Role).filter(Role.slug == "staff").first()
    reception_role = db.query(Role).filter(Role.slug == "reception").first()
    
    users_data = [
        {
            "email": "admin@vijethadigital.com",
            "password": "admin123",
            "full_name": "Admin User",
            "role": UserRole.ADMIN,
            "status": UserStatus.ACTIVE,
            "phone": "+91 9876543210",
            "iam_role": admin_role,
        },
        {
            "email": "staff@vijethadigital.com",
            "password": "staff123",
            "full_name": "Staff Member",
            "role": UserRole.CUSTOMER,
            "status": UserStatus.ACTIVE,
            "phone": "+91 9876543211",
            "iam_role": staff_role,
        },
        {
            "email": "reception@vijethadigital.com",
            "password": "reception123",
            "full_name": "Reception Desk",
            "role": UserRole.CUSTOMER,
            "status": UserStatus.ACTIVE,
            "phone": "+91 9876543212",
            "iam_role": reception_role,
        },
    ]
    
    for user_data in users_data:
        existing = db.query(User).filter(User.email == user_data["email"]).first()
        if not existing:
            iam_role = user_data.pop("iam_role")
            password = user_data.pop("password")
            
            user = User(
                **user_data,
                hashed_password=hash_password(password),
                email_verified=True,
                email_verified_at=datetime.utcnow(),
            )
            
            if iam_role:
                user.roles_assigned.append(iam_role)
            
            db.add(user)
            print(f"  ✅ Added user '{user_data['email']}'")
    
    db.commit()
    print(f"✅ Users seeded!\n")


def main():
    """Main entry point."""
    print("=" * 60)
    print("VIJETHA DIGITAL - Complete Database Seeding")
    print("=" * 60)
    print()
    
    db = SessionLocal()
    try:
        seed_roles(db)
        seed_users(db)
        seed_products(db)
        
        print("=" * 60)
        print("✅ All seeding complete!")
        print("=" * 60)
        print()
        print("Demo Credentials:")
        print("  Admin:     admin@vijethadigital.com / admin123")
        print("  Staff:     staff@vijethadigital.com / staff123")
        print("  Reception: reception@vijethadigital.com / reception123")
        print()
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
