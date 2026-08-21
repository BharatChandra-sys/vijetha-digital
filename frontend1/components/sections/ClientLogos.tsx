'use client';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

// Major client logos - builds trust and authority
const clients = [
  { name: 'Samsung', logo: '🏢', desc: 'Showroom Branding' },
  { name: 'Reliance Digital', logo: '🛒', desc: 'Retail Signage' },
  { name: 'Airtel', logo: '📱', desc: 'Telecom Branding' },
  { name: 'Jio', logo: '📡', desc: 'Store Branding' },
  { name: 'SBI', logo: '🏦', desc: 'Branch Signage' },
  { name: 'HDFC Bank', logo: '💳', desc: 'ATM Branding' },
  { name: 'Vivo', logo: '📱', desc: 'Dealer Branding' },
  { name: 'Microsoft', logo: '💻', desc: 'Office Interiors' },
];

export default function ClientLogos() {
  return (
    <section style={{ backgroundColor: '#f9f9f7', padding: '64px 0' }}>
      <div className="wix-container">
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p 
            style={{ 
              fontFamily: font, 
              fontSize: '11px', 
              letterSpacing: '0.18em', 
              textTransform: 'uppercase', 
              color: 'rgb(85,78,78)', 
              marginBottom: '12px' 
            }}
          >
            Trusted By
          </p>
          <h2 
            style={{ 
              fontFamily: font, 
              fontSize: 'clamp(24px, 3vw, 36px)', 
              fontWeight: 400, 
              lineHeight: 1.2, 
              color: '#000',
              marginBottom: '8px'
            }}
          >
            1000+ Leading Brands & Businesses
          </h2>
          <p 
            style={{ 
              fontFamily: font, 
              fontSize: '15px', 
              color: 'rgb(85,78,78)', 
              maxWidth: '600px', 
              margin: '0 auto' 
            }}
          >
            From Fortune 500 companies to local businesses — trusted partners since 2009
          </p>
        </div>

        {/* Client Grid */}
        <div className="client-grid">
          {clients.map((client, i) => (
            <div 
              key={i} 
              className="wix-motion wix-fade-up client-card"
              style={{ 
                transitionDelay: `${i * 50}ms`,
                backgroundColor: '#fff',
                padding: '32px 24px',
                textAlign: 'center',
                border: '1px solid #e8e8e4',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              <div style={{ 
                fontSize: '48px', 
                marginBottom: '16px',
                opacity: 0.8
              }}>
                {client.logo}
              </div>
              <div style={{ 
                fontFamily: fontBold, 
                fontSize: '16px', 
                color: '#000',
                marginBottom: '4px'
              }}>
                {client.name}
              </div>
              <div style={{ 
                fontFamily: font, 
                fontSize: '12px', 
                color: 'rgb(85,78,78)'
              }}>
                {client.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="stats-row" style={{ marginTop: '48px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fontBold, fontSize: '32px', color: '#000', marginBottom: '8px' }}>
              1000+
            </div>
            <div style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)' }}>
              Projects Completed
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fontBold, fontSize: '32px', color: '#000', marginBottom: '8px' }}>
              85%
            </div>
            <div style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)' }}>
              Client Retention Rate
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fontBold, fontSize: '32px', color: '#000', marginBottom: '8px' }}>
              4.9/5
            </div>
            <div style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)' }}>
              Average Rating
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: fontBold, fontSize: '32px', color: '#000', marginBottom: '8px' }}>
              15+
            </div>
            <div style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)' }}>
              Years Experience
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .client-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .client-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 32px;
          padding-top: 48px;
          border-top: 1px solid #e8e8e4;
        }
        @media (max-width: 900px) {
          .client-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
        }
        @media (max-width: 600px) {
          .client-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
      `}</style>
    </section>
  );
}
