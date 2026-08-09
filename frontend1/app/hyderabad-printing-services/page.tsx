import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import HiddenSEOContent from '@/components/seo/HiddenSEOContent';
import { WA_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Printing Services in Hyderabad | Offset, Digital & Flex Printing | Vijetha Digital',
  description:
    'Professional printing services in Hyderabad. Offset printing, digital printing, flex printing, UV printing, screen printing for brochures, banners, stationery, packaging. Vijetha Digital — 15+ years, same-day available.',
  keywords:
    'printing services Hyderabad, offset printing Hyderabad, digital printing Hyderabad, flex printing Hyderabad, UV printing Hyderabad, screen printing Hyderabad, brochure printing Hyderabad, banner printing Hyderabad, catalogue printing Hyderabad, stationery printing Hyderabad',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-printing-services',
  },
  openGraph: {
    title: 'Printing Services in Hyderabad | Offset, Digital & Flex | Vijetha Digital',
    description: 'Professional printing services in Hyderabad. Offset, digital, flex, UV, screen printing. Same-day available. Fast turnaround.',
    url: 'https://vijethadigital.com/hyderabad-printing-services',
    type: 'website',
  },
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://vijethadigital.com/hyderabad-printing-services#webpage',
  url: 'https://vijethadigital.com/hyderabad-printing-services',
  name: 'Printing Services in Hyderabad | Vijetha Digital',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: { '@id': 'https://vijethadigital.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Printing Services Hyderabad', item: 'https://vijethadigital.com/hyderabad-printing-services' },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What printing services are available in Hyderabad at Vijetha Digital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital in Hyderabad offers: Digital printing (flex, vinyl, canvas, UV, eco-solvent), Offset printing (brochures, catalogs, flyers, stationery, packaging with spot UV, foil stamping, die-cutting), Screen printing (regulatory boards, flex boards, UV print, municipal signage), and Large format printing up to 64 inches wide using HP Latex 570 and Epson Surecolor machines with 1 lakh sq.ft per day capacity.',
      },
    },
    {
      '@type': 'Question',
      name: 'How fast is printing turnaround in Hyderabad at Vijetha Digital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital Hyderabad offers same-day printing for flex banners and standees under 500 sq.ft. Standard digital printing (vinyl, canvas) takes 1-2 days. Offset printing for brochures and flyers takes 3-5 days. Specialty finishing (spot UV, foil stamping) adds 1-2 extra days. Screen printing takes 3-5 days. Rush production available for urgent requirements at additional charges.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum order quantity for offset printing in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital recommends a minimum of 500 copies for offset printing to be cost-effective. For smaller quantities (under 500), digital printing is more economical. Offset printing at Vijetha Digital starts from Rs 2 per piece for A4 single-color flyers at 1,000+ quantity. Premium finishes (spot UV, foil, embossing) are priced separately.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you offer same-day printing in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Vijetha Digital offers same-day printing in Hyderabad for flex banners, vinyl banners, roll-up standee graphics, and digital prints under 500 sq.ft when files are submitted before 12 PM. The production facility at Nacharam IDA operates till 8 PM allowing for urgent same-day dispatch.',
      },
    },
    {
      '@type': 'Question',
      name: 'What printing equipment does Vijetha Digital use in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital\'s Hyderabad production facility uses: HP Latex 570 (64-inch wide format, 1440 dpi), Epson Surecolor S80670 (eco-solvent, 10,000 sq.ft/day), Roland Soljet EJ 640 (solvent, outdoor durability), 4-pillar screen printing machine (high-volume boards), K Tech 1325 HD CNC Router (precision cutting), Laser engraving machine, and Graphtec cutting plotter.',
      },
    },
  ],
};

const hiddenContent = [
  'Printing services Hyderabad — Vijetha Digital offers offset printing, digital printing, flex printing, UV printing, screen printing in Hyderabad with same-day turnaround available.',
  'Offset printing Hyderabad: brochures, flyers, catalogs, stationery, packaging, spot UV, foil stamping, die-cutting, embossing. Minimum 500 copies.',
  'Digital printing Hyderabad: HP Latex 570, Epson Surecolor S80670, 64-inch wide format, 1440 dpi, 1 lakh sq.ft per day capacity, same-day for under 500 sq.ft.',
  'Flex printing Hyderabad: frontlit flex, backlit flex, vinyl, mesh, canvas, eco-solvent. Rs 35 per sq.ft starting price.',
  'Screen printing Hyderabad: regulatory boards, no parking boards, government boards, UV print, 3D print, pole boards, flute boards.',
  'Printing areas Hyderabad: Nacharam IDA, Secunderabad, Madhapur, Gachibowli, Banjara Hills, Kukatpally, Ameerpet, Lakdikapool.',
];

export default function HyderabadPrintingServicesPage() {
  return (
    <>
      <Header />
      <HiddenSEOContent content={hiddenContent} />

      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Printing Services · Hyderabad
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '800px' }}>
            Professional printing services in Hyderabad — offset, digital, flex, UV, and screen printing.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '700px', lineHeight: '1.7em' }}>
            Vijetha Digital operates a 10,000 sq.ft production facility in Nacharam IDA with HP Latex 570, Epson Surecolor, and 5 other advanced machines delivering 1 lakh sq.ft per day with same-day service available.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', marginTop: '32px',
            backgroundColor: '#000', color: '#fff', fontFamily: font,
            fontSize: '14px', padding: '15px 40px', textDecoration: 'none',
          }}>
            Get Printing Quote
          </a>
        </div>
      </section>

      {/* Printing services */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '40px' }}>
            Printing services available in Hyderabad
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#e8e8e4', border: '1px solid #e8e8e4' }}>
            {[
              {
                title: 'Digital Printing (Large Format)',
                price: 'From Rs 35 / sq.ft',
                items: ['Flex / Vinyl Banners', 'Canvas & UV Print', '3D & Eco-Solvent Print', '64-inch max width, 1440 dpi', 'HP Latex 570 · Epson Surecolor', 'Same-day for under 500 sq.ft'],
              },
              {
                title: 'Offset Printing',
                price: 'From Rs 2 / piece',
                items: ['Brochures & Catalogs', 'Flyers & Pamphlets', 'Corporate Stationery', 'Packaging & Gift Boxes', 'Spot UV & Foil Stamping', 'Die-Cutting & Embossing'],
              },
              {
                title: 'Screen Printing',
                price: 'Custom quote',
                items: ['Regulatory Sign Boards', 'No Parking Boards', 'Government & Municipal Signs', 'UV Print Boards', 'Pole Hanging Boards', 'Flute Sheet Printing'],
              },
              {
                title: 'Exhibition & Display Printing',
                price: 'From Rs 1,500',
                items: ['Roll-Up Standees', 'Fabric Light Boxes', 'Demo Tent Graphics', 'Trade Show Banners', 'Event Backdrops', 'Table Covers & Throws'],
              },
            ].map(s => (
              <div key={s.title} style={{ backgroundColor: '#fff', padding: '32px' }}>
                <h3 style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '6px' }}>{s.title}</h3>
                <p style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.06em', color: 'rgba(0,0,0,0.45)', marginBottom: '16px', textTransform: 'uppercase' }}>{s.price}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.items.map(item => (
                    <li key={item} style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', lineHeight: '2em' }}>— {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: '#1c1d20', padding: '64px 0' }}>
        <div className="wix-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {[
              { value: '1 Lakh+', label: 'Sq.ft printed per day' },
              { value: 'Same Day', label: 'For orders under 500 sq.ft' },
              { value: '1440 dpi', label: 'Max print resolution' },
              { value: '7 Systems', label: 'Advanced printing machines' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: fontBold, fontSize: 'clamp(20px, 2.5vw, 32px)', color: '#fff', marginBottom: '8px' }}>{s.value}</p>
                <p style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#f7f5ef', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '36px' }}>
            Printing services Hyderabad — frequently asked questions
          </h2>
          <div style={{ display: 'grid', gap: '16px', maxWidth: '860px' }}>
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} style={{ backgroundColor: '#fff', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{item.name}</p>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <JsonLd data={pageSchema} />
      <JsonLd data={faqSchema} />

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: repeat(2, 1fr)"][style*="gap: 1px"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"],
          div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
