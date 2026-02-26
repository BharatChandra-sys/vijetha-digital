"""remove order_number column

Revision ID: 67094842866a
Revises: cf963d59721f
Create Date: 2026-02-26
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "67094842866a"
down_revision: Union[str, Sequence[str], None] = "cf963d59721f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1️⃣ Drop index first
    op.drop_index("ix_orders_order_number", table_name="orders")

    # 2️⃣ Drop column
    op.drop_column("orders", "order_number")

    # 3️⃣ Ensure indexes exist (if not already)
    op.create_index("ix_orders_created_at", "orders", ["created_at"], unique=False)
    op.create_index("ix_orders_user_id", "orders", ["user_id"], unique=False)


def downgrade() -> None:
    # 1️⃣ Add column back as nullable first (safe downgrade)
    op.add_column(
        "orders",
        sa.Column("order_number", sa.String(length=50), nullable=True),
    )

    # 2️⃣ Restore index
    op.create_index(
        "ix_orders_order_number",
        "orders",
        ["order_number"],
        unique=True,
    )

    # 3️⃣ Drop newly added indexes
    op.drop_index("ix_orders_user_id", table_name="orders")
    op.drop_index("ix_orders_created_at", table_name="orders")