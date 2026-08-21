import type { MetadataRoute } from 'next';

const baseUrl = 'https://vijethadigital.com';

// Build date for lastModified
const BUILD_DATE = new Date('2026-08-08T12:00:00Z');

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
  { name: 'LED Sign Board', date: '2026-08-01' },
  { name: 'ACP Cladding Sign', date: '2026-08-01' },
  { name: 'Acrylic Letter Sign', date: '2026-08-01' },
  { name: 'Fascia Sign Board', date: '2026-08-01' },
  { name: 'Flex Board Hoarding', date: '2026-08-01' },
  { name: 'Pylon Sign', date: '2026-08-01' },
  // Internal Branding
  { name: 'Office Wall Branding', date: '2026-08-01' },
  { name: 'Reception & Lobby', date: '2026-08-01' },
  { name: 'Retail In-Shop Branding', date: '2026-08-01' },
  { name: 'Hospital Branding', date: '2026-08-01' },
  // Vehicle Branding
  { name: 'Car / 4-Wheeler Wrap', date: '2026-08-01' },
  { name: 'Bus / Van Branding', date: '2026-08-01' },
  { name: '2-Wheeler Branding', date: '2026-08-01' },
  { name: 'Heavy Vehicle Branding', date: '2026-08-01' },
  // Digital Printing
  { name: 'Flex / Vinyl Printing', date: '2026-08-01' },
  { name: 'UV Print', date: '2026-08-01' },
  { name: '3D Canvas Print', date: '2026-08-01' },
  { name: 'Eco-Solvent Print', date: '2026-08-01' },
  // Offset Printing
  { name: 'Brochure / Catalogue', date: '2026-08-01' },
  { name: 'Flyers & Pamphlets', date: '2026-08-01' },
  { name: 'Corporate Stationery', date: '2026-08-01' },
  { name: 'Packaging & Gift Boxes', date: '2026-08-01' },
  // Display & Exhibition
  { name: 'Roll-Up Standee', date: '2026-08-01' },
  { name: 'Demo Tent / Canopy', date: '2026-08-01' },
  { name: 'Fabric Light Box', date: '2026-08-01' },
  { name: 'Trade Show Booth', date: '2026-08-01' },
  // Outdoor Advertising
  { name: 'Flags & Bunting', date: '2026-08-01' },
  { name: 'Backdrop / Stage Banner', date: '2026-08-01' },
  { name: 'Stickers & Decals', date: '2026-08-01' },
  { name: 'Canopy & Tent Branding', date: '2026-08-01' },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Core pages — highest priority
  const coreRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.94,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.92,
    },
  ];

  // Service sub-pages
  const serviceRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/signage`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/services/vehicle-branding`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/services/digital-printing`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.90,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.88,
    },
  ];

  // Local SEO landing pages
  const localSeoRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/hyderabad-printing-signage`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/hyderabad-printing-services`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/hyderabad-signage-company`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/hyderabad-vehicle-branding`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/vijetha-digital`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.92 },
  ];

  // Service + Location SEO routes (redirect to product pages via next.config.ts)
  // These URLs capture location-specific searches and redirect to relevant products
  const serviceLocationRoutes: MetadataRoute.Sitemap = [
    // LED Sign Board locations
    { url: `${baseUrl}/led-sign-board-kukatpally`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/led-sign-board-gachibowli`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/led-sign-board-madhapur`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
    // Vehicle Branding locations
    { url: `${baseUrl}/vehicle-branding-kukatpally`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/vehicle-branding-gachibowli`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
    // Flex Printing locations
    { url: `${baseUrl}/flex-printing-kukatpally`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/flex-printing-nacharam`, lastModified: BUILD_DATE, changeFrequency: 'monthly', priority: 0.85 },
  ];

  // Product pages
  const productRoutes: MetadataRoute.Sitemap = PRODUCTS.map(({ name, date }) => ({
    url: `${baseUrl}/products/${toSlug(name)}`,
    lastModified: new Date(date),
    changeFrequency: 'monthly',
    priority: 0.82,
  }));

  // Utility pages — lower priority
  const utilityRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/sitemap`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: BUILD_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: BUILD_DATE,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [
    ...coreRoutes,
    ...serviceRoutes,
    ...localSeoRoutes,
    ...productRoutes,
    ...utilityRoutes,
  ];
}
