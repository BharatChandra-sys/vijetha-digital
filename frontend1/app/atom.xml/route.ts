import { NextResponse } from 'next/server';

const baseUrl = 'https://vijethadigital.com';

// Helper to convert product name to slug
const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

// All products for feed
const PRODUCTS = [
  'LED Sign Board',
  'ACP Cladding Sign',
  'Acrylic Letter Sign',
  'Fascia Sign Board',
  'Flex Board Hoarding',
  'Pylon Sign',
  'Office Wall Branding',
  'Reception & Lobby',
  'Retail In-Shop Branding',
  'Hospital Branding',
  'Car / 4-Wheeler Wrap',
  'Bus / Van Branding',
  '2-Wheeler Branding',
  'Heavy Vehicle Branding',
  'Flex / Vinyl Printing',
  'UV Print',
  '3D Canvas Print',
  'Eco-Solvent Print',
  'Brochure / Catalogue',
  'Flyers & Pamphlets',
  'Corporate Stationery',
  'Packaging & Gift Boxes',
  'Roll-Up Standee',
  'Demo Tent / Canopy',
  'Fabric Light Box',
  'Trade Show Booth',
  'Flags & Bunting',
  'Backdrop / Stage Banner',
  'Stickers & Decals',
  'Canopy & Tent Branding',
];

const MAIN_PAGES = [
  {
    url: '',
    title: 'Vijetha Digital - Premium Printing & Signage Solutions in Hyderabad',
    description:
      'Leading printing and signage company in Hyderabad. Offering high-quality signage, vehicle branding, digital printing, and offset printing services since 2009.',
    updated: '2026-08-08T12:00:00Z',
  },
  {
    url: '/services',
    title: 'Our Services - Signage, Printing & Branding Solutions',
    description:
      'Comprehensive printing and signage services including LED sign boards, vehicle branding, digital printing, offset printing, and display solutions.',
    updated: '2026-08-08T12:00:00Z',
  },
  {
    url: '/products',
    title: 'Our Products - Complete Printing & Signage Catalog',
    description:
      'Browse our extensive range of 30+ signage and printing products. From LED signs to vehicle wraps, we offer premium solutions for your business.',
    updated: '2026-08-08T12:00:00Z',
  },
  {
    url: '/about',
    title: 'About Vijetha Digital - 15+ Years of Excellence',
    description:
      'Learn about Vijetha Digital, Hyderabad\'s trusted printing and signage partner since 2009. Serving 500+ clients with premium quality solutions.',
    updated: '2026-08-08T12:00:00Z',
  },
  {
    url: '/contact',
    title: 'Contact Us - Get a Free Quote Today',
    description:
      'Connect with Vijetha Digital for all your printing and signage needs. Located in Patlanthimaus, Hyderabad. Call +91-40-1234-5678.',
    updated: '2026-08-08T12:00:00Z',
  },
];

function generateProductDescription(productName: string): string {
  const descriptions: Record<string, string> = {
    'LED Sign Board': 'Premium LED sign boards for eye-catching business visibility. Energy-efficient and customizable designs.',
    'ACP Cladding Sign': 'Durable ACP cladding signage with modern aesthetics. Weather-resistant and long-lasting.',
    'Acrylic Letter Sign': 'Elegant acrylic letter signage for professional business branding. 3D letters with LED options.',
    'Fascia Sign Board': 'High-visibility fascia sign boards for storefronts. Premium quality materials.',
    'Flex Board Hoarding': 'Large format flex board hoardings for maximum exposure. Outdoor-ready printing.',
    'Pylon Sign': 'Towering pylon signs for highway and commercial visibility. Illuminated options available.',
  };
  
  return descriptions[productName] || `Professional ${productName} solutions from Vijetha Digital. Premium quality printing and signage services in Hyderabad.`;
}

export async function GET() {
  const updated = new Date().toISOString();

  // Generate product entries
  const productEntries = PRODUCTS.map((productName) => {
    const slug = toSlug(productName);
    return `
    <entry>
      <title>${productName} - Vijetha Digital</title>
      <link href="${baseUrl}/products/${slug}" rel="alternate" type="text/html"/>
      <id>${baseUrl}/products/${slug}</id>
      <updated>${updated}</updated>
      <published>${updated}</published>
      <summary type="html">${generateProductDescription(productName)}</summary>
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

  // Generate main page entries
  const mainPageEntries = MAIN_PAGES.map((page) => `
    <entry>
      <title>${page.title}</title>
      <link href="${baseUrl}${page.url}" rel="alternate" type="text/html"/>
      <id>${baseUrl}${page.url}</id>
      <updated>${page.updated}</updated>
      <published>${page.updated}</published>
      <summary type="html">${page.description}</summary>
      <category term="Main"/>
      <author>
        <name>Vijetha Digital</name>
        <email>info@vijethadigital.com</email>
        <uri>${baseUrl}</uri>
      </author>
    </entry>`).join('');

  const atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-IN">
  <title>Vijetha Digital - Printing &amp; Signage Solutions</title>
  <subtitle>Premium printing and signage services in Hyderabad. LED signs, vehicle branding, digital printing, and more. Trusted by 500+ businesses since 2009.</subtitle>
  <link href="${baseUrl}" rel="alternate" type="text/html"/>
  <link href="${baseUrl}/atom.xml" rel="self" type="application/atom+xml"/>
  <id>${baseUrl}/</id>
  <updated>${updated}</updated>
  <rights>Copyright ${new Date().getFullYear()} Vijetha Digital. All rights reserved.</rights>
  <generator uri="https://nextjs.org/" version="14">Next.js</generator>
  <logo>${baseUrl}/logo.png</logo>
  <icon>${baseUrl}/favicon.ico</icon>
  <author>
    <name>Vijetha Digital</name>
    <email>info@vijethadigital.com</email>
    <uri>${baseUrl}</uri>
  </author>
  <category term="Printing"/>
  <category term="Signage"/>
  <category term="Branding"/>
  <category term="Digital Printing"/>
  <category term="Vehicle Branding"/>
  ${mainPageEntries}
  ${productEntries}
</feed>`;

  return new NextResponse(atomFeed, {
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
      'X-Robots-Tag': 'index, follow',
    },
  });
}
