import { MetadataRoute } from 'next';

const baseUrl = 'https://vijethadigital.com';

const routes = [
  '',
  '/about',
  '/products',
  '/services',
  '/services/signage',
  '/services/vehicle-branding',
  '/services/digital-printing',
  '/projects',
  '/contact',
  '/privacy',
  '/terms',
  '/hyderabad-printing-signage',
  '/hyderabad-printing-services',
  '/hyderabad-signage-company',
  '/hyderabad-vehicle-branding',
];

export async function GET(): Promise<Response> {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map((route) => {
      const url = `${baseUrl}${route}`;
      return `
    <url>
      <loc>${url}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${route === '' ? '1.0' : route.includes('/services') || route.includes('/hyderabad') ? '0.9' : '0.8'}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
