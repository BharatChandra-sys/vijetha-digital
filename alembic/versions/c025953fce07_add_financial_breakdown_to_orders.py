"""add financial breakdown to orders

Revision ID: c025953fce07
Revises: 506b8be2e6d4
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "c025953fce07"
down_revision: Union[str, Sequence[str], None] = "506b8be2e6d4"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1️⃣ Add columns with safe defaults
    op.add_column(
        "orders",
        sa.Column(
            "subtotal",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "tax",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "discount",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "orders",
        sa.Column(
            "shipping",
            sa.Numeric(12, 2),
            nullable=False,
            server_default="0",
        ),
    )

    # 2️⃣ Remove redundant index (safe)
    op.drop_index(op.f("ix_orders_id"), table_name="orders")

    # 3️⃣ Optional: remove defaults after backfill (clean schema)
    op.alter_column("orders", "subtotal", server_default=None)
    op.alter_column("orders", "tax", server_default=None)
    op.alter_column("orders", "discount", server_default=None)
    op.alter_column("orders", "shipping", server_default=None)


def downgrade() -> None:
    op.create_index(op.f("ix_orders_id"), "orders", ["id"], unique=False)

    op.drop_column("orders", "shipping")
    op.drop_column("orders", "discount")
    op.drop_column("orders", "tax")
    op.drop_column("orders", "subtotal")