'use client';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

// Google favicon service — free, no auth, reliable
const gLogo = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

const clients = [
  { name: 'SBI',              domain: 'sbi.co.in',           desc: 'Branch Signage'    },
  { name: 'HDFC Bank',        domain: 'hdfcbank.com',        desc: 'ATM Branding'      },
  { name: 'Vivo',             domain: 'vivo.com',            desc: 'Dealer Branding'   },
  { name: 'Microsoft',        domain: 'microsoft.com',       desc: 'Office Interiors'  },
  { name: 'Samsung',          domain: 'samsung.com',         desc: 'Showroom Branding' },
  { name: 'Reliance Digital', domain: 'reliancedigital.in',  desc: 'Retail Signage'    },
  { name: 'Airtel',           domain: 'airtel.com',          desc: 'Telecom Branding'  },
  { name: 'Jio',              domain: 'jio.com',             desc: 'Store Branding'    },
];

export default function ClientLogos() {
  return (
    <section style={{ backgroundColor: '#f9f9f7', padding: '80px 0' }}>
      <div className="wix-container">

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{
            fontFamily: font,
            fontSize: '11px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgb(85,78,78)',
            marginBottom: '12px',
          }}>
            Trusted By
          </p>
          <h2 style={{
            fontFamily: font,
            fontSize: 'clamp(24px, 3vw, 36px)',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#000',
            marginBottom: '10px',
          }}>
            1000+ Leading Brands &amp; Businesses
          </h2>
          <p style={{
            fontFamily: font,
            fontSize: '15px',
            color: 'rgb(85,78,78)',
            maxWidth: '560px',
            margin: '0 auto',
          }}>
            From Fortune 500 companies to local businesses — trusted partners since 2009
          </p>
        </div>

        {/* Client Grid */}
        <div className="client-logos-grid">
          {clients.map((client, i) => (
            <div
              key={i}
              className="wix-motion wix-fade-up client-logo-card"
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gLogo(client.domain)}
                alt={`${client.name} logo`}
                width={36}
                height={36}
                className="logo-img"
              />
              <div style={{
                fontFamily: fontBold,
                fontSize: '15px',
                color: '#000',
                marginBottom: '3px',
              }}>
                {client.name}
              </div>
              <div style={{
                fontFamily: font,
                fontSize: '12px',
                color: 'rgb(85,78,78)',
              }}>
                {client.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .client-logos-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .client-logo-card {
          background: #fff;
          border: 1px solid #e8e8e4;
          padding: 32px 20px;
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .client-logo-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 6px;
          opacity: 0.75;
          transition: opacity 0.2s ease;
        }
        .client-logo-card:hover .logo-img {
          opacity: 1;
        }
        @media (max-width: 900px) {
          .client-logos-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 500px) {
          .client-logos-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
