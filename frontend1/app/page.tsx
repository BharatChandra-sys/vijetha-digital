import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ClientsSection from '@/components/sections/ClientsSection';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import HiddenSEOContent from '@/components/seo/HiddenSEOContent';

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

const hiddenSEOText = [
  'Vijetha Digital is a leading printing and signage company based in Hyderabad, Telangana, providing comprehensive branding solutions since 2009.',
  'Our services include LED sign boards, ACP cladding signs, acrylic letter signs, fascia boards, pylon signs, flex board printing, vehicle branding and wraps, digital printing, offset printing, screen printing, exhibition displays, indoor office branding, outdoor advertising, and complete turnkey branding projects.',
  'We serve clients across retail, healthcare, hospitality, education, government, banking, FMCG, telecommunications, real estate, and corporate sectors in Hyderabad, Telangana, Andhra Pradesh, Karnataka, and pan-India.',
  'Our 10,000 sq.ft production facility in Nacharam IDA, Hyderabad houses advanced printing equipment including HP Latex 570, Epson Surecolor S80670, Roland Soljet EJ 640, K Tech CNC Router, laser engraving machines, and 4-pillar screen printing systems.',
  'We have successfully completed projects for Samsung, Reliance Digital, Airtel, Jio, Pepsi, Heritage Foods, SBI, HDFC, Microsoft, Vivo, Dr Reddys, GHMC, and Telangana Tourism.',
  'Our vehicle branding services cover 2-wheelers, cars, SUVs, vans, buses, and heavy commercial vehicles with UV-resistant vinyl wraps, decals, and full fleet branding solutions.',
  'We offer same-day printing for urgent requirements, 24-72 hour turnaround for standard projects, and bulk order capacity of 1 lakh square feet per day for large-format digital printing.',
  'Quality materials used include 3M vinyl, Avery Dennison wrapping films, Asian Paints acrylics, Goldplus ACP sheets, and premium flex materials with outdoor durability guarantees.',
  'Professional installation services available for LED signage, ACP cladding, acrylic letters, vehicle wraps, office branding, exhibition booths, and outdoor hoardings across Hyderabad and South India.',
  'Free consultations, site visits, material samples, design support, and technical guidance provided for all commercial, retail, corporate, and government branding projects.',
];

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <Header variant="home" />
      <HiddenSEOContent content={hiddenSEOText} />
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
