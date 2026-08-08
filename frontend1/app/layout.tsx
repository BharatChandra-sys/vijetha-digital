import type { Metadata, Viewport } from 'next';
import JsonLd from '@/components/seo/JsonLd';
import './globals.css';

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vijetha Digital',
  url: 'https://vijethadigital.com',
  description:
    'Vijetha Digital provides premium printing, signage, vehicle branding, exhibition displays, and promotional solutions in Hyderabad and across India.',
  publisher: {
    '@type': 'Organization',
    name: 'Vijetha Digital',
    url: 'https://vijethadigital.com',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://vijethadigital.com/#organization',
  name: 'Vijetha Digital',
  legalName: 'Vijetha Digital',
  url: 'https://vijethadigital.com',
  logo: 'https://vijethadigital.com/vd-logo.jpeg',
  image: 'https://vijethadigital.com/vd-logo.jpeg',
  description:
    'Leading printing and signage company in Hyderabad offering LED signage, ACP cladding, acrylic signs, vehicle branding, flex printing, offset printing, exhibition displays, and complete branding solutions.',
  telephone: '+917942643004',
  email: 'info@vijethadigital.com',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'H No. 11-5-456, Shop No. 5, Sanapride Complex',
    addressLocality: 'Lakdikapool',
    addressRegion: 'Hyderabad',
    postalCode: '500004',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 17.385044,
    longitude: 78.486671,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Hyderabad',
    },
    {
      '@type': 'State',
      name: 'Telangana',
    },
    {
      '@type': 'Country',
      name: 'India',
    },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Sunday',
      opens: '10:00',
      closes: '18:00',
    },
  ],
  sameAs: [
    'https://www.facebook.com/vijethadigital',
    'https://www.instagram.com/vijethadigital',
    'https://www.linkedin.com/company/vijetha-digital',
    'https://twitter.com/vijethadigital',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+917942643004',
    contactType: 'Customer Service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi', 'Telugu'],
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Printing and Signage Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Signage Solutions',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'LED Sign Board',
              description: 'Bright LED illuminated boards for 24/7 visibility',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'ACP Cladding Sign',
              description: 'Aluminium composite panel cladding for professional signage',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Acrylic Letter Sign',
              description: 'Precision-cut acrylic 3D lettering for shopfronts',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Vehicle Branding',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Car Wrapping',
              description: 'Full or partial vehicle wraps for cars and SUVs',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Bus Branding',
              description: 'Large-format bus and van branding',
            },
          },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Digital Printing',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Flex Printing',
              description: 'High-resolution flex and vinyl printing',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'UV Printing',
              description: 'UV-cured printing for vibrant output',
            },
          },
        ],
      },
    ],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vijethadigital.com'),
  title: {
    default: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions in Hyderabad',
    template: '%s | Vijetha Digital',
  },
  description:
    'Leading printing, signage and branding company in Hyderabad. We offer LED signage, ACP cladding, vehicle branding, flex printing, offset printing, exhibition displays, and complete branding solutions with world-class quality and fast delivery across India.',
  keywords: [
    'Vijetha Digital',
    'printing services Hyderabad',
    'signage company Hyderabad',
    'vehicle branding Hyderabad',
    'LED sign board',
    'ACP cladding',
    'acrylic signage',
    'digital printing',
    'offset printing',
    'flex printing',
    'banner printing',
    'exhibition displays',
    'branding solutions',
    'retail branding',
    'office branding',
    'vehicle wrap',
    'pylon sign',
    'fascia board',
    'rollup standee',
    'trade show booth',
    'Hyderabad',
    'Telangana',
    'India',
  ],
  authors: [{ name: 'Vijetha Digital', url: 'https://vijethadigital.com' }],
  creator: 'Vijetha Digital',
  publisher: 'Vijetha Digital',
  alternates: {
    canonical: 'https://vijethadigital.com/',
  },
  openGraph: {
    title: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions',
    description:
      'Leading printing, signage and branding company in Hyderabad offering LED signage, vehicle branding, digital printing, and complete branding solutions with world-class quality.',
    url: 'https://vijethadigital.com/',
    siteName: 'Vijetha Digital',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/vd-logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Vijetha Digital - Premium Printing and Signage Solutions',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions',
    description:
      'Leading printing, signage and branding company in Hyderabad offering LED signage, vehicle branding, and complete branding solutions.',
    images: ['/vd-logo.jpeg'],
    creator: '@vijethadigital',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  classification: 'Business',
  category: 'Printing, Signage, Branding',
  other: {
    'theme-color': '#0f0f10',
    'format-detection': 'telephone=no',
    'msapplication-TileColor': '#0f0f10',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'author': 'Vijetha Digital',
    'publisher': 'Vijetha Digital',
    'geo.region': 'IN-TG',
    'geo.placename': 'Hyderabad',
    'geo.position': '17.385044;78.486671',
    'ICBM': '17.385044, 78.486671',
  },
  icons: {
    icon: [
      { url: '/vd-logo.jpeg', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/vd-logo.jpeg',
    apple: [
      { url: '/vd-logo.jpeg', sizes: 'any' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  verification: {
    google: 'google9f42b8a0d05f7d64f',
    yandex: 'yandex-verification',
    other: {
      'bing': 'bing-site-verification',
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f0f10',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
      </body>
    </html>
  );
}
