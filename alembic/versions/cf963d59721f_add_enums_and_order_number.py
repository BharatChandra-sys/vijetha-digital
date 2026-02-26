"""add enums and order_number

Revision ID: cf963d59721f
Revises: f3061cbd3567
Create Date: 2026-02-26

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision: str = "cf963d59721f"
down_revision: Union[str, Sequence[str], None] = "f3061cbd3567"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    # ----------------------------
    # 1️⃣ Create ENUM types first
    # ----------------------------

    order_status_enum = sa.Enum(
        "placed",
        "confirmed",
        "printing",
        "quality_check",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        name="order_status_enum",
    )

    payment_status_enum = sa.Enum(
        "pending",
        "paid",
        "failed",
        "refunded",
        name="payment_status_enum",
    )

    order_status_enum.create(op.get_bind(), checkfirst=True)
    payment_status_enum.create(op.get_bind(), checkfirst=True)

    # ----------------------------
    # 2️⃣ Add order_number
    # ----------------------------

    op.add_column(
        "orders",
        sa.Column("order_number", sa.String(length=50), nullable=False),
    )

    op.create_index(
        "ix_orders_order_number",
        "orders",
        ["order_number"],
        unique=True,
    )

    # ----------------------------
    # 3️⃣ Add payment_status column
    # ----------------------------

    op.add_column(
        "orders",
        sa.Column(
            "payment_status",
            payment_status_enum,
            nullable=False,
            server_default="pending",
        ),
    )

    # ----------------------------
    # 4️⃣ Convert existing status column to ENUM
    # ----------------------------

    op.execute(
        "ALTER TABLE orders ALTER COLUMN status TYPE order_status_enum USING status::order_status_enum",
    )

    # ----------------------------
    # 5️⃣ Add performance indexes
    # ----------------------------

    op.create_index(
        "ix_orders_user_created",
        "orders",
        ["user_id", "created_at"],
        unique=False,
    )


def downgrade() -> None:

    # Drop composite index
    op.drop_index("ix_orders_user_created", table_name="orders")

    # Revert status back to VARCHAR
    op.alter_column(
        "orders",
        "status",
        existing_type=sa.Enum(
            "placed",
            "confirmed",
            "printing",
            "quality_check",
            "shipped",
            "delivered",
            "cancelled",
            "refunded",
            name="order_status_enum",
        ),
        type_=sa.VARCHAR(),
        existing_nullable=False,
    )

    # Drop columns
    op.drop_column("orders", "payment_status")
    op.drop_index("ix_orders_order_number", table_name="orders")
    op.drop_column("orders", "order_number")

    # Drop ENUM types
    sa.Enum(name="payment_status_enum").drop(op.get_bind(), checkfirst=True)
    sa.Enum(name="order_status_enum").drop(op.get_bind(), checkfirst=True)