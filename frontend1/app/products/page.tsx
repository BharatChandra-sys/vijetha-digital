import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductsContent from './ProductsContent';
import HiddenSEOContent from '@/components/seo/HiddenSEOContent';
import JsonLd from '@/components/seo/JsonLd';
import { productsFaqContent } from './faq';

export const metadata: Metadata = {
  title: 'Printing Products in Hyderabad | Signage, Flex, Banners & Branding',
  description:
    'Explore Vijetha Digital's complete catalogue of signage boards, flex boards, banners, vehicle branding, exhibition displays, and promotional products for Hyderabad businesses.',
  alternates: {
    canonical: 'https://vijethadigital.com/products',
  },
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const hiddenSEOText = [
  'Vijetha Digital offers 30+ premium printing and signage products manufactured in-house at our Hyderabad facility.',
  'Product categories include signage solutions (LED boards, ACP cladding, acrylic letters, fascia boards, pylon signs), internal branding (office walls, reception areas, retail displays, hospital wayfinding), vehicle branding (car wraps, bus branding, bike graphics, fleet solutions), digital printing (flex, vinyl, UV, eco-solvent, 3D canvas), offset printing (brochures, catalogs, stationery, packaging), display and exhibition (standees, tents, light boxes, trade show booths), and outdoor advertising (flags, backdrops, stickers, canopies).',
  'All products available with same-day quotes, 24-72 hour production, custom sizing, bulk order discounts, professional installation, and pan-India delivery.',
  'Premium materials used: 3M vinyl for vehicle wraps, Goldplus ACP sheets for cladding, Asian Paints acrylics for letters, high-grade flex for outdoor durability, and certified fire-retardant materials for indoor applications.',
  'Serving retail chains, corporate offices, healthcare facilities, hospitality venues, educational institutions, real estate projects, automobile dealerships, FMCG brands, and government departments across Hyderabad, Telangana, and South India.',
];

export default function ProductsPage() {
  const productsFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: productsFaqContent.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <Header />
      <HiddenSEOContent content={hiddenSEOText} />

      {/* Page hero — server rendered */}
      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Our Catalogue
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '760px' }}>
            Premium printing products and branding materials for Hyderabad businesses.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '620px', lineHeight: '1.65em' }}>
            Explore high-quality signage boards, vehicle branding wraps, flex printing, exhibition displays, banners, stickers, and promotional materials designed for retail, corporate, hospitality, healthcare, and government projects.
          </p>
          <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)', marginTop: '16px', maxWidth: '620px', lineHeight: '1.65em' }}>
            From acrylic letters and ACP cladding to custom packaging and event graphics, Vijetha Digital offers a complete range of branding solutions under one roof with fast turnaround and dependable quality.
          </p>
        </div>
      </section>

      {/* Interactive content in client component */}
      <ProductsContent />

      {/* FAQ section */}
      <section style={{ backgroundColor: '#f7f5ef', padding: '80px 0' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Product Information
          </p>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 36px)', fontWeight: 400, color: '#000', marginBottom: '36px', maxWidth: '680px' }}>
            Common questions about our printing and signage products
          </h2>
          <div style={{ display: 'grid', gap: '16px' }}>
            {productsFaqContent.map((item) => (
              <div key={item.question} style={{ backgroundColor: '#fff', padding: '24px 28px', border: '1px solid #e8e8e4' }}>
                <p style={{ fontFamily: fontBold, fontSize: '16px', color: '#000', marginBottom: '8px' }}>{item.question}</p>
                <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <JsonLd data={productsFaqSchema} />
    </>
  );
}
