'use client';

import Link from 'next/link';

export default function AboutSection() {
  return (
    <section
      id="about"
      style={{ backgroundColor: '#f1f0eb', width: '100%', padding: '80px 0' }}
    >
      <div className="wix-container">
        <div className="about-grid">

          {/* Image */}
          <div className="wix-motion wix-fade-right">
            <div className="wix-img-wrap" style={{ aspectRatio: '4/3' }}>
              <img
                src="/images/about-printing.jpg"
                alt="Vijetha Digital printing facility"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="wix-motion wix-fade-left wix-delay-2">
            <p style={{
              fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize: '11px', fontWeight: 400, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px',
            }}>
              About Us
            </p>

            <h2 style={{
              fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400,
              lineHeight: 1.25, color: '#000', marginBottom: '22px',
            }}>
              The go-to experts for<br />all your printing needs
            </h2>

            <p style={{
              fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize: '16px', lineHeight: '1.65em', color: 'rgb(85,78,78)', marginBottom: '14px',
            }}>
              Vijetha Digital is a full-service printing company delivering precision, quality and 
              creativity to every project. From high-volume commercial prints to bespoke marketing 
              collateral, we combine state-of-the-art machinery with skilled craftsmanship.
            </p>
            <p style={{
              fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize: '16px', lineHeight: '1.65em', color: 'rgb(85,78,78)', marginBottom: '36px',
            }}>
              Whether it&apos;s a business card or a large-format banner, every print that leaves 
              our facility meets the highest standards — because your brand deserves nothing less.
            </p>

            <Link href="#contact" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#000', color: '#fff',
              fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize: '14px', fontWeight: 400, letterSpacing: '0.03em',
              padding: '14px 36px', textDecoration: 'none',
            }}>
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 72px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr; gap: 36px; }
        }
      `}</style>
    </section>
  );
}
