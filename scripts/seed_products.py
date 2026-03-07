"""
scripts/seed_products.py  —  Vijetha Digital COMPLETE product catalog
Sources: IndiaMart, JustDial, business card, Facebook
Run: venv/Scripts/python.exe scripts/seed_products.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.session import SessionLocal
from app.models.product import Product

# ── Complete catalog — 43 products across 5 categories ────────────
PRODUCTS = [

    # ══ SIGN BOARDS (14) ══════════════════════════════════════════
    {
        "name":        "Vinyl Sign Board",
        "category":    "Sign Boards",
        "description": "High-quality self-adhesive vinyl print on rigid board · weather-resistant · ideal for shop fronts, offices & outdoor signage",
        "unit":        "per sq ft",
        "base_price":  450.00,
        "image_url":   "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Glow Sign Board",
        "category":    "Sign Boards",
        "description": "Back-lit acrylic glow sign board · vibrant day & night visibility · weather resistant · available in custom sizes",
        "unit":        "per sq ft",
        "base_price":  450.00,
        "image_url":   "https://images.pexels.com/photos/1126384/pexels-photo-1126384.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Aluminium Sign Board",
        "category":    "Sign Boards",
        "description": "Powder-coated aluminium composite panel (ACP) sign board · durable, lightweight & extensively used for premium storefront branding",
        "unit":        "per sq ft",
        "base_price":  1100.00,
        "image_url":   "https://images.pexels.com/photos/2788488/pexels-photo-2788488.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Open LED Sign Board",
        "category":    "Sign Boards",
        "description": "Eye-catching open LED neon-style sign for shops & showrooms · fine quality · easy to maintain · lightweight",
        "unit":        "per sq ft",
        "base_price":  300.00,
        "image_url":   "https://images.pexels.com/photos/1105325/pexels-photo-1105325.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "3D Sign Board",
        "category":    "Sign Boards",
        "description": "Fabricated 3D acrylic or ACP raised letters · premium finish · gives a high-end professional look to your brand name",
        "unit":        "per sq ft",
        "base_price":  1200.00,
        "image_url":   "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Acrylic Sign Board",
        "category":    "Sign Boards",
        "description": "Transparent or coloured acrylic sheet signage · smooth finish · ideal for office name plates, reception boards & shop displays",
        "unit":        "per sq ft",
        "base_price":  900.00,
        "image_url":   "https://images.pexels.com/photos/2736499/pexels-photo-2736499.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Brass Sign Board",
        "category":    "Sign Boards",
        "description": "Engraved or etched brass name plate · premium golden finish · ideal for doctors, lawyers & corporate offices",
        "unit":        "per sq ft",
        "base_price":  800.00,
        "image_url":   "https://images.pexels.com/photos/2228580/pexels-photo-2228580.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "LED Acrylic Sign Board",
        "category":    "Sign Boards",
        "description": "Acrylic sign board with integrated LED edge-lighting · glows at night · modern look for retail & hospitality",
        "unit":        "per sq ft",
        "base_price":  1200.00,
        "image_url":   "https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Backlit Glow Sign Board",
        "category":    "Sign Boards",
        "description": "Budget-friendly backlit flex sign board · bright LED illumination · per sq ft costing makes large signs affordable",
        "unit":        "per sq ft",
        "base_price":  250.00,
        "image_url":   "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Fibre Glass Sign Board",
        "category":    "Sign Boards",
        "description": "Moulded fibre glass signage · excellent durability against rain, sun & dust · available in custom shapes & sizes",
        "unit":        "per sq ft",
        "base_price":  750.00,
        "image_url":   "https://images.pexels.com/photos/1556691/pexels-photo-1556691.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "ACP Board",
        "category":    "Sign Boards",
        "description": "Aluminium Composite Panel board · UV-printed or vinyl-pasted · sleek modern look for façades, elevations & signage",
        "unit":        "per sq ft",
        "base_price":  350.00,
        "image_url":   "https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Sandwich Board",
        "category":    "Sign Boards",
        "description": "Portable A-frame sandwich board · double-sided display · ideal for restaurants, salons & retail pavement advertising",
        "unit":        "per piece",
        "base_price":  1500.00,
        "image_url":   "https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Star Backlit Sign Board",
        "category":    "Sign Boards",
        "description": "Star-flex backlit translucent film board · brilliant uniform glow · ideal for large hoardings & light boxes",
        "unit":        "per sq ft",
        "base_price":  300.00,
        "image_url":   "https://images.pexels.com/photos/2899097/pexels-photo-2899097.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Acrylic Letter Cutting",
        "category":    "Sign Boards",
        "description": "Precision CNC/laser-cut acrylic letters · available in any font, any colour · with or without LED backing",
        "unit":        "per letter",
        "base_price":  150.00,
        "image_url":   "https://images.pexels.com/photos/1047540/pexels-photo-1047540.jpeg?auto=compress&cs=tinysrgb&w=600",
    },

    # ══ PRINTING SERVICES (13) ════════════════════════════════════
    {
        "name":        "Offset Printing",
        "category":    "Printing Services",
        "description": "Commercial offset printing · high-volume runs · sharp CMYK colour reproduction · ideal for brochures, flyers & stationery",
        "unit":        "per piece",
        "base_price":  2.50,
        "image_url":   "https://images.pexels.com/photos/8381085/pexels-photo-8381085.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Letterhead Printing",
        "category":    "Printing Services",
        "description": "100GSM bond paper letterheads · single or double-sided · premium finish · available with watermark & embossing",
        "unit":        "per 1000 pcs",
        "base_price":  1200.00,
        "image_url":   "https://images.pexels.com/photos/6591440/pexels-photo-6591440.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Gift Voucher Printing",
        "category":    "Printing Services",
        "description": "Custom gift vouchers with serial numbering · premium 300GSM art card · as per client's specification",
        "unit":        "per piece",
        "base_price":  8.00,
        "image_url":   "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Flex Printing",
        "category":    "Printing Services",
        "description": "High-resolution outdoor flex banners · Eco-solvent / solvent inks · on-time completion · guideline-based execution",
        "unit":        "per sq ft",
        "base_price":  18.00,
        "image_url":   "https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Catalogue Printing",
        "category":    "Printing Services",
        "description": "Full-colour product catalogues · A4/A5 · gloss or matte lamination · saddle-stitched or perfect-bound",
        "unit":        "per piece",
        "base_price":  15.00,
        "image_url":   "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Digital Flex Printing",
        "category":    "Printing Services",
        "description": "Digital-quality flex printing · sharper detail than solvent · ideal for indoor or close-view displays",
        "unit":        "per sq ft",
        "base_price":  22.00,
        "image_url":   "https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Canvas Printing",
        "category":    "Printing Services",
        "description": "Photo-quality canvas prints · stretched on wooden frame or rolled · UV-resistant inks · ideal for art reproductions & décor",
        "unit":        "per sq ft",
        "base_price":  150.00,
        "image_url":   "https://images.pexels.com/photos/1053687/pexels-photo-1053687.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Star Flex Printing",
        "category":    "Printing Services",
        "description": "Star-flex solvent printing · brighter whites · excellent for lit & un-lit outdoor hoardings and shop boards",
        "unit":        "per sq ft",
        "base_price":  25.00,
        "image_url":   "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Vinyl Printing",
        "category":    "Printing Services",
        "description": "Self-adhesive vinyl printing · great for wall graphics, vehicle wraps, window branding & floor stickers",
        "unit":        "per sq ft",
        "base_price":  35.00,
        "image_url":   "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Cloth Printing",
        "category":    "Printing Services",
        "description": "Full-colour dye-sublimation on fabric · wrinkle-free display · ideal for trade shows, backdrops & curtain banners",
        "unit":        "per sq ft",
        "base_price":  120.00,
        "image_url":   "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Radium Printing",
        "category":    "Printing Services",
        "description": "Retro-reflective radium sticker printing · high visibility at night · used for safety signs, vehicle markings & road signage",
        "unit":        "per sq ft",
        "base_price":  80.00,
        "image_url":   "https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Umbrella Printing",
        "category":    "Printing Services",
        "description": "Custom branded promotional umbrellas · full-panel printing · great for outdoor events, cafés & brand giveaways",
        "unit":        "per piece",
        "base_price":  350.00,
        "image_url":   "https://images.pexels.com/photos/1755683/pexels-photo-1755683.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Blackout Flex Printing",
        "category":    "Printing Services",
        "description": "Opaque blackout flex printing · blocks light bleed-through · ideal for double-sided hoardings & light-box displays",
        "unit":        "per sq ft",
        "base_price":  30.00,
        "image_url":   "https://images.pexels.com/photos/935756/pexels-photo-935756.jpeg?auto=compress&cs=tinysrgb&w=600",
    },

    # ══ BANNER STANDS (5) ═════════════════════════════════════════
    {
        "name":        "Roller Banner Stand",
        "category":    "Banner Stands",
        "description": "Retractable pull-up banner stand · lightweight aluminium base · easy carry · comes with free carry bag",
        "unit":        "per piece",
        "base_price":  550.00,
        "image_url":   "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Advertising Roll Up Banner Stand",
        "category":    "Banner Stands",
        "description": "Standard roll-up advertising standee · 6×3 ft · includes flex printing · perfect quality & easy to carry",
        "unit":        "per piece",
        "base_price":  1000.00,
        "image_url":   "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Promotional Banner Stand",
        "category":    "Banner Stands",
        "description": "Wide-format promotional banner with clamp/tripod stand · attractive pattern · alluring design · perfect display",
        "unit":        "per sq ft",
        "base_price":  1000.00,
        "image_url":   "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Roll Up Banner Stand",
        "category":    "Banner Stands",
        "description": "Premium roll-up with padded carry bag · exquisite design with precise colour · ideal for exhibitions, events & conferences",
        "unit":        "per piece",
        "base_price":  1500.00,
        "image_url":   "https://images.pexels.com/photos/3182769/pexels-photo-3182769.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Heavy Roll Up Banner Stand",
        "category":    "Banner Stands",
        "description": "Heavy-duty double-sided roll-up standee · wide base for stability · ideal for permanent retail displays & lobbies",
        "unit":        "per piece",
        "base_price":  3500.00,
        "image_url":   "https://images.pexels.com/photos/3183125/pexels-photo-3183125.jpeg?auto=compress&cs=tinysrgb&w=600",
    },

    # ══ DEMO TENTS (4) ════════════════════════════════════════════
    {
        "name":        "Demo Tent 6×6×7 ft",
        "category":    "Demo Tents",
        "description": "Heavy canopy tent 6×6×7 ft · waterproof 320GSM flex with stitching & pipe set · branding on all 4 sides",
        "unit":        "per piece",
        "base_price":  3500.00,
        "image_url":   "https://images.pexels.com/photos/270082/pexels-photo-270082.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Demo Tent 4×4×7 ft",
        "category":    "Demo Tents",
        "description": "Compact canopy tent 4×4×7 ft · solvent print on 320GSM flex with stitching & pipe set · Teran cloth optional (₹1000 extra)",
        "unit":        "per piece",
        "base_price":  2500.00,
        "image_url":   "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Outdoor Demo Tent",
        "category":    "Demo Tents",
        "description": "Large outdoor event canopy with full-colour custom printing · high strength · available in different colours & perfect print",
        "unit":        "per piece",
        "base_price":  5000.00,
        "image_url":   "https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Display Demo Tent",
        "category":    "Demo Tents",
        "description": "Pop-up display tent for product demos & trade shows · perfect design · available in different sizes & quality",
        "unit":        "per piece",
        "base_price":  4500.00,
        "image_url":   "https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=600",
    },

    # ══ PROMOTIONAL ITEMS (7) ════════════════════════════════════
    {
        "name":        "Promo Table",
        "category":    "Promotional Items",
        "description": "Portable branded promotional table · lightweight foldable design · printed stretch cover · ideal for activations & sampling",
        "unit":        "per piece",
        "base_price":  1500.00,
        "image_url":   "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Flute Board",
        "category":    "Promotional Items",
        "description": "PP corrugated flute board printing · lightweight, waterproof · great for in-store POP displays, event signage & direction boards",
        "unit":        "per sq ft",
        "base_price":  45.00,
        "image_url":   "https://images.pexels.com/photos/5816299/pexels-photo-5816299.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Cutout Sprint",
        "category":    "Promotional Items",
        "description": "Custom die-cut standee or character cutout · printed on sun-board or foam · ideal for product launches & photo booths",
        "unit":        "per sq ft",
        "base_price":  200.00,
        "image_url":   "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "LED Board",
        "category":    "Promotional Items",
        "description": "Custom LED display board · scrolling text or fixed graphic · bright & energy-efficient · eye-catching for retail & events",
        "unit":        "per sq ft",
        "base_price":  500.00,
        "image_url":   "https://images.pexels.com/photos/2417842/pexels-photo-2417842.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Business Card Printing",
        "category":    "Promotional Items",
        "description": "Premium visiting cards · 300GSM art card or textured stock · matte / gloss / spot UV finish · available in 100/250/500 packs",
        "unit":        "per 100 pcs",
        "base_price":  250.00,
        "image_url":   "https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Brochure & Pamphlet Printing",
        "category":    "Promotional Items",
        "description": "Bi-fold / tri-fold full-colour brochures · 130/170GSM art paper · matte or gloss lamination · bulk pricing available",
        "unit":        "per piece",
        "base_price":  5.00,
        "image_url":   "https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Bill Book & Receipt Printing",
        "category":    "Promotional Items",
        "description": "Custom carbonless bill books · 2-part or 3-part NCR · serial numbered · GST-compliant formats available",
        "unit":        "per book (50 sets)",
        "base_price":  120.00,
        "image_url":   "https://images.pexels.com/photos/4475524/pexels-photo-4475524.jpeg?auto=compress&cs=tinysrgb&w=600",
    },

    # ══ ADDITIONAL PRODUCTS — from IndiaMART New Items ═══════════
    {
        "name":        "SS Letter Sign Board",
        "category":    "Sign Boards",
        "description": "Stainless steel (S.S.) 3D letter signage · mirror or brushed finish · premium corporate look · rust-proof & long-lasting",
        "unit":        "per letter",
        "base_price":  250.00,
        "image_url":   "https://images.pexels.com/photos/2507416/pexels-photo-2507416.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Clip On Frame",
        "category":    "Sign Boards",
        "description": "Aluminium snap/clip-on frame for posters & menus · tool-free front-loading · ideal for restaurants, offices & retail",
        "unit":        "per piece",
        "base_price":  600.00,
        "image_url":   "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "In-Shop Branding",
        "category":    "Sign Boards",
        "description": "Complete in-store branding solution · wall graphics, ceiling danglers, aisle signs & window decals · turnkey execution",
        "unit":        "per sq ft",
        "base_price":  180.00,
        "image_url":   "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Non-Lit Arch",
        "category":    "Sign Boards",
        "description": "Non-illuminated arch gate / entrance arch · ACP or flex with metal frame · ideal for events, shops & showrooms",
        "unit":        "per piece",
        "base_price":  3500.00,
        "image_url":   "https://images.pexels.com/photos/2263410/pexels-photo-2263410.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "ACP Cladding",
        "category":    "Sign Boards",
        "description": "Aluminium Composite Panel facade cladding · UV-stable · transforms building exteriors with sleek modern finish",
        "unit":        "per sq ft",
        "base_price":  400.00,
        "image_url":   "https://images.pexels.com/photos/3649522/pexels-photo-3649522.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Translite Printing",
        "category":    "Printing Services",
        "description": "Translucent backlit film printing · brilliant colours when lit · ideal for light boxes, menu boards & display panels",
        "unit":        "per sq ft",
        "base_price":  60.00,
        "image_url":   "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Sticker Printing",
        "category":    "Printing Services",
        "description": "Custom die-cut or kiss-cut stickers · vinyl / paper / transparent · perfect for product labels, packaging & promos",
        "unit":        "per sq ft",
        "base_price":  40.00,
        "image_url":   "https://images.pexels.com/photos/5816299/pexels-photo-5816299.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "T-Shirt Printing",
        "category":    "Promotional Items",
        "description": "Custom printed T-shirts · DTG / screen / heat-transfer · ideal for corporate events, teams & brand merchandise",
        "unit":        "per piece",
        "base_price":  250.00,
        "image_url":   "https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "ID Card Printing",
        "category":    "Promotional Items",
        "description": "PVC ID cards with photo · single or double-sided · lanyard & holder available · corporate & institutional bulk orders",
        "unit":        "per piece",
        "base_price":  35.00,
        "image_url":   "https://images.pexels.com/photos/6476587/pexels-photo-6476587.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Calendar Printing",
        "category":    "Promotional Items",
        "description": "Wall & desk calendars with custom branding · 12-sheet or single-sheet · matte / gloss lamination · yearly bulk orders",
        "unit":        "per piece",
        "base_price":  40.00,
        "image_url":   "https://images.pexels.com/photos/4475524/pexels-photo-4475524.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Vehicle Branding",
        "category":    "Promotional Items",
        "description": "Full or partial vehicle wrap · high-quality vinyl with UV lamination · cars, vans, autos & fleet branding",
        "unit":        "per vehicle",
        "base_price":  8000.00,
        "image_url":   "https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
        "name":        "Canopy Printing",
        "category":    "Demo Tents",
        "description": "Branded canopy top cover printing · replacement flex or fabric top · available for all standard canopy sizes",
        "unit":        "per piece",
        "base_price":  1500.00,
        "image_url":   "https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
]


def seed():
    db = SessionLocal()
    try:
        added = updated = 0
        for p in PRODUCTS:
            row = db.query(Product).filter(Product.name == p["name"]).first()
            if row:
                for k, v in p.items():
                    setattr(row, k, v)
                row.is_active = True
                updated += 1
                print(f"  [U]  Updated : {p['name']}")
            else:
                db.add(Product(**p))
                added += 1
                print(f"  +  Created : {p['name']}")
        db.commit()
        print(f"\n[OK]  Done -- {added} created, {updated} updated.")
    finally:
        db.close()


if __name__ == "__main__":
    print("Seeding Vijetha Digital products ...\n")
    seed()
