from typing import Sequence, Union
from alembic import op

revision: str = "add_paid_revenue_index"
down_revision: Union[str, Sequence[str], None] = "remove_ix_orders_user_id"  # use your latest revision ID
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