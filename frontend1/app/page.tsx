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
  title: 'More Than B&W | Premium Printing Solutions',
  description:
    'The go-to experts for all your printing needs. Quality prints, beautiful details.',
};

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <Header />

      {/*
        Stack-scroll layout:
        Each section is position:sticky top:0 with increasing z-index.
        As you scroll, each new section slides up and overlays the previous one.
        The spacer divs give the page enough scroll height for each section.
      */}
      <main>
        {/*
          STACK ZONE — Hero + About + Projects all stack over each other.
          Wrapper height = 100vh (Hero) + ~100vh (About) + ~100vh (Projects) = 300vh.
          Once the wrapper ends, Services and Clients scroll normally.
        */}
        <div style={{ position: 'relative', height: '300vh' }}>
          {/* Hero — z-index 1 */}
          <div style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <HeroSection />
          </div>

          {/* About — slides over Hero, z-index 2 */}
          <div style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <AboutSection />
          </div>

          {/* Projects — slides over About, z-index 3 */}
          <div style={{ position: 'sticky', top: 0, zIndex: 3 }}>
            <ProjectsSection />
          </div>
        </div>

        {/* ── NORMAL SCROLL from here ── */}
        <ServicesSection />
        <ClientsSection />
      </main>

      <Footer />
    </>
  );
}
