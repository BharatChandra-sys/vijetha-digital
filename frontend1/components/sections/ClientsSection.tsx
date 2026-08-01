'use client';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

// Google favicon service — free, no auth, always returns an icon
const gLogo = (domain: string) =>
  `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;

const ROW_1 = [
  { name: 'Vivo',             logo: gLogo('vivo.com')               },
  { name: 'Samsung',          logo: gLogo('samsung.com')            },
  { name: 'Microsoft',        logo: gLogo('microsoft.com')          },
  { name: 'Airtel',           logo: gLogo('airtel.com')             },
  { name: 'Pepsi',            logo: gLogo('pepsi.com')              },
  { name: 'SBI',              logo: gLogo('sbi.co.in')              },
  { name: 'Swiggy',           logo: gLogo('swiggy.com')             },
  { name: 'OLA',              logo: gLogo('olacabs.com')            },
  { name: 'Jio',              logo: gLogo('jio.com')                },
  { name: 'Reliance Digital', logo: gLogo('reliancedigital.in')     },
];

const ROW_2 = [
  { name: "Dr. Reddy's",       logo: gLogo('drreddys.com')           },
  { name: 'Mi',                logo: gLogo('mi.com')                 },
  { name: 'Panasonic',         logo: gLogo('panasonic.com')          },
  { name: 'Cult.fit',          logo: gLogo('cult.fit')               },
  { name: 'Heritage',          logo: gLogo('heritagefoods.in')       },
  { name: 'GHMC',              logo: gLogo('ghmc.gov.in')            },
  { name: 'Coromandel',        logo: gLogo('coromandel.com')         },
  { name: 'GlobalData',        logo: gLogo('globaldata.com')         },
  { name: 'Telangana Tourism', logo: gLogo('telanganatourism.gov.in') },
  { name: 'Air Costa',         logo: gLogo('aircosta.in')            },
];

function MarqueeRow({
  items,
  reverse = false,
  speed = 40,
}: {
  items: { name: string; logo: string }[];
  reverse?: boolean;
  speed?: number;
}) {
  const doubled = [...items, ...items];
  return (
    <div
      className="marquee-track"
      style={{ '--speed': `${speed}s`, '--dir': reverse ? 'reverse' : 'normal' } as React.CSSProperties}
    >
      <div className="marquee-inner">
        {doubled.map((client, i) => (
          <div key={`${client.name}-${i}`} className="client-chip">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={client.logo}
              alt={`${client.name} logo`}
              width={28}
              height={28}
              className="client-logo"
            />
            <span className="client-name">{client.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsSection() {
  return (
    <section style={{ backgroundColor: '#ffedc9', width: '100%', padding: '96px 0', overflow: 'hidden' }}>

      {/* Centered header */}
      <div className="wix-container" style={{ textAlign: 'center' }}>
        <div className="wix-motion wix-fade-up" style={{ marginBottom: '64px' }}>
          <p style={{
            fontFamily: font, fontSize: '11px', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px',
          }}>
            Trusted By
          </p>
          <h2 style={{
            fontFamily: font,
            fontSize: 'clamp(28px, 3vw, 42px)',
            fontWeight: 400, lineHeight: 1.15, color: '#000',
          }}>
            India&apos;s leading brands<br />choose Vijetha Digital.
          </h2>
        </div>
      </div>

      {/* Two marquee rows — full bleed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <MarqueeRow items={ROW_1} reverse={false} speed={38} />
        <MarqueeRow items={ROW_2} reverse={true}  speed={46} />
      </div>

      {/* Centered footer note */}
      <div className="wix-container" style={{ textAlign: 'center' }}>
        <div className="wix-motion wix-fade-up" style={{ marginTop: '52px' }}>
          <p style={{ fontFamily: font, fontSize: '14px', color: 'rgb(85,78,78)' }}>
            1,000+ businesses across South India trust Vijetha Digital.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        .marquee-track {
          width: 100%;
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        .marquee-inner {
          display: flex;
          align-items: center;
          width: max-content;
          animation: marquee-scroll var(--speed, 40s) linear infinite;
          animation-direction: var(--dir, normal);
        }

        .marquee-track:hover .marquee-inner {
          animation-play-state: paused;
        }

        .client-chip {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 32px;
          white-space: nowrap;
          cursor: default;
        }

        .client-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          border-radius: 6px;
          opacity: 0.75;
          transition: opacity 0.2s ease;
          flex-shrink: 0;
        }

        .client-chip:hover .client-logo {
          opacity: 1;
        }

        .client-name {
          font-family: ${fontBold};
          font-size: 13px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.55);
          transition: color 0.2s ease;
          user-select: none;
        }

        .client-chip:hover .client-name {
          color: rgba(0,0,0,0.9);
        }

        @media (prefers-reduced-motion: reduce) {
          .marquee-inner { animation: none; }
          .marquee-inner { flex-wrap: wrap; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
