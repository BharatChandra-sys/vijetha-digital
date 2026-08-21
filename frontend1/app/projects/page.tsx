import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import JsonLd from '@/components/seo/JsonLd';

export const metadata: Metadata = {
  title: 'Our Work | Printing & Signage Projects Portfolio | Vijetha Digital Hyderabad',
  description:
    'Portfolio of 1,000+ printing and branding projects by Vijetha Digital — LED signs, vehicle fleets, office branding and exhibitions across Hyderabad.',
  alternates: {
    canonical: 'https://vijethadigital.com/projects',
  },
  openGraph: {
    title: 'Our Work | Printing & Signage Projects by Vijetha Digital',
    description: '15+ years of completed printing and branding projects for 1000+ clients across Hyderabad and South India.',
    url: 'https://vijethadigital.com/projects',
    type: 'website',
  },
};

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const projects = [
  {
    id: 1,
    title: 'LED Sign Board — Retail Chain',
    category: 'Signage',
    description: 'Multi-store LED fascia sign board rollout for a retail chain across 12 Hyderabad locations. Aluminium frame, acrylic face, IP65-rated LED modules with 2-year warranty.',
    tag: 'Signage',
    image: '/images/project-booklets.webp',
  },
  {
    id: 2,
    title: 'Vehicle Fleet Branding — Delivery Company',
    category: 'Vehicle Branding',
    description: '50-vehicle fleet wrap using 3M cast vinyl for a leading FMCG delivery brand in Telangana. Full wrap with contact details, QR codes, and brand identity across bikes, vans, and trucks.',
    tag: 'Vehicle Branding',
    image: '/images/project-cards.webp',
  },
  {
    id: 3,
    title: 'Corporate Office Branding — Tech Firm',
    category: 'Office Branding',
    description: 'Complete office interior branding for a Hyderabad-based technology company — reception wall mural, wayfinding system, glass film graphics, and conference room branding.',
    tag: 'Office Branding',
    image: '/images/about-printing.webp',
  },
  {
    id: 4,
    title: 'ACP Cladding — Hospital Signage',
    category: 'Signage',
    description: 'Premium ACP cladding with acrylic 3D letter signs for a multi-specialty hospital in Hyderabad. Goldplus 4mm ACP with brushed finish, precision CNC-cut letters, and directional signage system.',
    tag: 'ACP Cladding',
    image: '/images/project-booklets.webp',
  },
  {
    id: 5,
    title: 'Trade Show Booth — Pharma Company',
    category: 'Exhibition',
    description: 'Custom 20x20 ft modular exhibition booth for a pharmaceutical company at a national medical conference in Hyderabad. Fabric light boxes, demo counters, and branded graphics throughout.',
    tag: 'Exhibition',
    image: '/images/project-cards.webp',
  },
  {
    id: 6,
    title: 'Offset Catalogue — Jewellery Brand',
    category: 'Offset Printing',
    description: 'Luxury product catalogue on 170gsm art paper with spot UV on cover, foil stamping on brand logo, and die-cut inserts. 5,000-copy run completed in 5 working days.',
    tag: 'Print',
    image: '/images/about-printing.webp',
  },
  {
    id: 7,
    title: 'Pylon Sign — Commercial Complex',
    category: 'Signage',
    description: 'Freestanding 25-ft double-sided pylon sign for a commercial complex in Gachibowli, Hyderabad. Structural steel base, aluminium cladding, full-color digital print faces with LED backlit modules.',
    tag: 'Signage',
    image: '/images/project-booklets.webp',
  },
  {
    id: 8,
    title: 'School Branding — Campus Signage',
    category: 'Signage',
    description: 'Complete campus signage system for a CBSE school — entry gate sign, department identification boards, corridor wayfinding, sports ground display boards, and motivational wall graphics.',
    tag: 'Education',
    image: '/images/project-cards.webp',
  },
  {
    id: 9,
    title: 'Flex Printing — Telecom Campaign',
    category: 'Digital Printing',
    description: 'Large-scale flex banner printing campaign for a telecom brand across 200+ retail outlets in Hyderabad. HP Latex 570 printing on frontlit flex with weather-resistant lamination.',
    tag: 'Digital Print',
    image: '/images/about-printing.webp',
  },
];

const stats = [
  { value: '1,000+', label: 'Projects Completed' },
  { value: '15+', label: 'Years of Experience' },
  { value: '12+', label: 'Industries Served' },
  { value: '3', label: 'Hyderabad Branches' },
];

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://vijethadigital.com/projects#webpage',
  url: 'https://vijethadigital.com/projects',
  name: 'Our Work | Printing & Signage Projects by Vijetha Digital',
  description: 'Portfolio of 1000+ printing, signage, and branding projects completed by Vijetha Digital across Hyderabad and South India.',
  isPartOf: { '@id': 'https://vijethadigital.com/#website' },
  about: { '@id': 'https://vijethadigital.com/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://vijethadigital.com/' },
      { '@type': 'ListItem', position: 2, name: 'Our Work', item: 'https://vijethadigital.com/projects' },
    ],
  },
};

export default function ProjectsPage() {
  return (
    <>
      <ScrollAnimations />
      <Header />

      {/* Page hero */}
      <section style={{ backgroundColor: '#f1f0eb', paddingTop: '140px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Our Work
          </p>
          <h1 style={{ fontFamily: font, fontSize: 'clamp(36px, 4.5vw, 58px)', fontWeight: 400, lineHeight: 1.1, color: '#000', maxWidth: '760px' }}>
            1,000+ printing and branding projects delivered across Hyderabad and South India.
          </h1>
          <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginTop: '20px', maxWidth: '680px', lineHeight: '1.7em' }}>
            From LED sign boards and vehicle fleets to exhibition booths and offset catalogues — Vijetha Digital has delivered high-quality branding solutions for retail, corporate, healthcare, government, and hospitality clients since 2009.
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ backgroundColor: '#1c1d20', padding: '40px 0' }}>
        <div className="wix-container">
          <div className="stats-strip">
            {stats.map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: fontBold, fontSize: 'clamp(22px, 2.5vw, 34px)', color: '#fff', marginBottom: '4px' }}>{s.value}</p>
                <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects grid */}
      <section style={{ backgroundColor: '#fff', padding: '80px 0' }}>
        <div className="wix-container">
          <div style={{ marginBottom: '48px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '10px' }}>
              Project Portfolio
            </p>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(22px, 2.5vw, 36px)', fontWeight: 400, color: '#000', maxWidth: '600px' }}>
              Featured projects across signage, printing, branding, and exhibition
            </h2>
          </div>

          <div className="proj-grid">
            {projects.map((p, i) => (
              <div
                key={p.id}
                className="proj-card wix-motion wix-fade-up"
                style={{ transitionDelay: `${(i % 3) * 80}ms` }}
              >
                {/* Image */}
                <div style={{ aspectRatio: '16/10', overflow: 'hidden', backgroundColor: '#f1f0eb', marginBottom: '20px' }}>
                  <img
                    src={p.image}
                    alt={`${p.title} — Vijetha Digital`}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                {/* Tag */}
                <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '8px' }}>
                  {p.category}
                </p>
                {/* Title */}
                <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(14px, 1.4vw, 17px)', fontWeight: 400, letterSpacing: '0.03em', color: '#000', marginBottom: '10px', lineHeight: '1.4' }}>
                  {p.title}
                </h2>
                {/* Description */}
                <p style={{ fontFamily: font, fontSize: '14px', lineHeight: '1.65em', color: 'rgb(85,78,78)' }}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries strip */}
      <section style={{ backgroundColor: '#f1f0eb', padding: '64px 0' }}>
        <div className="wix-container">
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '20px', textAlign: 'center' }}>
            Industries we serve
          </p>
          <div className="industries-grid">
            {['Retail & Showrooms', 'Corporate & IT', 'Healthcare & Hospitals', 'Hospitality & Hotels', 'Education & Colleges', 'Government & PSU', 'FMCG & Pharma', 'Real Estate & Construction', 'Automotive & Dealerships', 'Banking & Finance', 'Telecom & Media', 'Events & Exhibitions'].map(ind => (
              <div key={ind} style={{
                backgroundColor: '#fff', padding: '14px 18px', border: '1px solid #e8e8e4',
                fontFamily: font, fontSize: '13px', color: '#000', textAlign: 'center',
              }}>
                {ind}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#1c1d20', padding: '80px 0' }}>
        <div className="wix-container" style={{ textAlign: 'center' }}>
          <div className="wix-motion wix-fade-up">
            <h2 style={{ fontFamily: font, fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 400, color: '#fff', marginBottom: '18px' }}>
              Have a project in mind?
            </h2>
            <p style={{ fontFamily: font, fontSize: '16px', color: 'rgba(255,255,255,0.55)', marginBottom: '32px' }}>
              Tell us what you need — free quote within 4–6 hours.
            </p>
            <a href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20get%20a%20quote%20for%20printing%20services." target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#fff', color: '#000',
              fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
              padding: '16px 44px', textDecoration: 'none',
            }}>
              Start a Project
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <JsonLd data={portfolioSchema} />

      <style>{`
        .stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        .proj-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px 32px;
        }
        .proj-card {
          display: flex;
          flex-direction: column;
        }
        .industries-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 8px;
        }
        @media (max-width: 1100px) {
          .industries-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 900px) {
          .proj-grid { grid-template-columns: repeat(2, 1fr); gap: 32px 24px; }
          .stats-strip { grid-template-columns: repeat(2, 1fr); gap: 24px; }
          .industries-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 600px) {
          .proj-grid { grid-template-columns: 1fr; gap: 36px; }
          .industries-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </>
  );
}
