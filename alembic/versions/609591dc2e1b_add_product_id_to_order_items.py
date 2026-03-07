"""add_product_id_to_order_items

Revision ID: 609591dc2e1b
Revises: cfb8f6b4d6d0
Create Date: 2026-03-07 19:20:19.429617

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '609591dc2e1b'
down_revision: Union[str, Sequence[str], None] = 'cfb8f6b4d6d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('order_items', sa.Column('product_id', sa.Integer(), nullable=True))
    op.create_foreign_key(op.f('fk_order_items_product_id_products'), 'order_items', 'products', ['product_id'], ['id'])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint(op.f('fk_order_items_product_id_products'), 'order_items', type_='foreignkey')
    op.drop_column('order_items', 'product_id')
