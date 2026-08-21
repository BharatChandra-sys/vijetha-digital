import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import StructuredContent from '@/components/seo/StructuredContent';

import { WA_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Printing & Signage Company in Hyderabad | Vijetha Digital',
  description:
    'Vijetha Digital — trusted printing and signage company in Hyderabad since 2009. LED signs, vehicle branding, flex printing, 3 branches, 10,000 sq.ft facility.',
  keywords:
    'printing signage company Hyderabad, signage Hyderabad, LED sign board Hyderabad, ACP cladding Hyderabad, printing company Hyderabad, commercial printing Hyderabad, vehicle branding Hyderabad, flex printing Hyderabad',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-printing-signage',
  },
  openGraph: {
    title: 'Printing & Signage Company in Hyderabad | Vijetha Digital',
    description: 'Leading printing and signage company in Hyderabad. LED signs, vehicle wraps, flex printing, offset printing, exhibition displays. 3 branches. Fast turnaround.',
    url: 'https://vijethadigital.com/hyderabad-printing-signage',
    type: 'website',
  },
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://vijethadigital.com/hyderabad-printing-signage#webpage',
  url: 'https://vijethadigital.com/hyderabad-printing-signage',
  name: 'Printing & Signage Company in Hyderabad | Vijetha Digital',
  description: 'Leading commercial printing and signage company in Hyderabad since 2009.',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: { '@id': 'https://vijethadigital.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Printing & Signage Hyderabad', item: 'https://vijethadigital.com/hyderabad-printing-signage' },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Which is the best printing and signage company in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital is one of the leading printing and signage companies in Hyderabad, established in 2009. With 15+ years of experience, a 10,000 sq.ft in-house production facility, 7 advanced manufacturing systems, and over 1,000 clients including Samsung, Airtel, SBI, and GHMC, Vijetha Digital delivers premium commercial printing and signage across Hyderabad with 3 branches at Nacharam, Lakdikapool, and Indira Park.',
      },
    },
    {
      '@type': 'Question',
      name: 'What types of signage does Vijetha Digital make in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital manufactures LED sign boards, ACP cladding signs, acrylic letter signs, fascia boards, pylon signs, flex board hoardings, backlit signs, glow signs, and modular signage for retail stores, corporate offices, hospitals, hotels, schools, and government buildings across Hyderabad.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does printing and signage cost in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Printing and signage prices in Hyderabad at Vijetha Digital: Flex printing from Rs 35 per sq.ft, LED sign boards from Rs 15,000, ACP cladding from Rs 18,000, vehicle wraps from Rs 8,000, offset printing from Rs 2 per piece, roll-up standees from Rs 1,500. Contact Vijetha Digital at +91 92481 95552 for a free custom quote within 4-6 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Vijetha Digital deliver signage outside Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. While Vijetha Digital is based in Hyderabad, the company serves clients across Telangana, Andhra Pradesh, Karnataka, Tamil Nadu, and pan-India. Printing is dispatched from the Nacharam production facility. Installation support is available across South India through verified local partners.',
      },
    },
  ],
};

export default function HyderabadPrintingSignagePage() {
  return (
    <>
      <Header />

      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Hyderabad
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '800px' }}>
            Commercial printing and signage company in Hyderabad since 2009.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '720px', lineHeight: '1.7em' }}>
            Vijetha Digital delivers LED sign boards, ACP cladding, acrylic letters, vehicle branding, flex printing, offset printing, and exhibition displays for businesses across Hyderabad from our 10,000 sq.ft production facility in Nacharam IDA.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', marginTop: '32px',
            backgroundColor: '#000', color: '#fff', fontFamily: font,
            fontSize: '14px', padding: '15px 40px', textDecoration: 'none',
          }}>
            Get a Free Quote
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, color: '#000', marginBottom: '48px', maxWidth: '600px' }}>
            Complete printing and signage services in Hyderabad
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { title: 'Signage Solutions', items: ['LED Sign Boards', 'ACP Cladding Signs', 'Acrylic Letter Signs', 'Fascia & Pylon Signs', 'Flex Board Hoardings'] },
              { title: 'Vehicle Branding', items: ['Car & SUV Wraps', 'Van & Bus Branding', '2-Wheeler Graphics', 'Fleet Branding', 'Delivery Vehicle Branding'] },
              { title: 'Digital Printing', items: ['Flex / Vinyl Printing', 'UV Printing', '3D Canvas Print', 'Eco-Solvent Print', 'Large Format Banners'] },
              { title: 'Offset Printing', items: ['Brochures & Catalogs', 'Flyers & Pamphlets', 'Stationery & Packaging', 'Spot UV & Foil Stamping', 'Gift Boxes'] },
              { title: 'Exhibition Displays', items: ['Roll-Up Standees', 'Demo Tents', 'Fabric Light Boxes', 'Trade Show Booths', 'Event Backdrops'] },
              { title: 'Office Branding', items: ['Wall Murals', 'Reception Branding', 'Wayfinding Systems', 'Window Graphics', 'Floor Graphics'] },
            ].map(cat => (
              <div key={cat.title} style={{ backgroundColor: '#f9f9f7', padding: '28px', border: '1px solid #e8e8e4' }}>
                <h3 style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '16px' }}>{cat.title}</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {cat.items.map(item => (
                    <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '2em' }}>— {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, color: '#000', marginBottom: '40px' }}>
            Why businesses in Hyderabad choose Vijetha Digital
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px', maxWidth: '900px' }}>
            {[
              { q: '15+ Years Experience', a: 'Established 2009. Serving Hyderabad businesses for over 15 years with consistent quality and reliability.' },
              { q: 'In-house Production', a: '10,000 sq.ft facility in Nacharam IDA. No outsourcing — complete quality control from design to installation.' },
              { q: 'Same-Day Printing', a: 'Flex banners, standees, and vinyl printing ready same day for urgent requirements across Hyderabad.' },
              { q: '3 Branches in Hyderabad', a: 'Nacharam IDA, Lakdikapool, and Indira Park. Convenient access across central, north, and east Hyderabad.' },
              { q: '1,000+ Clients Served', a: 'Trusted by Samsung, Airtel, SBI, GHMC, Microsoft, Pepsi, and 995+ more organizations across Hyderabad.' },
              { q: 'Premium Materials', a: '3M vinyl, Avery Dennison, Goldplus ACP, Asian Paints acrylics — materials with proven outdoor durability.' },
            ].map(item => (
              <div key={item.q} style={{ backgroundColor: '#fff', padding: '24px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '8px' }}>{item.q}</p>
                <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '1.65em' }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, color: '#000', marginBottom: '36px' }}>
            Printing and signage in Hyderabad — common questions
          </h2>
          <div style={{ display: 'grid', gap: '16px', maxWidth: '860px' }}>
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} style={{ backgroundColor: '#f9f9f7', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{item.name}</p>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
          
          {/* Structured SEO Content */}
          <StructuredContent
            title="Complete Company & Service Coverage Information"
            content={[
              'Vijetha Digital is the leading printing and signage company in Hyderabad, Telangana with 15+ years of experience since 2009.',
              'Printing and signage services in Hyderabad include LED sign boards, ACP cladding, acrylic letters, vehicle branding, flex printing, offset printing, screen printing, UV printing, exhibition displays, and outdoor advertising.',
              'Three Hyderabad branches: Nacharam IDA (main production, 10,000 sq.ft), Lakdikapool Sanapride Complex, and Indira Park near NTR Stadium.',
              'Clients in Hyderabad include Samsung, Reliance Digital, Airtel, Jio, SBI, HDFC, Microsoft, Pepsi, Heritage Foods, Dr Reddys, GHMC, and Telangana Tourism.',
              'Same-day printing available in Hyderabad. LED signage Hyderabad ready in 5-7 days. Vehicle branding Hyderabad 1-2 days per vehicle.',
              'Areas served in Hyderabad: Nacharam, Secunderabad, Kukatpally, Gachibowli, Madhapur, Banjara Hills, Jubilee Hills, Ameerpet, Lakdikapool, Begumpet, Somajiguda, Himayatnagar, Kondapur, Miyapur.',
            ]}
          />
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1c1d20', padding: '72px 0' }}>
        <div className="wix-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.8vw, 40px)', fontWeight: 400, color: '#fff', marginBottom: '16px' }}>
            Get a printing and signage quote in Hyderabad today
          </h2>
          <p style={{ fontFamily: font, fontSize: '15px', color: 'rgba(255,255,255,0.55)', marginBottom: '32px' }}>
            Call or WhatsApp +91 92481 95552. Free quotes within 4-6 hours.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center',
            backgroundColor: '#fff', color: '#000', fontFamily: font,
            fontSize: '14px', padding: '15px 40px', textDecoration: 'none',
          }}>
            WhatsApp for Quote
          </a>
        </div>
      </section>

      <Footer />
      <JsonLd data={pageSchema} />
      <JsonLd data={faqSchema} />

      <style>{`
        @media (max-width: 900px) {
          .wix-container > div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .wix-container > div[style*="grid-template-columns: repeat(3"] ,
          .wix-container > div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
