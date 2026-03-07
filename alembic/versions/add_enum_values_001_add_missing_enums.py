"""add missing enum values for actions and resources

Revision ID: add_enum_values_001
Revises: add_iam_system_001
Create Date: 2026-03-02
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "add_enum_values_001"
down_revision: Union[str, Sequence[str], None] = "add_iam_system_001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new values to action_type_enum
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'list'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'suspend'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'assign'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'revoke'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'approve'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'cancel'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'refund'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'export'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'accept'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'complete'")
    op.execute("ALTER TYPE action_type_enum ADD VALUE IF NOT EXISTS 'manage'")
    
    # Add new values to resource_type_enum
    op.execute("ALTER TYPE resource_type_enum ADD VALUE IF NOT EXISTS 'analytics'")
    op.execute("ALTER TYPE resource_type_enum ADD VALUE IF NOT EXISTS 'system'")


def downgrade() -> None:
    # Note: PostgreSQL does not support removing enum values in versions < 12
    # For PostgreSQL 12+, you would need to:
    # 1. Remove all usages of the enum value
    # 2. DROP TYPE and recreate without the value
    # This is generally not recommended, so we leave it as pass
    pass
