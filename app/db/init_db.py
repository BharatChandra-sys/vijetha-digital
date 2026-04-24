from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.models.iam import Permission, PermissionAccessLog, Role, RoleAssignmentLog
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.pricing import ExtraRate, MaterialRate
from app.models.product import Product
from app.models.staff import Staff
from app.models.token_blacklist import TokenBlacklist
from app.models.user import User


def init_db():
    if settings.AUTO_CREATE_SCHEMA_ON_STARTUP:
        Base.metadata.create_all(bind=engine, checkfirst=True)
