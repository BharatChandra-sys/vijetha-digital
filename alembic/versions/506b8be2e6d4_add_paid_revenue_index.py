"""add paid revenue index

Revision ID: 506b8be2e6d4
Revises: b7c058799b91
Create Date: 2026-02-26
"""

from typing import Sequence, Union
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "506b8be2e6d4"
down_revision: Union[str, Sequence[str], None] = "b7c058799b91"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("""
        CREATE INDEX ix_orders_paid_created
        ON orders (created_at)
        WHERE payment_status = 'paid';
    """)


def downgrade() -> None:
    op.execute("""
        DROP INDEX IF EXISTS ix_orders_paid_created;
    """)