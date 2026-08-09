import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/seo/JsonLd';
import HiddenSEOContent from '@/components/seo/HiddenSEOContent';
import { WA_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Vehicle Branding in Hyderabad | Car, Bus & Fleet Wrapping | Vijetha Digital',
  description:
    'Professional vehicle branding in Hyderabad. Car wraps, bus branding, van graphics, 2-wheeler decals, and fleet branding using 3M and Avery Dennison vinyl. 5-7 year outdoor durability. Vijetha Digital — 15+ years.',
  keywords:
    'vehicle branding Hyderabad, car wrap Hyderabad, vehicle wrap Hyderabad, bus branding Hyderabad, van branding Hyderabad, fleet branding Hyderabad, 2 wheeler branding Hyderabad, vehicle graphics Hyderabad, vinyl wrap Hyderabad',
  alternates: {
    canonical: 'https://vijethadigital.com/hyderabad-vehicle-branding',
  },
  openGraph: {
    title: 'Vehicle Branding in Hyderabad | Car, Bus & Fleet Wrapping | Vijetha Digital',
    description: 'Professional vehicle branding and wrapping in Hyderabad using 3M vinyl. Cars, buses, vans, 2-wheelers, fleet. 5-7 year durability.',
    url: 'https://vijethadigital.com/hyderabad-vehicle-branding',
    type: 'website',
  },
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://vijethadigital.com/hyderabad-vehicle-branding#webpage',
  url: 'https://vijethadigital.com/hyderabad-vehicle-branding',
  name: 'Vehicle Branding in Hyderabad | Vijetha Digital',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: { '@id': 'https://vijethadigital.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Vehicle Branding Hyderabad', item: 'https://vijethadigital.com/hyderabad-vehicle-branding' },
    ],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Vehicle Branding and Wrapping',
  description: 'Professional vehicle branding for cars, buses, vans, 2-wheelers, and fleets in Hyderabad using UV-resistant 3M and Avery Dennison vinyl.',
  provider: { '@id': 'https://vijethadigital.com/#organization' },
  areaServed: [
    { '@type': 'City', name: 'Hyderabad' },
    { '@type': 'State', name: 'Telangana' },
    { '@type': 'State', name: 'Andhra Pradesh' },
  ],
  offers: {
    '@type': 'Offer',
    price: '8000',
    priceCurrency: 'INR',
    availability: 'https://schema.org/InStock',
    priceValidUntil: '2027-12-31',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Vehicle Branding Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Car / 4-Wheeler Full Wrap', description: 'Full vehicle wrap for cars and SUVs using 3M vinyl' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Bus & Van Branding', description: 'Large-format bus and van graphics for fleet branding' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: '2-Wheeler Branding', description: 'Bike and scooter graphics and decals' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Fleet Branding', description: 'Complete fleet branding programs for corporate vehicles' } },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does vehicle branding cost in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vehicle branding costs in Hyderabad at Vijetha Digital start from Rs 8,000 for a 2-wheeler, Rs 15,000-25,000 for a car partial wrap, Rs 35,000-60,000 for a full car wrap, Rs 40,000-80,000 for vans, and Rs 80,000-1,50,000 for buses depending on size and design complexity. All prices include design, printing, and installation.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does vehicle branding last in Hyderabad weather?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vijetha Digital uses 3M and Avery Dennison UV-resistant cast vinyl rated for 5-7 years outdoor durability in Indian weather conditions. The vinyl is laminated with UV protection and weather-resistant coating to handle Hyderabad\'s heat, rain, and sun. Proper washing with mild soap extends vinyl life significantly.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can vehicle branding be removed without damaging car paint?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Vehicle wraps applied by Vijetha Digital using 3M or Avery Dennison cast vinyl can be cleanly removed after their service life without damaging the original paint, provided the paint was in good condition before application. The vinyl actually protects the original paint from UV fading and minor scratches.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does vehicle branding installation take in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Vehicle wrap installation at Vijetha Digital Hyderabad takes 1 day for 2-wheelers and partial car wraps, 1-2 days for full car wraps, and 2-3 days for vans and buses. The vehicle needs to be clean and available at our Nacharam production facility. Design and printing is completed 1-2 days before installation begins.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Vijetha Digital do fleet vehicle branding for companies in Hyderabad?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Vijetha Digital specializes in fleet branding programs for companies with 5 or more vehicles in Hyderabad. Fleet services include standardized design templates, consistent quality across all vehicles, volume pricing discounts, scheduled batch production, and nationwide installation support for companies operating across multiple cities.',
      },
    },
  ],
};

const hiddenContent = [
  'Vehicle branding Hyderabad — Vijetha Digital provides professional car wrap, bus branding, van graphics, 2-wheeler decals, and fleet branding in Hyderabad, Telangana.',
  'Vehicle branding materials: 3M vinyl wrap, Avery Dennison cast vinyl, UV-resistant lamination. 5-7 years outdoor durability in Indian weather.',
  'Vehicle branding process: design mockup, printing on premium vinyl, surface preparation, vinyl application with heat gun, edge sealing, quality inspection.',
  'Vehicle types: 2-wheelers (bikes, scooters), cars, hatchbacks, sedans, SUVs, vans, minivans, buses, trucks, heavy commercial vehicles.',
  'Fleet branding Hyderabad: standardized templates, volume pricing, scheduled production, nationwide installation support.',
  'Vehicle branding areas in Hyderabad: Nacharam, Secunderabad, Banjara Hills, Kukatpally, Gachibowli, Madhapur, Kondapur, Miyapur, LB Nagar, Dilsukhnagar.',
];

export default function HyderabadVehicleBrandingPage() {
  return (
    <>
      <Header />
      <HiddenSEOContent content={hiddenContent} />

      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Vehicle Branding · Hyderabad
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '800px' }}>
            Professional vehicle branding and car wrapping in Hyderabad.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '700px', lineHeight: '1.7em' }}>
            Turn your vehicles into moving brand media. Vijetha Digital delivers professional car wraps, bus branding, van graphics, fleet branding, and 2-wheeler decals in Hyderabad using 3M and Avery Dennison UV-resistant vinyl rated for 5-7 years.
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '32px', flexWrap: 'wrap' }}>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: '#000', color: '#fff', fontFamily: font,
              fontSize: '14px', padding: '15px 40px', textDecoration: 'none',
            }}>
              Get Vehicle Branding Quote
            </a>
            <a href="/services" style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: 'transparent', color: '#000', fontFamily: font,
              fontSize: '14px', padding: '15px 40px', textDecoration: 'none',
              border: '1px solid #000',
            }}>
              View All Services
            </a>
          </div>
        </div>
      </section>

      {/* Services */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '40px' }}>
            Vehicle branding services in Hyderabad
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#e8e8e4', border: '1px solid #e8e8e4' }}>
            {[
              { title: 'Car & 4-Wheeler Wrap', desc: 'Full or partial vinyl wraps for cars, hatchbacks, sedans, and SUVs. Starts from Rs 15,000. Premium 3M cast vinyl with UV lamination.', detail: 'Turnaround: 1-2 days' },
              { title: 'Bus & Commercial Vehicle Branding', desc: 'Large-format bus branding, van wraps, and truck graphics for maximum road visibility. Full and partial options.', detail: 'Turnaround: 2-3 days' },
              { title: '2-Wheeler Branding', desc: 'Bike and scooter decals, graphics, and full wraps for delivery bikes, promotional vehicles, and personal branding.', detail: 'Turnaround: 1 day' },
              { title: 'Fleet Branding Programs', desc: 'Standardized branding for 5+ vehicle fleets. Volume pricing, consistent quality across all vehicles, nationwide support.', detail: 'Custom timeline' },
              { title: 'Delivery Vehicle Branding', desc: 'Purpose-designed branding for delivery bikes, vans, and box trucks with contact details, QR codes, and brand identity.', detail: 'Turnaround: 1-2 days' },
              { title: 'Promotional Vehicle Wraps', desc: 'Event and campaign vehicle wraps for product launches, promotions, and roadshow activations across Hyderabad.', detail: 'Rush available' },
            ].map(s => (
              <div key={s.title} style={{ backgroundColor: '#fff', padding: '32px' }}>
                <h3 style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '10px' }}>{s.title}</h3>
                <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.65em', color: 'rgb(85,78,78)', marginBottom: '12px' }}>{s.desc}</p>
                <p style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)' }}>{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '40px' }}>
            How vehicle branding works at Vijetha Digital
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
            {[
              { step: '01', title: 'Design & Mockup', desc: 'Your brand applied to a 3D vehicle mockup for approval before printing.' },
              { step: '02', title: 'Vinyl Printing', desc: 'Printed on 3M or Avery vinyl with UV lamination at our Nacharam facility.' },
              { step: '03', title: 'Surface Prep', desc: 'Vehicle cleaned, degreased, and inspected for optimal vinyl adhesion.' },
              { step: '04', title: 'Application & Seal', desc: 'Panel-by-panel vinyl application with heat sealing on all edges.' },
            ].map(p => (
              <div key={p.step}>
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '12px' }}>{p.step}</p>
                <p style={{ fontFamily: fontBold, fontSize: '15px', color: '#000', marginBottom: '8px' }}>{p.title}</p>
                <p style={{ fontFamily: font, fontSize: '13px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 400, color: '#000', marginBottom: '36px' }}>
            Vehicle branding Hyderabad — frequently asked questions
          </h2>
          <div style={{ display: 'grid', gap: '16px', maxWidth: '860px' }}>
            {faqSchema.mainEntity.map((item) => (
              <div key={item.name} style={{ backgroundColor: '#f9f9f7', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{item.name}</p>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{item.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <JsonLd data={pageSchema} />
      <JsonLd data={serviceSchema} />
      <JsonLd data={faqSchema} />

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] { grid-template-columns: repeat(2, 1fr) !important; }
          div[style*="grid-template-columns: repeat(2, 1fr)"][style*="gap: 1px"] { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"],
          div[style*="grid-template-columns: repeat(2, 1fr)"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
