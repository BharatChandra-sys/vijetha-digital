'use client';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";

// Use direct CDN URLs for reliable logos — only for brands with known stable assets
// Everything else gets a clean initials badge
type Client = {
  name: string;
  logoUrl?: string;   // direct image URL — only set when we know it works
  initials: string;   // always present as fallback
  bg: string;         // bg colour for initials badge
  href: string;
};

const ROW_1: Client[] = [
  {
    name: 'Samsung',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=samsung.com',
    initials: 'Sa', bg: '#1428A0',
    href: 'https://www.samsung.com',
  },
  {
    name: 'Microsoft',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=microsoft.com',
    initials: 'Ms', bg: '#F25022',
    href: 'https://www.microsoft.com',
  },
  {
    name: 'Jio',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=jio.com',
    initials: 'Ji', bg: '#003087',
    href: 'https://www.jio.com',
  },
  {
    name: 'Airtel',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=airtel.in',
    initials: 'Ai', bg: '#E40000',
    href: 'https://www.airtel.in',
  },
  {
    name: 'Swiggy',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=swiggy.com',
    initials: 'Sw', bg: '#FC8019',
    href: 'https://www.swiggy.com',
  },
  {
    name: 'Reliance Digital',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=reliancedigital.in',
    initials: 'RD', bg: '#CC0000',
    href: 'https://www.reliancedigital.in',
  },
  {
    name: 'Vivo',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=vivo.com',
    initials: 'Vi', bg: '#415FFF',
    href: 'https://www.vivo.com',
  },
  {
    name: 'Pepsi',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=pepsi.com',
    initials: 'Pe', bg: '#004B93',
    href: 'https://www.pepsi.com',
  },
  {
    name: 'SBI',
    initials: 'SB', bg: '#2D4EC8',
    href: 'https://www.onlinesbi.sbi',
  },
  {
    name: 'OLA',
    initials: 'OL', bg: '#000000',
    href: 'https://www.olacabs.com',
  },
];

const ROW_2: Client[] = [
  {
    name: 'Mi',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=mi.com',
    initials: 'Mi', bg: '#FF6900',
    href: 'https://www.mi.com',
  },
  {
    name: 'Panasonic',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=panasonic.com',
    initials: 'Pa', bg: '#004B9B',
    href: 'https://www.panasonic.com',
  },
  {
    name: 'Cult.fit',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=cult.fit',
    initials: 'Cu', bg: '#FF3C3C',
    href: 'https://www.cult.fit',
  },
  {
    name: "Dr. Reddy's",
    initials: 'DR', bg: '#C8102E',
    href: 'https://www.drreddys.com',
  },
  {
    name: 'Heritage',
    logoUrl: 'https://www.google.com/s2/favicons?sz=64&domain=heritagefoods.in',
    initials: 'He', bg: '#6B3A2A',
    href: 'https://www.heritagefoods.in',
  },
  {
    name: 'Coromandel',
    initials: 'Co', bg: '#1D6F42',
    href: 'https://www.coromandel.com',
  },
  {
    name: 'GlobalData',
    initials: 'GD', bg: '#0F2D6B',
    href: 'https://www.globaldata.com',
  },
  {
    name: 'GHMC',
    initials: 'GH', bg: '#2E4A7A',
    href: 'https://www.ghmc.gov.in',
  },
  {
    name: 'Telangana Tourism',
    initials: 'TT', bg: '#006341',
    href: 'https://www.telanganatourism.gov.in',
  },
  {
    name: 'Air Costa',
    initials: 'AC', bg: '#003580',
    href: 'https://www.aircosta.in',
  },
];

// Renders either a real logo (if logoUrl provided) or a coloured initials badge
function LogoBadge({ client }: { client: Client }) {
  if (client.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={client.logoUrl}
        alt={client.name}
        width={22}
        height={22}
        style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 4, display: 'block', flexShrink: 0 }}
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        justifyContent:  'center',
        width:           22,
        height:          22,
        borderRadius:    4,
        backgroundColor: client.bg,
        fontFamily:      fontBold,
        fontSize:        8,
        fontWeight:      700,
        letterSpacing:   '0.04em',
        color:           '#fff',
        flexShrink:      0,
      }}
    >
      {client.initials}
    </span>
  );
}

function Chip({ client }: { client: Client }) {
  return (
    <a
      href={client.href}
      target="_blank"
      rel="noopener noreferrer"
      className="client-chip"
      title={client.name}
    >
      <LogoBadge client={client} />
      <span className="client-name">{client.name}</span>
    </a>
  );
}

function MarqueeRow({ items, reverse = false, speed = 40 }: { items: Client[]; reverse?: boolean; speed?: number }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="marquee-track"
      style={{ '--speed': `${speed}s`, '--dir': reverse ? 'reverse' : 'normal' } as React.CSSProperties}
    >
      <div className="marquee-inner">
        {doubled.map((client, i) => (
          <Chip key={`${client.name}-${i}`} client={client} />
        ))}
      </div>
    </div>
  );
}

export default function ClientsSection() {
  return (
    <section style={{ backgroundColor: '#ffedc9', width: '100%', padding: '96px 0', overflow: 'hidden', position: 'relative', zIndex: 5 }}>

      <div className="wix-container" style={{ textAlign: 'center' }}>
        <div className="wix-motion wix-fade-up" style={{ marginBottom: '64px' }}>
          <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '14px' }}>
            Trusted By
          </p>
          <h2 style={{ fontFamily: font, fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 400, lineHeight: 1.15, color: '#000' }}>
            India&apos;s leading brands<br />choose Vijetha Digital.
          </h2>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <MarqueeRow items={ROW_1} reverse={false} speed={38} />
        <MarqueeRow items={ROW_2} reverse={true}  speed={46} />
      </div>

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
          padding: 10px 28px;
          white-space: nowrap;
          text-decoration: none;
          border-radius: 2px;
          transition: background 0.2s ease;
        }
        .client-chip:hover {
          background: rgba(0,0,0,0.06);
        }
        .client-name {
          font-family: ${fontBold};
          font-size: 12px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(0,0,0,0.5);
          transition: color 0.2s ease;
          user-select: none;
        }
        .client-chip:hover .client-name {
          color: rgba(0,0,0,0.85);
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-inner { animation: none; flex-wrap: wrap; justify-content: center; }
        }
      `}</style>
    </section>
  );
}
