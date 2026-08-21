'use client';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

const badges = [
  { label: '15+', sublabel: 'Years Experience', desc: 'Since 2009' },
  { label: '1000+', sublabel: 'Projects Delivered', desc: 'Happy Clients' },
  { label: 'Same Day', sublabel: 'Printing Available', desc: 'Under 500 sq.ft' },
  { label: '85%', sublabel: 'Client Retention', desc: 'Rate' },
];

export default function TrustBadges() {
  return (
    <section style={{ backgroundColor: '#000', color: '#fff', padding: '40px 0' }}>
      <div className="wix-container">
        <div className="trust-grid">
          {badges.map((badge, i) => (
            <div 
              key={i} 
              className="wix-motion wix-fade-up"
              style={{ 
                textAlign: 'center', 
                transitionDelay: `${i * 100}ms` 
              }}
            >
              <div style={{ 
                fontFamily: fontBold, 
                fontSize: 'clamp(32px, 4vw, 48px)', 
                fontWeight: 400, 
                lineHeight: 1, 
                marginBottom: '8px',
                color: '#fff' 
              }}>
                {badge.label}
              </div>
              <div style={{ 
                fontFamily: font, 
                fontSize: 'clamp(11px, 1.2vw, 13px)', 
                letterSpacing: '0.08em', 
                textTransform: 'uppercase', 
                color: 'rgba(255,255,255,0.75)',
                marginBottom: '4px' 
              }}>
                {badge.sublabel}
              </div>
              <div style={{ 
                fontFamily: font, 
                fontSize: '12px', 
                color: 'rgba(255,255,255,0.5)' 
              }}>
                {badge.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
        }
        @media (max-width: 900px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px 24px;
          }
        }
        @media (max-width: 500px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px 16px;
          }
        }
      `}</style>
    </section>
  );
}
