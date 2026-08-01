import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductsContent from './ProductsContent';

export const metadata: Metadata = {
  title: 'Products | Vijetha Digital',
  description: 'Sign boards, printing services, banner stands, demo tents and promotional items — browse the full Vijetha Digital catalogue.',
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
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '700px' }}>
            Everything you need,<br />printed to perfection
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '520px', lineHeight: '1.65em' }}>
            Sign boards, flex printing, banner stands, demo tents and promotional items — all under one roof.
          </p>
        </div>
      </section>

      {/* Interactive content in client component */}
      <ProductsContent />

      <Footer />
    </>
  );
}
