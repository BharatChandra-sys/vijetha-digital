'use client';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

// Real clients from the existing frontend data
const clients = [
  { id: 1, name: 'Hackmage'  },
  { id: 2, name: 'SPAZIO'    },
  { id: 3, name: 'Image Co.' },
];

export default function ClientsSection() {
  return (
    <section style={{ backgroundColor: '#ffedc9', width: '100%', padding: '80px 0' }}>
      <div className="wix-container">

        <div className="wix-motion wix-fade-up" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '12px' }}>
            Our Clients
          </p>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(24px, 2.6vw, 34px)', fontWeight: 400, lineHeight: 1.25, color: '#000' }}>
            Trusted by 500+ businesses<br />across Hyderabad
          </h2>
        </div>

        <div className="clients-grid">
          {clients.map((client, i) => (
            <div
              key={client.id}
              className={`wix-motion wix-fade-up wix-delay-${i + 2}`}
              style={{ textAlign: 'center' }}
            >
              <p style={{ fontFamily: fontBold, fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 400, letterSpacing: '0.04em', color: '#000' }}>
                {client.name}
              </p>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .clients-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          max-width: 640px;
          margin: 0 auto;
          align-items: center;
        }
        @media (max-width: 480px) {
          .clients-grid { grid-template-columns: 1fr; gap: 20px; }
        }
      `}</style>
    </section>
  );
}
