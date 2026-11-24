'use client';

import Link from 'next/link';

const font     = 'var(--font-wix)';
const fontBold = 'var(--font-wix-bold)';

const projects = [
  {
    id: 1,
    title: 'LARGE-FORMAT PRINTING',
    description: 'Flex, vinyl and banners printed in one piece up to 3.2 metres wide on our solvent and UV roll printers, in Telugu, English or any script.',
    image: '/images/vd/solvent-printer-3-2m-printing.jpg',
    href: '/products/flex-vinyl-printing',
  },
  {
    id: 2,
    title: 'CNC & LASER-CUT SIGNAGE',
    description: 'Acrylic letters, ACP panels and MDF shapes cut in-house on an 8 x 4 ft CNC router and a CO2 laser, ready for LED sign boards and fascias.',
    image: '/images/vd/k-tech-1325-cnc-router.jpg',
    href: '/products/acrylic-letter-sign',
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" style={{ backgroundColor: '#ffffff', width: '100%', padding: '80px 0' }}>
      <div className="wix-container">

        {/* Header */}
        <div className="wix-motion wix-fade-up" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 1.96vw, 25px)', fontWeight: 400, lineHeight: 1.2, color: '#000', marginBottom: '12px' }}>
            Our Work
          </h2>
          <Link href="/products" style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            View All Products
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 2-col grid */}
        <div className="proj-grid">
          {projects.map((p, i) => (
            <Link
              key={p.id}
              href={p.href}
              className={`wix-motion wix-fade-up wix-delay-${i + 2}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div className="wix-img-wrap" style={{ aspectRatio: '16/10', marginBottom: '18px' }}>
                <img src={p.image} alt={p.title} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </div>
              <h3 style={{ fontFamily: fontBold, fontSize: 'clamp(12px, 1.05vw, 15px)', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#000', marginBottom: '10px' }}>
                {p.title}
              </h3>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.6em', color: 'rgb(85,78,78)' }}>
                {p.description}
              </p>
            </Link>
          ))}
        </div>

      </div>

      <style>{`
        .proj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        @media (max-width: 768px) { .proj-grid { grid-template-columns: 1fr; gap: 36px; } }
      `}</style>
    </section>
  );
}
