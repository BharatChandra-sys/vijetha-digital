import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import { WA_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Services | Vijetha Digital',
  description: 'Full-service printing solutions — booklets, visiting cards, flex printing, banners, packaging and more.',
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const services = [
  {
    id: '01',
    title: 'Booklets & Catalogues',
    description:
      'Saddle-stitched or perfect-bound booklets for product catalogues, annual reports, event programs and corporate brochures. Full colour, any page count, delivered on time.',
    specs: ['A4 / A5 / Custom sizes', 'Saddle stitch or perfect bind', '90gsm–170gsm paper', 'Full colour + mono'],
  },
  {
    id: '02',
    title: 'Visiting Cards',
    description:
      'Make every introduction count. Choose from matte laminate, gloss, spot UV, foil stamping and textured finishes. Standard 3.5×2" or custom die-cut shapes.',
    specs: ['Standard & custom sizes', 'Matte, gloss, spot UV, foil', 'Single & double-sided', 'From 100 to 50,000 units'],
  },
  {
    id: '03',
    title: 'Flex & Banner Printing',
    description:
      'Large-format printing for hoardings, roll-up banners, pop-up displays, backdrops and outdoor signage. Weather-resistant inks, reinforced hems and eyelets.',
    specs: ['Flex, vinyl, canvas media', 'Up to 10 ft wide', 'UV-resistant inks', 'Hems, eyelets & poles'],
  },
  {
    id: '04',
    title: 'Packaging',
    description:
      'Custom boxes, bags, sleeves and labels for retail, gifting and e-commerce. Structural design support available. Minimum order quantities from 50 units.',
    specs: ['Rigid, folding & corrugated', 'Custom structural design', 'Full colour print', 'Food-safe options available'],
  },
  {
    id: '05',
    title: 'Offset Printing',
    description:
      'High-volume commercial printing for flyers, letterheads, envelopes, posters and newspapers. Pantone colour matching, varnish and special finishes available.',
    specs: ['Pantone colour matching', 'Gloss / matte varnish', 'Any substrate', 'Bulk pricing available'],
  },
  {
    id: '06',
    title: 'Stationery',
    description:
      'Complete corporate stationery sets — letterheads, envelopes, notepads, folders and presentation kits branded consistently for your business.',
    specs: ['Letterheads & envelopes', 'Branded notepads', 'Presentation folders', 'Full identity kits'],
  },
];

export default function ServicesPage() {
  return (
    <>
      <ScrollAnimations />
      <Header />

      {/* Page hero */}
      <section style={{
        backgroundColor: '#f1f0eb',
        paddingTop: '140px',
        paddingBottom: '72px',
        width: '100%',
      }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            What We Do
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '700px' }}>
            Printing services built<br />for every scale
          </h1>
        </div>
      </section>

      {/* Services list */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
        <div className="wix-container">
          <div className="services-list">
            {services.map((s, i) => (
              <div
                key={s.id}
                className="wix-motion wix-fade-up"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px minmax(0, 1fr) minmax(260px, 340px)',
                  gap: '48px',
                  padding: '48px 0',
                  borderTop: '1px solid #e8e8e4',
                  alignItems: 'start',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                {/* Number */}
                <p style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)', paddingTop: '4px' }}>
                  {s.id}
                </p>
                {/* Title + description */}
                <div>
                  <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 1.8vw, 24px)', fontWeight: 400, letterSpacing: '0.04em', color: '#000', marginBottom: '14px' }}>
                    {s.title}
                  </h2>
                  <p style={{ fontFamily: font, fontSize: '15px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>
                    {s.description}
                  </p>
                </div>
                {/* Specs */}
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.specs.map(spec => (
                    <li key={spec} style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)', lineHeight: '1.8em' }}>
                      — {spec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {/* Last border */}
            <div style={{ borderTop: '1px solid #e8e8e4' }} />
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section style={{ backgroundColor: '#ffedc9', padding: '80px 0' }}>
        <div className="wix-container" style={{ textAlign: 'center' }}>
          <div className="wix-motion wix-fade-up">
            <h2 style={{ fontFamily: font, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, color: '#000', marginBottom: '20px' }}>
              Ready to print?
            </h2>
            <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginBottom: '36px' }}>
              Get a quote in under 24 hours. No hidden costs.
            </p>
            <a href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20get%20a%20quote%20for%20printing%20services." target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#000', color: '#fff',
              fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
              padding: '16px 44px', textDecoration: 'none',
            }}>
              Get a Quote
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        /* Tablet: hide specs column */
        @media (max-width: 900px) {
          .services-list > div {
            grid-template-columns: 48px 1fr !important;
            gap: 32px !important;
          }
          .services-list > div > ul {
            display: none;
          }
        }
        
        /* Mobile: single column */
        @media (max-width: 600px) {
          .services-list > div {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
            padding: 32px 0 !important;
          }
        }
      `}</style>
    </>
  );
}
