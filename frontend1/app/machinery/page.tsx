import type { Metadata } from 'next';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import JsonLd from '@/components/seo/JsonLd';
import { CmykChips } from '@/components/brand/CmykStrip';
import MachineMedia from '@/components/machinery/MachineMedia';
import ScaleStrip from '@/components/machinery/ScaleStrip';
import VisitSection from '@/components/sections/VisitSection';
import { MACHINES, OTHER_EQUIPMENT, WIDEST_MM, formatMetres, sizeLabel } from '@/lib/machinery';
import { PHONE_RAW } from '@/lib/constants';

const URL = 'https://vijethadigital.com/machinery';

export const metadata: Metadata = {
  title: 'Our Machinery: 3.2 m Printing, UV Flatbed, CNC & Laser',
  description:
    'The printers and cutters at our Chengicherla production floor: 3.2 metre solvent and UV roll printers, a UV flatbed, Epson SureColor, an 8 x 4 ft CNC router and a CO2 laser.',
  alternates: { canonical: URL },
  openGraph: {
    title: 'Our Machinery | Vijetha Digital',
    description: 'Printing up to 3.2 m wide, direct-to-board UV, and CNC and laser cutting under one roof in Hyderabad.',
    url: URL,
    type: 'website',
    images: [{ url: 'https://vijethadigital.com/images/vd/hero-printer-telugu-banner.jpg', width: 2400, height: 1350 }],
  },
};

const quoteUrl = (name: string) =>
  `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(`Hi! I'd like a quote for a job on your ${name}.`)}`;

const STATS: [string, string][] = [
  [String(MACHINES.length), 'production machines, photographed on our floor'],
  [formatMetres(WIDEST_MM), 'widest print, in one seamless piece'],
  ['8 x 4 ft', 'full sheets cut and printed without trimming'],
  ['1 roof', 'print, cut and fabrication, no outsourcing'],
];

export default function MachineryPage() {
  return (
    <>
      <ScrollAnimations />
      <Header />
      <main>
        <section className="vd-guide-hero vd-mach-hero">
          <div className="wix-container">
            <Breadcrumbs items={[{ name: 'Machinery', url: '/machinery' }]} />
            <p className="vd-eyebrow"><CmykChips /> Chengicherla production floor</p>
            <h1 className="vd-guide-title">The machines behind every job</h1>
            <p className="vd-body vd-guide-lead" data-speakable>
              Every banner, board and letter we sell is printed or cut here, on our own machines.
              We print up to {formatMetres(WIDEST_MM)} wide in one piece, print straight onto rigid
              boards, and cut acrylic, ACP and MDF in-house on a CNC router and a laser.
            </p>
            <dl className="vd-mach-stats">
              {STATS.map(([value, label], i) => (
                <div key={label} className={`wix-motion wix-fade-up wix-delay-${i + 1}`}>
                  <dt>{value}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <div className="vd-mach-band" role="img" aria-label="3.2 metre printer running a Telugu banner">
          <Image
            src="/images/vd/hero-printer-telugu-banner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={78}
            style={{ objectFit: 'cover' }}
          />
        </div>

        <section className="vd-section vd-section--white" aria-labelledby="scale-heading">
          <div className="wix-container">
            <p className="vd-eyebrow wix-motion wix-fade-up">To scale</p>
            <h2 id="scale-heading" className="vd-h2 wix-motion wix-fade-up">How wide we can go</h2>
            <p className="vd-body wix-motion wix-fade-up" style={{ maxWidth: 640 }}>
              Each bar is a machine&apos;s print width, or the long side of its bed, drawn to the
              same scale. A wider printer means fewer joins on a hoarding and less trimming on a board.
            </p>
            <ScaleStrip />
          </div>
        </section>

        <section className="vd-section vd-section--cream" aria-labelledby="machines-heading">
          <div className="wix-container">
            <h2 id="machines-heading" className="vd-h2 wix-motion wix-fade-up">Machine by machine</h2>
            <div className="vd-mach-list">
              {MACHINES.map((m, i) => (
                <article key={m.slug} id={m.slug} className="vd-mach" aria-labelledby={`${m.slug}-name`}>
                  <div className={`vd-mach-media wix-motion ${i % 2 ? 'wix-fade-left' : 'wix-fade-right'}`}>
                    <MachineMedia
                      image={m.image}
                      alt={m.imageAlt}
                      video={m.video}
                      sizes="(max-width: 900px) 100vw, 50vw"
                      position={m.portrait ? 'center 60%' : 'center'}
                    />
                    <span className="vd-mach-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="vd-mach-body wix-motion wix-fade-up wix-delay-2">
                    <p className="vd-branch-role">{m.process}</p>
                    <h3 id={`${m.slug}-name`} className="vd-mach-name">{m.name}</h3>
                    <p className="vd-mach-size">{sizeLabel(m)}</p>
                    <p className="vd-body">{m.summary}</p>
                    <dl className="vd-mach-spec">
                      <div><dt>Used for</dt><dd>{m.makes.join(', ')}</dd></div>
                      <div><dt>Materials</dt><dd>{m.materials.join(', ')}</dd></div>
                    </dl>
                    <a href={quoteUrl(m.name)} target="_blank" rel="noopener noreferrer" className="vd-text-link">
                      Get a quote for this machine
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="vd-section vd-section--white" aria-labelledby="also-heading">
          <div className="wix-container vd-mach-also">
            <div>
              <h2 id="also-heading" className="vd-h2 wix-motion wix-fade-up">Also in the workshop</h2>
              <p className="vd-body wix-motion wix-fade-up">
                Finishing and fabrication equipment that works alongside the machines above.
              </p>
            </div>
            <ul className="wix-motion wix-fade-up">
              {OTHER_EQUIPMENT.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>

        <VisitSection />
      </main>
      <Footer />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': `${URL}#webpage`,
          url: URL,
          name: 'Our Machinery | Vijetha Digital',
          isPartOf: { '@id': 'https://vijethadigital.com/#website' },
          about: { '@id': 'https://vijethadigital.com/#organization' },
          primaryImageOfPage: 'https://vijethadigital.com/images/vd/hero-printer-telugu-banner.jpg',
          image: MACHINES.map((m) => `https://vijethadigital.com${m.image}`),
        }}
      />
    </>
  );
}
