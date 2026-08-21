import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import Script from 'next/script';
import JsonLd from '@/components/seo/JsonLd';
import CookieConsent from '@/components/privacy/CookieConsent';
import './globals.css';

// ─── GA4 MEASUREMENT ID ──────────────────────────────────────────────────────
// Replace with your actual GA4 ID from Google Analytics → Admin → Data Streams
const GA4_ID = 'G-XXXXXXXXXX'; // ← UPDATE THIS with your real GA4 ID

// ─── SITELINKS SEARCH BOX + WEBSITE SCHEMA ───────────────────────────────────
// This is the PRIMARY schema that enables Google sitelinks in search results.
// Google uses this to understand your site hierarchy and show sub-links.
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://vijethadigital.com/#website',
  name: 'Vijetha Digital',
  url: 'https://vijethadigital.com',
  description:
    'Vijetha Digital provides premium printing, signage, vehicle branding, exhibition displays, and promotional solutions in Hyderabad and across India.',
  inLanguage: 'en-IN',
  publisher: {
    '@id': 'https://vijethadigital.com/#organization',
  },
  potentialAction: [
    {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://vijethadigital.com/products?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
    {
      '@type': 'OrderAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://vijethadigital.com/contact',
        actionPlatform: [
          'http://schema.org/DesktopWebPlatform',
          'http://schema.org/MobileWebPlatform',
        ],
      },
      name: 'Request Quote',
      description: 'Get a free quote for printing and signage services',
    },
  ],
  // Enhanced navigation for sitelinks — MUST match exact header nav URLs
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'SiteNavigationElement',
        position: 1,
        name: 'Services',
        description: 'LED signage, vehicle branding, digital printing, offset printing and exhibition solutions in Hyderabad',
        url: 'https://vijethadigital.com/services',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 2,
        name: 'Products',
        description: 'Browse 30+ printing and signage products — LED boards, vehicle wraps, flex printing, standees and more',
        url: 'https://vijethadigital.com/products',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 3,
        name: 'About Us',
        description: '15+ years of printing and signage expertise. 1,000+ clients. 3 branches in Hyderabad.',
        url: 'https://vijethadigital.com/about',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 4,
        name: 'Our Work',
        description: 'Portfolio of printing and branding projects delivered across Hyderabad and South India',
        url: 'https://vijethadigital.com/projects',
      },
      {
        '@type': 'SiteNavigationElement',
        position: 5,
        name: 'Contact Us',
        description: 'Get a free quote from Vijetha Digital — Hyderabad printing and signage company',
        url: 'https://vijethadigital.com/contact',
      },
    ],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'Organization', 'ProfessionalService'],
  '@id': 'https://vijethadigital.com/#organization',
  name: 'Vijetha Digital',
  alternateName: 'Vijetha Digital Printing & Signage',
  legalName: 'Vijetha Digital',
  url: 'https://vijethadigital.com',
  logo: {
    '@type': 'ImageObject',
    url: 'https://vijethadigital.com/vd-logo.jpeg',
    width: 400,
    height: 400,
  },
  image: 'https://vijethadigital.com/vd-logo.jpeg',
  description:
    'Leading printing and signage company in Hyderabad offering LED signage, ACP cladding, acrylic signs, vehicle branding, flex printing, offset printing, exhibition displays, and complete branding solutions.',
  telephone: '+917942643004',
  email: 'info@vijethadigital.com',
  priceRange: '₹₹',
  foundingDate: '2009',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 25 },
  slogan: 'Premium Printing & Signage Solutions',
  // Entity linking for Knowledge Graph - Critical for AI citations
  mentions: [
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q11060274', name: 'Printing' },
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q1052592', name: 'Signage' },
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q1361', name: 'Hyderabad' },
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q1159', name: 'Andhra Pradesh' },
  ],
  about: [
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q11060274', name: 'Commercial Printing Industry' },
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q1052592', name: 'Signage Manufacturing' },
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q329618', name: 'Graphic Design Services' },
  ],
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
    { '@type': 'City', name: 'Hyderabad', '@id': 'https://www.wikidata.org/wiki/Q1361' },
    { '@type': 'City', name: 'Secunderabad' },
    { '@type': 'City', name: 'Nacharam' },
    { '@type': 'City', name: 'Kukatpally' },
    { '@type': 'City', name: 'Gachibowli' },
    { '@type': 'City', name: 'Madhapur' },
    { '@type': 'City', name: 'Banjara Hills' },
    { '@type': 'City', name: 'Jubilee Hills' },
    { '@type': 'City', name: 'Ameerpet' },
    { '@type': 'City', name: 'Lakdikapool' },
    { '@type': 'City', name: 'Warangal' },
    { '@type': 'City', name: 'Nizamabad' },
    { '@type': 'City', name: 'Khammam' },
    { '@type': 'City', name: 'Karimnagar' },
    { '@type': 'City', name: 'Vijayawada' },
    { '@type': 'City', name: 'Visakhapatnam' },
    { '@type': 'City', name: 'Guntur' },
    { '@type': 'City', name: 'Bangalore', '@id': 'https://www.wikidata.org/wiki/Q1355' },
    { '@type': 'City', name: 'Chennai', '@id': 'https://www.wikidata.org/wiki/Q1352' },
    { '@type': 'State', name: 'Telangana', '@id': 'https://www.wikidata.org/wiki/Q677037' },
    { '@type': 'State', name: 'Andhra Pradesh', '@id': 'https://www.wikidata.org/wiki/Q1159' },
    { '@type': 'State', name: 'Karnataka' },
    { '@type': 'State', name: 'Tamil Nadu' },
    { '@type': 'AdministrativeArea', name: 'South India' },
    { '@type': 'Country', name: 'India', '@id': 'https://www.wikidata.org/wiki/Q668' },
  ],
  knowsAbout: [
    'Commercial Printing Hyderabad',
    'LED Sign Boards',
    'ACP Cladding Signage',
    'Acrylic Letter Signs',
    'Vehicle Branding',
    'Vehicle Wrapping',
    'Digital Printing',
    'Offset Printing',
    'Flex Printing',
    'Screen Printing',
    'Exhibition Displays',
    'Trade Show Booths',
    'Corporate Branding',
    'Retail Branding',
    'Indoor Office Branding',
    'Outdoor Advertising',
    'Fascia Sign Board',
    'Pylon Sign',
    'UV Printing',
    'Signage Fabrication',
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
    'https://www.indiamart.com/vijethadigital/',
    'https://www.youtube.com/@vijetha_print_signs',
    'https://www.justdial.com/Hyderabad/Vijetha-Digital',
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+917942643004',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Telugu'],
    },
    {
      '@type': 'ContactPoint',
      telephone: '+919248195552',
      contactType: 'sales',
      contactOption: 'TollFree',
      areaServed: 'IN',
      availableLanguage: ['English', 'Telugu'],
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Commercial Printing and Signage Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Signage Solutions',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'LED Sign Board', description: 'Bright LED illuminated boards for 24/7 visibility' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'ACP Cladding Sign', description: 'Aluminium composite panel cladding for professional signage' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Acrylic Letter Sign', description: 'Precision-cut acrylic 3D lettering for shopfronts' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fascia Sign Board', description: 'Storefront fascia boards for maximum brand visibility' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pylon Sign', description: 'Towering pylon signs for highway and commercial visibility' } },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Vehicle Branding',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car / 4-Wheeler Wrap', description: 'Full or partial vehicle wraps for cars and SUVs' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bus / Van Branding', description: 'Large-format bus and van branding' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '2-Wheeler Branding', description: 'Bike and scooter graphics and decals' } },
        ],
      },
      {
        '@type': 'OfferCatalog',
        name: 'Digital Printing',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Flex / Vinyl Printing', description: 'High-resolution flex and vinyl printing' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'UV Print', description: 'UV-cured printing for vibrant output' } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '3D Canvas Print', description: 'Premium 3D canvas printing for artistic displays' } },
        ],
      },
    ],
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vijethadigital.com'),
  title: {
    default: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions in Hyderabad',
    template: '%s | Vijetha Digital',
  },
  description:
    'Leading printing and signage company in Hyderabad. LED signage, ACP cladding, vehicle branding, flex printing, offset printing, and exhibition displays across India.',
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
    types: {
      'application/rss+xml': [
        { url: 'https://vijethadigital.com/rss.xml', title: 'Vijetha Digital RSS Feed' },
      ],
      'application/atom+xml': [
        { url: 'https://vijethadigital.com/atom.xml', title: 'Vijetha Digital Atom Feed' },
      ],
    },
  },
  openGraph: {
    title: 'Vijetha Digital | Premium Printing, Signage & Branding Solutions',
    description:
      'Leading printing and signage company in Hyderabad offering LED signage, vehicle branding, digital printing, and complete branding solutions.',
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
      'Leading printing and signage company in Hyderabad offering LED signage, vehicle branding, and complete branding solutions.',
    images: ['/vd-logo.jpeg'],
    creator: '@vijethadigital',
    site: '@vijethadigital',
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
  // NOTE: Bing and Google verification done via DNS TXT records + HTML file method
  // — NOT in frontend code. Go to bing.com/webmasters → Add site → choose
  // "XML file" method → upload the file to /public/ folder.
  // Google already verified via google9f42b8a0d05f7d64f.html file in /public/.
  classification: 'Business',
  category: 'Printing, Signage, Branding',
  other: {
    // Browser / PWA
    'theme-color': '#0f0f10',
    'color-scheme': 'light',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Vijetha Digital',
    'application-name': 'Vijetha Digital',
    // Windows / Edge / IE tiles (Bing reads these)
    'msapplication-TileColor': '#0f0f10',
    'msapplication-TileImage': '/vd-logo.jpeg',
    'msapplication-navbutton-color': '#0f0f10',
    'msapplication-starturl': 'https://vijethadigital.com/',
    'msapplication-tooltip': 'Vijetha Digital - Printing & Signage',
    'msapplication-config': '/browserconfig.xml',
    // Authorship
    'author': 'Vijetha Digital',
    'publisher': 'Vijetha Digital',
    'copyright': 'Vijetha Digital',
    // Geo tags — Bing-optimized format (15-20 characters for placename)
    'geo.region': 'IN-TG',
    'geo.placename': 'Hyderabad, India',
    'geo.position': '17.385044;78.486671',
    'ICBM': '17.385044, 78.486671',
    // Content classification signals
    'rating': 'general',
    'distribution': 'global',
    'revisit-after': '7 days',
    'language': 'en-IN',
    'coverage': 'India',
    'target': 'all',
    'audience': 'all',
    'robots': 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    // Mobile optimization
    'HandheldFriendly': 'True',
    'MobileOptimized': '320',
    'viewport': 'width=device-width, initial-scale=1.0',
    // Search engine specific
    'googlebot': 'index, follow, max-image-preview:large',
    'bingbot': 'index, follow',
    'yandex': 'index, follow',
    'slurp': 'index, follow',
    // Business identifiers
    'business:contact_data:street_address': 'H No. 11-5-456, Shop No. 5, Sanapride Complex',
    'business:contact_data:locality': 'Lakdikapool',
    'business:contact_data:region': 'Telangana',
    'business:contact_data:postal_code': '500004',
    'business:contact_data:country_name': 'India',
    'business:contact_data:phone_number': '+917942643004',
    'business:contact_data:website': 'https://vijethadigital.com',
    // Referrer policy for privacy
    'referrer': 'origin-when-cross-origin',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0f0f10',
};

// ─── MULTI-BRANCH LOCAL BUSINESS SCHEMA ─────────────────────────────────────
// Three separate LocalBusiness entities — one per physical branch.
// This signals to Google that each location is a real, distinct place,
// which is critical for map pack visibility and local "near me" queries.
const branchNacharamSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://vijethadigital.com/#branch-nacharam',
  name: 'Vijetha Digital – Nacharam (Main Production)',
  parentOrganization: { '@id': 'https://vijethadigital.com/#organization' },
  url: 'https://vijethadigital.com/contact',
  telephone: '+917942643004',
  email: 'info@vijethadigital.com',
  image: 'https://vijethadigital.com/vd-logo.jpeg',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '42/B, No. 16, IDA, Nacharam',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500076',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 17.4278,
    longitude: 78.5603,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
  ],
  description: 'Vijetha Digital main production facility in Nacharam IDA, Hyderabad. 10,000 sq.ft plant with HP Latex, Epson Surecolor, CNC router and screen printing systems.',
  hasMap: 'https://maps.google.com/?q=Nacharam+IDA+Hyderabad',
};

const branchLakdikaqoolSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://vijethadigital.com/#branch-lakdikapool',
  name: 'Vijetha Digital – Lakdikapool',
  parentOrganization: { '@id': 'https://vijethadigital.com/#organization' },
  url: 'https://vijethadigital.com/contact',
  telephone: '+919248195552',
  email: 'info@vijethadigital.com',
  image: 'https://vijethadigital.com/vd-logo.jpeg',
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
    latitude: 17.3851,
    longitude: 78.4867,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
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
  description: 'Vijetha Digital branch at Lakdikapool, Hyderabad. Signage display, material samples, and project consultation for central Hyderabad clients.',
  hasMap: 'https://maps.google.com/?q=Sanapride+Complex+Lakdikapool+Hyderabad',
};

const branchIndiraParkSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://vijethadigital.com/#branch-indirapark',
  name: 'Vijetha Digital – Indira Park',
  parentOrganization: { '@id': 'https://vijethadigital.com/#organization' },
  url: 'https://vijethadigital.com/contact',
  telephone: '+919248195552',
  email: 'info@vijethadigital.com',
  image: 'https://vijethadigital.com/vd-logo.jpeg',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Shop No. 1-2-607/75, 76, Opp NTR Stadium, LIC Colony Rd',
    addressLocality: 'Hyderabad',
    addressRegion: 'Telangana',
    postalCode: '500029',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 17.4110,
    longitude: 78.4774,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      opens: '09:00',
      closes: '20:00',
    },
  ],
  description: 'Vijetha Digital branch near Indira Park and NTR Stadium, Hyderabad. Signage consultation, material display, and client services.',
  hasMap: 'https://maps.google.com/?q=NTR+Stadium+LIC+Colony+Road+Hyderabad',
};

// ─── REVIEW SCHEMA ────────────────────────────────────────────────────────────
// Individual reviews that reference the organization.
// AggregateRating is ONLY in organizationSchema to avoid "multiple aggregate ratings" GSC error.
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  author: { '@type': 'Person', name: 'Rajesh Kumar' },
  reviewBody: 'Excellent quality LED sign boards. Vijetha Digital delivered our 3-store signage project on time with outstanding finish. Will use again for our next location.',
  datePublished: '2026-06-15',
  publisher: {
    '@type': 'Organization',
    name: 'Vijetha Digital'
  }
};

const reviewSchema2 = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  author: { '@type': 'Person', name: 'Priya Sharma' },
  reviewBody: 'Best vehicle branding company in Hyderabad. Our fleet of 12 vans looks professional and the vinyl is holding up perfectly after 8 months. Highly recommended.',
  datePublished: '2026-05-20',
  publisher: {
    '@type': 'Organization',
    name: 'Vijetha Digital'
  }
};

const reviewSchema3 = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  author: { '@type': 'Person', name: 'Mohammed Asif' },
  reviewBody: 'Used Vijetha Digital for our office branding — reception, walls, and wayfinding. The team was professional, fast, and the quality exceeded our expectations.',
  datePublished: '2026-04-10',
  publisher: {
    '@type': 'Organization',
    name: 'Vijetha Digital'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#">
      <head>
        {/* Preconnect to external domains for faster loading - with crossorigin for fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" />
        
        {/* Preload critical hero image */}
        <link
          rel="preload"
          as="image"
          href="/images/hero-banner-hq.webp"
          type="image/webp"
          fetchPriority="high"
        />
        
        {/* DNS prefetch for third-party resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Alternate language versions for international SEO */}
        <link rel="alternate" hrefLang="en-IN" href="https://vijethadigital.com/" />
        <link rel="alternate" hrefLang="en" href="https://vijethadigital.com/" />
        <link rel="alternate" hrefLang="x-default" href="https://vijethadigital.com/" />
        
        {/* Search engine verification - Add your verification codes */}
        {/* Google Search Console verification already done via HTML file */}
        {/* Bing Webmaster Tools - Add when you get verification code */}
        {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}
        
        {/* Yandex Webmaster verification */}
        {/* <meta name="yandex-verification" content="YOUR_YANDEX_CODE" /> */}
        
        {/* Pinterest verification */}
        {/* <meta name="p:domain_verify" content="YOUR_PINTEREST_CODE" /> */}
        
        {/* Baidu verification */}
        {/* <meta name="baidu-site-verification" content="YOUR_BAIDU_CODE" /> */}
        
        {/* Inline critical CSS for instant render */}
        <style dangerouslySetInnerHTML={{__html: `
          body{margin:0;font-family:helvetica-w01-roman,'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#000;background:#fff}
          .wix-container{width:100%;max-width:1280px;margin:0 auto;padding:0 1.25rem}
          @media(min-width:768px){.wix-container{padding:0 2.5rem}}
        `}} />
      </head>
      <body>
        {/* Google Analytics GA4 — tracks user behavior signals Google uses for sitelinks */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', {
              page_path: window.location.pathname,
              send_page_view: true
            });
          `}
        </Script>

        {children}
        <CookieConsent />
        <Analytics />
        
        {/* Structured data - deferred for performance */}
        <JsonLd data={websiteSchema} />
        <JsonLd data={organizationSchema} />
        <JsonLd data={branchNacharamSchema} />
        <JsonLd data={branchLakdikaqoolSchema} />
        <JsonLd data={branchIndiraParkSchema} />
        <JsonLd data={reviewSchema} />
        <JsonLd data={reviewSchema2} />
        <JsonLd data={reviewSchema3} />
      </body>
    </html>
  );
}
