'use client';

import Link from 'next/link';

const services = [
  { id: 1, title: 'BOOKLETS',  description: 'Describe the service and how customers or clients can benefit from it.' },
  { id: 2, title: 'CARDS',     description: 'Describe the service and how customers or clients can benefit from it.' },
  { id: 3, title: 'PACKAGING', description: 'Describe the service and how customers or clients can benefit from it.' },
  { id: 4, title: 'BROCHURES', description: 'Describe the service and how customers or clients can benefit from it.' },
];

export default function ServicesSection() {
  return (
    <section id="services" style={{ backgroundColor: '#f1f0eb', width: '100%', padding: '80px 0' }}>
      <div className="wix-container">

        {/* Header */}
        <div className="wix-motion wix-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 className="wix-font-2" style={{ marginBottom: '12px' }}>OUR PRINTING SERVICES</h2>
          <p className="wix-font-7" style={{ color: 'rgb(85,78,78)', marginBottom: '20px' }}>
            Quality prints,<br />Beautiful details
          </p>
          <Link
            href="/services"
            className="wix-font-8"
            style={{
              color: 'rgb(85,78,78)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            All Services
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 4-col grid → 2-col tablet → 1-col mobile */}
        <div className="services-grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`wix-motion wix-fade-up wix-delay-${index + 1}`}
            >
              <h3 className="wix-font-3" style={{ marginBottom: '12px' }}>{service.title}</h3>
              <p className="wix-font-8" style={{ color: 'rgb(85,78,78)', lineHeight: '1.6em' }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .services-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px;
        }
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </section>
  );
}
