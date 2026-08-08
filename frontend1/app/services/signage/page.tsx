import type { Metadata } from 'next';
import ServiceLocationPage from '@/components/seo/ServiceLocationPage';

export const metadata: Metadata = {
  title: 'Signage Company in Hyderabad | Sign Boards, Acrylic & Outdoor Branding',
  description:
    'Hire a trusted signage company in Hyderabad for acrylic letters, ACP cladding, LED sign boards, pylon signage, retail branding, and outdoor sign solutions.',
  alternates: {
    canonical: 'https://vijethadigital.com/services/signage',
  },
};

export default function SignageServicePage() {
  return (
    <ServiceLocationPage
      title="Premium signage solutions for indoor, outdoor, and architectural branding"
      description="Vijetha Digital creates durable sign boards, acrylic lettering, pylon signs, flex boards, and interior branding systems for businesses that want strong visibility in Hyderabad and across Telangana."
      heroLabel="Service page"
      heroTitle="Signage solutions for businesses that want to stand out"
      heroIntro="From office fascia boards to large-format outdoor signage, we deliver high-impact visual branding with durable materials, precision fabrication, and expert installation."
      keyPoints={[
        'Acrylic letters, ACP cladding, LED signage, and pylon boards',
        'Indoor and outdoor branding for retail, hospitals, offices, and public spaces',
        'Custom design, fabrication, installation, and site support',
        'Fast turnaround with in-house production and quality control',
      ]}
      serviceAreas={['Hyderabad', 'Secunderabad', 'Cyberabad', 'Telangana', 'South India']}
      relatedLinks={[
        { href: '/services', label: 'All services' },
        { href: '/services/vehicle-branding', label: 'Vehicle branding' },
        { href: '/services/digital-printing', label: 'Digital printing' },
      ]}
    />
  );
}
