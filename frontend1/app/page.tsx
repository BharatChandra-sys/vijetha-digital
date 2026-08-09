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
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Commercial Printing Hyderabad | Vijetha Digital - Signage & Vehicle Branding',
  description:
    'Vijetha Digital is a leading commercial printing and signage company in Hyderabad, Telangana, providing comprehensive branding solutions since 2009. Serving 500+ clients with LED signs, vehicle branding, flex printing, offset printing, and exhibition displays across South India.',
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
const homePageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://vijethadigital.com/#webpage',
  url: 'https://vijethadigital.com/',
  name: 'Vijetha Digital | Printing, Signage & Vehicle Branding in Hyderabad',
  description:
    'Leading printing and signage company in Hyderabad providing LED signs, vehicle branding, digital printing, offset printing, and exhibition displays since 2009.',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: { '@id': 'https://vijethadigital.com/#organization' },
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
    cssSelector: ['h1', 'h2'],
  },
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

const hiddenSEOText = [
  'Vijetha Digital is a leading commercial printing and signage company based in Hyderabad, Telangana, providing comprehensive branding solutions since 2009. Proprietor: Krishnam Raju. GST: 36AGBPC3175H1ZP.',
  'Commercial printing services Hyderabad: LED sign boards, ACP cladding signs, acrylic letter signs, fascia boards, pylon signs, flex board printing, vehicle branding and wraps, digital printing, offset printing, screen printing, UV printing, exhibition displays, indoor office branding, outdoor advertising, and complete turnkey branding projects.',
  'What makes Vijetha Digital the best signage company in Hyderabad: 15+ years experience, in-house 10,000 sq.ft production, advanced HP Latex 570 and Epson Surecolor machines, 1 lakh sq.ft per day capacity, same-day printing available, 1000+ clients served, 85% client retention rate.',
  'How much does signage cost in Hyderabad: LED sign boards from Rs 15,000, ACP cladding signs from Rs 18,000, vehicle wraps from Rs 8,000, flex printing from Rs 35 per sq.ft, offset printing brochures from Rs 2 per piece, roll-up standees from Rs 1,500.',
  'Vehicle branding Hyderabad: 2-wheelers, cars, SUVs, vans, buses, and heavy commercial vehicles with 3M and Avery Dennison UV-resistant vinyl wraps. Wraps last 5-7 years, clean removal without paint damage.',
  'Signage types available: LED illuminated sign boards, ACP aluminium composite cladding, acrylic letter signs, backlit signs, fascia signs, pylon signs, hoarding boards, glow signs, non-lit signs, outdoor billboards.',
  'We serve clients across retail, healthcare, hospitality, education, government, banking, FMCG, telecommunications, real estate, and corporate sectors in Hyderabad, Telangana, Andhra Pradesh, Karnataka, and pan-India.',
  'Our production facility at Nacharam IDA Hyderabad houses: HP Latex 570, Epson Surecolor S80670, Roland Soljet EJ 640, K Tech 1325 HD CNC Router, laser engraving machines, 4-pillar screen printing system, and Graphtec cutting plotter.',
  'Clients served: Samsung, Reliance Digital, Airtel, Jio, Pepsi, Heritage Foods, SBI, HDFC, Microsoft, Vivo, Dr Reddys, GHMC, and Telangana Tourism.',
  'How long does printing take at Vijetha Digital: same-day for flex under 500 sq.ft, LED signage 5-7 days, vehicle wraps 1-2 days, offset printing 3-5 days, ACP cladding 7-10 days, exhibition booths 10-15 days.',
  'Three branches in Hyderabad: Nacharam IDA (main production), Indira Park near NTR Stadium, Lakdikapool Sanapride Complex. Open Monday to Saturday 9am to 8pm.',
  'Printing materials used: 3M vinyl, Avery Dennison wrapping films, Asian Paints acrylics, Goldplus ACP sheets, premium flex with outdoor durability guarantees up to 10 years.',
];

export default function Home() {
  return (
    <>
      <ScrollAnimations />
      <Header variant="home" />
      <HiddenSEOContent content={hiddenSEOText} />
      <main>
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
        <ServicesSection />
        <ClientsSection />
      </main>
      <Footer />
      <JsonLd data={homeFaqSchema} />
      <JsonLd data={homePageSchema} />
      <JsonLd data={siteNavigationSchema} />
    </>
  );
}
