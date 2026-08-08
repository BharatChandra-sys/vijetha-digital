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
  name: 'Vijetha Digital',
  url: 'https://vijethadigital.com',
  logo: 'https://vijethadigital.com/vd-logo.jpeg',
  description:
    'Vijetha Digital delivers premium printing, signage, vehicle branding, exhibition displays, and promotional solutions in Hyderabad and across India.',
  telephone: '+917942643004',
  email: 'info@vijethadigital.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'H No. 11-5-456, Shop No. 5, Sanapride Complex',
    addressLocality: 'Lakdikapool',
    addressRegion: 'Hyderabad',
    postalCode: '500004',
    addressCountry: 'IN',
  },
  areaServed: ['Hyderabad', 'Telangana', 'India'],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '09:00',
    closes: '20:00',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vijethadigital.com'),
  title: {
    default: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions',
    template: '%s | Vijetha Digital',
  },
  description:
    'Vijetha Digital offers premium printing, signage, vehicle branding, exhibition displays, and promotional solutions with world-class quality and fast delivery.',
  keywords: [
    'printing services Hyderabad',
    'signage company Hyderabad',
    'vehicle branding',
    'digital printing',
    'offset printing',
    'flex printing',
    'banner printing',
    'exhibition displays',
    'branding solutions',
    'Vijetha Digital',
  ],
  alternates: {
    canonical: 'https://vijethadigital.com/',
  },
  openGraph: {
    title: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions',
    description:
      'Premium printing, signage, vehicle branding, and exhibition solutions delivered with precision and quality.',
    url: 'https://vijethadigital.com/',
    siteName: 'Vijetha Digital',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/vd-logo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Vijetha Digital logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions',
    description:
      'Premium printing, signage, vehicle branding, and exhibition solutions delivered with precision and quality.',
    images: ['/vd-logo.jpeg'],
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
    'author': 'Vijetha Digital',
    'publisher': 'Vijetha Digital',
  },
  icons: {
    icon: '/vd-logo.jpeg',
    shortcut: '/vd-logo.jpeg',
    apple: '/vd-logo.jpeg',
  },
  verification: {
    google: 'google9f42b8a0d05f7d64f',
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
