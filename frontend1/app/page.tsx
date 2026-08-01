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
  title: 'Vijetha Digital | Professional Printing Services',
  description:
    'Vijetha Digital — your go-to experts for all printing needs. Quality prints, beautiful details. Booklets, cards, flex printing, banners and more.',
  keywords: 'printing services, booklets, flex printing, banner printing, visiting cards, Vijetha Digital',
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
