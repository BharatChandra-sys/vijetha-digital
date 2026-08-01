'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1c1d20', color: '#ffffff', width: '100%' }}>
      {/* Main footer content */}
      <div className="wix-container" style={{ paddingTop: '72px', paddingBottom: '48px' }}>
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <p style={{
              fontFamily: "'helvetica-w01-bold', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '18px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.01em',
            }}>
              More Than B&amp;W
            </p>
          </div>

          {/* Head Office */}
          <div>
            <p style={{
              fontFamily: "'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '20px',
            }}>
              Head Office
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p className="footer-text">500 Terry Francine St,<br />San Francisco, CA 94158</p>
              <p className="footer-text">123-456-7890</p>
              <p className="footer-text">info@mysite.com</p>
            </div>
          </div>

          {/* Socials */}
          <div>
            <p style={{
              fontFamily: "'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '20px',
            }}>
              Socials
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['Facebook', 'Instagram', 'LinkedIn'].map(s => (
                <Link
                  key={s}
                  href={`https://${s.toLowerCase()}.com`}
                  className="footer-link"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Inquiries */}
          <div>
            <p style={{
              fontFamily: "'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: '11px',
              fontWeight: 400,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '20px',
            }}>
              Inquiries
            </p>
            <p className="footer-text" style={{ marginBottom: '20px' }}>
              Looking to get a quote?
            </p>
            <Link
              href="#quote"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px 28px',
                border: '1px solid rgba(255,255,255,0.7)',
                color: '#ffffff',
                fontFamily: "'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '14px',
                fontWeight: 400,
                textDecoration: 'none',
                transition: 'background-color 0.2s ease, color 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#ffffff';
                (e.currentTarget as HTMLElement).style.color = '#000000';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#ffffff';
              }}
            >
              Get a Quote
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="wix-container"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '20px',
          paddingBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {[['Privacy Policy', '/privacy'], ['Accessibility Statement', '/accessibility']].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: "'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: '12px',
                color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)')}
            >
              {label}
            </Link>
          ))}
        </div>
        <p style={{
          fontFamily: "'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: '12px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          © 2035 by More than B&amp;W. Made with Wix Studio™
        </p>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.5fr 1fr 1.5fr;
          gap: 48px;
          margin-bottom: 48px;
        }
        .footer-text {
          font-family: 'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.6em;
          color: rgba(255,255,255,0.7);
        }
        .footer-link {
          font-family: 'helvetica-w01-roman', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: #ffffff; }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
