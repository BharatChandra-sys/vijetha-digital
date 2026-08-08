import type { Metadata } from 'next';
import ServiceLocationPage from '@/components/seo/ServiceLocationPage';

export const metadata: Metadata = {
  title: 'Printing Services in Hyderabad | Banners, Signage & Branding',
  description:
    'Find professional printing services in Hyderabad for banners, signage boards, flex printing, vehicle branding, exhibition displays, and promotional materials.',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-printing-services',
  },
};

export default function HyderabadPrintingServicesPage() {
  return (
    <ServiceLocationPage
      title="Full-service printing partner for businesses, events, retail outlets, and campaigns"
      description="Vijetha Digital delivers high-quality printing services in Hyderabad for banners, signage, vehicle graphics, exhibition boards, and branded promotional materials."
      heroLabel="Location page"
      heroTitle="Printing services in Hyderabad for signage, banners, and branding projects"
      heroIntro="From large-format print to vehicle graphics and retail displays, we deliver dependable print production for businesses that need speed and consistency."
      keyPoints={[
        'Banners, flex boards, posters, and large-format printing',
        'Vehicle wraps, decals, and fleet branding support',
        'Exhibition displays, standees, and event graphics',
        'Scalable production for retail, corporate, and government projects',
      ]}
      serviceAreas={['Hyderabad', 'Secunderabad', 'Telangana', 'Andhra Pradesh', 'India']}
      relatedLinks={[
        { href: '/services/digital-printing', label: 'Digital printing' },
        { href: '/hyderabad-signage-company', label: 'Hyderabad signage company' },
        { href: '/contact', label: 'Contact us' },
      ]}
    />
  );
}
