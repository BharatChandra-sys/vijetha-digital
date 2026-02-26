"""remove redundant user_id index

Revision ID: 65223a8b8480
Revises: 25f39476aa71
"""

from typing import Sequence, Union
from alembic import op


revision: str = "65223a8b8480"
down_revision: Union[str, Sequence[str], None] = "25f39476aa71"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Drop ONLY the redundant standalone user_id index
    op.drop_index("ix_orders_user_id", table_name="orders")


def downgrade() -> None:
    # Restore the standalone user_id index if downgraded
    op.create_index(
        "ix_orders_user_id",
        "orders",
        ["user_id"],
        unique=False,
    )