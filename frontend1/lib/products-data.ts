// Central product data — single source of truth for all 30 products.
// Used by the dynamic [slug] page, products listing, sitemap, and schemas.

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: string;
  priceNumeric: number;
  image: string;
  desc: string;
  longDesc: string;
  specs: { label: string; value: string }[];
  relatedSlugs: string[];
  faqs: { q: string; a: string }[];
}

export const toSlug = (v: string) =>
  v.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LED Sign Board',
    slug: 'led-sign-board',
    category: 'Signage Solutions',
    price: 'Rs 3,500 onwards (Rs 15,000 for 3x1 feet standard)',
    priceNumeric: 3500,
    image: '/images/project-booklets.webp',
    desc: 'Bright LED illuminated boards for 24/7 visibility. Ideal for retail, showrooms and commercial spaces.',
    longDesc: 'Vijetha Digital manufactures premium LED sign boards for businesses across Hyderabad with IP65-rated weatherproof construction. Our LED signs use energy-efficient modules with 3000-5000 lumens brightness, aluminium frames, and CNC-precision acrylic faces. Suitable for retail stores, showrooms, restaurants, hospitals, banks, and corporate offices. Comes with 2-year warranty on LED modules and professional installation.',
    specs: [
      { label: 'Material', value: 'Aluminium frame + acrylic face + LED modules' },
      { label: 'IP Rating', value: 'IP65 weatherproof' },
      { label: 'Brightness', value: '3000-5000 lumens per sq.ft' },
      { label: 'Power', value: '12W per sq.ft' },
      { label: 'Warranty', value: '2 years LED modules, 1 year transformer' },
      { label: 'Turnaround', value: '5-7 working days' },
    ],
    relatedSlugs: ['acp-cladding-sign', 'acrylic-letter-sign', 'fascia-sign-board', 'pylon-sign'],
    faqs: [
      { q: 'How much does an LED sign board cost in Hyderabad?', a: 'LED sign boards at Vijetha Digital start from Rs 3,500 for small signs and go up based on size and LED type. A standard 4x2 feet illuminated LED board costs approximately Rs 8,000-12,000. Large showroom fascia LED signs range from Rs 50,000 to Rs 3,00,000+. Contact us for an exact quote.' },
      { q: 'How long do LED sign boards last?', a: 'LED sign boards made by Vijetha Digital last 5-10 years with proper maintenance. LED modules carry a 2-year warranty. The acrylic and aluminium structure lasts 7-10 years. Regular cleaning and power surge protection extend life significantly.' },
      { q: 'Do you provide LED sign board installation in Hyderabad?', a: 'Yes. Vijetha Digital provides professional LED sign board installation across Hyderabad including Nacharam, Banjara Hills, Kukatpally, Madhapur, Gachibowli, Secunderabad, and all areas. Our electricians handle wiring and mounting safely.' },
    ],
  },
  {
    id: 2,
    name: 'ACP Cladding Sign',
    slug: 'acp-cladding-sign',
    category: 'Signage Solutions',
    price: 'Rs 2,200 onwards',
    priceNumeric: 2200,
    image: '/images/project-cards.webp',
    desc: 'Aluminium composite panel cladding for professional, weather-resistant outdoor signage.',
    longDesc: 'ACP cladding signs from Vijetha Digital use 4mm Goldplus aluminium composite panels with 3D letter fabrication. Available in glossy, matte, brushed, and mirror finishes. Structurally mounted with MS frames and chemical anchors for wind resistance. Ideal for corporate building facades, showroom frontages, and commercial complexes. Outdoor durability of 7-10 years.',
    specs: [
      { label: 'Material', value: 'Goldplus 4mm ACP sheets + MS frame' },
      { label: 'Finish Options', value: 'Glossy, Matte, Brushed, Mirror' },
      { label: 'Letter Height', value: '6 inches to 48 inches' },
      { label: 'Durability', value: '7-10 years outdoor' },
      { label: 'Mounting', value: 'MS structural frame + chemical anchors' },
      { label: 'Turnaround', value: '7-10 working days' },
    ],
    relatedSlugs: ['led-sign-board', 'acrylic-letter-sign', 'fascia-sign-board'],
    faqs: [
      { q: 'What is ACP cladding signage?', a: 'ACP (Aluminium Composite Panel) cladding signage uses 4mm aluminium composite sheets bent and fabricated into 3D letters or flat panels. It provides a premium, modern look for corporate buildings and commercial frontages. ACP signs are weather-resistant, durable for 7-10 years, and available in multiple finishes including brushed aluminium.' },
      { q: 'How much does ACP cladding cost in Hyderabad?', a: 'ACP cladding signs at Vijetha Digital start from Rs 2,200 per letter for standard sizes. A complete storefront ACP cladding project typically costs Rs 25,000-1,50,000 depending on dimensions and finish. Contact us for a free site assessment and quote.' },
    ],
  },
  {
    id: 3,
    name: 'Acrylic Letter Sign',
    slug: 'acrylic-letter-sign',
    category: 'Signage Solutions',
    price: 'Rs 1,800 onwards',
    priceNumeric: 1800,
    image: '/images/about-printing.webp',
    desc: 'Precision-cut acrylic 3D lettering for shopfronts, offices and brand walls.',
    longDesc: 'Vijetha Digital produces precision acrylic letter signs using CNC routing for exact tolerances. Available in backlit (with LEDs inside), front-lit, and non-illuminated options. Acrylic thickness from 5mm to 25mm. Colors from Asian Paints palette. Suitable for company name boards, reception walls, entrance signs, and brand displays.',
    specs: [
      { label: 'Material', value: 'Asian Paints acrylic sheets 5mm-25mm' },
      { label: 'Cutting Method', value: 'K Tech 1325 HD CNC router' },
      { label: 'Illumination', value: 'Backlit LED, front-lit, or non-lit' },
      { label: 'Color Options', value: '500+ Asian Paints colors' },
      { label: 'Minimum Height', value: '3 inches' },
      { label: 'Turnaround', value: '5-7 working days' },
    ],
    relatedSlugs: ['led-sign-board', 'acp-cladding-sign', 'office-wall-branding'],
    faqs: [
      { q: 'What is the difference between acrylic letters and ACP cladding?', a: 'Acrylic letters are individual precision-cut 3D letters mounted on a wall or backdrop, each letter separate. ACP cladding covers the entire facade surface with aluminium composite panels. Acrylic letters look more premium and 3D; ACP cladding provides a sleek flat panel look. Both are popular for corporate signage in Hyderabad.' },
    ],
  },
  {
    id: 4,
    name: 'Fascia Sign Board',
    slug: 'fascia-sign-board',
    category: 'Signage Solutions',
    price: 'Rs 4,500 onwards',
    priceNumeric: 4500,
    image: '/images/hero-banner-hq.webp',
    desc: 'Full-width fascia boards for storefronts and commercial complexes.',
    longDesc: 'Fascia sign boards span the full width of a storefront for maximum brand visibility at street level. Vijetha Digital fabricates fascia signs in flex-lit, ACP, LED-backlit, and acrylic variants. Custom sizes, illumination options, and brand color matching available.',
    specs: [
      { label: 'Types', value: 'Flex-lit, ACP, LED backlit, acrylic' },
      { label: 'Custom Sizing', value: 'Any width, standard 2-4 feet height' },
      { label: 'Illumination', value: 'Internal LED backlit or external spotlights' },
      { label: 'Turnaround', value: '7-10 working days' },
    ],
    relatedSlugs: ['led-sign-board', 'acp-cladding-sign', 'pylon-sign'],
    faqs: [
      { q: 'What is a fascia sign board?', a: 'A fascia sign board is a horizontal sign running across the full width of a building frontage or shopfront, typically positioned above the entrance. It is one of the most visible and impactful signs for retail stores and commercial premises, providing clear brand identification from the street.' },
    ],
  },
  {
    id: 5,
    name: 'Flex Board Hoarding',
    slug: 'flex-board-hoarding',
    category: 'Signage Solutions',
    price: 'Rs 18-35 per sq.ft',
    priceNumeric: 18,
    image: '/images/project-booklets.webp',
    desc: 'High-resolution flex printing for large hoardings, outdoor banners and backdrops.',
    longDesc: 'Flex board hoardings from Vijetha Digital are printed on HP Latex 570 for vivid, UV-resistant output. Available in frontlit and backlit flex, with eyelets and hem finishing for outdoor installation. Bulk orders at 1 lakh sq.ft per day capacity. Same-day available for orders under 500 sq.ft.',
    specs: [
      { label: 'Equipment', value: 'HP Latex 570, Roland Soljet EJ 640' },
      { label: 'Material', value: 'Frontlit flex 440 GSM, backlit flex' },
      { label: 'Resolution', value: 'Up to 1440 dpi' },
      { label: 'Daily Capacity', value: '1 lakh sq.ft' },
      { label: 'Turnaround', value: 'Same day under 500 sq.ft' },
      { label: 'Finishing', value: 'Eyelets, hem, pole pockets' },
    ],
    relatedSlugs: ['flex-vinyl-printing', 'backdrop-stage-banner', 'flags-and-bunting'],
    faqs: [
      { q: 'What is the price of flex board printing in Hyderabad?', a: 'Flex board printing at Vijetha Digital starts from Rs 18 per sq.ft for standard frontlit flex. Backlit flex is Rs 22-25 per sq.ft. Canvas printing is Rs 45-60 per sq.ft. Bulk orders above 1,000 sq.ft get volume discounts. Same-day service available.' },
    ],
  },
  {
    id: 6,
    name: 'Pylon Sign',
    slug: 'pylon-sign',
    category: 'Signage Solutions',
    price: 'Rs 8,000 onwards',
    priceNumeric: 8000,
    image: '/images/project-cards.webp',
    desc: 'Tall freestanding pylon signs for maximum visibility at malls, hospitals and industrial sites.',
    longDesc: 'Pylon signs are tall freestanding structures that provide visibility from long distances. Vijetha Digital fabricates single and double-sided pylons with LED illumination, ACP cladding, and custom branding. Suitable for petrol stations, malls, hospitals, industrial parks, and highway commercial properties. Structural drawings and PMC approvals coordinated.',
    specs: [
      { label: 'Height Range', value: '8 feet to 40 feet' },
      { label: 'Structure', value: 'MS/SS fabrication with concrete foundation' },
      { label: 'Illumination', value: 'Internal LED or external flood lights' },
      { label: 'Cladding', value: 'ACP or backlit flex panels' },
      { label: 'Turnaround', value: '15-21 working days' },
    ],
    relatedSlugs: ['led-sign-board', 'fascia-sign-board', 'acp-cladding-sign'],
    faqs: [
      { q: 'How much does a pylon sign cost in Hyderabad?', a: 'Pylon sign prices at Vijetha Digital start from Rs 8,000 for small 8-foot pylons and can go up to Rs 5,00,000+ for large illuminated 30-foot pylons at commercial complexes. Price depends on height, structure material, illumination, and number of faces. Contact us for engineering drawings and quote.' },
    ],
  },
  {
    id: 7, name: 'Office Wall Branding', slug: 'office-wall-branding', category: 'Internal Branding',
    price: 'On request', priceNumeric: 15000, image: '/images/about-printing.webp',
    desc: 'Transform office walls into powerful brand statements with murals, typography and graphics.',
    longDesc: 'Vijetha Digital creates immersive office wall branding using high-resolution vinyl wall graphics, UV prints, canvas murals, and 3D dimensional lettering. We cover reception areas, conference rooms, corridors, and feature walls. Turnkey design-to-installation service for corporate offices in Hyderabad.',
    specs: [{ label: 'Types', value: 'Vinyl wrap, UV print, canvas mural, 3D letters' }, { label: 'Finish', value: 'Matte, glossy, textured' }, { label: 'Turnaround', value: '7-14 working days' }],
    relatedSlugs: ['reception-and-lobby', 'retail-in-shop-branding', 'acrylic-letter-sign'],
    faqs: [{ q: 'How much does office wall branding cost in Hyderabad?', a: 'Office wall branding costs depend on wall area, material choice, and design complexity. Vijetha Digital typically quotes Rs 150-400 per sq.ft for vinyl wall graphics including design and installation. Contact us for a site assessment.' }],
  },
  {
    id: 8, name: 'Reception & Lobby', slug: 'reception-and-lobby', category: 'Internal Branding',
    price: 'On request', priceNumeric: 25000, image: '/images/hero-banner-hq.webp',
    desc: 'Premium reception and lobby branding that creates unforgettable first impressions.',
    longDesc: 'First impressions matter. Vijetha Digital designs and installs complete reception and lobby branding including company name walls, backlit logo panels, feature wall graphics, wayfinding elements, and branded counters. We have executed reception branding for IT companies, hospitals, banks, and hotels across Hyderabad.',
    specs: [{ label: 'Elements', value: 'Logo wall, backlit panels, wayfinding, feature wall' }, { label: 'Materials', value: 'Acrylic, ACP, vinyl, LED backlit' }, { label: 'Turnaround', value: '10-21 working days' }],
    relatedSlugs: ['office-wall-branding', 'acrylic-letter-sign', 'led-sign-board'],
    faqs: [{ q: 'What does reception branding include?', a: 'Reception branding at Vijetha Digital typically includes a company name/logo feature wall (acrylic or LED backlit), wall graphics, wayfinding signage, and branded elements for the reception counter. We provide design mockups before production for client approval.' }],
  },
  {
    id: 9, name: 'Retail In-Shop Branding', slug: 'retail-in-shop-branding', category: 'Internal Branding',
    price: 'On request', priceNumeric: 30000, image: '/images/project-booklets.webp',
    desc: 'Complete in-shop branding for retail stores — walls, ceilings, floors and windows.',
    longDesc: 'Vijetha Digital provides complete retail in-shop branding for single stores and multi-location rollouts. Services include wall graphics, window frosting, floor graphics, ceiling branding, POS display fabrication, shelf branding, and promotional display stands. We have executed store branding for Samsung, Reliance Digital, Airtel, and Vivo across Hyderabad.',
    specs: [{ label: 'Coverage', value: 'Walls, windows, floors, ceilings, POS' }, { label: 'Materials', value: 'Vinyl, canvas, frosted glass film, 3D elements' }, { label: 'Scale', value: 'Single store to 100+ location rollouts' }],
    relatedSlugs: ['office-wall-branding', 'hospital-branding', 'led-sign-board'],
    faqs: [{ q: 'Do you handle multi-store retail branding rollouts?', a: 'Yes. Vijetha Digital has executed retail branding rollouts for Samsung, Reliance Digital, Airtel, Jio, and Vivo across Hyderabad and South India. We manage design templates, production batching, logistics, and installation coordination for multi-location projects.' }],
  },
  {
    id: 10, name: 'Hospital Branding', slug: 'hospital-branding', category: 'Internal Branding',
    price: 'On request', priceNumeric: 40000, image: '/images/project-cards.webp',
    desc: 'Wayfinding, signage and branding solutions tailored for healthcare environments.',
    longDesc: 'Vijetha Digital specializes in healthcare branding including hospital wayfinding systems, department signage, directional boards, outdoor hospital signs, and interior wall graphics. Our healthcare branding solutions comply with patient safety guidelines and use fire-retardant materials where required.',
    specs: [{ label: 'Specialization', value: 'Wayfinding, department signs, directional' }, { label: 'Materials', value: 'Fire-retardant substrates available' }, { label: 'Compliance', value: 'Patient safety and exit signage standards' }],
    relatedSlugs: ['office-wall-branding', 'reception-and-lobby', 'led-sign-board'],
    faqs: [{ q: 'What signage does a hospital need?', a: 'Hospitals need: entrance sign boards, department name boards, wayfinding/directional signs, room number boards, fire exit signs, no smoking boards, canteen and pharmacy signs, parking signage, and outdoor pylon signs. Vijetha Digital provides complete hospital signage packages with fire-safe materials.' }],
  },
  {
    id: 11, name: 'Car / 4-Wheeler Wrap', slug: 'car-4-wheeler-wrap', category: 'Vehicle Branding',
    price: 'Rs 3,500 onwards', priceNumeric: 3500, image: '/images/about-printing.webp',
    desc: 'Full or partial vehicle wraps for cars, jeeps and SUVs. UV-resistant, professionally installed.',
    longDesc: 'Vijetha Digital applies professional car wraps using premium 3M and Avery Dennison cast vinyl. Full wraps, partial wraps, bonnet wraps, and door panel graphics available. Printed at 1440 dpi on Epson Surecolor for photo-realistic brand graphics. UV lamination protects against Hyderabad heat and rain. Clean removal without paint damage.',
    specs: [{ label: 'Material', value: '3M vinyl or Avery Dennison cast vinyl' }, { label: 'Lamination', value: 'UV-resistant gloss or matte' }, { label: 'Durability', value: '5-7 years outdoor' }, { label: 'Turnaround', value: '1-2 working days' }],
    relatedSlugs: ['bus-van-branding', '2-wheeler-branding', 'heavy-vehicle-branding'],
    faqs: [
      { q: 'How much does a car wrap cost in Hyderabad?', a: 'Car wrapping at Vijetha Digital Hyderabad: Bonnet wrap Rs 3,500-6,000, partial wrap (2 doors) Rs 8,000-15,000, full car wrap Rs 25,000-60,000 depending on car size and design complexity. All prices include design, printing, and installation at our Nacharam facility.' },
      { q: 'Does car wrap damage paint?', a: 'No. Premium cast vinyl used by Vijetha Digital (3M and Avery Dennison) does not damage car paint when properly applied and removed. The vinyl actually protects original paint from UV fading and minor scratches. Clean removal is possible for up to 7 years after application.' },
    ],
  },
  {
    id: 12, name: 'Bus / Van Branding', slug: 'bus-van-branding', category: 'Vehicle Branding',
    price: 'Rs 6,000 onwards', priceNumeric: 6000, image: '/images/hero-banner-hq.webp',
    desc: 'Large-format bus and van branding that turns your fleet into moving billboards.',
    longDesc: 'Bus and van branding from Vijetha Digital covers full-body wraps, partial side graphics, rear branding, and window perforated vinyl for buses and vans. We print on Epson Surecolor at 1440 dpi with UV lamination. Fleet pricing available for 5+ vehicles. Nationally we have branded vehicles for Pepsi, Heritage Foods, Airtel, and other major brands.',
    specs: [{ label: 'Coverage', value: 'Full wrap, side panels, rear, windows' }, { label: 'Window Vinyl', value: 'Perforated one-way vision vinyl' }, { label: 'Fleet Pricing', value: 'Available for 5+ vehicles' }],
    relatedSlugs: ['car-4-wheeler-wrap', '2-wheeler-branding', 'heavy-vehicle-branding'],
    faqs: [{ q: 'How much does bus branding cost in Hyderabad?', a: 'Bus branding prices at Vijetha Digital: Mini bus/Tempo Traveller partial sides Rs 6,000-15,000, full wrap Rs 20,000-45,000. Standard bus full wrap Rs 40,000-90,000. Price depends on bus size and coverage area. Fleet discounts available.' }],
  },
  {
    id: 13, name: '2-Wheeler Branding', slug: '2-wheeler-branding', category: 'Vehicle Branding',
    price: 'Rs 800 onwards', priceNumeric: 800, image: '/images/project-booklets.webp',
    desc: 'Eye-catching delivery bike and scooter branding for food, logistics and promo campaigns.',
    longDesc: 'Vijetha Digital brands 2-wheelers with precision-cut vinyl decals, half-body wraps, and full scooter/bike wraps. Popular for Zomato, Swiggy, delivery apps, logistics companies, and promotional campaigns. Same-day production for urgent fleet requirements.',
    specs: [{ label: 'Options', value: 'Decals, half wrap, full wrap' }, { label: 'Turnaround', value: 'Same day for standard designs' }, { label: 'Fleet', value: '50+ bike fleet branding expertise' }],
    relatedSlugs: ['car-4-wheeler-wrap', 'bus-van-branding'],
    faqs: [{ q: 'How much does bike branding cost in Hyderabad?', a: 'Bike and scooter branding at Vijetha Digital: Basic decal set Rs 800-1,500, half-body wrap Rs 2,000-3,500, full body wrap Rs 3,500-6,000. Fleet pricing available for 10+ bikes.' }],
  },
  {
    id: 14, name: 'Heavy Vehicle Branding', slug: 'heavy-vehicle-branding', category: 'Vehicle Branding',
    price: 'On request', priceNumeric: 20000, image: '/images/project-cards.webp',
    desc: 'Full truck and heavy transport branding for maximum road presence and brand reach.',
    longDesc: 'Vijetha Digital brands trucks, lorries, container vehicles, and heavy commercial vehicles with large-format prints on high-tack vinyl for commercial vehicle surfaces. Maximum road presence for FMCG, logistics, and manufacturing companies with nationwide fleet support.',
    specs: [{ label: 'Vehicle Types', value: 'Trucks, lorries, containers, tankers' }, { label: 'Material', value: 'High-tack commercial vehicle vinyl' }, { label: 'Fleet Support', value: 'Nationwide coordination available' }],
    relatedSlugs: ['bus-van-branding', 'car-4-wheeler-wrap'],
    faqs: [{ q: 'Do you brand trucks and HCV fleets?', a: 'Yes. Vijetha Digital brands trucks, lorries, and heavy commercial vehicles for FMCG brands, logistics companies, and manufacturers. We use high-tack commercial vinyl rated for 5+ years. Fleet coordination available pan-India.' }],
  },
  {
    id: 15, name: 'Flex / Vinyl Printing', slug: 'flex-vinyl-printing', category: 'Digital Printing',
    price: 'Rs 18-35 per sq.ft', priceNumeric: 18, image: '/images/about-printing.webp',
    desc: 'High-resolution flex and vinyl printing for banners, hoardings and backdrops.',
    longDesc: 'Vijetha Digital operates HP Latex 570 and Epson Surecolor S80670 for flex and vinyl printing at 1440 dpi. Daily capacity of 1 lakh sq.ft. Available in frontlit flex, backlit flex, self-adhesive vinyl, one-way vision vinyl, mesh, and canvas. Same-day for orders under 500 sq.ft submitted before 12 PM.',
    specs: [{ label: 'Equipment', value: 'HP Latex 570, Epson Surecolor S80670' }, { label: 'Max Width', value: '64 inches (5.3 feet)' }, { label: 'Resolution', value: '1440 dpi' }, { label: 'Capacity', value: '1 lakh sq.ft/day' }, { label: 'Materials', value: 'Frontlit flex, backlit flex, vinyl, mesh, canvas' }],
    relatedSlugs: ['uv-print', 'flex-board-hoarding', 'backdrop-stage-banner'],
    faqs: [
      { q: 'What is the difference between flex and vinyl printing?', a: 'Flex is a soft PVC material used for banners, hoardings, and backdrops — it is flexible and can be rolled. Vinyl is a firmer self-adhesive film used for vehicle graphics, wall stickers, and window graphics. Both are printed on the same large-format machines at Vijetha Digital.' },
      { q: 'What is the price of flex printing per square foot in Hyderabad?', a: 'Flex printing prices at Vijetha Digital: Frontlit flex Rs 18/sq.ft, backlit flex Rs 22-25/sq.ft, self-adhesive vinyl Rs 35-45/sq.ft, one-way vision Rs 55-65/sq.ft, canvas Rs 45-60/sq.ft. Bulk discounts apply for 1000+ sq.ft orders.' },
    ],
  },
  {
    id: 16, name: 'UV Print', slug: 'uv-print', category: 'Digital Printing',
    price: 'Rs 45 per sq.ft', priceNumeric: 45, image: '/images/hero-banner-hq.webp',
    desc: 'UV-cured printing for vibrant, scratch-resistant output on rigid and flexible substrates.',
    longDesc: 'UV printing uses ultraviolet-cured inks for exceptional color vibrancy, scratch resistance, and instant drying. Vijetha Digital offers UV printing on acrylic, glass, metal, foam board, corrugated sheets, and flexible materials. No minimum order. Suitable for premium displays, awards, and point-of-sale materials.',
    specs: [{ label: 'Substrates', value: 'Acrylic, glass, metal, foam board, corrugated' }, { label: 'Properties', value: 'UV-cured, scratch-resistant, waterproof' }, { label: 'Minimum Order', value: 'No minimum' }],
    relatedSlugs: ['flex-vinyl-printing', '3d-canvas-print', 'eco-solvent-print'],
    faqs: [{ q: 'What is UV printing used for?', a: 'UV printing is used for premium displays, awards, decorative panels, rigid sign boards, point-of-sale materials, acrylic standees, and any application requiring vivid colors on rigid substrates. UV inks cure instantly and are scratch and water resistant.' }],
  },
  {
    id: 17, name: '3D Canvas Print', slug: '3d-canvas-print', category: 'Digital Printing',
    price: 'Rs 120 per sq.ft', priceNumeric: 120, image: '/images/project-booklets.webp',
    desc: 'Textured 3D canvas printing for premium wall art, retail displays and exhibitions.',
    longDesc: 'Vijetha Digital produces premium 3D canvas prints for wall art, retail feature walls, and exhibition displays. Printed on high-quality canvas with photographic accuracy, stretched over wooden frames or presented as gallery wraps. Popular for hotels, restaurants, corporate lobbies, and retail stores.',
    specs: [{ label: 'Material', value: 'Artist canvas 380-450 GSM' }, { label: 'Mounting', value: 'Wooden frame or gallery wrap' }, { label: 'Resolution', value: 'Up to 1440 dpi' }],
    relatedSlugs: ['uv-print', 'flex-vinyl-printing', 'office-wall-branding'],
    faqs: [{ q: 'What is 3D canvas printing?', a: '3D canvas printing refers to photographic prints on thick textured artist canvas, typically stretched over a wooden frame to create a dimensional display effect. Vijetha Digital prints canvas at 1440 dpi for photo-quality results suitable for commercial and decorative use.' }],
  },
  {
    id: 18, name: 'Eco-Solvent Print', slug: 'eco-solvent-print', category: 'Digital Printing',
    price: 'Rs 20 per sq.ft', priceNumeric: 20, image: '/images/project-cards.webp',
    desc: 'Durable eco-solvent outdoor printing on Roland Soljet EJ 640 for long-lasting results.',
    longDesc: 'Eco-solvent printing on the Roland Soljet EJ 640 delivers weather-resistant, UV-resistant output for outdoor applications. Suitable for vehicle decals, outdoor banners, and long-duration signage applications where durability is critical. 3-5 year outdoor rating without lamination.',
    specs: [{ label: 'Equipment', value: 'Roland Soljet EJ 640' }, { label: 'Durability', value: '3-5 years outdoor without lamination' }, { label: 'Max Width', value: '64 inches' }],
    relatedSlugs: ['flex-vinyl-printing', 'uv-print', 'car-4-wheeler-wrap'],
    faqs: [{ q: 'What is eco-solvent printing?', a: 'Eco-solvent printing uses mildly solvent-based inks that penetrate vinyl and other substrates for long-lasting outdoor durability. Vijetha Digital uses a Roland Soljet EJ 640 which produces vivid, UV-resistant prints rated for 3-5 years outdoors without lamination.' }],
  },
  {
    id: 19, name: 'Brochure / Catalogue', slug: 'brochure-catalogue', category: 'Offset Printing',
    price: 'Rs 2,500 onwards', priceNumeric: 2500, image: '/images/about-printing.webp',
    desc: 'Full-colour perfect-bound or saddle-stitched brochures and product catalogues.',
    longDesc: 'Vijetha Digital prints premium product catalogues, company brochures, and annual reports using 4-color offset printing. Saddle-stitch (stapled) for 8-48 pages and perfect-bound (glued spine) for 48+ pages. Available in 100-300 GSM coated art paper with optional spot UV, foil stamping, and soft-touch lamination.',
    specs: [{ label: 'Binding', value: 'Saddle-stitch, perfect-bind, wire-o' }, { label: 'Paper', value: '100-300 GSM coated art paper' }, { label: 'Finishing', value: 'Spot UV, foil, lamination, embossing' }, { label: 'Min Quantity', value: '500 copies' }, { label: 'Turnaround', value: '5-7 working days' }],
    relatedSlugs: ['flyers-and-pamphlets', 'corporate-stationery', 'packaging-and-gift-boxes'],
    faqs: [{ q: 'What is the cost of brochure printing in Hyderabad?', a: 'Brochure printing at Vijetha Digital: 4-page A4 brochure at 1,000 copies costs approximately Rs 6,000-10,000 with standard lamination. 8-page bi-fold brochures at 1,000 copies Rs 12,000-18,000. Price depends on pages, paper weight, and finishing. Minimum 500 copies for cost-effective offset printing.' }],
  },
  {
    id: 20, name: 'Flyers & Pamphlets', slug: 'flyers-and-pamphlets', category: 'Offset Printing',
    price: 'Rs 800 per 1000', priceNumeric: 800, image: '/images/hero-banner-hq.webp',
    desc: 'High-quality offset flyers and pamphlets for promotions, events and campaigns.',
    longDesc: 'Vijetha Digital prints A4, A5, and DL-size flyers and pamphlets for events, promotions, and campaigns. 170-250 GSM art paper with single or double-sided printing. Fast turnaround: standard flyers ready in 3-5 days, urgent in 24-48 hours. Bulk pricing for 5,000+ pieces.',
    specs: [{ label: 'Sizes', value: 'A4, A5, DL, A6, custom' }, { label: 'Paper', value: '170-250 GSM art paper' }, { label: 'Turnaround', value: '3-5 days, urgent 24-48 hours' }, { label: 'Min Quantity', value: '500 pieces' }],
    relatedSlugs: ['brochure-catalogue', 'corporate-stationery'],
    faqs: [{ q: 'How much does flyer printing cost in Hyderabad?', a: 'Flyer printing at Vijetha Digital: A4 single-side 1,000 copies Rs 1,200-1,800 on 170 GSM paper. Double-sided Rs 1,800-2,500. A5 1,000 copies Rs 800-1,200. Premium 250 GSM with lamination costs 30-40% more. Minimum 500 copies.' }],
  },
  {
    id: 21, name: 'Corporate Stationery', slug: 'corporate-stationery', category: 'Offset Printing',
    price: 'Rs 1,200 onwards', priceNumeric: 1200, image: '/images/project-booklets.webp',
    desc: 'Letterheads, envelopes, visiting cards and notepads with consistent brand identity.',
    longDesc: 'Vijetha Digital provides complete corporate stationery packages including letterheads, envelopes, visiting cards, notepads, presentation folders, and ID card holders. Consistent color matching across all stationery items ensures strong brand identity for corporate clients.',
    specs: [{ label: 'Items', value: 'Letterhead, envelope, visiting card, notepad, folder' }, { label: 'Visiting Cards', value: '90-350 GSM, matte/gloss/spot UV options' }, { label: 'Turnaround', value: '3-5 working days' }],
    relatedSlugs: ['brochure-catalogue', 'flyers-and-pamphlets', 'packaging-and-gift-boxes'],
    faqs: [{ q: 'How much do visiting cards cost in Hyderabad?', a: 'Visiting card printing at Vijetha Digital: 500 standard cards (4x2 inches, 300 GSM, glossy lamination) Rs 1,200-1,800. Spot UV cards Rs 2,000-2,800. Premium velvet lamination with foil Rs 3,500-5,000 per 500. Double-sided printing Rs 200 extra.' }],
  },
  {
    id: 22, name: 'Packaging & Gift Boxes', slug: 'packaging-and-gift-boxes', category: 'Offset Printing',
    price: 'Rs 3,000 onwards', priceNumeric: 3000, image: '/images/project-cards.webp',
    desc: 'Custom packaging boxes and gift sets with spot UV, foil stamping and die-cutting.',
    longDesc: 'Vijetha Digital manufactures custom packaging boxes and gift boxes for FMCG, retail, and corporate gifting. Die-cut rigid boxes, folding cartons, sleeve boxes, and corrugated shipping boxes available. Finishing options include spot UV, foil stamping, embossing, soft-touch lamination, and window cutouts.',
    specs: [{ label: 'Types', value: 'Rigid box, folding carton, sleeve, corrugated' }, { label: 'Finishing', value: 'Spot UV, foil, embossing, window cutout' }, { label: 'Min Quantity', value: '500 pieces' }],
    relatedSlugs: ['brochure-catalogue', 'corporate-stationery'],
    faqs: [{ q: 'Do you print custom gift boxes in Hyderabad?', a: 'Yes. Vijetha Digital manufactures custom gift boxes, product packaging, and presentation boxes for corporate gifting and retail. We handle design, die-making, printing, and finishing in-house. Minimum 500 pieces. Lead time 7-10 working days.' }],
  },
  {
    id: 23, name: 'Roll-Up Standee', slug: 'roll-up-standee', category: 'Display & Exhibition',
    price: 'Rs 1,800 onwards', priceNumeric: 1800, image: '/images/about-printing.webp',
    desc: 'Portable roll-up standees for exhibitions, events and retail point-of-sale displays.',
    longDesc: 'Roll-up standees from Vijetha Digital include standard (85x200cm), mini (60x160cm), and wide (120x200cm) sizes. Premium aluminum spring-loaded mechanism for smooth retraction. Includes custom printed graphic on 540 GSM backlit film. Same-day production for standard designs. Carry bag included.',
    specs: [{ label: 'Sizes', value: '60x160cm, 85x200cm, 120x200cm' }, { label: 'Mechanism', value: 'Aluminum spring-loaded base' }, { label: 'Print', value: '540 GSM backlit film' }, { label: 'Turnaround', value: 'Same day for standard size' }],
    relatedSlugs: ['demo-tent-canopy', 'fabric-light-box', 'trade-show-booth'],
    faqs: [{ q: 'What is the price of a roll-up standee in Hyderabad?', a: 'Roll-up standee prices at Vijetha Digital: Standard 85x200cm Rs 1,800-2,500 including printing, mini 60x160cm Rs 1,400-1,800, wide 120x200cm Rs 2,500-3,500. Premium premium standees with heavier base Rs 3,500-5,000. Bulk pricing for 10+ pieces.' }],
  },
  {
    id: 24, name: 'Demo Tent / Canopy', slug: 'demo-tent-canopy', category: 'Display & Exhibition',
    price: 'Rs 8,500 onwards', priceNumeric: 8500, image: '/images/hero-banner-hq.webp',
    desc: 'Branded demo tents for outdoor promotions, trade fairs and road shows.',
    longDesc: 'Vijetha Digital supplies and prints promotional pop-up tents, canopies, and demo tents in 6x6 ft, 10x10 ft, and 10x20 ft sizes. Water-resistant polyester fabric printing, aluminium frame, and carry bag. Custom branding on all 4 walls, roof panels, and back wall available.',
    specs: [{ label: 'Sizes', value: '6x6ft, 10x10ft, 10x20ft' }, { label: 'Material', value: 'Water-resistant polyester + aluminium frame' }, { label: 'Branding', value: 'All 4 walls, roof, back wall' }],
    relatedSlugs: ['roll-up-standee', 'flags-and-bunting', 'canopy-and-tent-branding'],
    faqs: [{ q: 'How much does a branded tent cost in Hyderabad?', a: 'Branded promotional tents at Vijetha Digital: 6x6ft with 4-side printing Rs 8,500-12,000, 10x10ft Rs 15,000-22,000, 10x20ft Rs 25,000-38,000. Price includes aluminium frame, custom printing, and carry bag.' }],
  },
  {
    id: 25, name: 'Fabric Light Box', slug: 'fabric-light-box', category: 'Display & Exhibition',
    price: 'Rs 5,500 onwards', priceNumeric: 5500, image: '/images/project-booklets.webp',
    desc: 'Illuminated fabric tension displays for high-impact retail and exhibition environments.',
    longDesc: 'Fabric light boxes from Vijetha Digital use SEG (silicone edge graphics) fabric printing stretched on an illuminated aluminium frame. Even backlit glow with no hot spots. Slim profile. Fabric is washable and replaceable. Ideal for retail brand walls, exhibition booths, and hotel lobbies.',
    specs: [{ label: 'System', value: 'SEG silicone edge graphics on LED backlit frame' }, { label: 'Profile', value: '85mm slim frame' }, { label: 'Fabric', value: 'Washable, replaceable' }],
    relatedSlugs: ['trade-show-booth', 'roll-up-standee', 'office-wall-branding'],
    faqs: [{ q: 'What is a fabric light box?', a: 'A fabric light box is a slim aluminium frame with integrated LED backlighting and a stretched fabric graphic using SEG (silicone edge) technology. The fabric creates an even, glowing backlit display without visible hardware. Popular for retail brand walls, exhibition stands, and hotel lobbies.' }],
  },
  {
    id: 26, name: 'Trade Show Booth', slug: 'trade-show-booth', category: 'Display & Exhibition',
    price: 'On request', priceNumeric: 50000, image: '/images/project-cards.webp',
    desc: 'Complete trade show booth design and fabrication for conferences, expos and product launches.',
    longDesc: 'Vijetha Digital designs and fabricates modular and custom trade show booths for exhibitions, expos, and product launches. Services include booth design, graphic production (fabric, flex, acrylic), structural fabrication, furniture rental, lighting, and on-site installation. We have executed booths for major Hyderabad and national trade shows.',
    specs: [{ label: 'Types', value: 'Modular, custom, island, inline' }, { label: 'Services', value: 'Design, fabrication, installation, dismantle' }, { label: 'Sizes', value: '10x10 to 40x40 sq.ft and beyond' }],
    relatedSlugs: ['fabric-light-box', 'roll-up-standee', 'backdrop-stage-banner'],
    faqs: [{ q: 'How much does a trade show booth cost in Hyderabad?', a: 'Trade show booth fabrication at Vijetha Digital: Small 10x10ft booth Rs 50,000-1,20,000, medium 20x20ft Rs 1,50,000-3,50,000, large 30x30ft+ Rs 4,00,000+. Price includes design, structure, graphics, and installation. Contact us for a site-specific quote.' }],
  },
  {
    id: 27, name: 'Flags & Bunting', slug: 'flags-and-bunting', category: 'Outdoor Advertising',
    price: 'Rs 350 onwards', priceNumeric: 350, image: '/images/about-printing.webp',
    desc: 'Printed flags, buntings and feather flags for outdoor events and brand promotions.',
    longDesc: 'Vijetha Digital prints all flag types: rectangular flags, feather flags (teardrop), swooper flags, table flags, and string buntings. Fabric dye-sublimation printing for vivid, long-lasting color. Aluminium poles and ground spikes included. Popular for store openings, events, and roadside brand activations.',
    specs: [{ label: 'Types', value: 'Rectangular, feather, swooper, table, bunting' }, { label: 'Printing', value: 'Dye-sublimation fabric printing' }, { label: 'Includes', value: 'Aluminium pole and ground spike' }],
    relatedSlugs: ['backdrop-stage-banner', 'canopy-and-tent-branding', 'demo-tent-canopy'],
    faqs: [{ q: 'How much do printed flags cost in Hyderabad?', a: 'Printed flag prices at Vijetha Digital: Table flags (30x45cm) Rs 350-600, standard 2x3ft flags Rs 500-900, feather flags 2.4m Rs 1,200-2,000 including pole, large 4x6ft flags Rs 1,500-2,500. Bulk pricing for 10+ flags.' }],
  },
  {
    id: 28, name: 'Backdrop / Stage Banner', slug: 'backdrop-stage-banner', category: 'Outdoor Advertising',
    price: 'Rs 1,200 onwards', priceNumeric: 1200, image: '/images/hero-banner-hq.webp',
    desc: 'Large format backdrops and stage banners for events, press conferences and launches.',
    longDesc: 'Vijetha Digital prints event backdrops and stage banners on premium backlit flex or fabric for press conferences, product launches, award ceremonies, and weddings. Custom sizes up to 20 feet wide. Retractable backdrop stand systems available. Same-day production for urgent events.',
    specs: [{ label: 'Material', value: 'Backlit flex or fabric' }, { label: 'Max Width', value: '20 feet continuous' }, { label: 'Stand', value: 'Retractable stand available on hire/purchase' }],
    relatedSlugs: ['flex-vinyl-printing', 'flags-and-bunting', 'roll-up-standee'],
    faqs: [{ q: 'How much does an event backdrop cost in Hyderabad?', a: 'Event backdrop printing at Vijetha Digital: 6x4ft Rs 1,200-1,800, 8x6ft Rs 1,800-2,800, 10x8ft Rs 2,500-4,000, 12x8ft Rs 3,200-5,000. With retractable stand system add Rs 3,000-8,000. Same-day for urgent events.' }],
  },
  {
    id: 29, name: 'Stickers & Decals', slug: 'stickers-and-decals', category: 'Outdoor Advertising',
    price: 'Rs 5 per sq.ft', priceNumeric: 5, image: '/images/project-booklets.webp',
    desc: 'Custom stickers and vinyl decals for vehicles, walls, floors and glass surfaces.',
    longDesc: 'Vijetha Digital produces custom stickers and vinyl decals for virtually any application — vehicle decals, wall stickers, floor graphics, glass stickers, laptop stickers, and waterproof labels. Die-cut to any shape. Self-adhesive vinyl with removable or permanent options. Minimum order as low as 50 pieces.',
    specs: [{ label: 'Applications', value: 'Vehicle, wall, floor, glass, product labels' }, { label: 'Options', value: 'Removable or permanent adhesive' }, { label: 'Cutting', value: 'Die-cut to any custom shape' }, { label: 'Min Order', value: '50 pieces' }],
    relatedSlugs: ['flex-vinyl-printing', 'car-4-wheeler-wrap', '2-wheeler-branding'],
    faqs: [{ q: 'How much do custom stickers cost in Hyderabad?', a: 'Custom sticker printing at Vijetha Digital: Small A4 sticker sheets Rs 5-8 per sheet (100+ pcs), die-cut stickers Rs 8-25 each depending on size, floor graphics Rs 60-100 per sq.ft, vehicle decals Rs 150-300 each. Minimum 50 pieces for custom orders.' }],
  },
  {
    id: 30, name: 'Canopy & Tent Branding', slug: 'canopy-and-tent-branding', category: 'Outdoor Advertising',
    price: 'Rs 2,200 onwards', priceNumeric: 2200, image: '/images/project-cards.webp',
    desc: 'Branded promotional canopies and pop-up tents for outdoor activations and events.',
    longDesc: 'Canopy branding from Vijetha Digital covers umbrella canopies, gazebo tents, and pop-up canopies with printed panels in frontlit flex or polyester fabric. Popular for outdoor restaurant seating, market stalls, petrol station canopies, and promotional activations.',
    specs: [{ label: 'Sizes', value: '2m, 3m, 4m diameter canopies' }, { label: 'Material', value: 'Frontlit flex or polyester fabric' }, { label: 'Poles', value: 'Aluminium or MS depending on size' }],
    relatedSlugs: ['demo-tent-canopy', 'flags-and-bunting', 'backdrop-stage-banner'],
    faqs: [{ q: 'How much does canopy branding cost in Hyderabad?', a: 'Canopy branding at Vijetha Digital: 2m round canopy with printing Rs 2,200-3,500, 3m canopy Rs 3,500-5,500, 4m canopy Rs 5,500-8,000. Gazebo pop-up tents Rs 8,000-18,000 depending on quality and printing coverage.' }],
  },
];

export const CATEGORIES = [
  'Signage Solutions', 'Internal Branding', 'Vehicle Branding',
  'Digital Printing', 'Offset Printing', 'Display & Exhibition', 'Outdoor Advertising',
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug);
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedSlugs
    .map(s => PRODUCTS.find(p => p.slug === s))
    .filter(Boolean) as Product[];
}

