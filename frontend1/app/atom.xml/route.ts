import { NextResponse } from 'next/server';
import { toSlug } from '@/lib/products-data';

const baseUrl = 'https://vijethadigital.com';

// Static build date — same principle as rss.xml.
// Atom feeds with ever-changing <updated> dates look like "constantly updated content" to crawlers.
const BUILD_DATE_ISO = '2026-08-21T12:00:00Z';
const YEAR = 2026;

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}


const PRODUCTS: { name: string; desc: string; updated: string }[] = [
  { name: 'LED Sign Board', desc: 'Premium LED sign boards for 24/7 business visibility in Hyderabad. IP65 weatherproof, 2-year warranty. From Rs 3,500.', updated: '2026-08-01T00:00:00Z' },
  { name: 'ACP Cladding Sign', desc: 'Goldplus 4mm ACP cladding with 3D letter fabrication. Brushed, matte, or glossy finish. 7-10 year durability. From Rs 2,200.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Acrylic Letter Sign', desc: 'Precision CNC-cut acrylic 3D letters. Backlit, front-lit, or non-illuminated. From Rs 1,800.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Fascia Sign Board', desc: 'Full-width illuminated fascia boards for storefronts. From Rs 4,500.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Flex Board Hoarding', desc: 'HP Latex 570 flex printing for hoardings. Same-day under 500 sq.ft. From Rs 18/sq.ft.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Pylon Sign', desc: 'Freestanding illuminated pylon signs for highway visibility. From Rs 8,000.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Office Wall Branding', desc: 'Office wall murals, UV prints, and 3D lettering for corporate interiors in Hyderabad.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Reception & Lobby', desc: 'Reception branding with backlit logo walls, wayfinding systems, and branded counters.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Retail In-Shop Branding', desc: 'Complete retail store branding — walls, windows, floors, POS. Multi-location rollouts handled.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Hospital Branding', desc: 'Hospital wayfinding, department signage, and interior branding with fire-retardant materials.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Car / 4-Wheeler Wrap', desc: '3M cast vinyl car and SUV wraps. Full wrap, partial wrap, bonnet wrap. From Rs 3,500.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Bus / Van Branding', desc: 'Large-format bus and van vinyl branding. Fleet pricing for 5+ vehicles. From Rs 6,000.', updated: '2026-08-01T00:00:00Z' },
  { name: '2-Wheeler Branding', desc: 'Delivery bike and scooter vinyl graphics. Same-day service. From Rs 800.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Heavy Vehicle Branding', desc: 'Truck and HCV branding with high-tack commercial vinyl. Fleet coordination available.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Flex / Vinyl Printing', desc: 'HP Latex 570 printing. 1,440 dpi, 1 lakh sq.ft/day. Frontlit, backlit, vinyl. From Rs 18/sq.ft.', updated: '2026-08-01T00:00:00Z' },
  { name: 'UV Print', desc: 'UV-cured printing on acrylic, glass, metal, and rigid substrates. From Rs 45/sq.ft.', updated: '2026-08-01T00:00:00Z' },
  { name: '3D Canvas Print', desc: 'Premium canvas at 1440 dpi, 380-450 GSM. Gallery wrap options. From Rs 120/sq.ft.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Eco-Solvent Print', desc: 'Roland Soljet EJ 640 outdoor printing. 3-5 year durability without lamination. From Rs 20/sq.ft.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Brochure / Catalogue', desc: 'Offset-printed brochures with spot UV, foil stamping, and perfect binding. From Rs 2,500.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Flyers & Pamphlets', desc: 'A4/A5/DL flyers on 170-250 GSM paper. 3-5 day turnaround. From Rs 800 per 1,000.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Corporate Stationery', desc: 'Letterheads, visiting cards, notepads and envelopes with consistent brand identity. From Rs 1,200.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Packaging & Gift Boxes', desc: 'Custom gift boxes and packaging with die-cutting, foil stamping, and embossing. From Rs 3,000.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Roll-Up Standee', desc: 'Aluminum roll-up standees with 540 GSM print. Same-day for standard size. From Rs 1,800.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Demo Tent / Canopy', desc: 'Branded pop-up tents in 6x6ft to 10x20ft. Water-resistant, 4-side printing. From Rs 8,500.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Fabric Light Box', desc: 'SEG fabric displays on LED backlit frames. Even glow, washable graphic. From Rs 5,500.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Trade Show Booth', desc: 'Complete trade show booth design, fabrication, and installation for Hyderabad exhibitions.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Flags & Bunting', desc: 'Dye-sublimation printed flags — feather, rectangular, swooper, bunting. From Rs 350.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Backdrop / Stage Banner', desc: 'Event backdrops up to 20ft wide on backlit flex or fabric. Same-day available. From Rs 1,200.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Stickers & Decals', desc: 'Die-cut vinyl stickers for vehicles, walls, floors, and glass. From Rs 5/sq.ft.', updated: '2026-08-01T00:00:00Z' },
  { name: 'Canopy & Tent Branding', desc: 'Branded promotional canopies for outdoor activations. From Rs 2,200.', updated: '2026-08-01T00:00:00Z' },
];

// SITELINKS OPTIMIZATION:
// Core navigation pages listed FIRST to signal site hierarchy to Google.
// Service category pages included for better topical clustering.
const MAIN_PAGES = [
  // Primary navigation (sitelinks candidates)
  { url: '/', title: 'Vijetha Digital — Printing, Signage & Vehicle Branding Hyderabad', desc: 'Leading commercial printing and signage company in Hyderabad since 2009. LED signs, vehicle branding, flex printing, offset printing, exhibition displays.', updated: '2026-08-21T12:00:00Z' },
  { url: '/services', title: 'Printing & Signage Services in Hyderabad | Vijetha Digital', desc: 'LED signage, vehicle branding, digital printing, offset printing, screen printing and exhibition display solutions for businesses across Hyderabad.', updated: '2026-08-21T12:00:00Z' },
  { url: '/products', title: 'Printing Products in Hyderabad | Vijetha Digital', desc: 'Browse 30+ printing and signage products — LED boards, vehicle wraps, flex printing, standees, brochures and more.', updated: '2026-08-21T12:00:00Z' },
  { url: '/about', title: 'About Vijetha Digital | Printing & Signage Company Since 2009', desc: '15+ years of expertise. 1,000+ clients, 3 branches, 10,000 sq.ft production facility in Nacharam IDA, Hyderabad.', updated: '2026-08-21T12:00:00Z' },
  { url: '/contact', title: 'Contact Vijetha Digital | Free Quote | Hyderabad', desc: 'Get a free printing and signage quote. 3 Hyderabad branches — Nacharam, Lakdikapool, Indira Park. Call +91 92481 95552.', updated: '2026-08-21T12:00:00Z' },
  
  // Service categories (help Google understand site structure)
  { url: '/services/signage', title: 'Signage Services in Hyderabad | LED Signs, ACP Cladding | Vijetha Digital', desc: 'Complete signage solutions in Hyderabad — LED sign boards, ACP cladding, acrylic letters, fascia boards, pylon signs. 15+ years experience.', updated: '2026-08-21T12:00:00Z' },
  { url: '/services/vehicle-branding', title: 'Vehicle Branding Services in Hyderabad | Car Wraps, Bus Branding | Vijetha Digital', desc: 'Professional vehicle branding in Hyderabad using 3M vinyl. Cars, buses, vans, bikes, heavy vehicles. Fleet pricing available.', updated: '2026-08-21T12:00:00Z' },
  { url: '/services/digital-printing', title: 'Digital Printing Services in Hyderabad | Flex, UV, Canvas | Vijetha Digital', desc: 'High-resolution digital printing services — flex, vinyl, UV print, canvas, eco-solvent. 1 lakh sq.ft daily capacity.', updated: '2026-08-21T12:00:00Z' },
  
  // Secondary pages
  { url: '/projects', title: 'Our Work | Printing & Signage Projects | Vijetha Digital', desc: '1,000+ completed projects across Hyderabad — LED signs, vehicle fleets, office branding, exhibitions.', updated: '2026-08-21T12:00:00Z' },
];

export async function GET() {
  const productEntries = PRODUCTS.map(({ name, desc, updated }) => {
    const slug = toSlug(name);
    return `
  <entry>
    <title>${xmlEscape(name + ' — Vijetha Digital Hyderabad')}</title>
    <link href="${baseUrl}/products/${slug}" rel="alternate" type="text/html"/>
    <id>${baseUrl}/products/${slug}</id>
    <updated>${updated}</updated>
    <published>${updated}</published>
    <summary type="html">${xmlEscape(desc)}</summary>
    <category term="Products"/>
    <category term="Printing"/>
    <category term="Signage"/>
    <author>
      <name>Vijetha Digital</name>
      <email>info@vijethadigital.com</email>
      <uri>${baseUrl}</uri>
    </author>
  </entry>`;
  }).join('');

  const mainPageEntries = MAIN_PAGES.map(({ url, title, desc, updated }) => `
  <entry>
    <title>${xmlEscape(title)}</title>
    <link href="${baseUrl}${url}" rel="alternate" type="text/html"/>
    <id>${baseUrl}${url}</id>
    <updated>${updated}</updated>
    <published>${updated}</published>
    <summary type="html">${xmlEscape(desc)}</summary>
    <category term="Pages"/>
    <author>
      <name>Vijetha Digital</name>
      <email>info@vijethadigital.com</email>
      <uri>${baseUrl}</uri>
    </author>
  </entry>`).join('');

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-IN">
  <title>Vijetha Digital — Printing &amp; Signage Solutions Hyderabad</title>
  <subtitle>Premium printing and signage services in Hyderabad. LED signs, vehicle branding, flex printing, offset printing, and exhibition displays. 1,000+ clients since 2009.</subtitle>
  <link href="${baseUrl}" rel="alternate" type="text/html"/>
  <link href="${baseUrl}/atom.xml" rel="self" type="application/atom+xml"/>
  <id>${baseUrl}/</id>
  <updated>${BUILD_DATE_ISO}</updated>
  <rights>Copyright ${YEAR} Vijetha Digital. All rights reserved.</rights>
  <generator uri="https://nextjs.org/" version="15">Next.js</generator>
  <logo>${baseUrl}/vd-logo.jpeg</logo>
  <icon>${baseUrl}/vd-logo.jpeg</icon>
  <author>
    <name>Vijetha Digital</name>
    <email>info@vijethadigital.com</email>
    <uri>${baseUrl}</uri>
  </author>
  <category term="Printing"/>
  <category term="Signage"/>
  <category term="Branding"/>
  ${mainPageEntries}
  ${productEntries}
</feed>`;

  return new NextResponse(atomFeed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'index, follow',
      'Link': `<${baseUrl}/atom.xml>; rel="canonical"`,
    },
  });
}
