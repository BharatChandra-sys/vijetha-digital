'use client';

import Link from 'next/link';

import { WA_URL, PHONE, PHONE_RAW, EMAIL } from '@/lib/constants';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1c1d20', color: '#fff', width: '100%' }}>

      {/* ── MAIN GRID ── */}
      <div className="wix-container" style={{ paddingTop: '72px', paddingBottom: '56px' }}>
        <div className="footer-main-grid">

          {/* ── COL 1: Brand ── */}
          <div className="footer-brand-col">
            <p style={{ fontFamily: fontBold, fontSize: '20px', color: '#fff', letterSpacing: '0.02em', marginBottom: '16px' }}>
              Vijetha Digital
            </p>
            <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.7em', color: 'rgba(255,255,255,0.65)', marginBottom: '28px', maxWidth: '260px' }}>
              Established 2002. Hyderabad&apos;s trusted print partner for sign boards, flex printing, banner stands &amp; promotional tents. Serving 500+ businesses across Telangana.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {/* Facebook */}
              <a href="https://www.facebook.com/vijethadigital" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/vijethadigital" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="social-icon social-icon--wa" title="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* IndiaMart */}
              <a href="https://www.indiamart.com/vijethadigital/" target="_blank" rel="noopener noreferrer" className="social-icon social-icon--im" title="IndiaMart">
                <span style={{ fontSize: '9px', fontFamily: fontBold, fontWeight: 900, letterSpacing: '-0.02em' }}>IM</span>
              </a>
            </div>
          </div>

          {/* ── COL 2: Products ── */}
          <div>
            <p className="footer-col-heading">Products</p>
            <ul className="footer-link-list">
              {[
                ['Sign Boards',       '/products#sign-boards'],
                ['Printing Services', '/products#printing-services'],
                ['Banner Stands',     '/products#banner-stands'],
                ['Demo Tents',        '/products#demo-tents'],
                ['Promotional Items', '/products#promotional-items'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="footer-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 3: Company ── */}
          <div>
            <p className="footer-col-heading">Company</p>
            <ul className="footer-link-list">
              {[
                ['Services',      '/services'],
                ['Products',      '/products'],
                ['About',         '/about'],
                ['Contact',       '/contact'],
                ['Privacy Policy','/privacy'],
              ].map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="footer-nav-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COL 4: Contact / Branches ── */}
          <div>
            <p className="footer-col-heading">Contact Us</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>

              {/* Branch 1 */}
              <li className="footer-contact-row">
                <span className="footer-contact-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </span>
                <div>
                  <p className="footer-branch-name">Indira Park (Main)</p>
                  <p className="footer-contact-text">Shop No. 1-2-607/75, 76, Opp NTR Stadium,<br />LIC Colony Rd, Hyderabad – 500029</p>
                </div>
              </li>

              {/* Branch 2 */}
              <li className="footer-contact-row">
                <span className="footer-contact-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </span>
                <div>
                  <p className="footer-branch-name">Lakdikapool</p>
                  <p className="footer-contact-text">H No. 11-5-456, Shop No. 5,<br />Sanapride Complex, Hyderabad – 500004</p>
                </div>
              </li>

              {/* Branch 3 */}
              <li className="footer-contact-row">
                <span className="footer-contact-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </span>
                <div>
                  <p className="footer-branch-name">Nacharam</p>
                  <p className="footer-contact-text">42/B, No. 16, IDA,<br />Nacharam, Hyderabad – 500076</p>
                </div>
              </li>

              {/* Phone */}
              <li className="footer-contact-row">
                <span className="footer-contact-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </span>
                <a href={`tel:+${PHONE_RAW}`} className="footer-nav-link" style={{ fontSize: '14px' }}>{PHONE}</a>
              </li>

              {/* Hours */}
              <li className="footer-contact-row">
                <span className="footer-contact-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
                  </svg>
                </span>
                <p className="footer-contact-text" style={{ margin: 0 }}>Mon – Sat, 9:00 AM – 8:00 PM</p>
              </li>

              {/* GST */}
              <li className="footer-contact-row">
                <span className="footer-contact-icon">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.9 }}>
                    <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                  </svg>
                </span>
                <p style={{ fontFamily: font, fontSize: '12px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em', margin: 0 }}>
                  GST: 36AGBPC3175H1ZP
                </p>
              </li>

            </ul>
          </div>

        </div>

        {/* ── CTA STRIP ── */}
        <div className="footer-cta-strip">
          <div>
            <p style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 2vw, 24px)', color: '#fff', marginBottom: '6px' }}>
              Ready to print? Let&apos;s talk.
            </p>
            <p style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
              Get a quote in under 24 hours. No hidden costs.
            </p>
          </div>
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '10px',
              backgroundColor: '#fff', color: '#000',
              fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
              padding: '14px 36px', textDecoration: 'none', whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            className="footer-cta-btn"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="footer-bottom-bar">
          <p style={{ fontFamily: font, fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            © 2002–2026 Vijetha Digital · Prop. Krishnam Raju · All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {[['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Sitemap', '/sitemap']].map(([label, href]) => (
              <Link key={label} href={href} className="footer-bottom-link">{label}</Link>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        /* ── MAIN GRID ── */
        .footer-main-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1.6fr;
          gap: 48px;
          margin-bottom: 56px;
        }

        /* ── CTA STRIP ── */
        .footer-cta-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 32px 40px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }
        .footer-cta-btn:hover {
          background-color: rgba(255,237,201,1) !important;
        }

        /* ── BOTTOM BAR ── */
        .footer-bottom-bar {
          border-top: 1px solid rgba(255,255,255,0.08);
          padding-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        /* ── TYPOGRAPHY HELPERS ── */
        .footer-col-heading {
          font-family: ${fontBold};
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.9);
          margin-bottom: 20px;
        }
        .footer-link-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }
        .footer-nav-link {
          font-family: ${font};
          font-size: 14px;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-nav-link:hover { color: #fff; }

        .footer-contact-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .footer-contact-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          min-width: 26px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          color: rgba(255,237,201,0.9);
          margin-top: 1px;
        }
        .footer-branch-name {
          font-family: ${fontBold};
          font-size: 11px;
          color: rgba(255,255,255,0.8);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 3px;
        }
        .footer-contact-text {
          font-family: ${font};
          font-size: 13px;
          line-height: 1.6em;
          color: rgba(255,255,255,0.55);
          margin: 0;
        }

        /* ── SOCIAL ICONS ── */
        .social-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .social-icon:hover { background: rgba(255,255,255,0.25); color: #fff; }
        .social-icon--wa:hover  { background: #25D366 !important; color: #fff !important; }
        .social-icon--im:hover  { background: #0066CC !important; color: #fff !important; }

        .footer-bottom-link {
          font-family: ${font};
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-bottom-link:hover { color: rgba(255,255,255,0.7); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .footer-main-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
          .footer-brand-col { grid-column: 1 / -1; }
        }
        @media (max-width: 600px) {
          .footer-main-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-cta-strip {
            padding: 24px 20px;
            flex-direction: column;
            align-items: flex-start;
          }
          .footer-bottom-bar {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </footer>
  );
}
