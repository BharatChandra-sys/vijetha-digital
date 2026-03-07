-- Vijetha Digital – Real Product Catalog (from IndiaMart listing)
-- Run: PGPASSWORD=admin123 psql -U postgres -d vijetha_db -f scripts/seed_products.sql

BEGIN;

-- Remove old prototype / placeholder products
DELETE FROM products
WHERE name IN (
  'Standard Visiting Cards','Roll-up Standees','Official Letterheads',
  'Flex Banners','LED Illuminated Boards','Brochures & Flyers',
  'Custom Packaging Boxes'
);

-- ── SIGN BOARDS ───────────────────────────────────────────────────
INSERT INTO products (name, category, description, unit, base_price, image_url, is_active) VALUES
(
  'Vinyl Sign Board','Sign Boards',
  'High-quality vinyl print on rigid board · weather-resistant outdoor signage',
  'per sq ft', 80.00,
  'https://4.imimg.com/data4/NW/NM/MY-4392469/vinyl-sign-board-500x500.jpeg', true
),
(
  'Glow Sign Board','Sign Boards',
  'Back-lit acrylic glow board · vibrant day & night visibility',
  'per sq ft', 180.00,
  'https://4.imimg.com/data4/YH/UY/MY-4392469/glow-sign-board-250x250.jpg', true
),
(
  'Aluminium Sign Board','Sign Boards',
  'Powder-coated aluminium composite panel · durable & lightweight',
  'per sq ft', 1100.00,
  'https://4.imimg.com/data4/XB/KP/MY-4392469/aluminium-sign-board-250x250.jpg', true
),
(
  'Open LED Sign Board','Sign Boards',
  'Eye-catching open LED neon sign for shops & showrooms',
  'per sq ft', 300.00,
  'https://4.imimg.com/data4/UK/FP/MY-4392469/open-led-sign-board-250x250.jpg', true
),
(
  '3D Sign Board','Sign Boards',
  'Fabricated 3D acrylic or ACP letters · premium finish',
  'per sq ft', 1200.00,
  'https://4.imimg.com/data4/FR/SP/MY-4392469/3d-sign-boards-250x250.jpg', true
)
ON CONFLICT DO NOTHING;

-- ── PRINTING SERVICES ─────────────────────────────────────────────
INSERT INTO products (name, category, description, unit, base_price, image_url, is_active) VALUES
(
  'Offset Printing','Printing Services',
  'Commercial offset printing · high-volume · sharp colour reproduction',
  'per piece', 2.50,
  'https://4.imimg.com/data4/KA/GP/MY-4392469/offset-printing-service-500x500.jpg', true
),
(
  'Letterhead Printing','Printing Services',
  '100GSM Bond Paper · single / double-sided · premium finish',
  '1000 pcs', 1200.00,
  'https://4.imimg.com/data4/OQ/AO/MY-4392469/letterhead-printing-service-250x250.jpg', true
),
(
  'Gift Voucher Printing','Printing Services',
  'Custom gift vouchers with serial numbering · premium cardstock',
  'per piece', 8.00,
  'https://4.imimg.com/data4/NO/OS/MY-4392469/gift-voucher-printing-service-250x250.png', true
),
(
  'Flex Printing','Printing Services',
  'High-resolution outdoor flex banners · Star Flex / Eco Flex',
  'per sq ft', 18.00,
  'https://4.imimg.com/data4/UN/HB/GLADMIN-4392469/6-250x250.png', true
),
(
  'Catalogue Printing','Printing Services',
  'Full-colour product catalogues · A4/A5 · gloss or matte finish',
  'per piece', 15.00,
  'https://4.imimg.com/data4/QC/YW/MY-4392469/catalogue-printing-service-250x250.jpg', true
),
(
  'Canvas Printing','Printing Services',
  'Photo-quality canvas prints · stretched or rolled · UV-resistant inks',
  'per sq ft', 150.00,
  'https://4.imimg.com/data4/SN/JS/NSDMERP-4392469/canvasprinting-250x250.png', true
)
ON CONFLICT DO NOTHING;

-- ── BANNER STANDS ─────────────────────────────────────────────────
INSERT INTO products (name, category, description, unit, base_price, image_url, is_active) VALUES
(
  'Roller Banner Stand','Banner Stands',
  'Retractable pull-up banner stand · lightweight aluminium base',
  'per piece', 1500.00,
  'https://4.imimg.com/data4/YS/CY/MY-4392469/roller-banner-stand-250x250.jpg', true
),
(
  'Advertising Roll Up Banner Stand','Banner Stands',
  'Standard roll-up advertising standee · 6×3 ft · includes printing',
  'per piece', 1000.00,
  'https://4.imimg.com/data4/ET/JI/MY-4392469/91-250x250.jpg', true
),
(
  'Promotional Banner Stand','Banner Stands',
  'Wide-format promotional banner with clamp stand',
  'per sq ft', 1000.00,
  'https://4.imimg.com/data4/FT/NO/MY-4392469/92-250x250.jpg', true
),
(
  'Roll Up Banner Stand','Banner Stands',
  'Premium roll-up with carry bag · ideal for exhibitions & events',
  'per piece', 1500.00,
  'https://4.imimg.com/data4/OE/UF/MY-4392469/roll-up-banner-stand-250x250.jpg', true
),
(
  'Heavy Roll Up Banner Stand','Banner Stands',
  'Heavy-duty double-sided roll-up · wide base · double-sided print',
  'per piece', 3500.00,
  'https://4.imimg.com/data4/NN/LR/MY-4392469/93-250x250.jpg', true
)
ON CONFLICT DO NOTHING;

-- ── DEMO TENTS ────────────────────────────────────────────────────
INSERT INTO products (name, category, description, unit, base_price, image_url, is_active) VALUES
(
  'Demo Tent 6x6x7 ft','Demo Tents',
  'Heavy canopy tent 6×6×7 ft · waterproof · custom branding available',
  'per piece', 12000.00,
  'https://4.imimg.com/data4/DJ/IX/MY-4392469/98-250x250.jpg', true
),
(
  'Demo Tent 4x4x7 ft','Demo Tents',
  'Compact canopy tent 4×4×7 ft · easy setup · printed sidewalls',
  'per piece', 8500.00,
  'https://4.imimg.com/data4/CJ/HI/MY-4392469/95-250x250.jpg', true
),
(
  'Outdoor Demo Tent','Demo Tents',
  'Large outdoor event canopy with full-colour custom printing',
  'per piece', 15000.00,
  'https://4.imimg.com/data4/YC/HX/MY-4392469/100-250x250.jpg', true
),
(
  'Display Demo Tent','Demo Tents',
  'Pop-up display tent for product demos & trade shows',
  'per piece', 7500.00,
  'https://4.imimg.com/data4/IN/RI/MY-4392469/display-demo-tent-250x250.jpg', true
)
ON CONFLICT DO NOTHING;

COMMIT;

-- Verify result
SELECT id, name, category, base_price, unit FROM products ORDER BY category, name;
