"""add tracking and invoice fields to orders

Revision ID: add_tracking_invoice
Revises: 
Create Date: 2026-03-08 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'add_tracking_invoice'
down_revision = '8b15d1723c5d'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add tracking and invoice fields to orders table
    op.add_column('orders', sa.Column('tracking_number', sa.String(100), nullable=True))
    op.add_column('orders', sa.Column('tracking_url', sa.String(500), nullable=True))
    op.add_column('orders', sa.Column('invoice_url', sa.String(500), nullable=True))


def downgrade() -> None:
    # Remove the columns
    op.drop_column('orders', 'tracking_number')
    op.drop_column('orders', 'tracking_url')
    op.drop_column('orders', 'invoice_url')
