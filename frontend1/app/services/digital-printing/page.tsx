import type { Metadata } from 'next';
import ServiceLocationPage from '@/components/seo/ServiceLocationPage';

export const metadata: Metadata = {
  title: 'Digital Printing Services in Hyderabad | Banners, Vinyl & Posters',
  description:
    'Reliable digital printing in Hyderabad for banners, vinyl graphics, posters, canvas prints, exhibition panels, and promotional materials with sharp colour and fast turnaround.',
  alternates: {
    canonical: 'https://vijethadigital.com/services/digital-printing',
  },
};

export default function DigitalPrintingPage() {
  return (
    <ServiceLocationPage
      title="High-quality digital printing for campaigns, events, and retail displays"
      description="Vijetha Digital provides large-format digital printing for banners, posters, vinyl graphics, exhibition panels, and point-of-sale materials with excellent colour consistency for Hyderabad businesses."
      heroLabel="Service page"
      heroTitle="Digital printing services with sharp output and fast delivery"
      heroIntro="We combine modern wide-format printers and careful production workflows to deliver professional results for events, retail launches, outdoor campaigns, and high-volume printing needs."
      keyPoints={[
        'Flex, vinyl, canvas, and UV print options',
        'High-resolution output for indoor and outdoor applications',
        'Support for event signage, retail graphics, and marketing campaigns',
        'Scalable production for both small orders and large rollouts',
      ]}
      serviceAreas={['Hyderabad', 'Secunderabad', 'Telangana', 'Andhra Pradesh', 'India']}
      relatedLinks={[
        { href: '/services/vehicle-branding', label: 'Vehicle branding' },
        { href: '/services/signage', label: 'Signage solutions' },
        { href: '/contact', label: 'Contact us' },
      ]}
    />
  );
}
