-- ============================================================================
-- VIJETHA DIGITAL - Product Seeding Script (SQL)
-- Run this directly in PostgreSQL to seed products
-- ============================================================================

-- Insert products (will skip if slug already exists due to unique constraint)
INSERT INTO products (name, category, base_price, description, unit, slug, is_active, created_at, updated_at)
VALUES
    ('Business Cards', 'cards', 500.00, 'Professional business cards with premium finish', 'box', 'business-cards', true, NOW(), NOW()),
    ('Flyers', 'marketing', 1000.00, 'High-quality promotional flyers', 'piece', 'flyers', true, NOW(), NOW()),
    ('Banners', 'large-format', 2500.00, 'Large format banners for events and promotions', 'sqft', 'banners', true, NOW(), NOW()),
    ('Brochures', 'marketing', 1500.00, 'Professional marketing brochures', 'piece', 'brochures', true, NOW(), NOW()),
    ('Posters', 'marketing', 800.00, 'Eye-catching posters for advertising', 'piece', 'posters', true, NOW(), NOW()),
    ('Letterheads', 'stationery', 600.00, 'Professional letterheads for business correspondence', 'piece', 'letterheads', true, NOW(), NOW()),
    ('Envelopes', 'stationery', 400.00, 'Custom printed envelopes', 'piece', 'envelopes', true, NOW(), NOW()),
    ('Stickers', 'marketing', 300.00, 'Custom stickers for branding', 'piece', 'stickers', true, NOW(), NOW()),
    ('Catalogs', 'marketing', 2000.00, 'Professional product catalogs', 'piece', 'catalogs', true, NOW(), NOW()),
    ('Packaging Boxes', 'packaging', 1200.00, 'Custom packaging boxes for products', 'piece', 'packaging-boxes', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- Verify products were inserted
SELECT COUNT(*) as total_products FROM products;
SELECT name, category, base_price, is_active FROM products ORDER BY name;
