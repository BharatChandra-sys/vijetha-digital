import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ClientsSection from '@/components/sections/ClientsSection';
import TrustBadges from '@/components/sections/TrustBadges';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import JsonLd from '@/components/seo/JsonLd';
import StickyContactBar from '@/components/conversion/StickyContactBar';
import FloatingWhatsApp from '@/components/conversion/FloatingWhatsApp';

export const metadata: Metadata = {
  title: 'Commercial Printing Hyderabad | Vijetha Digital - Signage & Vehicle Branding',
  description:
    'Leading printing & signage company in Hyderabad. LED Signs, Vehicle Branding, Flex Printing. 1000+ clients, Same-Day Service. Call +91 92481 95552.',
  keywords:
    'commercial printing Hyderabad, Vijetha Digital, printing services Hyderabad, signage company Hyderabad, vehicle branding Hyderabad, LED sign board Hyderabad, flex printing Hyderabad, banner printing, acrylic signage, ACP cladding, exhibition displays, branding solutions Hyderabad, offset printing Hyderabad',
  alternates: {
    canonical: 'https://vijethadigital.com/',
    types: {
      'application/rss+xml': [{ url: 'https://vijethadigital.com/rss.xml', title: 'Vijetha Digital RSS Feed' }],
      'application/atom+xml': [{ url: 'https://vijethadigital.com/atom.xml', title: 'Vijetha Digital Atom Feed' }],
    },
  },
  openGraph: {
    title: 'Vijetha Digital | Printing, Signage & Vehicle Branding in Hyderabad',
    description: 'Leading printing and signage company in Hyderabad since 2009. LED signs, vehicle branding, digital printing, flex printing, offset printing, exhibition displays.',
    url: 'https://vijethadigital.com/',
    type: 'website',
  },
};

// Featured-snippet FAQ — structured to win "What is..." / "How to..." queries
// Each question targets a real search intent for commercial printing Hyderabad
const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What commercial printing services does Vijetha Digital offer in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital offers LED sign boards, ACP cladding signs, acrylic letter signs, vehicle branding, flex printing, offset printing, screen printing, UV printing, exhibition displays, trade show booths, indoor office branding, and outdoor advertising across Hyderabad and South India. The company operates from three branches — Nacharam, Lakdikapool, and Indira Park — with a 10,000 sq.ft production facility.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does commercial printing cost in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Commercial printing costs in Hyderabad vary by product: Flex/vinyl printing starts from Rs 35 per sq.ft, LED sign boards from Rs 15,000 onwards, ACP cladding signs from Rs 18,000, vehicle wraps from Rs 8,000 per vehicle, offset printing brochures from Rs 2 per piece (minimum 500 copies), roll-up standees from Rs 1,500. Vijetha Digital provides free quotes within 4-6 hours. Call +91 92481 95552 or WhatsApp for an accurate estimate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the turnaround time for printing and signage in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital offers same-day printing for flex banners and standees under 500 sq.ft. LED signage takes 5-7 working days. Vehicle wraps take 1-2 days per vehicle. Offset printing (brochures, flyers) takes 3-5 days. ACP cladding and fabricated signs take 7-10 days. Exhibition booth setups take 10-15 days. Rush production is available for urgent requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which is the best signage company in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital is one of Hyderabad\'s leading signage companies, established in 2009, with 15+ years of experience serving 1,000+ clients including Samsung, Reliance Digital, Airtel, Jio, SBI, and Telangana Tourism. The company operates a 10,000 sq.ft in-house production facility in Nacharam IDA with advanced CNC routing, LED fabrication, and large-format printing capabilities. Rated 4.8/5 by clients.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Vijetha Digital provide vehicle branding services in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Vijetha Digital provides comprehensive vehicle branding for 2-wheelers, cars, SUVs, vans, buses, and heavy commercial vehicles in Hyderabad. Services include full wraps, partial wraps, decals, fleet branding, and promotional vehicle graphics using premium 3M and Avery Dennison UV-resistant vinyl. Vehicle wraps are durable for 5-7 years and can be cleanly removed without paint damage.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I get a printing quote from Vijetha Digital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To get a quote from Vijetha Digital, WhatsApp +91 92481 95552 with your requirements — product type, dimensions, quantity, and timeline. Alternatively, call +91 79426 43004 or email info@vijethadigital.com. The team responds within 1-2 hours on WhatsApp and provides detailed quotes within 4-6 hours for standard projects. Site visits are available for large-scale branding and signage projects in Hyderabad.',
      },
    },
  ],
};

// WebPage schema — tells Google exactly what this page is and how it fits the site
// Enhanced with Speakable for voice search and AI citations
const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://vijethadigital.com/#webpage',
  url: 'https://vijethadigital.com/',
  name: 'Vijetha Digital | Printing, Signage & Vehicle Branding in Hyderabad',
  description:
    'Leading printing and signage company in Hyderabad providing LED signs, vehicle branding, digital printing, offset printing, and exhibition displays since 2009.',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: [
    { '@id': 'https://vijethadigital.com/#organization' },
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q11060274', name: 'Printing' },
    { '@type': 'Thing', '@id': 'https://www.wikidata.org/wiki/Q1052592', name: 'Signage' },
  ],
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: 'https://vijethadigital.com/vd-logo.jpeg',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
    ],
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['h1', 'h2', '[data-speakable]'],
    xpath: [
      '/html/head/title',
      '/html/head/meta[@name=\'description\']/@content',
    ],
  },
  mentions: [
    { '@type': 'Brand', '@id': 'https://www.wikidata.org/wiki/Q20716', name: 'Samsung' },
    { '@type': 'Brand', '@id': 'https://www.wikidata.org/wiki/Q2333753', name: 'Reliance Digital' },
    { '@type': 'Brand', '@id': 'https://www.wikidata.org/wiki/Q1420426', name: 'Airtel' },
  ],
};

// ItemList — signals to Google the key sub-sections for sitelinks
const siteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Vijetha Digital Site Navigation',
  description: 'Key pages on Vijetha Digital website',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Services',
      description: 'Signage, vehicle branding, digital printing, offset printing, and display services in Hyderabad',
      url: 'https://vijethadigital.com/services',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Products',
      description: 'Complete catalogue of printing and signage products for businesses',
      url: 'https://vijethadigital.com/products',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'About',
      description: 'About Vijetha Digital — 15+ years of printing and signage expertise in Hyderabad',
      url: 'https://vijethadigital.com/about',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Contact',
      description: 'Get a free quote from Vijetha Digital — Hyderabad printing and signage company',
      url: 'https://vijethadigital.com/contact',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Projects',
      description: 'Completed printing and signage projects by Vijetha Digital',
      url: 'https://vijethadigital.com/projects',
    },
  ],
};




export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <Header variant="home" />
      <main>
        <div style={{ position: 'relative', height: '300vh', isolation: 'isolate' }}>
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
        <div style={{ position: 'relative', zIndex: 10 }}>
          <ServicesSection />
          <TrustBadges />
          <ClientsSection />
        </div>
      </main>
      <Footer />
      <StickyContactBar />
      <FloatingWhatsApp />
      <JsonLd data={homeFaqSchema} />
      <JsonLd data={homePageSchema} />
      <JsonLd data={siteNavigationSchema} />
    </>
  );
}
