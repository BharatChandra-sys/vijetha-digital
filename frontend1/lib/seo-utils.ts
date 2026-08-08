/**
 * SEO Utilities for Vijetha Digital
 * Helper functions for generating SEO metadata across the site
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export const BASE_URL = 'https://vijethadigital.com';
export const SITE_NAME = 'Vijetha Digital';
export const DEFAULT_OG_IMAGE = '/vd-logo.jpeg';

/**
 * Generate complete metadata for a page
 */
export function generateMetadata(config: SEOConfig) {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = DEFAULT_OG_IMAGE,
    noindex = false,
  } = config;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    keywords: keywords.join(', '),
    alternates: {
      canonical: canonical ? `${BASE_URL}${canonical}` : undefined,
    },
    openGraph: {
      title,
      description,
      url: canonical ? `${BASE_URL}${canonical}` : undefined,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
  };
}

/**
 * Generate breadcrumb schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate product schema
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: string;
  category: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price.replace(/[^0-9.]/g, ''),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
    image: product.image ? `${BASE_URL}${product.image}` : DEFAULT_OG_IMAGE,
  };
}

/**
 * Generate FAQ schema
 */
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate service schema
 */
export function generateServiceSchema(service: {
  name: string;
  description: string;
  areaServed?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: {
      '@type': 'LocalBusiness',
      name: SITE_NAME,
      url: BASE_URL,
    },
    areaServed: service.areaServed || 'Hyderabad, India',
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: BASE_URL,
    },
  };
}

/**
 * Common keywords for the site
 */
export const COMMON_KEYWORDS = [
  'Vijetha Digital',
  'printing services',
  'signage company',
  'Hyderabad',
  'vehicle branding',
  'digital printing',
  'offset printing',
  'exhibition displays',
  'branding solutions',
];
