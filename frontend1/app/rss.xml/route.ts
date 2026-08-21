import { NextResponse } from 'next/server';

const baseUrl = 'https://vijethadigital.com';

// Static build date — NEVER use new Date() here.
// Dynamic dates cause RSS readers and crawlers to treat unchanged content as "new"
// which wastes crawl budget and confuses feed readers.
const BUILD_DATE = new Date('2026-08-21T12:00:00Z').toUTCString();
const YEAR = new Date('2026-08-21T12:00:00Z').getFullYear();

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const toSlug = (value: string) =>
  value.toLowerCase().replace(/&/g, 'and').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const PRODUCTS: { name: string; desc: string; pubDate: string }[] = [
  { name: 'LED Sign Board', desc: 'Premium LED sign boards for eye-catching 24/7 business visibility in Hyderabad. Aluminium frame, IP65 weatherproof, 2-year warranty. From Rs 3,500.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'ACP Cladding Sign', desc: 'Durable 4mm Goldplus ACP cladding signage with 3D letters for corporate facades. Weather-resistant, 7-10 year durability. From Rs 2,200.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Acrylic Letter Sign', desc: 'Precision CNC-cut acrylic 3D letters for shopfronts and offices. Backlit, front-lit, and non-lit options. From Rs 1,800.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Fascia Sign Board', desc: 'Full-width fascia boards for storefronts in Hyderabad. Illuminated and non-lit options. From Rs 4,500.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Flex Board Hoarding', desc: 'HP Latex 570 flex printing for hoardings and outdoor banners. Same-day for under 500 sq.ft. From Rs 18/sq.ft.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Pylon Sign', desc: 'Towering freestanding pylon signs for highway visibility in Hyderabad. 8-40ft height options. From Rs 8,000.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Office Wall Branding', desc: 'Transform office walls with vinyl murals, UV prints and 3D lettering for corporate interiors in Hyderabad.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Reception & Lobby', desc: 'Premium reception and lobby branding — backlit logo walls, wayfinding, and branded counters.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Retail In-Shop Branding', desc: 'Complete in-shop branding for retail chains — walls, windows, floors and POS displays. Multi-location rollouts.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Hospital Branding', desc: 'Wayfinding, department signage and interior branding for hospitals with fire-retardant materials.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Car / 4-Wheeler Wrap', desc: 'Professional car and SUV wraps using 3M vinyl. Full wrap, partial wrap, bonnet wrap. From Rs 3,500.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Bus / Van Branding', desc: 'Large-format bus and van branding with UV-laminated vinyl. Fleet pricing for 5+ vehicles. From Rs 6,000.', pubDate: '2026-08-01T00:00:00Z' },
  { name: '2-Wheeler Branding', desc: 'Delivery bike and scooter vinyl branding. Same-day for standard designs. From Rs 800.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Heavy Vehicle Branding', desc: 'Truck, lorry, and HCV branding with high-tack commercial vinyl for FMCG and logistics fleets.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Flex / Vinyl Printing', desc: 'HP Latex 570, 1440 dpi, 1 lakh sq.ft/day capacity. Frontlit flex, backlit flex, vinyl. From Rs 18/sq.ft.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'UV Print', desc: 'UV-cured scratch-resistant printing on acrylic, glass, metal, and rigid substrates. From Rs 45/sq.ft.', pubDate: '2026-08-01T00:00:00Z' },
  { name: '3D Canvas Print', desc: 'Premium canvas printing at 1440 dpi on 380-450 GSM artist canvas. Gallery wrap and framed options. From Rs 120/sq.ft.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Eco-Solvent Print', desc: 'Roland Soljet EJ 640 eco-solvent outdoor printing. 3-5 year outdoor durability without lamination. From Rs 20/sq.ft.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Brochure / Catalogue', desc: 'Offset-printed brochures and catalogues with spot UV, foil stamping, and perfect binding. From Rs 2,500.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Flyers & Pamphlets', desc: 'High-quality A4, A5, and DL flyers on 170-250 GSM paper. 3-5 day turnaround. From Rs 800 per 1,000.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Corporate Stationery', desc: 'Letterheads, envelopes, visiting cards, and notepads with consistent brand identity. From Rs 1,200.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Packaging & Gift Boxes', desc: 'Custom rigid boxes, folding cartons and gift boxes with die-cutting and foil stamping. From Rs 3,000.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Roll-Up Standee', desc: 'Portable aluminum roll-up standees with 540 GSM print. Same-day for standard size. From Rs 1,800.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Demo Tent / Canopy', desc: 'Branded pop-up promo tents in 6x6ft, 10x10ft, and 10x20ft. Water-resistant, custom 4-side printing. From Rs 8,500.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Fabric Light Box', desc: 'SEG silicone edge fabric displays on LED backlit aluminum frames. Even glow, washable fabric. From Rs 5,500.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Trade Show Booth', desc: 'Full design-to-installation trade show booth fabrication for exhibitions and expos in Hyderabad. On request.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Flags & Bunting', desc: 'Dye-sublimation printed flags — rectangular, feather, swooper, and buntings with aluminum poles. From Rs 350.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Backdrop / Stage Banner', desc: 'Large-format event backdrops up to 20ft wide on backlit flex or fabric. Same-day for urgent events. From Rs 1,200.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Stickers & Decals', desc: 'Die-cut custom stickers and vinyl decals for vehicles, walls, floors and glass. From Rs 5/sq.ft.', pubDate: '2026-08-01T00:00:00Z' },
  { name: 'Canopy & Tent Branding', desc: 'Branded promotional canopies and gazebo tents for outdoor activations. From Rs 2,200.', pubDate: '2026-08-01T00:00:00Z' },
];

const MAIN_PAGES = [
  { url: '/', title: 'Vijetha Digital — Printing, Signage & Vehicle Branding in Hyderabad', desc: 'Leading commercial printing and signage company in Hyderabad since 2009. LED signs, vehicle branding, flex printing, offset printing, exhibition displays.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/services', title: 'Printing & Signage Services in Hyderabad | Vijetha Digital', desc: 'LED signage, vehicle branding, digital printing, offset printing, screen printing, display and exhibition solutions for businesses across Hyderabad.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/products', title: 'Printing Products in Hyderabad | Vijetha Digital', desc: 'Browse 30+ printing and signage products — LED boards, vehicle wraps, flex printing, standees, brochures and more for Hyderabad businesses.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/about', title: 'About Vijetha Digital | Printing & Signage Company Hyderabad Since 2009', desc: '15+ years of printing and signage expertise. 1,000+ clients, 3 branches, 10,000 sq.ft production facility in Nacharam IDA, Hyderabad.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/contact', title: 'Contact Vijetha Digital | Get a Free Quote | Hyderabad', desc: 'Get a free printing and signage quote from Vijetha Digital. 3 branches in Hyderabad — Nacharam, Lakdikapool, Indira Park. Call +91 92481 95552.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/projects', title: 'Our Work | Printing & Signage Projects | Vijetha Digital', desc: '1,000+ completed printing and branding projects across Hyderabad and South India — LED signs, vehicle fleets, office branding, exhibitions.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/hyderabad-printing-signage', title: 'Commercial Printing & Signage Company in Hyderabad | Vijetha Digital', desc: 'Leading commercial printing and signage company in Hyderabad since 2009. 3 branches, 10,000 sq.ft facility, same-day service available.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/hyderabad-signage-company', title: 'Signage Company in Hyderabad | LED Signs, ACP Cladding | Vijetha Digital', desc: 'Best signage company in Hyderabad. LED sign boards, ACP cladding, acrylic letters, fascia boards, pylon signs. 15+ years, 1,000+ clients.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/hyderabad-vehicle-branding', title: 'Vehicle Branding in Hyderabad | Car, Bus & Fleet Wrapping | Vijetha Digital', desc: 'Professional vehicle branding in Hyderabad using 3M vinyl. Cars, buses, vans, 2-wheelers. 5-7 year durability.', pubDate: '2026-08-21T12:00:00Z' },
  { url: '/hyderabad-printing-services', title: 'Printing Services in Hyderabad | Offset, Digital & Flex | Vijetha Digital', desc: 'Professional offset, digital, flex, UV and screen printing services in Hyderabad. Same-day available. Fast turnaround.', pubDate: '2026-08-21T12:00:00Z' },
];

export async function GET() {
  const productItems = PRODUCTS.map(({ name, desc, pubDate }) => {
    const slug = toSlug(name);
    return `
    <item>
      <title>${xmlEscape(name + ' — Vijetha Digital Hyderabad')}</title>
      <link>${baseUrl}/products/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/products/${slug}</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      <category>Products</category>
      <category>Printing</category>
      <category>Signage</category>
    </item>`;
  }).join('');

  const mainPageItems = MAIN_PAGES.map(({ url, title, desc, pubDate }) => `
    <item>
      <title>${xmlEscape(title)}</title>
      <link>${baseUrl}${url}</link>
      <guid isPermaLink="true">${baseUrl}${url}</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${new Date(pubDate).toUTCString()}</pubDate>
      <category>Pages</category>
    </item>`).join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Vijetha Digital — Printing &amp; Signage Solutions Hyderabad</title>
    <link>${baseUrl}</link>
    <description>Premium printing and signage services in Hyderabad. LED signs, vehicle branding, flex printing, offset printing, and exhibition displays. 1,000+ clients since 2009.</description>
    <language>en-IN</language>
    <lastBuildDate>${BUILD_DATE}</lastBuildDate>
    <pubDate>${BUILD_DATE}</pubDate>
    <ttl>1440</ttl>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/vd-logo.jpeg</url>
      <title>Vijetha Digital</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
    </image>
    <managingEditor>info@vijethadigital.com (Vijetha Digital)</managingEditor>
    <webMaster>info@vijethadigital.com (Vijetha Digital)</webMaster>
    <copyright>Copyright ${YEAR} Vijetha Digital. All rights reserved.</copyright>
    <category>Printing</category>
    <category>Signage</category>
    <category>Branding</category>
    ${mainPageItems}
    ${productItems}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'index, follow',
    },
  });
}
