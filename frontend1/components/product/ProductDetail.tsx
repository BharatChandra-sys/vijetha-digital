'use client';

import { useState } from 'react';
import type { Product } from '@/lib/products-data';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";

const GALLERY_POOL = [
  '/images/project-booklets.webp',
  '/images/project-cards.webp',
  '/images/about-printing.webp',
  '/images/hero-banner-hq.webp',
];

function getGallery(productImage: string): string[] {
  const others = GALLERY_POOL.filter(i => i !== productImage);
  return [productImage, ...others.slice(0, 3)];
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderBottom: '1px solid #e8e8e4', cursor: 'pointer' }}
      onClick={() => setOpen(o => !o)}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '18px 0', gap: '16px',
      }}>
        <p style={{ fontFamily: font, fontSize: '15px', color: '#000', margin: 0, lineHeight: 1.4 }}>
          {q}
        </p>
        <span style={{
          fontFamily: font, fontSize: '20px', color: 'rgb(85,78,78)',
          flexShrink: 0, display: 'inline-block', userSelect: 'none',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>
          +
        </span>
      </div>
      {open && (
        <p style={{
          fontFamily: font, fontSize: '14px', lineHeight: '1.7em',
          color: 'rgb(85,78,78)', paddingBottom: '18px', margin: 0,
        }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function ProductDetail({
  product,
  related,
  waPhoneRaw,
}: {
  product: Product;
  related: Product[];
  waPhoneRaw: string;
}) {
  const gallery = getGallery(product.image);
  const [activeImg, setActiveImg] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const waText = encodeURIComponent(`Hi! I would like to enquire about ${product.name}.`);
  const waHref = `https://wa.me/${waPhoneRaw}?text=${waText}`;

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: '#f9f9f7', borderBottom: '1px solid #e8e8e4', paddingTop: '88px' }}>
        <div className="wix-container" style={{ padding: '12px 0' }}>
          <p style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)', margin: 0 }}>
            <a href="/" style={{ color: 'rgb(85,78,78)', textDecoration: 'none' }}>Home</a>
            {' / '}
            <a href="/products" style={{ color: 'rgb(85,78,78)', textDecoration: 'none' }}>Products</a>
            {' / '}
            <span style={{ color: '#000' }}>{product.name}</span>
          </p>
        </div>
      </div>

      {/* Hero — gallery + info */}
      <section style={{ backgroundColor: '#fff', paddingTop: '56px', paddingBottom: '72px' }}>
        <div className="wix-container">
          <div className="prod-hero-grid">

            {/* Gallery */}
            <div>
              <div style={{
                backgroundColor: '#f1f0eb', aspectRatio: '4/3',
                overflow: 'hidden', marginBottom: '12px',
              }}>
                {showVideo ? (
                  <video
                    controls
                    autoPlay
                    poster={gallery[0]}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#1c1d20' }}
                  >
                    <source src="/videos/product-demo.mp4" type="video/mp4" />
                    Your browser does not support video.
                  </video>
                ) : (
                  <img
                    src={gallery[activeImg]}
                    alt={`${product.name} — Vijetha Digital`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImg(i); setShowVideo(false); }}
                    style={{
                      width: '72px', height: '54px', padding: 0, border: 'none',
                      cursor: 'pointer', overflow: 'hidden', flexShrink: 0,
                      outline: activeImg === i && !showVideo ? '2px solid #000' : '2px solid transparent',
                      outlineOffset: '2px', backgroundColor: '#f1f0eb',
                    }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </button>
                ))}
                <button
                  onClick={() => setShowVideo(true)}
                  style={{
                    width: '72px', height: '54px', padding: 0, border: 'none',
                    cursor: 'pointer', flexShrink: 0, backgroundColor: '#1c1d20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    outline: showVideo ? '2px solid #000' : '2px solid transparent',
                    outlineOffset: '2px',
                  }}
                  aria-label="Play product video"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Info */}
            <div>
              <p style={{
                fontFamily: font, fontSize: '11px', letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '10px',
              }}>
                {product.category}
              </p>
              <h1 style={{
                fontFamily: font, fontSize: 'clamp(26px, 3.2vw, 42px)',
                fontWeight: 400, lineHeight: 1.1, color: '#000', marginBottom: '14px',
              }}>
                {product.name}
              </h1>
              <p style={{
                fontFamily: font, fontSize: '15px', lineHeight: '1.7em',
                color: 'rgb(85,78,78)', marginBottom: '20px',
              }}>
                {product.longDesc}
              </p>
              <p style={{ fontFamily: font, fontSize: '20px', color: '#000', marginBottom: '28px' }}>
                {product.price}
              </p>

              <div style={{ borderTop: '1px solid #e8e8e4', marginBottom: '32px' }}>
                {product.specs.map(s => (
                  <div key={s.label} style={{
                    display: 'grid', gridTemplateColumns: '140px 1fr',
                    gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f0eb',
                  }}>
                    <span style={{ fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)' }}>{s.label}</span>
                    <span style={{ fontFamily: font, fontSize: '13px', color: '#000' }}>{s.value}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    backgroundColor: '#25d366', color: '#fff',
                    fontFamily: font, fontSize: '14px',
                    padding: '14px 28px', textDecoration: 'none',
                  }}
                >
                  WhatsApp for Quote
                </a>
                <a
                  href="/contact"
                  style={{
                    display: 'inline-flex', alignItems: 'center',
                    backgroundColor: '#000', color: '#fff',
                    fontFamily: font, fontSize: '14px',
                    padding: '14px 28px', textDecoration: 'none',
                  }}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section style={{ backgroundColor: '#f9f9f7', padding: '64px 0', borderTop: '1px solid #e8e8e4' }}>
          <div className="wix-container">
            <h2 style={{
              fontFamily: font, fontSize: 'clamp(18px, 2vw, 24px)',
              fontWeight: 400, color: '#000', marginBottom: '32px',
            }}>
              Related products
            </h2>
            <div className="related-grid">
              {related.map(p => (
                <a
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <div className="related-card">
                    <div style={{
                      aspectRatio: '4/3', overflow: 'hidden',
                      backgroundColor: '#e8e8e4', marginBottom: '14px',
                    }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="related-img"
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', display: 'block',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                    </div>
                    <p style={{
                      fontFamily: font, fontSize: '10px', letterSpacing: '0.14em',
                      textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '5px',
                    }}>
                      {p.category}
                    </p>
                    <p style={{ fontFamily: font, fontSize: '15px', color: '#000', marginBottom: '6px' }}>
                      {p.name}
                    </p>
                    <p style={{
                      fontFamily: font, fontSize: '12px', color: 'rgb(85,78,78)',
                      lineHeight: '1.5em', marginBottom: '8px',
                    }}>
                      {p.desc}
                    </p>
                    <p style={{ fontFamily: font, fontSize: '13px', color: '#000' }}>
                      {p.price}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ accordion */}
      {product.faqs.length > 0 && (
        <section style={{ backgroundColor: '#fff', padding: '72px 0', borderTop: '1px solid #e8e8e4' }}>
          <div className="wix-container" style={{ maxWidth: '800px' }}>
            <h2 style={{
              fontFamily: font, fontSize: 'clamp(20px, 2.2vw, 28px)',
              fontWeight: 400, color: '#000', marginBottom: '32px',
            }}>
              Frequently asked questions
            </h2>
            <div>
              {product.faqs.map(f => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ backgroundColor: '#1c1d20', padding: '56px 0' }}>
        <div className="wix-container" style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px',
        }}>
          <div>
            <h2 style={{
              fontFamily: font, fontSize: 'clamp(18px, 2vw, 26px)',
              fontWeight: 400, color: '#fff', marginBottom: '6px',
            }}>
              Get a quote for {product.name} in Hyderabad
            </h2>
            <p style={{ fontFamily: font, fontSize: '14px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
              Call +91 92481 95552 or WhatsApp — we respond within 2 hours.
            </p>
          </div>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center',
              backgroundColor: '#fff', color: '#000',
              fontFamily: font, fontSize: '14px',
              padding: '14px 36px', textDecoration: 'none', flexShrink: 0,
            }}
          >
            WhatsApp Now
          </a>
        </div>
      </section>

      <style>{`
        .prod-hero-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 64px;
          align-items: start;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }
        .related-card { transition: opacity 0.2s; }
        .related-card:hover { opacity: 0.85; }
        .related-card:hover .related-img { transform: scale(1.03); }
        @media (max-width: 1024px) {
          .related-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .prod-hero-grid { grid-template-columns: 1fr; gap: 40px; }
          .related-grid { grid-template-columns: repeat(2, 1fr); gap: 20px; }
        }
        @media (max-width: 500px) {
          .related-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
        }
      `}</style>
    </>
  );
}
