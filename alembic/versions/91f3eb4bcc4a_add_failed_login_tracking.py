"""add_failed_login_tracking

Revision ID: 91f3eb4bcc4a
Revises: 0e89d5a7a6a5
Create Date: 2026-03-03 01:00:42.690008

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '91f3eb4bcc4a'
down_revision: Union[str, Sequence[str], None] = '0e89d5a7a6a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add failed login tracking and account lockout fields to users table."""
    # Add failed login tracking columns
    op.add_column('users', sa.Column('failed_login_attempts', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('users', sa.Column('last_failed_login_at', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('account_locked_until', sa.DateTime(), nullable=True))
    op.add_column('users', sa.Column('account_locked_reason', sa.String(500), nullable=True))


def downgrade() -> None:
    """Remove failed login tracking and account lockout fields from users table."""
    op.drop_column('users', 'account_locked_reason')
    op.drop_column('users', 'account_locked_until')
    op.drop_column('users', 'last_failed_login_at')
    op.drop_column('users', 'failed_login_attempts')
