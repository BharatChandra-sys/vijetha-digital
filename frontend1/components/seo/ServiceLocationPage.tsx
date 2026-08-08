import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import JsonLd from '@/components/seo/JsonLd';
import { WA_URL } from '@/lib/constants';

type ServiceLocationPageProps = {
  title: string;
  description: string;
  heroLabel: string;
  heroTitle: string;
  heroIntro: string;
  keyPoints: string[];
  serviceAreas?: string[];
  relatedLinks?: Array<{ href: string; label: string }>;
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

export default function ServiceLocationPage({
  title,
  description,
  heroLabel,
  heroTitle,
  heroIntro,
  keyPoints,
  serviceAreas = [],
  relatedLinks = [],
}: ServiceLocationPageProps) {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: title,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Vijetha Digital',
      url: 'https://vijethadigital.com',
    },
    areaServed: serviceAreas.length > 0 ? serviceAreas : ['Hyderabad', 'Telangana', 'India'],
    description,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: title,
      itemListElement: keyPoints.map((point) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: point },
      })),
    },
  };

  return (
    <>
      <ScrollAnimations />
      <Header />

      <section style={{ backgroundColor: '#1c1d20', paddingTop: '140px', paddingBottom: '80px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: '14px' }}>
            {heroLabel}
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 400, lineHeight: 1.1, color: '#fff', maxWidth: '780px', marginBottom: '20px' }}>
            {heroTitle}
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgba(255,255,255,0.62)', maxWidth: '720px', lineHeight: '1.7em' }}>
            {heroIntro}
          </p>
        </div>
      </section>

      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container" style={{ display: 'grid', gap: '32px', gridTemplateColumns: '1.2fr 0.8fr' }}>
          <div>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
              Why it works
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 34px)', fontWeight: 400, color: '#000', marginBottom: '20px' }}>
              {title}
            </h2>
            <p style={{ fontFamily: font, fontSize: '16px', lineHeight: '1.7em', color: 'rgb(85,78,78)', marginBottom: '20px' }}>
              {description}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '12px' }}>
              {keyPoints.map((point) => (
                <li key={point} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', fontFamily: font, fontSize: '15px', lineHeight: '1.6em', color: '#000' }}>
                  <span style={{ color: '#1c1d20', fontFamily: fontBold, fontSize: '16px' }}>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ backgroundColor: '#f1f0eb', padding: '32px', borderRadius: '2px' }}>
            <p style={{ fontFamily: fontBold, fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '12px' }}>
              Service coverage
            </p>
            {serviceAreas.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px 0', display: 'grid', gap: '8px' }}>
                {serviceAreas.map((area) => (
                  <li key={area} style={{ fontFamily: font, fontSize: '15px', color: '#000' }}>{area}</li>
                ))}
              </ul>
            )}
            <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.7em', color: 'rgb(85,78,78)', marginBottom: '20px' }}>
              Need a tailored recommendation for your project? Our team can help you choose the right material, finish, and production method.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <a href="/services" style={{ color: '#000', textDecoration: 'underline', fontFamily: font, fontSize: '14px' }}>All services</a>
              <a href="/contact" style={{ color: '#000', textDecoration: 'underline', fontFamily: font, fontSize: '14px' }}>Contact us</a>
              <a href="/projects" style={{ color: '#000', textDecoration: 'underline', fontFamily: font, fontSize: '14px' }}>Projects</a>
            </div>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff', padding: '14px 24px', textDecoration: 'none', fontFamily: font, fontSize: '14px', letterSpacing: '0.03em' }}>
              Talk to our team
            </a>
          </div>
        </div>
      </section>

      {relatedLinks.length > 0 && (
        <section style={{ backgroundColor: '#f1f0eb', padding: '0 0 80px' }}>
          <div className="wix-container">
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '16px' }}>
              Related pages
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} style={{ color: '#000', textDecoration: 'underline', fontFamily: font, fontSize: '15px' }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
      <JsonLd data={serviceSchema} />
    </>
  );
}
