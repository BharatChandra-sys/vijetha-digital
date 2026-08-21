import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import StructuredContent from '@/components/seo/StructuredContent';

import { WA_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Signage Company in Hyderabad | LED Signs, ACP Cladding & Acrylic | Vijetha Digital',
  description:
    'Best signage company in Hyderabad. LED sign boards, ACP cladding, acrylic letters, fascia boards, pylon signs. 15+ years, 1,000+ clients, 3 branches.',
  keywords:
    'signage company Hyderabad, LED sign board Hyderabad, ACP cladding Hyderabad, acrylic letter sign Hyderabad, fascia sign Hyderabad, pylon sign Hyderabad, sign board Hyderabad, signage manufacturers Hyderabad, signage fabricators Hyderabad',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-signage-company',
  },
  openGraph: {
    title: 'Signage Company in Hyderabad | LED Signs, ACP Cladding | Vijetha Digital',
    description: 'Best signage company in Hyderabad. LED sign boards, ACP cladding, acrylic letters, fascia boards, pylon signs. 15+ years, 1,000+ clients.',
    url: 'https://vijethadigital.com/hyderabad-signage-company',
    type: 'website',
  },
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://vijethadigital.com/hyderabad-signage-company#webpage',
  url: 'https://vijethadigital.com/hyderabad-signage-company',
  name: 'Signage Company in Hyderabad | Vijetha Digital',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: { '@id': 'https://vijethadigital.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Signage Company Hyderabad', item: 'https://vijethadigital.com/hyderabad-signage-company' },
    ],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Signage Manufacturing and Installation',
  description: 'Professional signage manufacturing in Hyderabad — LED sign boards, ACP cladding, acrylic letters, fascia signs, pylon signs, flex hoardings.',
  provider: { '@id': 'https://vijethadigital.com/#organization' },
  areaServed: [
    { '@type': 'City', name: 'Hyderabad' },
    { '@type': 'State', name: 'Telangana' },
  ],
  offers: {
    '@type': 'Offer',
    price: '15000',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which is the best signage company in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital is consistently rated as one of the best signage companies in Hyderabad. Established in 2009, the company has served 1,000+ clients including Samsung, Airtel, SBI, Microsoft, GHMC, and Telangana Tourism. With a 10,000 sq.ft in-house production facility, CNC routing, LED fabrication, and ACP cladding capabilities, Vijetha Digital delivers premium quality signage with professional installation across Hyderabad.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the cost of LED sign boards in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'LED sign board prices in Hyderabad at Vijetha Digital start from Rs 15,000 for a standard 3x1 feet illuminated sign. Pricing depends on dimensions, LED type (single color, RGB, programmable), frame material (aluminium, stainless steel), acrylic thickness, and installation requirements. Large LED fascia signs for showrooms and corporate buildings range from Rs 50,000 to Rs 5,00,000+. Contact Vijetha Digital for a free quote.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to make a sign board in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard LED sign boards take 5-7 working days at Vijetha Digital Hyderabad. Simple flex boards and vinyl signs can be ready in 2-3 days. ACP cladding and 3D letter signs take 7-10 days. Large pylon signs and building-mounted fascia boards take 10-15 days including structural assessment. Rush production is available for urgent requirements.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of sign boards does Vijetha Digital make in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital Hyderabad manufactures: LED illuminated sign boards, ACP (Aluminium Composite Panel) cladding signs, acrylic 3D letter signs, backlit sign boards, fascia sign boards, pylon signs, flex board hoardings, glow signs, non-lit sign boards, glass film graphics, window displays, and directional/wayfinding signage for retail stores, corporate offices, hospitals, hotels, schools, and government buildings.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Vijetha Digital provide signage installation in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Vijetha Digital provides complete turnkey signage services including design, fabrication, delivery, and professional installation across Hyderabad. The installation team handles wall-mounted signs, pole-mounted signs, fascia boards, LED electrical connections, ACP structural mounting with chemical anchors, and all necessary safety protocols. No need to coordinate separate contractors.',
      },
    },
  ],
};

export default function HyderabadSignageCompanyPage() {
  return (
    <>
      <Header />

      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Signage Company · Hyderabad
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '800px' }}>
            Premium signage company in Hyderabad — LED signs, ACP cladding, and acrylic letters.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '700px', lineHeight: '1.7em' }}>
            Vijetha Digital manufactures and installs all types of signage in Hyderabad — LED sign boards, ACP cladding, acrylic letter signs, fascia boards, pylon signs, and flex hoardings for retail, corporate, hospitality, healthcare, and government clients.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', marginTop: '32px',
            backgroundColor: '#000', color: '#fff', fontFamily: font,
            fontSize: '14px', padding: '15px 40px', textDecoration: 'none',
          }}>
            Get Signage Quote
          </a>
        </div>
      </section>

      {/* Signage types */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '40px' }}>
            Types of signage we make in Hyderabad
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#e8e8e4', border: '1px solid #e8e8e4' }}>
            {[
              { type: 'LED Sign Board', price: 'From Rs 15,000', desc: 'Aluminium frame, acrylic face, LED modules. IP65 weatherproof. 2-year warranty. CNC precision cut. 5-7 day delivery.' },
              { type: 'ACP Cladding Sign', price: 'From Rs 18,000', desc: 'Goldplus 4mm ACP sheets with 3D letter fabrication. Brushed, matte, or glossy finish. 7-10 year durability. 7-10 day delivery.' },
              { type: 'Acrylic Letter Sign', price: 'From Rs 8,000', desc: 'Precision CNC-cut acrylic letters. Backlit or front-lit options. Available in glossy, matte, or custom colors. 5-7 day delivery.' },
              { type: 'Fascia Sign Board', price: 'Custom quote', desc: 'Storefront fascia boards spanning full width. Illuminated or non-lit. Maximum brand visibility from street level.' },
              { type: 'Pylon Sign', price: 'Custom quote', desc: 'Freestanding pylon signs for highway visibility, petrol stations, malls, and commercial complexes. With or without LED.' },
              { type: 'Flex Board Hoarding', price: 'From Rs 35/sq.ft', desc: 'High-resolution flex printing for hoardings, banners, and backdrops. HP Latex 570 quality. Same-day for under 500 sq.ft.' },
            ].map(s => (
              <div key={s.type} style={{ backgroundColor: '#fff', padding: '28px' }}>
                <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '6px' }}>{s.type}</h3>
                <p style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.06em', color: 'rgba(0,0,0,0.5)', marginBottom: '12px', textTransform: 'uppercase' }}>{s.price}</p>
                <p style={{ fontFamily: font, fontSize: '13px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#f7f5ef', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '36px' }}>
            Signage in Hyderabad — common questions
          </h2>
          <div style={{ display: 'grid', gap: '16px', maxWidth: '860px' }}>
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} style={{ backgroundColor: '#fff', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{item.name}</p>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
          
          {/* Structured SEO Content */}
          <StructuredContent
            title="Complete Signage Manufacturing & Installation Details"
            content={[
              'Signage company Hyderabad — Vijetha Digital manufactures and installs LED sign boards, ACP cladding, acrylic letter signs, fascia boards, pylon signs, and flex hoardings in Hyderabad since 2009.',
              'LED sign board Hyderabad: aluminium frame, acrylic face, LED modules, transformer. IP65 weatherproof. 2-year warranty on electronics. CNC precision cut.',
              'ACP cladding Hyderabad: Goldplus ACP sheets 4mm, brushed or glossy finish, aluminium structural frame, 7-10 year outdoor durability.',
              'Signage types Hyderabad: glow signs, non-lit signs, backlit signs, front-lit signs, box signs, channel letters, 3D letters, directory boards, pylon signs.',
              'Signage industries Hyderabad: retail stores, shopping malls, hospitals, hotels, banks, schools, colleges, government buildings, factories, warehouses.',
              'Sign board installation areas Hyderabad: Banjara Hills, Jubilee Hills, Madhapur, Gachibowli, Kondapur, Kukatpally, Nacharam, Secunderabad, Lakdikapool, Ameerpet, Himayatnagar, Somajiguda.',
            ]}
          />
        </div>
      </section>

      <Footer />
      <JsonLd data={pageSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      <style>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          div[style*="grid-template-columns: repeat(3, 1fr)"],
          div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
