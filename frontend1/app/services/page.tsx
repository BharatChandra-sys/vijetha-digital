import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import JsonLd from '@/components/seo/JsonLd';
import StructuredContent from '@/components/seo/StructuredContent';
import FaqAccordion from '@/components/sections/FaqAccordion';

import { WA_URL } from '@/lib/constants';
import { serviceFaqContent } from './faq';
import { printingProcessSchemas } from '@/lib/howto-schemas';

export const metadata: Metadata = {
  title: 'Printing & Signage Services in Hyderabad | Vijetha Digital',
  description:
    'Vijetha Digital offers LED signage, ACP cladding, vehicle branding, digital printing, offset printing, screen printing and exhibition displays in Hyderabad.',
  alternates: {
    canonical: 'https://vijethadigital.com/services',
  },
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const services = [
  {
    id: '01',
    title: 'Signage Solutions',
    description:
      'From commanding fascia signs to precision-cut acrylic lettering, our signage solutions are engineered to make your brand impossible to ignore. Industry-leading materials and latest fabrication technology on every project.',
    specs: ['LED & ACP Cladding', 'Acrylic Letters & Back Lit', 'Billboard, Fascia & Pylon', 'Flex Board, Glass Film & Modular'],
  },
  {
    id: '02',
    title: 'Internal Branding',
    description:
      'We transform interiors into immersive brand experiences. Every wall, column, window and surface becomes a canvas — for offices, showrooms, hospitals, malls and retail spaces.',
    specs: ['Wall murals & feature walls', 'Reception & lobby branding', 'Wayfinding & directional systems', 'Window graphics & frosting'],
  },
  {
    id: '03',
    title: 'Vehicle Branding',
    description:
      'Turn your fleet into a moving media channel. Our vehicle wraps deliver maximum visibility across city streets and highways — from 2-wheelers to heavy transport, rain or shine.',
    specs: ['2-wheeler to heavy transport', 'UV-resistant lamination', 'Design & visualisation mockup', 'Nationwide fleet support'],
  },
  {
    id: '04',
    title: 'Digital Printing',
    description:
      'Powered by HP Latex 570 and Epson Surecolor machines, our digital printing delivers stunning colour accuracy at any scale. From single banners to 1 lakh sq.ft runs — done entirely in-house.',
    specs: ['Flex, Vinyl, Canvas, UV Print', '3D Printing & Eco-solvent', 'HP Latex 570 · Epson Surecolor', '1 Lakh+ sq.ft/day capacity'],
  },
  {
    id: '05',
    title: 'Offset Printing',
    description:
      'Premium offset printing for all corporate and marketing collateral. Crisp, consistent, crafted to reflect your brand quality — from a 1,000-copy brochure to a luxury invitation set.',
    specs: ['Books, Flyers, Brochures, Catalogues', 'Stationery, Packaging & Gift Boxes', 'Spot UV, Foil stamping, Die-cutting', 'High-volume bulk runs'],
  },
  {
    id: '06',
    title: 'Screen Printing',
    description:
      'Our 4-pillar screen printing machine delivers bold, durable prints on a wide range of substrates — perfect for regulatory signage, promotional boards and everything in between.',
    specs: ['No Parking & Regulatory Boards', 'Pole Hanging & Flute Board', 'UV Print & 3D Print', 'Municipal & government boards'],
  },
  {
    id: '07',
    title: 'Display & Exhibition',
    description:
      'Make every event a brand showcase. From portable standees to large-scale trade show booths — display solutions that command attention and drive engagement at every venue.',
    specs: ['Standees, Demo Tents & Umbrellas', 'Fabric Light Boxes & Canvas Frames', 'Trade Show & Name Plates', 'Easel Stands & Exhibition Booths'],
  },
  {
    id: '08',
    title: 'Outdoor Advertising',
    description:
      'Dominate the outdoor landscape with materials engineered for maximum impact and weather resistance. Your brand owns the space — rain or shine, day or night.',
    specs: ['Flags, Backdrops & Canopies', 'Stickers, Decals & Tents', 'Posters & Table Covers', 'Pan South India coverage'],
  },
];

export default function ServicesPage() {
  const servicesFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: serviceFaqContent.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <ScrollAnimations />
      <Header />

      {/* Page hero */}
      <section style={{
        backgroundColor: '#f1f0eb',
        paddingTop: '140px',
        paddingBottom: '72px',
        width: '100%',
      }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Our Capabilities
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '760px' }}>
            Printing, signage, vehicle branding, and exhibition solutions for modern businesses.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '720px', lineHeight: '1.7em' }}>
            Vijetha Digital delivers signage solutions, digital printing, vehicle branding, offset printing, screen printing, and display services for retail, corporate, hospitality, healthcare, and government projects.
          </p>
          <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <a href="/services/signage" style={{ fontFamily: font, fontSize: '14px', color: '#000', textDecoration: 'underline' }}>Signage solutions</a>
            <a href="/services/vehicle-branding" style={{ fontFamily: font, fontSize: '14px', color: '#000', textDecoration: 'underline' }}>Vehicle branding</a>
            <a href="/services/digital-printing" style={{ fontFamily: font, fontSize: '14px', color: '#000', textDecoration: 'underline' }}>Digital printing</a>
          </div>
        </div>
      </section>

      {/* Services list */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
        <div className="wix-container">
          <div style={{ marginBottom: '40px', maxWidth: '860px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '10px' }}>
              Why businesses choose us
            </p>
            <p style={{ fontFamily: font, fontSize: '16px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
              Our team combines in-house manufacturing, modern machinery, and a production-first approach to deliver reliable signage, branding, and print solutions for projects of every scale.
            </p>
          </div>
          <div className="services-list">
            {services.map((s, i) => (
              <div
                key={s.id}
                className="wix-motion wix-fade-up"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px minmax(0, 1fr) minmax(260px, 340px)',
                  gap: '48px',
                  padding: '48px 0',
                  borderTop: '1px solid #e8e8e4',
                  alignItems: 'start',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {/* Number */}
                <p style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)', paddingTop: '4px' }}>
                  {s.id}
                </p>
                {/* Title + description */}
                <div>
                  <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 1.8vw, 24px)', fontWeight: 400, letterSpacing: '0.04em', color: '#000', marginBottom: '14px' }}>
                    {s.title}
                  </h2>
                  <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>
                    {s.description}
                  </p>
                </div>
                {/* Specs */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.specs.map(spec => (
                    <li key={spec} style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)', lineHeight: '1.8em' }}>
                      — {spec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* Last border */}
            <div style={{ borderTop: '1px solid #e8e8e4' }} />
          </div>
        </div>
      </section>

      {/* Machinery section */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '80px 0' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Our Infrastructure
          </p>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, color: '#000', marginBottom: '48px', maxWidth: '600px' }}>
            World-class machinery behind every job.
          </h2>
          <div className="machinery-grid">
            {[
              { num: '01', name: 'HP Latex 570', desc: 'Wide-format latex printing with stunning colour accuracy for indoor & outdoor applications up to 64 inches wide.' },
              { num: '02', name: 'Epson Surecolor S80670', desc: 'Eco-solvent wide-format printer delivering 10,000+ sq.ft/day with precision 8-colour output for vehicle wraps & banners.' },
              { num: '03', name: 'Roland Soljet EJ 640', desc: '64" solvent printer renowned for vivid, weather-resistant output — perfect for outdoor signage.' },
              { num: '04', name: 'K Tech 1325 HD CNC Router', desc: 'High-definition CNC routing for precision-cut acrylic, ACP and wood signage with sub-millimetre accuracy.' },
              { num: '05', name: 'Laser Engraving & Cutting', desc: 'Precision laser engraving for nameplates, awards, glass etching and intricate branding details.' },
              { num: '06', name: '4-Pillar Screen Printer', desc: 'Industrial-grade screen printing for high-volume runs on boards, flute sheets, UV and 3D applications.' },
              { num: '07', name: 'Graphtec Cutting Plotter', desc: 'Japan-engineered precision cutting plotter for vinyl graphics, stickers, decals and vehicle wrap contours.' },
            ].map((m, i) => (
              <div key={m.num} className={`wix-motion wix-fade-up`} style={{ transitionDelay: `${i * 60}ms` }}>
                <p style={{ fontFamily: font, fontSize: '11px', color: 'rgb(85,78,78)', marginBottom: '10px' }}>{m.num}</p>
                <p style={{ fontFamily: fontBold, fontSize: 'clamp(14px, 1.4vw, 17px)', fontWeight: 400, letterSpacing: '0.04em', color: '#000', marginBottom: '8px' }}>{m.name}</p>
                <p style={{ fontFamily: font, fontSize: '13px', lineHeight: '1.6em', color: 'rgb(85,78,78)' }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ section */}
      <section style={{ backgroundColor: '#f7f5ef', padding: '80px 0' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Frequently asked questions
          </p>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, color: '#000', marginBottom: '36px', maxWidth: '680px' }}>
            Clear answers for the questions buyers ask before they choose a printing partner.
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {serviceFaqContent.map((item) => (
              <div key={item.question} style={{ backgroundColor: '#fff', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{item.question}</p>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Complete Service Information — SEO-rich visible content */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0', borderTop: '1px solid #e8e8e4' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(20px, 2.2vw, 28px)', fontWeight: 400, color: '#000', marginBottom: '32px' }}>
            Complete printing and signage capabilities in Hyderabad
          </h2>
          <div style={{ display: 'grid', gap: '24px', maxWidth: '900px' }}>
            <div style={{ backgroundColor: '#f9f9f7', padding: '24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '10px' }}>Signage Manufacturing</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                LED sign boards, ACP cladding, acrylic letter signs, fascia boards, pylon signs, flex boards, glass film graphics, and modular display systems manufactured in Hyderabad. Complete in-house fabrication with CNC precision cutting.
              </p>
            </div>
            <div style={{ backgroundColor: '#f9f9f7', padding: '24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '10px' }}>Vehicle Branding Solutions</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                2-wheeler to heavy transport vehicle branding with UV-resistant 3M and Avery Dennison vinyl wraps. Design visualisation mockups provided. Nationwide fleet support available for multi-city operations.
              </p>
            </div>
            <div style={{ backgroundColor: '#f9f9f7', padding: '24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '10px' }}>Digital Printing Infrastructure</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                HP Latex 570 and Epson Surecolor S80670 wide-format printers delivering flex, vinyl, canvas, UV print, 3D print, and eco-solvent output. Production capacity: 1 lakh sq.ft per day from our Nacharam facility.
              </p>
            </div>
            <div style={{ backgroundColor: '#f9f9f7', padding: '24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '10px' }}>Offset Printing Services</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                Brochures, flyers, corporate stationery, packaging, and gift boxes with premium finishing options including spot UV, foil stamping, die-cutting, and embossing. High-volume bulk runs supported.
              </p>
            </div>
            <div style={{ backgroundColor: '#f9f9f7', padding: '24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '10px' }}>Exhibition & Display Products</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                Roll-up standees, demo tents, fabric light boxes, trade show booths, and easel stands for exhibitions, conferences, and promotional events across Hyderabad and South India.
              </p>
            </div>
            <div style={{ backgroundColor: '#f9f9f7', padding: '24px', border: '1px solid #e8e8e4' }}>
              <h3 style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '10px' }}>Production Facility</h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
                10,000 sq.ft manufacturing facility at Nacharam IDA, Hyderabad with 7 specialized systems: HP Latex 570, Epson Surecolor, Roland Soljet, K Tech CNC Router, laser engraving, 4-pillar screen printer, and Graphtec plotter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ backgroundColor: '#ffedc9', padding: '80px 0' }}>
        <div className="wix-container" style={{ textAlign: 'center' }}>
          <div className="wix-motion wix-fade-up">
            <h2 style={{ fontFamily: font, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, color: '#000', marginBottom: '20px' }}>
              Ready to make your brand unforgettable?
            </h2>
            <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginBottom: '36px' }}>
              Talk to our team today and get a custom quote for your project.
            </p>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#000', color: '#fff',
              fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
              padding: '16px 44px', textDecoration: 'none',
            }}>
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      {/* Structured SEO Content - Expandable */}
      <section style={{ backgroundColor: '#fff', padding: '0 0 60px 0' }}>
        <div className="wix-container">
          <StructuredContent
            title="Complete Service Information & Technical Specifications"
            content={[
              'Vijetha Digital services include signage solutions, internal branding, vehicle branding, digital printing, offset printing, screen printing, display and exhibition, and outdoor advertising.',
              'Signage: LED sign boards, ACP cladding, acrylic letter signs, fascia boards, pylon signs, flex boards, glass film, and modular displays in Hyderabad.',
              'Vehicle Branding: 2-wheeler to heavy transport, UV-resistant vinyl wraps, design visualisation, and nationwide fleet support.',
              'Digital Printing: HP Latex 570, Epson Surecolor, flex vinyl canvas UV print 3D eco-solvent, 1 lakh sq.ft per day capacity.',
              'Offset Printing: Brochures, flyers, stationery, packaging, spot UV, foil stamping, die-cutting, high-volume bulk runs.',
              'Display and Exhibition: Standees, demo tents, fabric light boxes, trade show booths, easel stands in Hyderabad.',
              'Outdoor Advertising: Flags, backdrops, stickers, decals, canopies, tents, posters across South India.',
              'Infrastructure: 10000 sq.ft production facility Nacharam IDA Hyderabad, 7 specialized manufacturing systems.',
            ]}
          />
        </div>
      </section>

      <Footer />
      <JsonLd data={servicesFaqSchema} />
      {printingProcessSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': 'https://vijethadigital.com/services#webpage',
        url: 'https://vijethadigital.com/services',
        name: 'Printing & Signage Services in Hyderabad | Vijetha Digital',
        isPartOf: { '@id': 'https://vijethadigital.com/#website' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
            { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://vijethadigital.com/services' },
          ],
        },
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Vijetha Digital Services',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Signage Solutions', url: 'https://vijethadigital.com/services/signage' },
          { '@type': 'ListItem', position: 2, name: 'Vehicle Branding', url: 'https://vijethadigital.com/services/vehicle-branding' },
          { '@type': 'ListItem', position: 3, name: 'Digital Printing', url: 'https://vijethadigital.com/services/digital-printing' },
          { '@type': 'ListItem', position: 4, name: 'Offset Printing', url: 'https://vijethadigital.com/services' },
          { '@type': 'ListItem', position: 5, name: 'Display & Exhibition', url: 'https://vijethadigital.com/services' },
          { '@type': 'ListItem', position: 6, name: 'Outdoor Advertising', url: 'https://vijethadigital.com/services' },
        ],
      }} />

      <style>{`
        /* Tablet: hide specs column */
        @media (max-width: 900px) {
          .services-list > div {
            grid-template-columns: 48px 1fr !important;
            gap: 32px !important;
          }
          .services-list > div > ul {
            display: none;
          }
        }
        
        /* Mobile: single column */
        @media (max-width: 600px) {
          .services-list > div {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 32px 0 !important;
          }
        }

        .machinery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px 32px;
        }
        @media (max-width: 1024px) { .machinery-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .machinery-grid { grid-template-columns: repeat(2, 1fr); gap: 28px 20px; } }
        @media (max-width: 480px)  { .machinery-grid { grid-template-columns: 1fr; } }
      `}</style>
    </>
  );
}
