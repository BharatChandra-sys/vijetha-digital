import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Vijetha Digital | Printing, Signage & Vehicle Branding in Hyderabad',
  description:
    'Contact Vijetha Digital for signage boards, vehicle branding, digital printing, flex printing, exhibition displays, and corporate branding in Hyderabad.',
  alternates: {
    canonical: 'https://vijethadigital.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
