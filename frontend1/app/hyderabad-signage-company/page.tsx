import type { Metadata } from 'next';
import ServiceLocationPage from '@/components/seo/ServiceLocationPage';

export const metadata: Metadata = {
  title: 'Signage Company in Hyderabad | Indoor & Outdoor Sign Boards',
  description:
    'Find a trusted signage company in Hyderabad for indoor signage, outdoor boards, acrylic letters, LED sign boards, and architectural branding.',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-signage-company',
  },
};

export default function HyderabadSignageCompanyPage() {
  return (
    <ServiceLocationPage
      title="Local signage partner for retail stores, offices, hospitals, malls, and public-facing brands"
      description="Vijetha Digital helps businesses in Hyderabad find durable, high-impact signage solutions for stores, offices, healthcare facilities, malls, and outdoor spaces."
      heroLabel="Location page"
      heroTitle="Hyderabad signage company for indoor and outdoor brand visibility"
      heroIntro="From acrylic letters and ACP cladding to LED sign boards and pylon signage, we support businesses across Hyderabad with premium fabrication and installation."
      keyPoints={[
        'Retail sign boards, office signage, and wayfinding systems',
        'Acrylic letters, ACP cladding, LED boards, and pylon signs',
        'Durable materials for indoor and outdoor installation',
        'Fast production support for new launches and store branding',
      ]}
      serviceAreas={['Hyderabad', 'Secunderabad', 'Cyberabad', 'Telangana', 'South India']}
      relatedLinks={[
        { href: '/services/signage', label: 'Signage solutions' },
        { href: '/hyderabad-printing-signage', label: 'Hyderabad printing signage' },
        { href: '/contact', label: 'Contact us' },
      ]}
    />
  );
}
