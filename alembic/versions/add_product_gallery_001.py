"""add_product_gallery

Revision ID: add_product_gallery_001
Revises: 
Create Date: 2026-01-26

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSON


# revision identifiers, used by Alembic.
revision = 'add_product_gallery_001'
down_revision = None  # Update this to your latest migration
branch_labels = None
depends_on = None


def upgrade():
    """Add image gallery and video support to products."""
    
    # Add new columns for multiple images and videos
    op.add_column('products', 
        sa.Column('images', JSON, nullable=True, 
                 comment='Array of image URLs: ["url1.jpg", "url2.jpg", ...]'))
    
    op.add_column('products', 
        sa.Column('videos', JSON, nullable=True,
                 comment='Array of video objects: [{"url": "video.mp4", "thumbnail": "thumb.jpg", "title": "Demo"}]'))
    
    # Migrate existing image_url to images array
    # This SQL will convert single image_url to images array
    op.execute("""
        UPDATE products 
        SET images = CASE 
            WHEN image_url IS NOT NULL THEN 
                jsonb_build_array(image_url)
            ELSE 
                '[]'::jsonb
        END
        WHERE images IS NULL
    """)


def downgrade():
    """Remove gallery support."""
    op.drop_column('products', 'videos')
    op.drop_column('products', 'images')
