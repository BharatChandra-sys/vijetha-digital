import Link from 'next/link';
import Image from 'next/image';
import { MACHINES, WIDEST_MM, formatMetres, sizeLabel } from '@/lib/machinery';

export default function MachinerySection() {
  return (
    <section id="machinery" className="vd-section vd-section--white vd-mach-home" aria-labelledby="machinery-heading">
      <div className="wix-container vd-mach-home-head wix-motion wix-fade-up">
        <div>
          <p className="vd-eyebrow">Our production floor</p>
          <h2 id="machinery-heading" className="vd-h2">
            Printed and cut in-house, up to {formatMetres(WIDEST_MM)} wide
          </h2>
        </div>
        <Link href="/machinery" className="vd-hero-link">See all machinery</Link>
      </div>

      <div className="vd-marquee" aria-label="Our machines">
        <ul className="vd-marquee-track">
          {[0, 1].map((copy) =>
            MACHINES.map((m) => (
              <li key={`${copy}-${m.slug}`} className="vd-marquee-card" aria-hidden={copy === 1 ? true : undefined}>
                <Link href={`/machinery#${m.slug}`} tabIndex={copy === 1 ? -1 : undefined}>
                  <span className="vd-marquee-media">
                    <Image
                      src={m.image}
                      alt={copy === 1 ? '' : m.imageAlt}
                      fill
                      sizes="280px"
                      style={{ objectFit: 'cover', objectPosition: m.portrait ? 'center 60%' : 'center' }}
                    />
                  </span>
                  <span className="vd-mach-card-name">{m.name}</span>
                  <span className="vd-mach-card-size">{sizeLabel(m)}</span>
                </Link>
              </li>
            )),
          )}
        </ul>
      </div>
      <p className="wix-container vd-swipe-hint" aria-hidden="true">Swipe to see all {MACHINES.length} machines →</p>
    </section>
  );
}
