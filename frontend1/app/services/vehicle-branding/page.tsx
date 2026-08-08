import type { Metadata } from 'next';
import ServiceLocationPage from '@/components/seo/ServiceLocationPage';

export const metadata: Metadata = {
  title: 'Vehicle Branding in Hyderabad | Car, Bus, Truck & Fleet Wraps',
  description:
    'Professional vehicle branding in Hyderabad for cars, buses, trucks, two-wheelers, and fleet vehicles with UV-resistant wraps, premium finish, and durable graphics.',
  alternates: {
    canonical: 'https://vijethadigital.com/services/vehicle-branding',
  },
};

export default function VehicleBrandingPage() {
  return (
    <ServiceLocationPage
      title="Moving advertisements that turn vehicles into high-visibility brand assets"
      description="From two-wheelers to commercial fleets, Vijetha Digital offers vehicle wraps, decals, and vinyl graphics that keep your brand visible in Hyderabad, Secunderabad, and across Telangana."
      heroLabel="Service page"
      heroTitle="Vehicle branding that keeps your brand moving"
      heroIntro="Our vehicle branding solutions are designed for durability, crisp visuals, and long-term outdoor performance for corporate fleets, delivery vehicles, and promotional transport."
      keyPoints={[
        'Full vehicle wraps, partial wraps, and decals for cars and fleets',
        'UV-resistant lamination for long-term outdoor durability',
        'High-resolution print and precision installation',
        'Ideal for delivery fleets, corporate cars, and promotional campaigns',
      ]}
      serviceAreas={['Hyderabad', 'Secunderabad', 'Vijayawada', 'Visakhapatnam', 'Pan India']}
      relatedLinks={[
        { href: '/services/signage', label: 'Signage solutions' },
        { href: '/services/digital-printing', label: 'Digital printing' },
        { href: '/hyderabad-printing-signage', label: 'Hyderabad printing services' },
      ]}
    />
  );
}
