import type { MetadataRoute } from 'next';

const baseUrl = 'https://vijethadigital.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { route: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { route: '/about', priority: 0.96, changeFrequency: 'monthly' as const },
    { route: '/services', priority: 0.96, changeFrequency: 'weekly' as const },
    { route: '/services/signage', priority: 0.92, changeFrequency: 'monthly' as const },
    { route: '/services/vehicle-branding', priority: 0.92, changeFrequency: 'monthly' as const },
    { route: '/services/digital-printing', priority: 0.92, changeFrequency: 'monthly' as const },
    { route: '/products', priority: 0.9, changeFrequency: 'weekly' as const },
    { route: '/projects', priority: 0.9, changeFrequency: 'monthly' as const },
    { route: '/contact', priority: 0.95, changeFrequency: 'weekly' as const },
    { route: '/hyderabad-printing-signage', priority: 0.9, changeFrequency: 'monthly' as const },
    { route: '/hyderabad-printing-services', priority: 0.9, changeFrequency: 'monthly' as const },
    { route: '/hyderabad-signage-company', priority: 0.9, changeFrequency: 'monthly' as const },
    { route: '/hyderabad-vehicle-branding', priority: 0.9, changeFrequency: 'monthly' as const },
  ];

  return routes.map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
