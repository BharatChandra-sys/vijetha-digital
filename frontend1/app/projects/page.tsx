import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';

export const metadata: Metadata = {
  title: 'Projects | Vijetha Digital',
  description: 'Browse our portfolio of printing projects — booklets, visiting cards, packaging, flex banners and more.',
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const projects = [
  {
    id: 1,
    title: 'BOOKLETS',
    category: 'Print',
    description:
      'Premium saddle-stitched booklets for product catalogues and corporate brochures. Produced on 130gsm gloss art paper with full-colour printing.',
    image: '/images/project-booklets.jpg',
  },
  {
    id: 2,
    title: 'VISITING CARDS',
    category: 'Print',
    description:
      'High-impact visiting cards with spot UV coating on matte laminate. Custom die-cut shapes and foil options available for premium brands.',
    image: '/images/project-cards.jpg',
  },
  {
    id: 3,
    title: 'CORPORATE STATIONERY',
    category: 'Stationery',
    description:
      'Complete branded stationery suite — letterheads, envelopes, compliment slips and presentation folders for a Hyderabad-based technology firm.',
    image: '/images/about-printing.jpg',
  },
];

export default function ProjectsPage() {
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
            Our Work
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '600px' }}>
            Projects we&apos;re<br />proud of
          </h1>
        </div>
      </section>

      {/* Projects grid */}
      <section style={{ backgroundColor: '#ffffff', padding: '80px 0' }}>
        <div className="wix-container">
          <div className="proj-grid">
            {projects.map((p, i) => (
              <div
                key={p.id}
                className="wix-motion wix-fade-up"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Image */}
                <div className="wix-img-wrap" style={{ aspectRatio: '4/3', marginBottom: '20px' }}>
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                {/* Category */}
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '8px' }}>
                  {p.category}
                </p>
                {/* Title */}
                <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(15px, 1.5vw, 18px)', fontWeight: 400, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#000', marginBottom: '10px' }}>
                  {p.title}
                </h2>
                {/* Description */}
                <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.6em', color: 'rgb(85,78,78)' }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '80px 0' }}>
        <div className="wix-container" style={{ textAlign: 'center' }}>
          <div className="wix-motion wix-fade-up">
            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 400, color: '#000', marginBottom: '18px' }}>
              Have a project in mind?
            </h2>
            <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginBottom: '32px' }}>
              Tell us what you need — we&apos;ll handle the rest.
            </p>
            <a href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20get%20a%20quote%20for%20printing%20services." target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#000', color: '#fff',
              fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
              padding: '16px 44px', textDecoration: 'none',
            }}>
              Start a Project
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }
        @media (max-width: 900px) {
          .proj-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .proj-grid { grid-template-columns: 1fr; gap: 36px; }
        }
      `}</style>
    </>
  );
}
