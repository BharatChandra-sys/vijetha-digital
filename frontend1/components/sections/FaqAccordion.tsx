'use client';

import { useState } from 'react';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";

interface FaqItem {
  question: string;
  answer: string;
}

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderBottom: '1px solid #e8e8e4', cursor: 'pointer' }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '20px 0', gap: '24px',
      }}>
        <p style={{
          fontFamily: font, fontSize: 'clamp(15px, 1.5vw, 17px)',
          color: '#000', margin: 0, lineHeight: 1.4,
        }}>
          {q}
        </p>
        <span style={{
          fontFamily: font, fontSize: '22px', color: 'rgb(85,78,78)',
          flexShrink: 0, display: 'inline-block', userSelect: 'none',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>
          +
        </span>
      </div>
      {open && (
        <p style={{
          fontFamily: font, fontSize: '15px', lineHeight: '1.75em',
          color: 'rgb(85,78,78)', paddingBottom: '20px', margin: 0,
        }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function FaqAccordion({
  title = 'Frequently asked questions',
  items,
  maxWidth = '860px',
  bg = '#fff',
}: {
  title?: string;
  items: FaqItem[];
  maxWidth?: string;
  bg?: string;
}) {
  return (
    <section style={{ backgroundColor: bg, padding: '80px 0', borderTop: '1px solid #e8e8e4' }}>
      <div className="wix-container" style={{ maxWidth }}>
        <h2 style={{
          fontFamily: font,
          fontSize: 'clamp(22px, 2.5vw, 32px)',
          fontWeight: 400, color: '#000', marginBottom: '40px',
        }}>
          {title}
        </h2>
        <div>
          {items.map(item => (
            <Item key={item.question} q={item.question} a={item.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
