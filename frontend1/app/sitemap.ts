import type { MetadataRoute } from 'next';

const baseUrl = 'https://vijethadigital.com';

// Helper to convert product name to slug
const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

// All products for dynamic sitemap generation
const PRODUCTS = [
  // Signage Solutions
  'LED Sign Board', 'ACP Cladding Sign', 'Acrylic Letter Sign', 'Fascia Sign Board', 'Flex Board Hoarding', 'Pylon Sign',
  // Internal Branding
  'Office Wall Branding', 'Reception & Lobby', 'Retail In-Shop Branding', 'Hospital Branding',
  // Vehicle Branding
  'Car / 4-Wheeler Wrap', 'Bus / Van Branding', '2-Wheeler Branding', 'Heavy Vehicle Branding',
  // Digital Printing
  'Flex / Vinyl Printing', 'UV Print', '3D Canvas Print', 'Eco-Solvent Print',
  // Offset Printing
  'Brochure / Catalogue', 'Flyers & Pamphlets', 'Corporate Stationery', 'Packaging & Gift Boxes',
  // Display & Exhibition
  'Roll-Up Standee', 'Demo Tent / Canopy', 'Fabric Light Box', 'Trade Show Booth',
  // Outdoor Advertising
  'Flags & Bunting', 'Backdrop / Stage Banner', 'Stickers & Decals', 'Canopy & Tent Branding',
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Main static routes
  const routes = [
    { route: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { route: '/about', priority: 0.96, changeFrequency: 'monthly' as const },
    { route: '/services', priority: 0.96, changeFrequency: 'weekly' as const },
    { route: '/services/signage', priority: 0.92, changeFrequency: 'monthly' as const },
    { route: '/services/vehicle-branding', priority: 0.92, changeFrequency: 'monthly' as const },
    { route: '/services/digital-printing', priority: 0.92, changeFrequency: 'monthly' as const },
    { route: '/products', priority: 0.94, changeFrequency: 'weekly' as const },
    { route: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/contact', priority: 0.95, changeFrequency: 'weekly' as const },
    { route: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { route: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
    { route: '/sitemap', priority: 0.4, changeFrequency: 'monthly' as const },
    // SEO landing pages
    { route: '/hyderabad-printing-signage', priority: 0.88, changeFrequency: 'monthly' as const },
    { route: '/hyderabad-printing-services', priority: 0.88, changeFrequency: 'monthly' as const },
    { route: '/hyderabad-signage-company', priority: 0.88, changeFrequency: 'monthly' as const },
    { route: '/hyderabad-vehicle-branding', priority: 0.88, changeFrequency: 'monthly' as const },
  ];

  // Generate product page URLs
  const productRoutes = PRODUCTS.map((productName) => ({
    route: `/products/${toSlug(productName)}`,
    priority: 0.85,
    changeFrequency: 'monthly' as const,
  }));

  // Combine all routes
  const allRoutes = [...routes, ...productRoutes];

  return allRoutes.map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
