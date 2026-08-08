import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Vijetha Digital | Trusted Printing & Signage Partner in Hyderabad',
  description:
    'Learn about Vijetha Digital, our 15+ years of printing and signage expertise, world-class machinery, and trusted service for businesses across Hyderabad and India.',
  alternates: {
    canonical: 'https://vijethadigital.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
