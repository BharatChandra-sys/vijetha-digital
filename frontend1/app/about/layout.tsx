import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Vijetha Digital | Trusted Printing & Signage Partner in Hyderabad Since 2009',
  description:
    'Learn about Vijetha Digital — 15+ years of printing and signage expertise in Hyderabad. World-class machinery, 500+ clients, 3 branches, and trusted service for businesses across Telangana and South India.',
  keywords:
    'about Vijetha Digital, printing company Hyderabad, signage company Hyderabad, Krishnam Raju, Hyderabad branding company, printing manufacturer Hyderabad, signage manufacturer Telangana',
  alternates: {
    canonical: 'https://vijethadigital.com/about',
  },
  openGraph: {
    title: 'About Vijetha Digital | Trusted Printing & Signage Partner in Hyderabad',
    description: '15+ years of printing and signage expertise in Hyderabad. World-class machinery, 500+ clients, 3 branches across Hyderabad.',
    url: 'https://vijethadigital.com/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
