from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


def init_db():
    if settings.AUTO_CREATE_SCHEMA_ON_STARTUP:
        Base.metadata.create_all(bind=engine, checkfirst=True)
