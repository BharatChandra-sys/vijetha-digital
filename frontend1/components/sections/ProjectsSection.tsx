'use client';

import Link from 'next/link';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const projects = [
  {
    id: 1,
    title: 'BOOKLETS & CATALOGUES',
    description: 'Saddle-stitched and perfect-bound booklets for product catalogues, annual reports and corporate brochures. Delivered on 130gsm gloss art paper.',
    image: '/images/project-booklets.jpg',
    href: '/products/printing-services',
  },
  {
    id: 2,
    title: 'VISITING CARDS',
    description: 'High-impact cards with spot UV, matte laminate, foil and custom die-cuts. Standard 85×55mm or custom size, single or double-sided.',
    image: '/images/project-cards.jpg',
    href: '/products/printing-services',
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" style={{ backgroundColor: '#ffffff', width: '100%', padding: '80px 0' }}>
      <div className="wix-container">

        {/* Header */}
        <div className="wix-motion wix-fade-up" style={{ marginBottom: '48px' }}>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400, lineHeight: 1.2, color: '#000', marginBottom: '12px' }}>
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
              <h3 style={{ fontFamily: fontBold, fontSize: 'clamp(14px, 1.5vw, 17px)', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#000', marginBottom: '10px' }}>
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
