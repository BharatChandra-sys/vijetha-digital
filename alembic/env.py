from logging.config import fileConfig
import sys
import os

from sqlalchemy import engine_from_config, pool
from alembic import context

# Add project root to Python path
sys.path.append(os.getcwd())

# Import Base
from app.db.base import Base

# Import ALL models so Alembic detects every table for autogenerate
import app.models.access_log
import app.models.address
import app.models.audit_log
import app.models.business_profile
import app.models.coupon
import app.models.iam
import app.models.notification
import app.models.order
import app.models.order_file
import app.models.order_item
import app.models.order_timeline
import app.models.payment
import app.models.pricing
import app.models.product
import app.models.review
import app.models.staff
import app.models.token_blacklist
import app.models.user

# Alembic config
config = context.config

# Setup logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for autogenerate
target_metadata = Base.metadata


def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")

    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        compare_type=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()