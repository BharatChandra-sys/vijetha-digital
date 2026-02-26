"""remove redundant ix_orders_user_id"""

from typing import Sequence, Union
from alembic import op

revision: str = "remove_ix_orders_user_id"
down_revision: Union[str, Sequence[str], None] = "67094842866a"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.drop_index("ix_orders_user_id", table_name="orders")


def downgrade() -> None:
    op.create_index(
        "ix_orders_user_id",
        "orders",
        ["user_id"],
        unique=False,
    )