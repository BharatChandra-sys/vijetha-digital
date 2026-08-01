'use client';

import Link from 'next/link';

// Wix section bg = color_11 = white #ffffff
const projects = [
  {
    id: 1,
    title: 'BOOKLETS',
    description:
      "This is where the project description goes. Give an overview or go in depth — what it's all about, what inspired you, how you created it, or anything else you'd like visitors to know. To add Project descriptions, go to Manage Projects.",
    image: '/images/project-booklets.jpg',
    href: '/projects/booklets',
  },
  {
    id: 2,
    title: 'CARDS',
    description:
      "This is where the project description goes. Give an overview or go in depth — what it's all about, what inspired you, how you created it, or anything else you'd like visitors to know. To add Project descriptions, go to Manage Projects.",
    image: '/images/project-cards.jpg',
    href: '/projects/cards',
  },
];

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{ backgroundColor: '#ffffff', width: '100%', padding: '100px 0' }}
    >
      <div className="wix-container">

        {/* Header row */}
        <div
          className="wix-motion wix-fade-up"
          style={{ marginBottom: '60px' }}
        >
          {/* font_2 heading */}
          <h2 className="wix-font-2" style={{ marginBottom: '16px' }}>
            Our Projects
          </h2>

          {/* "All Projects →" link — font_8 */}
          <Link
            href="/projects"
            className="wix-font-8"
            style={{
              color: 'rgb(85,78,78)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.6')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            All Projects
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Projects grid — 2 columns */}
        <div className="projects-grid">
          {projects.map((project, i) => (
            <Link
              key={project.id}
              href={project.href}
              className={`wix-motion wix-fade-up wix-delay-${i + 2}`}
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
              }}
            >
              {/* Image */}
              <div
                className="wix-img-wrap"
                style={{ aspectRatio: '4/3', marginBottom: '20px' }}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* font_3 title */}
              <h3
                className="wix-font-3"
                style={{ marginBottom: '12px' }}
              >
                {project.title}
              </h3>

              {/* font_8 description */}
              <p
                className="wix-font-8"
                style={{ color: 'rgb(85,78,78)', lineHeight: '1.6em' }}
              >
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
          gap: 40px;
        }
        @media (max-width: 768px) {
          .projects-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
