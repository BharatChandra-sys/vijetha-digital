import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductsContent from './ProductsContent';

export const metadata: Metadata = {
  title: 'Printing Products in Hyderabad | Signage, Flex, Banners & Branding',
  description:
    'Explore Vijetha Digital’s complete catalogue of signage boards, flex boards, banners, vehicle branding, exhibition displays, and promotional products for Hyderabad businesses.',
  alternates: {
    canonical: 'https://vijethadigital.com/products',
  },
};

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";

export default function ProductsPage() {
  return (
    <>
      <Header />

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

      <Footer />
    </>
  );
}
