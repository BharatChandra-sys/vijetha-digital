import type { MetadataRoute } from 'next';

const baseUrl = 'https://vijethadigital.com';

export default function sitemap(): MetadataRoute.Sitemap {
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

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : route.includes('/services') || route.includes('/hyderabad') ? 0.9 : 0.8,
  }));
}
