'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CmykChips } from '@/components/brand/CmykStrip';
import { MACHINES, WIDEST_MM, formatMetres } from '@/lib/machinery';
import { WA_URL } from '@/lib/constants';

const AUDIENCES = ['shop fronts', 'hoardings', 'vehicle fleets', 'offices', 'events', 'hospitals'];

const SERVICES = [
  'LED sign boards', 'ACP cladding', 'Acrylic letters', 'Flex printing', 'Vehicle branding',
  'UV printing', 'Offset printing', 'Exhibition displays', 'Office branding', 'Laser cutting',
];

const FACTS: [string, string][] = [
  [formatMetres(WIDEST_MM), 'widest print, in one piece'],
  [String(MACHINES.length), 'production machines in-house'],
  ['8 × 4 ft', 'boards printed and cut whole'],
  ['2009', 'printing in Hyderabad since'],
];

export default function HeroSection() {
  const [word, setWord] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setWord((w) => (w + 1) % AUDIENCES.length), 2400);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section className="vd-hero" aria-labelledby="hero-heading">
      <span className="vd-crop vd-crop--tl" aria-hidden="true" />
      <span className="vd-crop vd-crop--tr" aria-hidden="true" />
      <span className="vd-crop vd-crop--bl" aria-hidden="true" />
      <span className="vd-crop vd-crop--br" aria-hidden="true" />

      <div className="wix-container vd-hero-inner">
        <div className="vd-hero-main">
        <div className="vd-hero-copy">
        <p className="vd-eyebrow vd-hero-eyebrow"><CmykChips />Printing &amp; signage · Hyderabad · Since 2009</p>

        <div className="vd-hero-print">
          <h1 id="hero-heading" className="vd-hero-title">
            Commercial printing{' '}<br />and signage in Hyderabad
          </h1>
          <span className="vd-printhead" aria-hidden="true"><i /><i /><i /><i /></span>
        </div>

        <p className="vd-hero-for">
          <span className="vd-sr-only">Made for {AUDIENCES.join(', ')}.</span>
          <span aria-hidden="true">Made for</span>
          <span className="vd-rotator" aria-hidden="true">
            {AUDIENCES.map((w, i) => (
              <span key={w} data-state={i === word ? 'in' : i === (word - 1 + AUDIENCES.length) % AUDIENCES.length ? 'out' : 'wait'}>
                {w}
              </span>
            ))}
          </span>
        </p>

        <p className="vd-hero-sub">
          We design, print, cut and install under one roof: sign boards, flex, vehicle wraps and
          brand interiors, made on our own machines at Chengicherla.
        </p>

        <div className="vd-hero-ctas">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="vd-btn">Get a free quote</a>
          <Link href="/machinery" className="vd-hero-link">See our machinery</Link>
        </div>
        </div>

        <div className="vd-ink" aria-hidden="true">
          <span className="vd-ink-c" />
          <span className="vd-ink-m" />
          <span className="vd-ink-y" />
          <span className="vd-ink-label vd-ink-label--c">C</span>
          <span className="vd-ink-label vd-ink-label--m">M</span>
          <span className="vd-ink-label vd-ink-label--y">Y</span>
          <span className="vd-ink-label vd-ink-label--k">K</span>
        </div>
        </div>

        <div className="vd-hero-dim" aria-hidden="true">
          <span className="vd-hero-dim-line" />
          <span className="vd-hero-dim-label">{formatMetres(WIDEST_MM)} · our widest print, no joins</span>
        </div>

        <dl className="vd-hero-facts">
          {FACTS.map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="vd-hero-ticker" aria-hidden="true">
        <div className="vd-hero-ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy}>
              {SERVICES.map((s) => <span key={s}>{s}</span>)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
