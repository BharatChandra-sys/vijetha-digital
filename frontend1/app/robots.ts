import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/private/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/private/', '/_next/', '/admin/'],
      },
    ],
    sitemap: 'https://vijethadigital.com/sitemap.xml',
    host: 'https://vijethadigital.com',
  };
}
