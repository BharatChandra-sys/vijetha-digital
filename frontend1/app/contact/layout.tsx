import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Vijetha Digital | Get a Free Quote | Hyderabad Printing & Signage',
  description:
    'Get free quotes from Vijetha Digital. 3 Hyderabad branches: Nacharam, Indira Park, Lakdikapool. Call +91 92481 95552.',
  keywords:
    'contact Vijetha Digital, printing quote Hyderabad, signage quote Hyderabad, vehicle branding quote, Hyderabad printing company contact, Nacharam printing',
  alternates: {
    canonical: 'https://vijethadigital.com/contact',
  },
  openGraph: {
    title: 'Contact Vijetha Digital | Get a Free Quote | Hyderabad Printing & Signage',
    description: 'Get a free quote for printing and signage in Hyderabad. 3 branches, fast turnaround, professional installation.',
    url: 'https://vijethadigital.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
