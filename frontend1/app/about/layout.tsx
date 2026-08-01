import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Vijetha Digital',
  description: 'Founded in 2009, Vijetha Digital is Hyderabad s trusted printing and signage partner. 15+ years of craftsmanship, 1,000+ happy clients, world-class machinery.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
