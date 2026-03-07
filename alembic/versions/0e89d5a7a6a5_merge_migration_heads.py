"""merge_migration_heads

Revision ID: 0e89d5a7a6a5
Revises: 7b81bafe0fbc, add_enum_values_002
Create Date: 2026-03-03 01:00:26.298534

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0e89d5a7a6a5'
down_revision: Union[str, Sequence[str], None] = ('7b81bafe0fbc', 'add_enum_values_002')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
