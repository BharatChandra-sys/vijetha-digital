import type { Metadata } from 'next';
import ServiceLocationPage from '@/components/seo/ServiceLocationPage';

export const metadata: Metadata = {
  title: 'Printing and Signage Services in Hyderabad | Vijetha Digital',
  description:
    'Find premium printing, signage, and branding services in Hyderabad with Vijetha Digital for businesses, events, retail, and government projects.',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-printing-signage',
  },
};

export default function HyderabadPrintingPage() {
  return (
    <ServiceLocationPage
      title="Local printing and signage partner for Hyderabad businesses"
      description="Whether you need a corporate sign board, promotional banner, event display, or vehicle wrap, Vijetha Digital supports businesses across Hyderabad with reliable production and on-time delivery."
      heroLabel="Location page"
      heroTitle="Printing and signage services in Hyderabad"
      heroIntro="We help startups, retail brands, event agencies, hospitals, and corporates in Hyderabad create impactful visuals with durable materials and expert execution."
      keyPoints={[
        'Service coverage across Hyderabad, Secunderabad, and nearby industrial zones',
        'Support for retail branding, office signage, exhibitions, and promotional campaigns',
        'In-house production for faster delivery and better quality control',
        'Trusted by local businesses and large organizations alike',
      ]}
      serviceAreas={['Nacharam', 'Lakdikapool', 'Kukatpally', 'Madhapur', 'Gachibowli', 'HITEC City']}
      relatedLinks={[
        { href: '/services/signage', label: 'Signage solutions' },
        { href: '/services/vehicle-branding', label: 'Vehicle branding' },
        { href: '/contact', label: 'Get a quote' },
      ]}
    />
  );
}
