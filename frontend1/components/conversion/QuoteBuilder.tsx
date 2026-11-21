'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PHONE_RAW } from '@/lib/constants';

const PRODUCTS: { label: string; sized: boolean; installable: boolean }[] = [
  { label: 'LED sign board', sized: true, installable: true },
  { label: 'ACP cladding sign', sized: true, installable: true },
  { label: 'Acrylic letter sign', sized: true, installable: true },
  { label: 'Flex or vinyl printing', sized: true, installable: true },
  { label: 'Vehicle branding', sized: false, installable: false },
  { label: 'Office or retail branding', sized: true, installable: true },
  { label: 'Roll-up standee', sized: false, installable: false },
  { label: 'Exhibition booth', sized: true, installable: true },
  { label: 'Brochures, flyers or cards', sized: false, installable: false },
  { label: 'Something else', sized: false, installable: false },
];

const TIMELINES = ['Flexible', 'Within 2 weeks', 'This week', 'Today'];

// Builds a WhatsApp message and nothing else: no prices are shown, and no details
// are sent anywhere until the visitor presses send in WhatsApp.
export default function QuoteBuilder() {
  const [productIndex, setProductIndex] = useState(0);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'ft' | 'in'>('ft');
  const [quantity, setQuantity] = useState('1');
  const [timeline, setTimeline] = useState(TIMELINES[0]);
  const [install, setInstall] = useState(false);

  const product = PRODUCTS[productIndex];
  const qty = Math.max(1, Math.floor(Number(quantity)) || 1);

  const area = useMemo(() => {
    const w = Number(width);
    const h = Number(height);
    if (!product.sized || !(w > 0) || !(h > 0)) return null;
    const each = unit === 'ft' ? w * h : (w * h) / 144;
    return Math.round(each * qty * 10) / 10;
  }, [product.sized, width, height, unit, qty]);

  const message = useMemo(() => {
    const lines = ['Hi Vijetha Digital, I need a quote.', `Product: ${product.label}`];
    if (area !== null) lines.push(`Size: ${width} x ${height} ${unit} (${area} sq.ft in total)`);
    lines.push(`Quantity: ${qty}`, `Needed: ${timeline}`);
    if (product.installable) lines.push(`Installation: ${install ? 'Yes' : 'No'}`);
    return lines.join('\n');
  }, [product, area, width, height, unit, qty, timeline, install]);

  const href = `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(message)}`;

  return (
    <form className="vd-builder" onSubmit={(e) => e.preventDefault()} aria-labelledby="builder-heading">
      <h3 id="builder-heading" className="vd-builder-title">Build your quote request</h3>

      <label className="vd-field">
        <span>What do you need?</span>
        <select value={productIndex} onChange={(e) => setProductIndex(Number(e.target.value))}>
          {PRODUCTS.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
        </select>
      </label>

      {product.sized && (
        <div className="vd-field-row vd-field-row--size">
          <label className="vd-field">
            <span>Width</span>
            <input type="number" inputMode="decimal" min="0" step="any" value={width} onChange={(e) => setWidth(e.target.value)} />
          </label>
          <label className="vd-field">
            <span>Height</span>
            <input type="number" inputMode="decimal" min="0" step="any" value={height} onChange={(e) => setHeight(e.target.value)} />
          </label>
          <label className="vd-field">
            <span>Unit</span>
            <select value={unit} onChange={(e) => setUnit(e.target.value as 'ft' | 'in')}>
              <option value="ft">Feet</option>
              <option value="in">Inches</option>
            </select>
          </label>
        </div>
      )}

      <div className="vd-field-row">
        <label className="vd-field">
          <span>Quantity</span>
          <input type="number" inputMode="numeric" min="1" step="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </label>
        <label className="vd-field">
          <span>When do you need it?</span>
          <select value={timeline} onChange={(e) => setTimeline(e.target.value)}>
            {TIMELINES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </label>
      </div>

      {product.installable && (
        <label className="vd-check">
          <input type="checkbox" checked={install} onChange={(e) => setInstall(e.target.checked)} />
          <span>Include installation</span>
        </label>
      )}

      <p className="vd-builder-area" aria-live="polite">
        {area !== null ? <>Total area: <strong>{area} sq.ft</strong></> : ' '}
      </p>

      <a href={href} target="_blank" rel="noopener noreferrer" className="vd-btn vd-btn--full">
        Send on WhatsApp
      </a>
      <p className="vd-builder-note">
        Opens WhatsApp with these details filled in. Nothing is saved on this site. Have artwork?
        Attach it in the chat, and see our <Link href="/artwork-guide">artwork guide</Link> for file specs.
      </p>
    </form>
  );
}
