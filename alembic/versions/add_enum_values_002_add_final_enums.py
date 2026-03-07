"""add final missing enum values for actions

Revision ID: add_enum_values_002
Revises: add_enum_values_001
Create Date: 2026-03-02
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "add_enum_values_002"
down_revision: Union[str, Sequence[str], None] = "add_enum_values_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add final missing values to action_type_enum
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'financial'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'revenue'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'dashboard'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'settings'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'logs'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'backup'")


def downgrade() -> None:
    pass
