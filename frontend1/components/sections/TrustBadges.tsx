'use client';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";

const badges = [
  { label: '15+',       sublabel: 'Years Experience',   desc: 'Since 2009'      },
  { label: '1000+',     sublabel: 'Projects Delivered',  desc: 'Happy Clients'   },
  { label: 'Same Day',  sublabel: 'Printing Available',  desc: 'Under 500 sq.ft' },
  { label: '85%',       sublabel: 'Client Retention',    desc: 'Rate'            },
];

export default function TrustBadges() {
  return (
    <section style={{ backgroundColor: '#000', color: '#fff', padding: '28px 0' }}>
      <div className="wix-container">
        <div className="trust-grid">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="wix-motion wix-fade-up"
              style={{ textAlign: 'center', transitionDelay: `${i * 80}ms` }}
            >
              <div style={{
                fontFamily:    font,
                fontSize:      '22px',
                fontWeight:    400,
                lineHeight:    1.1,
                letterSpacing: '0.01em',
                marginBottom:  '5px',
                color:         '#fff',
              }}>
                {badge.label}
              </div>

              <div style={{
                fontFamily:    font,
                fontSize:      '10px',
                fontWeight:    400,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color:         'rgba(255,255,255,0.6)',
                marginBottom:  '2px',
              }}>
                {badge.sublabel}
              </div>

              <div style={{
                fontFamily: font,
                fontSize:   '10px',
                fontWeight: 400,
                color:      'rgba(255,255,255,0.35)',
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
          gap: 24px;
        }
        @media (max-width: 900px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px 16px;
          }
        }
      `}</style>
    </section>
  );
}
