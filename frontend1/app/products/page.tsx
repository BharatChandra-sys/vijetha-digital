import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductsContent from './ProductsContent';
import HiddenSEOContent from '@/components/seo/HiddenSEOContent';
import JsonLd from '@/components/seo/JsonLd';
import FAQAccordion from '@/components/ui/FAQAccordion';
import { productsFaqContent } from './faq';
import { featuredProductSchemas } from '@/lib/product-schemas';

export const metadata: Metadata = {
  title: 'Printing Products in Hyderabad | Signage, Flex, Banners & Branding | Vijetha Digital',
  description:
    "Explore Vijetha Digital's complete catalogue of 30+ signage boards, flex boards, banners, vehicle branding, exhibition displays, and promotional products for Hyderabad businesses. Fast delivery, bulk pricing.",
  keywords:
    'printing products Hyderabad, signage products, LED sign board, ACP cladding sign, acrylic letter sign, vehicle wrap, flex printing, roll-up standee, trade show booth, branding products Hyderabad',
  alternates: {
    canonical: 'https://vijethadigital.com/products',
  },
  openGraph: {
    title: 'Printing Products in Hyderabad | Signage, Flex, Banners & Branding | Vijetha Digital',
    description: 'Browse 30+ premium printing and signage products. LED signs, vehicle wraps, flex printing, banners, exhibition displays, and more.',
    url: 'https://vijethadigital.com/products',
    type: 'website',
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
          <FAQAccordion items={productsFaqContent} />
        </div>
      </section>

      <Footer />
      <JsonLd data={productsFaqSchema} />
      {featuredProductSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': 'https://vijethadigital.com/products#webpage',
        url: 'https://vijethadigital.com/products',
        name: 'Printing Products in Hyderabad | Vijetha Digital',
        isPartOf: { '@id': 'https://vijethadigital.com/#website' },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
            { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://vijethadigital.com/products' },
          ],
        },
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Vijetha Digital Product Catalogue',
        description: '30+ premium printing and signage products by Vijetha Digital Hyderabad',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'LED Sign Board', url: 'https://vijethadigital.com/products/led-sign-board' },
          { '@type': 'ListItem', position: 2, name: 'ACP Cladding Sign', url: 'https://vijethadigital.com/products/acp-cladding-sign' },
          { '@type': 'ListItem', position: 3, name: 'Acrylic Letter Sign', url: 'https://vijethadigital.com/products/acrylic-letter-sign' },
          { '@type': 'ListItem', position: 4, name: 'Vehicle Wrap', url: 'https://vijethadigital.com/products/car-4-wheeler-wrap' },
          { '@type': 'ListItem', position: 5, name: 'Flex / Vinyl Printing', url: 'https://vijethadigital.com/products/flex-vinyl-printing' },
          { '@type': 'ListItem', position: 6, name: 'Roll-Up Standee', url: 'https://vijethadigital.com/products/roll-up-standee' },
          { '@type': 'ListItem', position: 7, name: 'Trade Show Booth', url: 'https://vijethadigital.com/products/trade-show-booth' },
          { '@type': 'ListItem', position: 8, name: 'Brochure / Catalogue', url: 'https://vijethadigital.com/products/brochure-catalogue' },
        ],
      }} />
    </>
  );
}
