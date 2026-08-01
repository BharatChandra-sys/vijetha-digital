'use client';

import Link from 'next/link';

const projects = [
  {
    id: 1,
    title: 'BOOKLETS',
    description:
      'Premium quality booklets for catalogues, product brochures, annual reports and event programs. Saddle-stitched or perfect-bound, any page count, full-colour or mono.',
    image: '/images/project-booklets.jpg',
    href: '/projects/booklets',
  },
  {
    id: 2,
    title: 'VISITING CARDS',
    description:
      'Make your first impression count. Matte, gloss, spot UV, foil and kraft options available. Standard and custom sizes, single or double-sided, delivered fast.',
    image: '/images/project-cards.jpg',
    href: '/projects/cards',
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{ backgroundColor: '#ffffff', width: '100%', padding: '80px 0' }}
    >
      <div className="wix-container">

        {/* Header */}
        <div className="wix-motion wix-fade-up" style={{ marginBottom: '48px' }}>
          <h2 style={{
            fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
            fontSize: 'clamp(26px, 2.8vw, 36px)', fontWeight: 400,
            lineHeight: 1.2, color: '#000', marginBottom: '12px',
          }}>
            Our Projects
          </h2>
          <Link href="/projects" style={{
            fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
            fontSize: '14px', color: 'rgb(85,78,78)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '5px',
          }}>
            All Projects
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="projects-grid">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={project.href}
              className={`wix-motion wix-fade-up wix-delay-${i + 2}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
            >
              <div className="wix-img-wrap" style={{ aspectRatio: '16/10', marginBottom: '18px' }}>
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <h3 style={{
                fontFamily: "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif",
                fontSize: 'clamp(15px, 1.6vw, 18px)', fontWeight: 400,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: '#000', marginBottom: '10px',
              }}>
                {project.title}
              </h3>
              <p style={{
                fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
                fontSize: '14px', lineHeight: '1.6em', color: 'rgb(85,78,78)',
              }}>
                {project.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .projects-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 48px;
        }
        @media (max-width: 768px) {
          .projects-grid { grid-template-columns: 1fr; gap: 36px; }
        }
      `}</style>
    </section>
  );
}
