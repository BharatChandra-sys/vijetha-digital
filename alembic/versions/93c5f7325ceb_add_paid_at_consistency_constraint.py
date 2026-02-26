"""add paid_at consistency constraint

Revision ID: 93c5f7325ceb
Revises: 65223a8b8480
"""

from typing import Sequence, Union
from alembic import op


revision: str = "93c5f7325ceb"
down_revision: Union[str, Sequence[str], None] = "65223a8b8480"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_check_constraint(
        "chk_paid_requires_timestamp",
        "orders",
        "payment_status <> 'paid'::payment_status_enum OR paid_at IS NOT NULL",
    )


def downgrade() -> None:
    op.drop_constraint(
        "chk_paid_requires_timestamp",
        "orders",
        type_="check",
    )