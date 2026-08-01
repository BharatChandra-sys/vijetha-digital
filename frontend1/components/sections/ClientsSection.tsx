'use client';

const clients = [
  { id: 1, name: 'Hackmage' },
  { id: 2, name: 'SPAZIO'   },
  { id: 3, name: 'Image'    },
];

export default function ClientsSection() {
  return (
    <section style={{ backgroundColor: '#ffedc9', width: '100%', padding: '80px 0' }}>
      <div className="wix-container">

        {/* Header */}
        <div
          className="wix-motion wix-fade-up"
          style={{ textAlign: 'center', marginBottom: '56px' }}
        >
          <p
            className="wix-font-9"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgb(85,78,78)',
              marginBottom: '12px',
            }}
          >
            Our Clients
          </p>
          <h2 className="wix-font-2" style={{ marginBottom: '12px' }}>
            We&apos;re proud to work with<br />these companies
          </h2>
        </div>

        {/* Client names — 3 columns */}
        <div className="clients-grid">
          {clients.map((client, index) => (
            <div
              key={client.id}
              className={`wix-motion wix-fade-up wix-delay-${index + 2}`}
              style={{ textAlign: 'center' }}
            >
              <p
                className="wix-font-3"
                style={{ fontSize: '22px', letterSpacing: '0.05em' }}
              >
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
          gap: 40px;
          max-width: 700px;
          margin: 0 auto;
          align-items: center;
        }
        @media (max-width: 640px) {
          .clients-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>
    </section>
  );
}
