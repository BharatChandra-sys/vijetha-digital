from app.db.session import engine
from app.db.base import Base
from app.core.config import settings

from app.models.user import User
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.pricing import MaterialRate, ExtraRate
from app.models.staff import Staff
from app.models.iam import Role, Permission, RoleAssignmentLog, PermissionAccessLog
from app.models.token_blacklist import TokenBlacklist


def init_db():
    if settings.AUTO_CREATE_SCHEMA_ON_STARTUP:
        Base.metadata.create_all(bind=engine, checkfirst=True)
