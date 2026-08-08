import type { Metadata } from 'next';

export const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Printing, signage, and vehicle branding services',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Vijetha Digital',
    url: 'https://vijethadigital.com',
    areaServed: ['Hyderabad', 'Secunderabad', 'Telangana', 'India'],
  },
  areaServed: ['Hyderabad', 'Secunderabad', 'Telangana', 'India'],
  availableChannel: {
    '@type': 'ServiceChannel',
    serviceUrl: 'https://vijethadigital.com/contact',
  },
};

export const servicePageMetadata = (title: string, description: string, canonical: string): Metadata => ({
  title,
  description,
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
});
