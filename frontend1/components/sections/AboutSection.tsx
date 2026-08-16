'use client';

import Link from 'next/link';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

export default function AboutSection() {
  return (
    <section id="about" style={{ backgroundColor: '#f1f0eb', width: '100%', padding: '80px 0' }}>
      <div className="wix-container">
        <div className="about-grid">

          {/* Image */}
          <div className="wix-motion wix-fade-right">
            <div className="wix-img-wrap" style={{ aspectRatio: '4/3' }}>
              <img
                src="/images/about-printing.webp"
                alt="Vijetha Digital printing facility — Hyderabad"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="wix-motion wix-fade-left wix-delay-2">
            <p style={{ fontFamily: font, fontSize: '11px', fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              About Us
            </p>

            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400, lineHeight: 1.25, color: '#000', marginBottom: '22px' }}>
              Hyderabad&apos;s trusted<br />printing partner
            </h2>

            <p style={{ fontFamily: font, fontSize: '16px', lineHeight: '1.65em', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              Vijetha Digital is a full-service printing and signage company based in Hyderabad,
              Telangana. From sign boards and flex printing to banner stands and branded tents,
              we deliver precision and quality on every project — regardless of scale.
            </p>
            <p style={{ fontFamily: font, fontSize: '16px', lineHeight: '1.65em', color: 'rgb(85,78,78)', marginBottom: '36px' }}>
              With 500+ happy businesses and a decade of expertise, we combine modern printing
              technology with skilled craftsmanship. Your brand deserves nothing less.
            </p>

            <a
              href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20get%20a%20quote%20for%20printing%20services."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: '#000', color: '#fff',
                fontFamily: font, fontSize: '14px', fontWeight: 400, letterSpacing: '0.03em',
                padding: '14px 36px', textDecoration: 'none',
              }}
            >
              Get a Quote
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; }
        @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; gap: 36px; } }
      `}</style>
    </section>
  );
}
