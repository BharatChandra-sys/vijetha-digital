import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import { WA_URL, PHONE, PHONE_RAW, EMAIL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Sitemap | Vijetha Digital - Complete Site Navigation',
  description: 'Complete sitemap for Vijetha Digital. Browse all printing services, signage products, vehicle branding, exhibition displays, and branding solutions. Navigate to any page on vijethadigital.com.',
  alternates: {
    canonical: 'https://vijethadigital.com/sitemap',
  },
  openGraph: {
    title: 'Sitemap | Vijetha Digital',
    description: 'Complete site navigation for Vijetha Digital printing and signage company in Hyderabad.',
    url: 'https://vijethadigital.com/sitemap',
    type: 'website',
  },
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const groups = [
  {
    heading: 'Main Pages',
    description: 'Primary navigation pages',
    links: [
      { label: 'Home', href: '/', desc: 'Printing, signage & branding in Hyderabad' },
      { label: 'About Us', href: '/about', desc: '15+ years of manufacturing expertise' },
      { label: 'Services', href: '/services', desc: 'Complete printing and signage services' },
      { label: 'Products', href: '/products', desc: '30+ branding products catalog' },
      { label: 'Projects', href: '/projects', desc: 'Completed signage projects' },
      { label: 'Contact', href: '/contact', desc: 'Get a free quote — 3 branches' },
    ],
  },
  {
    heading: 'Signage Solutions',
    description: 'Premium signage boards and displays',
    links: [
      { label: 'LED Sign Board', href: '/products/led-sign-board', desc: '24/7 illuminated signage' },
      { label: 'ACP Cladding Sign', href: '/products/acp-cladding-sign', desc: 'Aluminium composite panel signage' },
      { label: 'Acrylic Letter Sign', href: '/products/acrylic-letter-sign', desc: 'Precision-cut 3D acrylic letters' },
      { label: 'Fascia Sign Board', href: '/products/fascia-sign-board', desc: 'Storefront fascia boards' },
      { label: 'Pylon Sign', href: '/products/pylon-sign', desc: 'Towering pylon signage' },
      { label: 'Glow Sign Board', href: '/products/glow-sign-board', desc: 'Backlit glow signs' },
      { label: 'Non-Lit Sign Board', href: '/products/non-lit-sign-board', desc: 'Non-illuminated signage' },
    ],
  },
  {
    heading: 'Vehicle Branding',
    description: 'Professional vehicle wraps and fleet graphics',
    links: [
      { label: 'Car / 4-Wheeler Wrap', href: '/products/car-4-wheeler-wrap', desc: 'Car and SUV wraps' },
      { label: 'Bus / Van Branding', href: '/products/bus-van-branding', desc: 'Large vehicle branding' },
      { label: '2-Wheeler Branding', href: '/products/two-wheeler-branding', desc: 'Bike and scooter graphics' },
      { label: 'Fleet Graphics', href: '/products/bus-van-branding', desc: 'Complete fleet branding' },
    ],
  },
  {
    heading: 'Digital Printing',
    description: 'Large format and digital printing services',
    links: [
      { label: 'Flex / Vinyl Printing', href: '/products/flex-vinyl-printing', desc: 'High-resolution flex printing' },
      { label: 'UV Print', href: '/products/uv-print', desc: 'UV-cured printing' },
      { label: '3D Canvas Print', href: '/products/3d-canvas-print', desc: 'Premium canvas printing' },
      { label: 'Banner Printing', href: '/products/flex-vinyl-printing', desc: 'Custom banner printing' },
    ],
  },
  {
    heading: 'Offset Printing',
    description: 'Corporate and marketing collateral',
    links: [
      { label: 'Brochure / Catalogue', href: '/products/brochure-catalogue', desc: 'Corporate brochures and catalogs' },
      { label: 'Visiting Card', href: '/products/visiting-card', desc: 'Professional business cards' },
      { label: 'Letterhead Printing', href: '/products/letterhead-printing', desc: 'Corporate letterheads' },
      { label: 'Flyer / Pamphlet', href: '/products/brochure-catalogue', desc: 'Marketing flyers' },
    ],
  },
  {
    heading: 'Exhibition & Display',
    description: 'Trade show and event solutions',
    links: [
      { label: 'Roll-Up Standee', href: '/products/roll-up-standee', desc: 'Portable roll-up standees' },
      { label: 'Trade Show Booth', href: '/products/trade-show-booth', desc: 'Custom exhibition booths' },
      { label: 'Demo Tent', href: '/products/demo-tent', desc: 'Promotional tents' },
      { label: 'Fabric Light Box', href: '/products/fabric-light-box', desc: 'Backlit fabric displays' },
      { label: 'X-Stand Banner', href: '/products/x-stand-banner', desc: 'Portable X-banner stands' },
    ],
  },
  {
    heading: 'Company Information',
    description: 'About Vijetha Digital',
    links: [
      { label: 'Company Profile', href: '/about', desc: '15+ years of printing expertise' },
      { label: 'Our Clients', href: '/about#clients', desc: 'Trusted by 1000+ businesses' },
      { label: 'Testimonials', href: '/about#testimonials', desc: 'Client reviews and feedback' },
      { label: 'Branches', href: '/contact', desc: '3 locations in Hyderabad' },
      { label: 'Privacy Policy', href: '/privacy', desc: 'Data protection and privacy' },
    ],
  },
  {
    heading: 'Resources',
    description: 'Helpful resources and guides',
    links: [
      { label: 'Printing Guide Hyderabad', href: '/hyderabad-printing-signage', desc: 'Complete printing guide' },
      { label: 'XML Sitemap', href: '/sitemap.xml', desc: 'Machine-readable sitemap', external: true },
      { label: 'RSS Feed', href: '/rss.xml', desc: 'Subscribe to updates', external: true },
    ],
  },
  {
    heading: 'Get in Touch',
    description: 'Contact Vijetha Digital',
    links: [
      { label: 'Contact Page', href: '/contact', desc: 'Get a free quote' },
      { label: 'WhatsApp Chat', href: WA_URL, desc: 'Chat on WhatsApp', external: true },
      { label: PHONE, href: `tel:+${PHONE_RAW}`, desc: 'Call for immediate assistance', external: true },
      { label: EMAIL, href: `mailto:${EMAIL}`, desc: 'Email for inquiries', external: true },
    ],
  },
];

// Breadcrumb schema
const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
    { '@type': 'ListItem', position: 2, name: 'Sitemap', item: 'https://vijethadigital.com/sitemap' },
  ],
};

// CollectionPage schema
const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://vijethadigital.com/sitemap#webpage',
  url: 'https://vijethadigital.com/sitemap',
  name: 'Sitemap | Vijetha Digital',
  description: 'Complete index of pages, services, products, and resources on Vijetha Digital website.',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  breadcrumb: breadcrumbSchema,
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: groups.reduce((acc, group) => acc + group.links.length, 0),
    itemListElement: groups.flatMap((group, groupIdx) =>
      group.links
        .filter((link) => !link.external)
        .map((link, linkIdx) => ({
          '@type': 'ListItem',
          position: groupIdx * 10 + linkIdx + 1,
          name: link.label,
          url: `https://vijethadigital.com${link.href}`,
        }))
    ),
  },
};

export default function SitemapPage() {
  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <nav aria-label="Breadcrumb" style={{ marginBottom: '24px' }}>
            <ol itemScope itemType="https://schema.org/BreadcrumbList" style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, margin: 0, fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)' }}>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <Link href="/" itemProp="item" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  <span itemProp="name">Home</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <li aria-hidden="true">/</li>
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                <span itemProp="name" style={{ color: '#000' }}>Sitemap</span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </nav>

          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Site Navigation
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '760px' }}>
            Complete Sitemap
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '720px', lineHeight: '1.7em' }}>
            Browse all pages, services, products, and resources on Vijetha Digital. Find printing, signage, vehicle branding, exhibition displays, and complete branding solutions across Hyderabad.
          </p>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <div className="sitemap-grid">
            {groups.map((group, idx) => (
              <article key={group.heading} className="sitemap-group">
                <header style={{ marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e8e8e4' }}>
                  <h2 style={{ fontFamily: fontBold, fontSize: '15px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#000', marginBottom: '6px' }}>
                    {group.heading}
                  </h2>
                  <p style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', lineHeight: '1.5em' }}>
                    {group.description}
                  </p>
                </header>
                <nav aria-label={group.heading}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {group.links.map((link) => (
                      <li key={link.href} style={{ borderLeft: '2px solid #e8e8e4', paddingLeft: '14px', transition: 'border-color 0.2s' }} className="sitemap-item">
                        <Link
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noopener noreferrer' : undefined}
                          style={{
                            fontFamily: font,
                            fontSize: '14px',
                            color: '#000',
                            textDecoration: 'underline',
                            lineHeight: '1.4em',
                            display: 'block',
                            marginBottom: '4px',
                            transition: 'opacity 0.2s',
                          }}
                          className="sitemap-link"
                        >
                          {link.label}
                          {link.external && (
                            <span style={{ fontSize: '11px', marginLeft: '4px', opacity: 0.5 }}>↗</span>
                          )}
                        </Link>
                        {'desc' in link && link.desc && (
                          <p style={{
                            fontFamily: font,
                            fontSize: '12px',
                            color: 'rgb(85,78,78)',
                            lineHeight: '1.5em',
                            margin: 0,
                          }}>
                            {link.desc}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </article>
            ))}
          </div>

          {/* Quick stats */}
          <div style={{ marginTop: '80px', backgroundColor: '#f1f0eb', padding: '48px', borderRadius: '2px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', marginBottom: '32px' }}>
              {[
                { label: 'Established', value: '2009', sublabel: '15+ years in printing' },
                { label: 'GST Number', value: '36AGBPC3175H1ZP', sublabel: 'Registered business' },
                { label: 'Response Time', value: '< 4 hours', sublabel: 'Free quote turnaround' },
                { label: 'Clients Served', value: '1,000+', sublabel: 'Businesses across India' },
              ].map((item) => (
                <div key={item.label}>
                  <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '8px' }}>
                    {item.label}
                  </p>
                  <p style={{ fontFamily: fontBold, fontSize: '20px', color: '#000', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                    {item.value}
                  </p>
                  <p style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)' }}>
                    {item.sublabel}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', paddingTop: '32px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <h3 style={{ fontFamily: font, fontSize: 'clamp(20px, 2.2vw, 28px)', fontWeight: 400, color: '#000', marginBottom: '16px' }}>
                Need help finding what you're looking for?
              </h3>
              <p style={{ fontFamily: font, fontSize: '15px', color: 'rgb(85,78,78)', marginBottom: '28px', maxWidth: '560px', margin: '0 auto 28px', lineHeight: '1.65em' }}>
                Our team can guide you to the right signage, printing, or branding solution for your project.
              </p>
              <Link
                href="/contact"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#000',
                  color: '#fff',
                  fontFamily: font,
                  fontSize: '14px',
                  letterSpacing: '0.03em',
                  padding: '16px 44px',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s',
                }}
                className="sitemap-cta"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={collectionPageSchema} />

      <style>{`
        .sitemap-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 56px 48px;
        }
        .sitemap-link:hover { opacity: 0.6; }
        .sitemap-item:hover { border-left-color: #000; }
        .sitemap-cta:hover { opacity: 0.8; }
        
        @media (max-width: 1024px) {
          .sitemap-grid { grid-template-columns: repeat(2, 1fr); gap: 48px 40px; }
        }
        @media (max-width: 600px) {
          .sitemap-grid { grid-template-columns: 1fr; gap: 40px; }
        }
      `}</style>
    </>
  );
}
