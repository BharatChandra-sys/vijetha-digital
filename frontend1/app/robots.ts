import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Googlebot - Full access with specific crawl directives
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/_next/static/',
          '/admin/',
          '/_next/image',
          '/checkout/',
          '/cart/',
          '/*?*',  // Disallow query parameters
        ],
        crawlDelay: 0,
      },
      // Googlebot-Image - Image crawling
      {
        userAgent: 'Googlebot-Image',
        allow: '/',
        disallow: ['/private/', '/admin/'],
      },
      // Google StoreBot - Product pages
      {
        userAgent: 'Storebot-Google',
        allow: ['/products/', '/services/'],
        disallow: ['/*?*'],
      },
      // Bingbot - Microsoft search
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/_next/static/',
          '/admin/',
          '/_next/image',
        ],
        crawlDelay: 0,
      },
      // AI Crawlers - Strategic access
      {
        userAgent: 'GPTBot',
        allow: ['/about', '/services/', '/products/', '/contact'],
        disallow: ['/*'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/about', '/services/', '/products/', '/contact'],
        disallow: ['/*'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/api/', '/private/', '/admin/'],
      },
      {
        userAgent: 'anthropic-ai',
        allow: ['/about', '/services/', '/products/', '/contact'],
        disallow: ['/*'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/about', '/services/', '/products/', '/contact'],
        disallow: ['/*'],
      },
      // Prevent aggressive crawlers
      {
        userAgent: [
          'SemrushBot',
          'AhrefsBot',
          'DotBot',
          'MJ12bot',
          'BLEXBot',
        ],
        disallow: '/',
        crawlDelay: 10,
      },
      // Default rule - All other bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/private/',
          '/_next/static/',
          '/admin/',
          '/_next/image',
        ],
        crawlDelay: 1,
      },
    ],
    sitemap: [
      'https://vijethadigital.com/sitemap.xml',
      'https://vijethadigital.com/rss.xml',
      'https://vijethadigital.com/atom.xml',
    ],
  };
}
