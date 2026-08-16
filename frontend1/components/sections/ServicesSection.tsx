'use client';

import Link from 'next/link';

const services = [
  { id: 1, title: 'SIGN BOARDS', description: '3D, glow, vinyl, aluminium, open LED and acrylic sign boards for shops, offices and hoardings.', category: 'Signage Solutions' },
  { id: 2, title: 'FLEX & PRINTING', description: 'Offset, flex, letterhead, catalogue, canvas and business card printing under one roof.', category: 'Digital Printing' },
  { id: 3, title: 'BANNER STANDS', description: 'Roll-up standees, roller and heavy banner stands for exhibitions, events and retail displays.', category: 'Display & Exhibition' },
  { id: 4, title: 'DEMO TENTS', description: 'Custom branded canopy tents for outdoor events, promotions and road shows.', category: 'Outdoor Advertising' },
];

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

export default function ServicesSection() {
  return (
    <section id="services" style={{ backgroundColor: '#f1f0eb', width: '100%', padding: '80px 0', marginTop: '20vh', position: 'relative', zIndex: 4 }}>
      <div className="wix-container">

        {/* Header */}
        <div className="wix-motion wix-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400, lineHeight: 1.2, color: '#000', marginBottom: '10px' }}>
            Our Printing Services
          </h2>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', lineHeight: '1.6em', marginBottom: '18px' }}>
            Quality prints.<br />Beautiful details.
          </p>
          <Link href="/services" style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            All Services
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 4-col grid */}
        <div className="services-grid">
          {services.map((service, i) => (
            <Link
              key={service.id}
              href={`/products?category=${encodeURIComponent(service.category)}`}
              className={`wix-motion wix-fade-up wix-delay-${i + 1}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <h3 style={{ fontFamily: fontBold, fontSize: 'clamp(13px, 1.3vw, 15px)', fontWeight: 400, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#000', marginBottom: '12px' }}>
                {service.title}
              </h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>
                {service.description}
              </p>
            </Link>
          ))}
        </div>

      </div>

      <style>{`
        .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px 28px; }
        @media (max-width: 1024px) { .services-grid { grid-template-columns: repeat(2, 1fr); gap: 32px; } }
        @media (max-width: 640px)  { .services-grid { grid-template-columns: 1fr; gap: 28px; } }
      `}</style>
    </section>
  );
}
