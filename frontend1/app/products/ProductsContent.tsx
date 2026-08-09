'use client';

import { useEffect } from 'react';
import ScrollAnimations from '@/components/ui/ScrollAnimations';
import { WA_URL, PHONE_RAW } from '@/lib/constants';

const font     = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";
const fontBold = "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif";
const WA       = `https://wa.me/${PHONE_RAW}?text=Hi%21%20I%20would%20like%20to%20enquire%20about%20`;

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

const PRODUCTS = [
  // Signage Solutions
  { id:1,  name:'LED Sign Board',           category:'Signage Solutions',      image:'/images/project-booklets.jpg',  price:'₹3,500 onwards', desc:'Bright LED illuminated boards for 24/7 visibility. Ideal for retail, showrooms and commercial spaces.' },
  { id:2,  name:'ACP Cladding Sign',        category:'Signage Solutions',      image:'/images/project-cards.jpg',    price:'₹2,200 onwards', desc:'Aluminium composite panel cladding for professional, weather-resistant outdoor signage.' },
  { id:3,  name:'Acrylic Letter Sign',      category:'Signage Solutions',      image:'/images/about-printing.jpg',   price:'₹1,800 onwards', desc:'Precision-cut acrylic 3D lettering for shopfronts, offices and brand walls.' },
  { id:4,  name:'Fascia Sign Board',        category:'Signage Solutions',      image:'/images/hero-banner-hq.jpg',   price:'₹4,500 onwards', desc:'Full-width fascia boards for storefronts and commercial complexes. Bold, weather-resistant.' },
  { id:5,  name:'Flex Board Hoarding',      category:'Signage Solutions',      image:'/images/project-booklets.jpg', price:'₹18 per sq ft',  desc:'High-resolution flex printing for large hoardings, outdoor banners and backdrops.' },
  { id:6,  name:'Pylon Sign',               category:'Signage Solutions',      image:'/images/project-cards.jpg',    price:'₹8,000 onwards', desc:'Tall freestanding pylon signs for maximum visibility at malls, hospitals and industrial sites.' },
  // Internal Branding
  { id:7,  name:'Office Wall Branding',     category:'Internal Branding',      image:'/images/about-printing.jpg',   price:'On request',     desc:'Transform office walls into powerful brand statements with murals, typography and graphics.' },
  { id:8,  name:'Reception & Lobby',        category:'Internal Branding',      image:'/images/hero-banner-hq.jpg',   price:'On request',     desc:'Premium reception and lobby branding that creates unforgettable first impressions.' },
  { id:9,  name:'Retail In-Shop Branding',  category:'Internal Branding',      image:'/images/project-booklets.jpg', price:'On request',     desc:'Complete in-shop branding for retail stores — walls, ceilings, floors and windows.' },
  { id:10, name:'Hospital Branding',        category:'Internal Branding',      image:'/images/project-cards.jpg',    price:'On request',     desc:'Wayfinding, signage and branding solutions tailored for healthcare environments.' },
  // Vehicle Branding
  { id:11, name:'Car / 4-Wheeler Wrap',     category:'Vehicle Branding',       image:'/images/about-printing.jpg',   price:'₹3,500 onwards', desc:'Full or partial vehicle wraps for cars, jeeps and SUVs. UV-resistant, professionally installed.' },
  { id:12, name:'Bus / Van Branding',       category:'Vehicle Branding',       image:'/images/hero-banner-hq.jpg',   price:'₹6,000 onwards', desc:'Large-format bus and van branding that turns your fleet into moving billboards.' },
  { id:13, name:'2-Wheeler Branding',       category:'Vehicle Branding',       image:'/images/project-booklets.jpg', price:'₹800 onwards',   desc:'Eye-catching delivery bike and scooter branding for food, logistics and promo campaigns.' },
  { id:14, name:'Heavy Vehicle Branding',   category:'Vehicle Branding',       image:'/images/project-cards.jpg',    price:'On request',     desc:'Full truck and heavy transport branding for maximum road presence and brand reach.' },
  // Digital Printing
  { id:15, name:'Flex / Vinyl Printing',    category:'Digital Printing',       image:'/images/about-printing.jpg',   price:'₹18 per sq ft',  desc:'High-resolution flex and vinyl printing for banners, hoardings and backdrops. In-house 1 lakh sq.ft/day.' },
  { id:16, name:'UV Print',                 category:'Digital Printing',       image:'/images/hero-banner-hq.jpg',   price:'₹45 per sq ft',  desc:'UV-cured printing for vibrant, scratch-resistant output on rigid and flexible substrates.' },
  { id:17, name:'3D Canvas Print',          category:'Digital Printing',       image:'/images/project-booklets.jpg', price:'₹120 per sq ft', desc:'Textured 3D canvas printing for premium wall art, retail displays and exhibitions.' },
  { id:18, name:'Eco-Solvent Print',        category:'Digital Printing',       image:'/images/project-cards.jpg',    price:'₹20 per sq ft',  desc:'Durable eco-solvent outdoor printing on Roland Soljet EJ 640 for long-lasting results.' },
  // Offset Printing
  { id:19, name:'Brochure / Catalogue',     category:'Offset Printing',        image:'/images/about-printing.jpg',   price:'₹2,500 onwards', desc:'Full-colour perfect-bound or saddle-stitched brochures and product catalogues.' },
  { id:20, name:'Flyers & Pamphlets',       category:'Offset Printing',        image:'/images/hero-banner-hq.jpg',   price:'₹800 per 1000',  desc:'High-quality offset flyers and pamphlets for promotions, events and campaigns.' },
  { id:21, name:'Corporate Stationery',     category:'Offset Printing',        image:'/images/project-booklets.jpg', price:'₹1,200 onwards', desc:'Letterheads, envelopes, visiting cards and notepads with consistent brand identity.' },
  { id:22, name:'Packaging & Gift Boxes',   category:'Offset Printing',        image:'/images/project-cards.jpg',    price:'₹3,000 onwards', desc:'Custom packaging boxes and gift sets with spot UV, foil stamping and die-cutting.' },
  // Display & Exhibition
  { id:23, name:'Roll-Up Standee',          category:'Display & Exhibition',   image:'/images/about-printing.jpg',   price:'₹1,800 onwards', desc:'Portable roll-up standees for exhibitions, events and retail point-of-sale displays.' },
  { id:24, name:'Demo Tent / Canopy',       category:'Display & Exhibition',   image:'/images/hero-banner-hq.jpg',   price:'₹8,500 onwards', desc:'Branded demo tents for outdoor promotions, trade fairs and road shows.' },
  { id:25, name:'Fabric Light Box',         category:'Display & Exhibition',   image:'/images/project-booklets.jpg', price:'₹5,500 onwards', desc:'Illuminated fabric tension displays for high-impact retail and exhibition environments.' },
  { id:26, name:'Trade Show Booth',         category:'Display & Exhibition',   image:'/images/project-cards.jpg',    price:'On request',     desc:'Complete trade show booth design and fabrication for conferences, expos and product launches.' },
  // Outdoor Advertising
  { id:27, name:'Flags & Bunting',          category:'Outdoor Advertising',    image:'/images/about-printing.jpg',   price:'₹350 onwards',   desc:'Printed flags, buntings and feather flags for outdoor events and brand promotions.' },
  { id:28, name:'Backdrop / Stage Banner',  category:'Outdoor Advertising',    image:'/images/hero-banner-hq.jpg',   price:'₹1,200 onwards', desc:'Large format backdrops and stage banners for events, press conferences and launches.' },
  { id:29, name:'Stickers & Decals',        category:'Outdoor Advertising',    image:'/images/project-booklets.jpg', price:'₹5 per sq ft',   desc:'Custom stickers and vinyl decals for vehicles, walls, floors and glass surfaces.' },
  { id:30, name:'Canopy & Tent Branding',   category:'Outdoor Advertising',    image:'/images/project-cards.jpg',    price:'₹2,200 onwards', desc:'Branded promotional canopies and pop-up tents for outdoor activations and events.' },
];

const CATEGORIES = ['Signage Solutions', 'Internal Branding', 'Vehicle Branding', 'Digital Printing', 'Offset Printing', 'Display & Exhibition', 'Outdoor Advertising'];

export default function ProductsContent({ scrollToId }: { scrollToId?: string }) {
  useEffect(() => {
    if (!scrollToId) return;
    const element = document.getElementById(scrollToId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [scrollToId]);

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
                href={cat === 'All' ? '#signage-solutions' : `#${toSlug(cat)}`}
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
          <div style={{ marginBottom: '48px', maxWidth: '860px' }}>
            <p style={{ fontFamily: font, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgb(85,78,78)', marginBottom: '12px' }}>
              Search-friendly product categories
            </p>
            <p style={{ fontFamily: font, fontSize: '16px', lineHeight: '1.7em', color: 'rgb(85,78,78)' }}>
              Browse products for signage solutions, vehicle branding, digital printing, offset printing, exhibition displays, office branding, and outdoor advertising — all manufactured and delivered with professional quality.
            </p>
          </div>
          {CATEGORIES.map(category => {
            const items = PRODUCTS.filter(p => p.category === category);
            return (
              <div key={category} id={toSlug(category)} style={{ marginBottom: '80px' }}>
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
                      href={`/products/${toSlug(product.name)}`}
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
                      <div className="view-details-link">
                        <span style={{ fontFamily: font, fontSize: '12px', letterSpacing: '0.06em', color: '#000' }}>
                          View Details →
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
              href={WA_URL}
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
        .prod-card:hover .view-details-link { opacity: 0.6; }
        .view-details-link { border-bottom: 1px solid #000; display: inline-block; padding-bottom: 2px; }
        .cat-tab:hover { border-bottom-color: #000 !important; }
        div[style*='overflow-x: auto']::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
