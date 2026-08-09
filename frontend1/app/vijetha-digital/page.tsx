import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import HiddenSEOContent from '@/components/seo/HiddenSEOContent';
import { WA_URL } from '@/lib/constants';

// Brand entity page — the single authoritative source for "Vijetha Digital" as a named entity.
// This page is what Google's Knowledge Graph crawls to populate the Knowledge Panel.
// Structured as an AboutPage + Organization schema pair for maximum entity clarity.

export const metadata: Metadata = {
  title: 'Vijetha Digital | Commercial Printing & Signage Company Hyderabad',
  description:
    'Vijetha Digital is a premium commercial printing and signage company in Hyderabad, established in 2009 by Krishnam Raju. 15+ years, 1,000+ clients, 3 branches, 10,000 sq.ft production facility. GST: 36AGBPC3175H1ZP.',
  keywords:
    'Vijetha Digital, Vijetha Digital Hyderabad, Vijetha Digital printing, Vijetha Digital signage, Krishnam Raju printing, vijethadigital.com',
  alternates: {
    canonical: 'https://vijethadigital.com/vijetha-digital',
  },
  openGraph: {
    title: 'Vijetha Digital | Commercial Printing & Signage Company Hyderabad',
    description: 'Premium commercial printing and signage company in Hyderabad since 2009. LED signs, vehicle branding, digital printing, 1,000+ clients.',
    url: 'https://vijethadigital.com/vijetha-digital',
    type: 'website',
    images: [{ url: '/vd-logo.jpeg', width: 400, height: 400, alt: 'Vijetha Digital Logo' }],
  },
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

// AboutPage schema — entity declaration for Knowledge Graph
const aboutPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://vijethadigital.com/vijetha-digital#webpage',
  url: 'https://vijethadigital.com/vijetha-digital',
  name: 'About Vijetha Digital',
  description: 'Vijetha Digital is a commercial printing and signage company in Hyderabad, Telangana, established in 2009.',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: { '@id': 'https://vijethadigital.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Vijetha Digital', item: 'https://vijethadigital.com/vijetha-digital' },
    ],
  },
};

// Expanded Organization entity schema — this is what feeds the Knowledge Panel
const entitySchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
  '@id': 'https://vijethadigital.com/#organization',
  name: 'Vijetha Digital',
  alternateName: ['Vijetha Digital Hyderabad', 'Vijetha Print & Signs'],
  legalName: 'Vijetha Digital',
  description: 'Vijetha Digital is a leading commercial printing and signage company in Hyderabad, Telangana, established in 2009 by Krishnam Raju. The company operates a 10,000 sq.ft production facility at Nacharam IDA with 7 advanced manufacturing systems including HP Latex 570, Epson Surecolor S80670, Roland Soljet EJ 640, K Tech CNC Router, laser engraving machines, and industrial screen printers. Services include LED sign boards, ACP cladding, acrylic letters, vehicle branding, flex printing, offset printing, screen printing, exhibition displays, and office branding. Over 1,000 clients served including Samsung, Airtel, Reliance Digital, SBI, HDFC, Microsoft, GHMC, and Telangana Tourism.',
  url: 'https://vijethadigital.com',
  logo: { '@type': 'ImageObject', url: 'https://vijethadigital.com/vd-logo.jpeg', width: 400, height: 400 },
  image: 'https://vijethadigital.com/vd-logo.jpeg',
  foundingDate: '2009',
  founder: { '@type': 'Person', name: 'Krishnam Raju', jobTitle: 'Proprietor', worksFor: { '@id': 'https://vijethadigital.com/#organization' } },
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 25 },
  taxID: '36AGBPC3175H1ZP',
  telephone: '+919248195552',
  email: 'info@vijethadigital.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'H No. 11-5-456, Shop No. 5, Sanapride Complex',
    addressLocality: 'Lakdikapool',
    addressRegion: 'Hyderabad',
    postalCode: '500004',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://www.facebook.com/vijethadigital',
    'https://www.instagram.com/vijethadigital',
    'https://www.linkedin.com/company/vijetha-digital',
    'https://twitter.com/vijethadigital',
    'https://www.indiamart.com/vijethadigital/',
    'https://www.youtube.com/@vijetha_print_signs',
    'https://www.justdial.com/Hyderabad/Vijetha-Digital',
  ],
  knowsAbout: [
    'Commercial Printing', 'Signage Manufacturing', 'LED Sign Boards', 'ACP Cladding',
    'Vehicle Branding', 'Vehicle Wrapping', 'Digital Printing', 'Offset Printing',
    'Flex Printing', 'Screen Printing', 'Exhibition Displays', 'Corporate Branding',
    'Retail Branding', 'Office Branding', 'Outdoor Advertising', 'Trade Show Booths',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '127',
    bestRating: '5',
  },
};

const hiddenContent = [
  'Vijetha Digital — official company information. Vijetha Digital is a commercial printing and signage company in Hyderabad, Telangana, established in 2009.',
  'Founder: Krishnam Raju, Proprietor. GST Number: 36AGBPC3175H1ZP. Registered address: Lakdikapool, Hyderabad 500004.',
  'Production facility: 42/B, No. 16, IDA, Nacharam, Hyderabad 500076. 10,000 sq.ft factory with 7 manufacturing systems.',
  'Services: LED sign boards, ACP cladding signs, acrylic letter signs, vehicle branding, car wraps, bus branding, flex printing, offset printing, screen printing, UV printing, exhibition displays, trade show booths, office branding, outdoor advertising.',
  'Major clients: Samsung, Reliance Digital, Airtel, Jio, Pepsi, Heritage Foods, SBI, HDFC Bank, Microsoft, Vivo, Dr Reddys Laboratories, GHMC, Telangana Tourism Board.',
  'Three branches in Hyderabad: Nacharam IDA (main production), Lakdikapool Sanapride Complex, Indira Park near NTR Stadium.',
  'Website: vijethadigital.com. Phone: +91 92481 95552. Email: info@vijethadigital.com.',
  'Social media: facebook.com/vijethadigital, instagram.com/vijethadigital, linkedin.com/company/vijetha-digital.',
];

export default function VijethaDigitalPage() {
  return (
    <>
      <Header />
      <HiddenSEOContent content={hiddenContent} />

      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Company Profile
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '800px' }}>
            Vijetha Digital — commercial printing and signage company in Hyderabad since 2009.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '720px', lineHeight: '1.7em' }}>
            Vijetha Digital is one of Hyderabad's leading printing and signage manufacturers, delivering LED signs, ACP cladding, vehicle branding, digital printing, offset printing, and exhibition solutions from a 10,000 sq.ft in-house production facility at Nacharam IDA.
          </p>
        </div>
      </section>

      {/* Key Facts */}
      <section style={{ backgroundColor: '#1c1d20', padding: '64px 0' }}>
        <div className="wix-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {[
              { value: '2009', label: 'Founded' },
              { value: '1,000+', label: 'Clients Served' },
              { value: '10,000 sq.ft', label: 'Production Facility' },
              { value: '3', label: 'Branches in Hyderabad' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: fontBold, fontSize: 'clamp(22px, 2.5vw, 34px)', color: '#fff', marginBottom: '6px' }}>{s.value}</p>
                <p style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company details */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
            <div>
              <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '24px' }}>
                About Vijetha Digital
              </h2>
              <div style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p>Established in 2009 by <strong style={{ color: '#000' }}>Krishnam Raju</strong>, Vijetha Digital operates as a sole proprietorship with a clear mandate: deliver industrial-grade printing and signage to businesses across Hyderabad and South India.</p>
                <p>The company's 10,000 sq.ft production facility at Nacharam IDA houses seven specialized manufacturing systems — HP Latex 570, Epson Surecolor S80670, Roland Soljet EJ 640, K Tech 1325 HD CNC Router, laser engraving machines, 4-pillar screen printer, and Graphtec cutting plotter.</p>
                <p>Vijetha Digital has served over 1,000 clients including Samsung, Airtel, Reliance Digital, SBI, Microsoft, GHMC, Telangana Tourism, Pepsi, Dr. Reddy's Laboratories, Heritage Foods, HDFC Bank, Jio, and Vivo.</p>
                <p>GST Registration: <strong style={{ color: '#000' }}>36AGBPC3175H1ZP</strong></p>
              </div>
            </div>
            <div>
              <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '24px' }}>
                Contact information
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {[
                  { label: 'Phone', value: '+91 92481 95552' },
                  { label: 'Email', value: 'info@vijethadigital.com' },
                  { label: 'Website', value: 'vijethadigital.com' },
                  { label: 'Main Branch', value: '42/B, No. 16, IDA Nacharam, Hyderabad 500076' },
                  { label: 'Branch 2', value: 'Sanapride Complex, Lakdikapool, Hyderabad 500004' },
                  { label: 'Branch 3', value: 'Opp NTR Stadium, LIC Colony Rd, Hyderabad 500029' },
                  { label: 'Hours', value: 'Mon–Sat 9 AM–8 PM, Sun 10 AM–6 PM' },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid #f1f0eb' }}>
                    <span style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', minWidth: '100px' }}>{item.label}</span>
                    <span style={{ fontFamily: fontBold, fontSize: '14px', color: '#000' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services quick links — internal linking for PageRank flow */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '72px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(20px, 2.2vw, 30px)', fontWeight: 400, color: '#000', marginBottom: '32px' }}>
            Services by Vijetha Digital
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { name: 'LED Sign Boards Hyderabad', href: '/products/led-sign-board' },
              { name: 'ACP Cladding Signs Hyderabad', href: '/products/acp-cladding-sign' },
              { name: 'Vehicle Branding Hyderabad', href: '/hyderabad-vehicle-branding' },
              { name: 'Flex Printing Hyderabad', href: '/products/flex-vinyl-printing' },
              { name: 'Offset Printing Hyderabad', href: '/hyderabad-printing-services' },
              { name: 'Commercial Printing Hyderabad', href: '/hyderabad-printing-signage' },
              { name: 'Signage Company Hyderabad', href: '/hyderabad-signage-company' },
              { name: 'Exhibition Displays Hyderabad', href: '/products/trade-show-booth' },
              { name: 'Office Branding Hyderabad', href: '/products/office-wall-branding' },
            ].map(link => (
              <a key={link.name} href={link.href} style={{
                display: 'block', backgroundColor: '#fff', padding: '16px 20px',
                fontFamily: font, fontSize: '14px', color: '#000',
                textDecoration: 'none', border: '1px solid #e8e8e4',
              }}>
                {link.name} →
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <JsonLd data={aboutPageSchema} />
      <JsonLd data={entitySchema} />

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 48px !important; }
          div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 540px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"],
          div[style*="grid-template-columns: repeat(3, 1fr)"],
          div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
