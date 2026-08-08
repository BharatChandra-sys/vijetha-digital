import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ClientsSection from '@/components/sections/ClientsSection';
import ScrollAnimations from '@/components/ui/ScrollAnimations';

export const metadata: Metadata = {
  title: 'Printing, Signage & Vehicle Branding in Hyderabad | Vijetha Digital',
  description:
    'Vijetha Digital is a trusted printing and signage company in Hyderabad offering sign boards, acrylic signage, vehicle branding, digital printing, banners, exhibition displays, and promotional solutions for businesses across India.',
  keywords:
    'Vijetha Digital, printing services Hyderabad, signage company Hyderabad, vehicle branding Hyderabad, flex printing, banner printing, acrylic signage, exhibition displays, branding solutions',
  alternates: {
    canonical: 'https://vijethadigital.com/',
  },
};

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <Header variant="home" />
      <main>
        {/*
          Stack scroll zone: Hero → About → Projects each slide over the previous.
          The wrapper height drives scroll travel for each sticky section.
          Each non-hero section is ~600–700px so we give 100vh per section.
          No extra whitespace because sections are min-height not 100vh.
        */}
        <div style={{ position: 'relative', height: '300vh' }}>
          <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <HeroSection />
          </div>
          <div style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <AboutSection />
          </div>
          <div style={{ position: 'sticky', top: 0, zIndex: 3 }}>
            <ProjectsSection />
          </div>
        </div>

        {/* Normal scroll */}
        <ServicesSection />
        <ClientsSection />
      </main>
      <Footer />
    </>
  );
}
