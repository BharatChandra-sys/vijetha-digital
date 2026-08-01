'use client';

import Link from 'next/link';

// Wix section: bg = color_12 = rgb(241,240,235) = #f1f0eb
export default function AboutSection() {
  return (
    <section
      id="about"
      style={{
        backgroundColor: '#f1f0eb',
        width: '100%',
        padding: '100px 0',
      }}
    >
      <div className="wix-container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            alignItems: 'center',
          }}
          className="about-grid"
        >
          {/* Image — wix-fade-right: slides in from right */}
          <div className="wix-motion wix-fade-right">
            <div className="wix-img-wrap" style={{ aspectRatio: '4/3' }}>
              <img
                src="/images/about-printing.jpg"
                alt="About Us — Printing Services"
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          {/* Text — wix-fade-left: slides in from left, 150ms delay */}
          <div className="wix-motion wix-fade-left wix-delay-2">
            {/* font_9 label — uppercase small bold */}
            <p
              className="wix-font-9"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '16px',
                color: 'rgb(85,78,78)',
              }}
            >
              About Us
            </p>

            {/* font_2 heading */}
            <h2
              className="wix-font-2"
              style={{ marginBottom: '24px', lineHeight: '1.2em' }}
            >
              The go-to experts for<br />all your printing needs
            </h2>

            {/* font_7 body */}
            <p className="wix-font-7" style={{ color: 'rgb(85,78,78)', marginBottom: '16px', lineHeight: '1.6em' }}>
              This is a space to share more about the business: who&apos;s behind it,
              what it does and what this site has to offer. It&apos;s an opportunity to
              tell the story behind the business or describe a special service or product
              it offers. You can use this section to share the company&apos;s history or
              highlight a particular feature that sets it apart from competitors.
            </p>
            <p className="wix-font-7" style={{ color: 'rgb(85,78,78)', marginBottom: '40px', lineHeight: '1.6em' }}>
              Keep a consistent tone and voice throughout the website to stay true to the
              brand image and give visitors a taste of the company&apos;s values and
              personality.
            </p>

            <Link href="#quote" className="wix-btn-primary">
              Get a Quote
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
