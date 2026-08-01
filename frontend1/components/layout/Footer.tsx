'use client';

import Link from 'next/link';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1c1d20', color: '#fff', width: '100%' }}>
      <div className="wix-container" style={{ paddingTop: '64px', paddingBottom: '40px' }}>

        {/* 4-column grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <p style={{ fontFamily: fontBold, fontSize: '18px', fontWeight: 700, color: '#fff', letterSpacing: '0.01em' }}>
              Vijetha Digital
            </p>
          </div>

          {/* Head Office */}
          <div>
            <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
              Head Office
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.55em', color: 'rgba(255,255,255,0.7)' }}>
                Hyderabad, Telangana<br />India
              </p>
              <p style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>+91 98765 43210</p>
              <p style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>info@vijethadigital.com</p>
            </div>
          </div>

          {/* Socials */}
          <div>
            <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
              Socials
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
              {[
                { label: 'Facebook',  href: 'https://facebook.com' },
                { label: 'Instagram', href: 'https://instagram.com' },
                { label: 'LinkedIn',  href: 'https://linkedin.com' },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}
                  onMouseEnter={e => ((e.target as HTMLElement).style.color = '#fff')}
                  onMouseLeave={e => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Inquiries */}
          <div>
            <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '18px' }}>
              Inquiries
            </p>
            <p style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '18px' }}>
              Looking to get a quote?
            </p>
            <Link
              href="#contact"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                padding: '11px 26px', border: '1px solid rgba(255,255,255,0.6)',
                fontFamily: font, fontSize: '14px', color: '#fff', textDecoration: 'none',
                transition: 'background-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#fff';
                (e.currentTarget as HTMLElement).style.color = '#000';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#fff';
              }}
            >
              Get a Quote
            </Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: '48px', paddingTop: '20px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', flexWrap: 'wrap', gap: '12px',
        }}>
          <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {[['Privacy Policy', '/privacy'], ['Accessibility Statement', '/accessibility']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontFamily: font, fontSize: '12px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </div>
          <p style={{ fontFamily: font, fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            © 2025 by Vijetha Digital. All rights reserved.
          </p>
        </div>

      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.6fr 1fr 1.6fr;
          gap: 48px;
          margin-bottom: 0;
        }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 36px; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr; gap: 28px; }
        }
      `}</style>
    </footer>
  );
}
