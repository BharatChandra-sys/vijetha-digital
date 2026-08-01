'use client';

import Link from 'next/link';
import ScrollAnimations from '@/components/ui/ScrollAnimations';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";
const WA       = 'https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20enquire%20about%20';

const PRODUCTS = [
  { id:1,  name:'3D Sign Board',            category:'Sign Boards',        image:'/images/project-booklets.jpg',  price:'₹4,500 onwards', desc:'Eye-catching 3D lettering for shops and offices. Acrylic, metal & foam options.' },
  { id:2,  name:'Glow Sign Board',          category:'Sign Boards',        image:'/images/project-cards.jpg',    price:'₹2,800 onwards', desc:'Backlit glow boards for 24/7 visibility. Ideal for retail and commercial spaces.' },
  { id:3,  name:'Vinyl Sign Board',         category:'Sign Boards',        image:'/images/about-printing.jpg',   price:'₹900 onwards',   desc:'Durable vinyl boards for long-lasting outdoor signage at an affordable price.' },
  { id:4,  name:'Aluminium Sign Board',     category:'Sign Boards',        image:'/images/hero-banner-hq.jpg',   price:'₹2,200 onwards', desc:'Lightweight, rust-proof aluminium boards for indoor and outdoor use.' },
  { id:5,  name:'Open LED Sign Board',      category:'Sign Boards',        image:'/images/project-booklets.jpg', price:'₹3,500 onwards', desc:'LED-illuminated open signage for 24-hour shop fronts and kiosks.' },
  { id:6,  name:'Flex Printing',            category:'Printing Services',  image:'/images/project-cards.jpg',    price:'₹18 per sq ft',  desc:'High-resolution flex printing for hoardings, banners and backdrops.' },
  { id:7,  name:'Offset Printing',          category:'Printing Services',  image:'/images/about-printing.jpg',   price:'₹1,200 onwards', desc:'Commercial-grade offset printing for bulk flyers, letterheads and brochures.' },
  { id:8,  name:'Catalogue Printing',       category:'Printing Services',  image:'/images/hero-banner-hq.jpg',   price:'₹2,500 onwards', desc:'Full-colour perfect-bound or saddle-stitched product catalogues.' },
  { id:9,  name:'Canvas Printing',          category:'Printing Services',  image:'/images/project-booklets.jpg', price:'₹650 onwards',   desc:'Premium canvas prints for décor, photo galleries and brand displays.' },
  { id:10, name:'Business Card Printing',   category:'Printing Services',  image:'/images/project-cards.jpg',    price:'₹450 for 100',   desc:'Matte, gloss, spot UV and foil visiting cards. Fast turnaround.' },
  { id:11, name:'Roll-Up Banner Stand',     category:'Banner Stands',      image:'/images/about-printing.jpg',   price:'₹1,800 onwards', desc:'Portable roll-up standees for exhibitions, events and retail display.' },
  { id:12, name:'Heavy Roll-Up Stand',      category:'Banner Stands',      image:'/images/hero-banner-hq.jpg',   price:'₹3,200 onwards', desc:'Heavy-duty roll-up stands for frequent use at trade shows and road shows.' },
  { id:13, name:'Demo Tent 4×4×7 ft',      category:'Demo Tents',         image:'/images/project-booklets.jpg', price:'₹8,500 onwards', desc:'Compact branded canopy tent ideal for promotions and outdoor activations.' },
  { id:14, name:'Demo Tent 6×6×7 ft',      category:'Demo Tents',         image:'/images/project-cards.jpg',    price:'₹12,000 onwards',desc:'Large branded canopy for exhibitions, road shows and corporate events.' },
  { id:15, name:'Vehicle Branding',         category:'Promotional Items',  image:'/images/about-printing.jpg',   price:'₹3,500 onwards', desc:'Full or partial vehicle wrap printing for cars, vans and trucks.' },
  { id:16, name:'T-Shirt Printing',         category:'Promotional Items',  image:'/images/hero-banner-hq.jpg',   price:'₹250 per piece', desc:'Screen and digital printing on cotton, polyester and dri-fit tees.' },
  { id:17, name:'In-Shop Branding',         category:'Promotional Items',  image:'/images/project-booklets.jpg', price:'On request',     desc:'Complete branding solutions for shop interiors — walls, floors and windows.' },
  { id:18, name:'Promo Table',              category:'Promotional Items',  image:'/images/project-cards.jpg',    price:'₹2,200 onwards', desc:'Branded folding promotional tables for events, expos and pop-up stalls.' },
];

const CATEGORIES = ['Sign Boards', 'Printing Services', 'Banner Stands', 'Demo Tents', 'Promotional Items'];

export default function ProductsContent() {
  return (
    <>
      <ScrollAnimations />

      {/* Category nav */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e8e8e4', position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="wix-container">
          <div style={{ display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {['All', ...CATEGORIES].map(cat => (
              <a
                key={cat}
                href={cat === 'All' ? '#sign-boards' : `#${cat.replace(/\s+/g, '-').toLowerCase()}`}
                style={{
                  fontFamily: font, fontSize: '14px', color: '#000',
                  padding: '16px 20px', whiteSpace: 'nowrap', textDecoration: 'none',
                  borderBottom: '2px solid transparent', display: 'block',
                }}
                className="cat-tab"
              >
                {cat}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Products by category */}
      <section style={{ backgroundColor: '#ffffff', padding: '72px 0 0' }}>
        <div className="wix-container">
          {CATEGORIES.map(category => {
            const items = PRODUCTS.filter(p => p.category === category);
            return (
              <div key={category} id={category.replace(/\s+/g, '-').toLowerCase()} style={{ marginBottom: '80px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '36px', paddingBottom: '16px', borderBottom: '1px solid #e8e8e4' }}>
                  <h2 style={{ fontFamily: fontBold, fontSize: 'clamp(20px, 2vw, 26px)', fontWeight: 400, color: '#000' }}>
                    {category}
                  </h2>
                  <span style={{ fontFamily: font, fontSize: '13px', color: 'rgb(85,78,78)' }}>
                    {items.length} products
                  </span>
                </div>

                <div className="products-grid">
                  {items.map((product, i) => (
                    <a
                      key={product.id}
                      href={`${WA}${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`prod-card wix-motion wix-fade-up wix-delay-${(i % 4) + 1}`}
                    >
                      <div className="wix-img-wrap" style={{ aspectRatio: '4/3', marginBottom: '16px', backgroundColor: '#f1f0eb' }}>
                        <img src={product.image} alt={product.name} loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      </div>
                      <p style={{ fontFamily: font, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '6px' }}>
                        {product.category}
                      </p>
                      <h3 style={{ fontFamily: fontBold, fontSize: 'clamp(14px, 1.3vw, 16px)', fontWeight: 400, letterSpacing: '0.04em', color: '#000', marginBottom: '6px' }}>
                        {product.name}
                      </h3>
                      <p style={{ fontFamily: font, fontSize: '13px', lineHeight: '1.55em', color: 'rgb(85,78,78)', marginBottom: '10px' }}>
                        {product.desc}
                      </p>
                      <p style={{ fontFamily: fontBold, fontSize: '14px', color: '#000', marginBottom: '10px' }}>
                        {product.price}
                      </p>
                      <div className="enquire-link">
                        <span style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.06em', color: '#000' }}>
                          Enquire on WhatsApp →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: '#ffedc9', padding: '80px 0' }}>
        <div className="wix-container" style={{ textAlign: 'center' }}>
          <div className="wix-motion wix-fade-up">
            <h2 style={{ fontFamily: font, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, color: '#000', marginBottom: '16px' }}>
              Need something custom?
            </h2>
            <p style={{ fontFamily: font, fontSize: '16px', color: 'rgb(85,78,78)', marginBottom: '32px' }}>
              Tell us your requirement — we&apos;ll quote within 24 hours.
            </p>
            <a
              href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20a%20custom%20quote%20for%20printing%20services."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#000', color: '#fff',
                fontFamily: font, fontSize: '14px', letterSpacing: '0.03em',
                padding: '16px 44px', textDecoration: 'none',
              }}
            >
              Get a Custom Quote
            </a>
          </div>
        </div>
      </section>

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 40px 32px;
        }
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px)  { .products-grid { grid-template-columns: repeat(2, 1fr); gap: 28px 20px; } }
        @media (max-width: 400px)  { .products-grid { grid-template-columns: 1fr; } }
        .prod-card { text-decoration: none; color: inherit; display: block; cursor: pointer; }
        .prod-card:hover .enquire-link { opacity: 0.6; }
        .enquire-link { border-bottom: 1px solid #000; display: inline-block; padding-bottom: 2px; }
        .cat-tab:hover { border-bottom-color: #000 !important; }
        div[style*='overflow-x: auto']::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
