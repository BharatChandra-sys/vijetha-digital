import type { Metadata } from 'next';
import ServiceLocationPage from '@/components/seo/ServiceLocationPage';

export const metadata: Metadata = {
  title: 'Vehicle Branding in Hyderabad | Car, Bus, Truck & Fleet Wraps',
  description:
    'Get professional vehicle branding in Hyderabad for cars, buses, trucks, two-wheelers, and fleet vehicles with durable wraps and premium finish.',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-vehicle-branding',
  },
};

export default function HyderabadVehicleBrandingPage() {
  return (
    <ServiceLocationPage
      title="Vehicle branding services for corporate fleets and commercial promotions in Hyderabad"
      description="Vijetha Digital offers high-quality vehicle wraps, decals, and graphics for cars, buses, trucks, two-wheelers, and fleet vehicles across Hyderabad."
      heroLabel="Location page"
      heroTitle="Vehicle branding in Hyderabad for moving advertising that works"
      heroIntro="Turn your vehicles into mobile advertisements with durable wraps, crisp graphics, and installation support designed for daily use and long-term visibility."
      keyPoints={[
        'Full wraps, partial wraps, and decals for vehicles',
        'UV-resistant and weather-ready finishes for outdoor use',
        'Ideal for commercial fleets, delivery vehicles, and promo campaigns',
        'Professional print and installation support in Hyderabad',
      ]}
      serviceAreas={['Hyderabad', 'Secunderabad', 'Telangana', 'Andhra Pradesh', 'India']}
      relatedLinks={[
        { href: '/services/vehicle-branding', label: 'Vehicle branding' },
        { href: '/services/digital-printing', label: 'Digital printing' },
        { href: '/contact', label: 'Get a quote' },
      ]}
    />
  );
}
