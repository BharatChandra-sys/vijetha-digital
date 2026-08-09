import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { WA_URL, PHONE, PHONE_RAW, EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Sitemap | Vijetha Digital',
  description: 'Complete sitemap for Vijetha Digital — navigate to printing services, signage products, vehicle branding, about, contact, and all pages on vijethadigital.com.',
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const groups = [
  {
    heading: 'Main Pages',
    links: [
      { label: 'Home',       href: '/' },
      { label: 'Services',   href: '/services' },
      { label: 'Products',   href: '/products' },
      { label: 'About',      href: '/about' },
      { label: 'Contact',    href: '/contact' },
    ],
  },
  {
    heading: 'Products & Services',
    links: [
      { label: 'All Products',       href: '/products',                          indent: false },
      { label: '→ Sign Boards',       href: '/products/sign-boards',              indent: true  },
      { label: '→ Printing Services', href: '/products/printing-services',        indent: true  },
      { label: '→ Banner Stands',     href: '/products/banner-stands',            indent: true  },
      { label: '→ Demo Tents',        href: '/products/demo-tents',               indent: true  },
      { label: '→ Promotional Items', href: '/products/promotional-items',        indent: true  },
    ],
  },
  {
    heading: 'Legal & Policy',
    links: [
      { label: 'Privacy Policy',   href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Sitemap',          href: '/sitemap' },
    ],
  },
  {
    heading: 'Get in Touch',
    links: [
      { label: 'Contact Page',      href: '/contact' },
      { label: 'WhatsApp Us',              href: WA_URL,                         external: true },
      { label: PHONE,                       href: `tel:+${PHONE_RAW}`,            external: true },
      { label: EMAIL,                       href: `mailto:${EMAIL}`,              external: true },
    ],
  },
];

export default function SitemapPage() {
  return (
    <>
      <Header variant="home" />

      {/* Hero */}
      <section style={{ backgroundColor: '#1c1d20', paddingTop: '140px', paddingBottom: '64px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
            Navigation
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#fff' }}>
            Sitemap
          </h1>
          <p style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '16px' }}>
            Navigate through all sections of our website
          </p>
        </div>
      </section>

      {/* Grid */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <div className="sitemap-grid">
            {groups.map((group) => (
              <div key={group.heading}>
                <p style={{ fontFamily: fontBold, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e8e8e4' }}>
                  {group.heading}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        target={'external' in link && link.external ? '_blank' : undefined}
                        rel={'external' in link && link.external ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: font,
                          fontSize: '15px',
                          color: 'indent' in link && link.indent ? 'rgb(85,78,78)' : '#000',
                          textDecoration: 'none',
                          paddingLeft: 'indent' in link && link.indent ? '16px' : '0',
                          display: 'block',
                          transition: 'opacity 0.2s',
                        }}
                        className="sitemap-link"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Info strip */}
          <div style={{ marginTop: '72px', backgroundColor: '#f1f0eb', padding: '40px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {[
              { label: 'Established', value: '2002 — 20+ years in print' },
              { label: 'GST Number',  value: '36AGBPC3175H1ZP' },
              { label: 'Turnaround', value: 'Free quotes within 24 hours' },
              { label: 'Clients',    value: '500+ businesses across Telangana' },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '6px' }}>{item.label}</p>
                <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#000' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .sitemap-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 48px;
        }
        .sitemap-link:hover { opacity: 0.5; }
        @media (max-width: 900px) {
          .sitemap-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .sitemap-grid { grid-template-columns: 1fr; gap: 36px; }
        }
      `}</style>
    </>
  );
}
