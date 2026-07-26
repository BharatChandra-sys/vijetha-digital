import { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import ProductCarousel from "../components/product/ProductCarousel";

/* ── Icon-based services (matching Stitch design) ──────────────────── */
const SERVICES = [
  { icon: "badge",     title: "Business Cards",    desc: "Premium cardstocks, matte, gloss, and spot UV finishes for professional networking." },
  { icon: "ad_units",  title: "Flex Printing",     desc: "High-resolution large format banners and hoardings for maximum visibility." },
  { icon: "lightbulb", title: "LED Boards",        desc: "Illuminated signage solutions that make your business shine day and night." },
  { icon: "menu_book", title: "Marketing Material", desc: "Brochures, flyers, and pamphlets designed to convert customers." },
];

const FEATURES = [
  { icon: "stars",        label: "High Quality Offset" },
  { icon: "aspect_ratio", label: "Large Format Experts" },
  { icon: "bolt",         label: "Fast Turnaround" },
  { icon: "receipt_long", label: "GST Billing Available" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const popular = products.slice(0, 4);

  return (
    <div className="font-display overflow-x-hidden relative">

      {/* Global watermark – right edge */}
      <div className="fixed right-0 top-0 h-full w-[200px] pointer-events-none z-0 hidden lg:flex items-center justify-center opacity-[0.03]">
        <div className="vertical-watermark text-[120px] font-black text-plum-deep leading-none whitespace-nowrap">
          PRINT. BRAND. SCALE.
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-4 pb-6 sm:pt-6 sm:pb-8 lg:pt-14 lg:pb-20 overflow-hidden z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1fr] gap-4 sm:gap-6 lg:gap-12 items-center">
          {/* Left: copy */}
          <div className="relative z-10 space-y-3 sm:space-y-4 animate-fade-in-up">
            <h1 className="text-[1.625rem] sm:text-[2.375rem] lg:text-[2.75rem] font-extrabold text-plum-deep leading-[1.1] tracking-[-0.025em]">
              Premium Printing for{" "}
              <span className="text-coral-accent">Businesses</span>{" "}
              &amp; Brands
            </h1>

            <p className="text-[0.875rem] sm:text-base text-text-dark/80 leading-relaxed max-w-[480px] font-medium">
              From business cards to large-format signage — premium-quality prints that elevate your brand across Hyderabad.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link
                to="/products"
                className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 lg:px-10 bg-coral-accent hover:bg-coral-dark text-white font-bold rounded-xl shadow-sm transition-all hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base tracking-wide whitespace-nowrap"
              >
                Explore Products
              </Link>
              <a
                href="tel:+917942643004"
                className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 lg:px-10 border-2 border-plum-deep text-plum-deep hover:bg-plum-deep hover:text-white font-semibold rounded-xl transition-all text-sm sm:text-base whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-lg sm:text-[1.25rem] mr-2 leading-none">call</span>
                Get Custom Quote
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-[0.8125rem] text-plum-deep/70 font-medium">
                <span className="material-symbols-outlined text-coral-accent text-base">verified_user</span>
                <span>500+ businesses trust us</span>
              </div>
              <div className="flex items-center gap-1.5 text-[0.8125rem] text-plum-deep/70 font-medium">
                <span className="material-symbols-outlined text-coral-accent text-base">receipt_long</span>
                <span>GST Invoice included</span>
              </div>
            </div>
          </div>

          {/* Right: clean hero visual — desktop only */}
          <div className="hidden lg:block relative">
            {/* Main image */}
            <div className="relative rounded-2xl overflow-hidden shadow-architectural-xl" style={{height:380}}>
              <img
                src="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=900&q=85&auto=format&fit=crop"
                alt="Vijetha Digital — Large Format Printing"
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                loading="lazy"
              />
              {/* Lighter gradient overlay for better visibility */}
              <div className="absolute inset-0" style={{background:"linear-gradient(135deg, rgba(59,47,99,0.08) 0%, transparent 60%)"}} />
            </div>

            {/* Floating stat card — bottom left */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-card-enhanced border border-stone-border/50 px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-coral-accent/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-coral-accent text-lg">groups</span>
              </div>
              <div>
                <p className="text-[1.125rem] font-black text-plum-deep leading-none">500+</p>
                <p className="text-[0.6875rem] text-text-muted font-medium">Happy Businesses</p>
              </div>
            </div>

            {/* Floating badge — top right */}
            <div className="absolute -top-3 -right-3 bg-plum-deep text-white rounded-xl px-3 py-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-coral-accent text-base">verified</span>
              <span className="text-[0.75rem] font-bold">GST Invoice</span>
            </div>

            {/* Floating turnaround badge — right middle */}
            <div className="absolute top-1/2 -right-5 -translate-y-1/2 bg-white rounded-xl shadow-card-enhanced border border-stone-border/50 px-3 py-2.5 text-center">
              <p className="text-[1rem] font-black text-plum-deep leading-none">24h</p>
              <p className="text-[0.625rem] text-text-muted font-semibold mt-0.5">Turnaround</p>
            </div>
          </div>

          {/* Mobile hero image */}
          <div className="lg:hidden">
            <div className="relative rounded-2xl overflow-hidden shadow-architectural-xl" style={{height:220}}>
              <img
                src="https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=800&q=80&auto=format&fit=crop"
                alt="Vijetha Digital Printing"
                style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}
                loading="lazy"
              />
              {/* Lighter overlay for mobile */}
              <div className="absolute inset-0" style={{background:"linear-gradient(135deg, rgba(59,47,99,0.05) 0%, transparent 60%)"}} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE BAR ─────────────────────────────────────────── */}
      <div className="border-y border-stone-border bg-white z-20 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-3">
            {FEATURES.map((f, i) => (
              <Fragment key={f.label}>
                {i > 0 && <div className="w-px h-4 bg-stone-border flex-shrink-0" />}
                <div className="flex items-center gap-2 text-[0.8125rem] font-semibold text-plum-deep/80 whitespace-nowrap flex-shrink-0">
                  <span className="material-symbols-outlined text-coral-accent text-lg">{f.icon}</span>
                  {f.label}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── TRUST SIGNALS ───────────────────────────────────────── */}
      <section className="py-6 sm:py-8 lg:py-10 bg-white border-b border-stone-border z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 stagger-children">
            {[
              { icon: "groups",         stat: "500+",   label: "Happy Businesses",   sub: "Across Hyderabad"    },
              { icon: "local_shipping", stat: "24–48h", label: "Turnaround Time",    sub: "Print to delivery"   },
              { icon: "receipt_long",   stat: "GST",    label: "Tax Invoice",        sub: "On every order"      },
              { icon: "verified_user",  stat: "100%",   label: "Quality Guaranteed", sub: "Or we reprint free"  },
            ].map(t => (
              <div key={t.label} className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 lg:p-6 rounded-[14px] bg-warm-white border border-stone-border/60 hover:border-plum-deep/20 hover:shadow-card-default transition-all duration-200">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[12px] bg-plum-deep/5 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-plum-deep text-xl sm:text-2xl">{t.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[1.25rem] sm:text-[1.375rem] font-black text-plum-deep tracking-tight leading-none block mb-1.5">{t.stat}</span>
                  <span className="text-[0.8125rem] sm:text-[0.875rem] font-semibold text-text-dark leading-tight block">{t.label}</span>
                  <span className="text-[0.6875rem] sm:text-[0.75rem] text-text-hint leading-tight hidden sm:block mt-1">{t.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ───────────────────────────────────────── */}
      <section className="py-6 sm:py-8 lg:py-14 bg-white z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-4 sm:mb-6 lg:mb-10">
            <div>
              {/* H2: 32px per spec */}
              <h2 className="text-[1.5rem] sm:text-[1.75rem] lg:text-[2rem] font-bold text-plum-deep mb-1 sm:mb-2 leading-tight tracking-[-0.01em]">Our Core Services</h2>
              <p className="text-xs sm:text-sm lg:text-base text-text-dark/70 font-medium">Specialized printing solutions for every need.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-coral-accent font-bold text-sm hover:gap-2 transition-all whitespace-nowrap">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
            {SERVICES.map(svc => (
              <div key={svc.title} onClick={() => navigate("/products")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate("/products")}
                aria-label={`View ${svc.title}`}
                className="coral-top-border bg-white p-5 rounded-[12px] shadow-card-default hover:shadow-card-hover border border-stone-border/60 cursor-pointer transition-all duration-200 active:scale-[0.98] group min-h-[120px] sm:min-h-[140px]">
                <div className="w-11 h-11 bg-plum-deep/6 rounded-[10px] flex items-center justify-center mb-4 flex-shrink-0 transition-colors duration-200 group-hover:bg-plum-deep">
                  <span className="material-symbols-outlined text-[1.375rem] transition-colors duration-200 text-plum-deep group-hover:text-white">{svc.icon}</span>
                </div>
                <h3 className="text-[0.9375rem] sm:text-base font-bold text-plum-deep mb-1.5 leading-snug">{svc.title}</h3>
                <p className="text-[0.75rem] sm:text-[0.8125rem] text-text-dark/70 leading-relaxed line-clamp-2">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR PRODUCTS ────────────────────────────────────── */}
      <section className="py-8 sm:py-10 lg:py-14 bg-[#fbf9f4] z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-6 sm:mb-8">
            <div>
              <h2 className="text-[2rem] font-bold text-plum-deep mb-2 leading-tight tracking-[-0.01em]">Popular Products</h2>
              <p className="text-base text-text-muted">Our most-ordered items by Hyderabad businesses.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-coral-accent font-bold text-sm hover:gap-2 transition-all whitespace-nowrap">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <ProductCarousel products={popular} loading={loading} count={4} />

          <div className="text-center mt-6 sm:mt-8">
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-10 lg:px-12 bg-plum-deep hover:bg-plum-light text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base cursor-pointer whitespace-nowrap"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-8 sm:py-10 lg:py-14 bg-white border-y border-stone-border z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-[2rem] font-bold text-plum-deep mb-3 leading-tight tracking-[-0.01em]">How It Works</h2>
            <p className="text-base text-text-muted max-w-xl mx-auto">Order your prints in 4 simple steps — from design to delivery.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {[
              { step: "01", icon: "inventory_2",    title: "Choose Product",   desc: "Browse our catalog and select the product that fits your need." },
              { step: "02", icon: "tune",           title: "Customise",        desc: "Pick size, material, quantity and upload your artwork or design." },
              { step: "03", icon: "payments",       title: "Pay Securely",     desc: "Pay online via UPI, card or net banking. GST invoice auto-generated." },
              { step: "04", icon: "local_shipping", title: "Fast Delivery",    desc: "We print and deliver to your doorstep within 24–48 hours." },
            ].map((s, i) => (
              <div key={s.step} className="relative flex flex-col items-start gap-3 p-4 sm:p-5 rounded-[12px] bg-warm-white border border-stone-border/60 hover:border-plum-deep/20 hover:shadow-card-default transition-all duration-200">
                {/* Connector arrow — desktop only */}
                {i < 3 && (
                  <div className="hidden lg:flex absolute top-7 -right-3 z-10 items-center">
                    <div className="w-6 h-px bg-stone-border" />
                    <span className="material-symbols-outlined text-stone-border/80 text-sm -ml-1">chevron_right</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-[0.625rem] font-black text-coral-accent tracking-widest">{s.step}</span>
                  <div className="w-9 h-9 rounded-[10px] bg-plum-deep/5 flex items-center justify-center">
                    <span className="material-symbols-outlined text-plum-deep text-lg">{s.icon}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-[0.9375rem] sm:text-[1rem] font-semibold text-plum-deep mb-1 leading-snug">{s.title}</h3>
                  <p className="text-[0.75rem] text-text-muted leading-relaxed hidden sm:block">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BULK / CORPORATE ────────────────────────────────────── */}
      <section className="py-8 sm:py-10 lg:py-14 bg-beige-warm relative overflow-hidden z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 w-full text-center">
          <span className="text-[80px] md:text-[160px] font-black text-plum-deep opacity-[0.04] blur-[3px] whitespace-nowrap uppercase tracking-widest">
            Corporate Printing
          </span>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <span className="text-coral-accent font-bold tracking-widest uppercase text-[0.8125rem] mb-3 block">For Business</span>
              <h2 className="text-[2rem] font-bold text-plum-deep mb-5 leading-tight tracking-[-0.01em]">Bulk Orders &amp; Corporate Accounts</h2>
              <p className="text-base text-text-dark/80 mb-6 leading-relaxed">
                Streamline your procurement with a dedicated business account. Get exclusive pricing, priority support, and easy reordering.
              </p>
              <ul className="space-y-4 mb-6">
                {[
                  { title: "Volume Discounts",         desc: "Save up to 30% on bulk printing orders." },
                  { title: "Dedicated Design Support", desc: "Access to our professional design team for adjustments." },
                  { title: "GST Invoicing",            desc: "Compliant billing for easy input credit claims." },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-coral-accent mt-0.5 text-xl flex-shrink-0">check_circle</span>
                    <div>
                      <strong className="text-plum-deep block text-[0.9375rem] font-semibold">{item.title}</strong>
                      <span className="text-[0.8125rem] text-text-muted">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 lg:px-10 bg-plum-deep text-white font-bold rounded-xl hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.98] text-sm sm:text-base cursor-pointer whitespace-nowrap"
              >
                Open Business Account
              </Link>
            </div>

            <div className="relative hidden lg:block">
              <div className="bg-white p-7 rounded-[12px] shadow-architectural-lg relative z-10 overflow-hidden hover:scale-[1.01] transition-transform duration-300">
                <div className="absolute top-0 right-0 w-28 h-28 bg-coral-accent/5 rounded-bl-[80px]" />
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-11 h-11 rounded-full bg-plum-deep flex items-center justify-center text-white font-bold text-lg">V</div>
                  <div>
                    <h4 className="font-bold text-plum-deep text-[0.9375rem]">Corporate Brand Kit</h4>
                    <p className="text-[0.75rem] text-text-muted">Unified branding across all assets</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="col-span-2 h-28 rounded-[8px] bg-stone-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-plum-deep/10 flex items-center justify-center">
                      <span className="font-bold text-plum-deep/40 text-lg tracking-widest">EVENT BANNER</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white px-2 py-0.5 rounded text-[10px] font-bold text-plum-deep shadow-sm">6ft × 3ft</div>
                  </div>
                  <div className="h-20 rounded-[8px] bg-stone-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-coral-accent/10 flex items-center justify-center">
                      <span className="font-bold text-coral-accent/40 text-xs">LETTERHEAD</span>
                    </div>
                  </div>
                  <div className="h-20 rounded-[8px] bg-stone-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-plum-deep/5 flex items-center justify-center">
                      <div className="w-10 h-7 bg-white shadow-sm border border-stone-200" />
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-text-muted">Biz Cards</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-stone-light/40 rounded-[8px] border border-stone-border/50">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white" />
                    <div className="w-7 h-7 rounded-full bg-gray-400 border-2 border-white" />
                    <div className="w-7 h-7 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">+40</div>
                  </div>
                  <p className="text-[0.75rem] text-text-muted"><strong>Trusted by 40+ Corporates</strong> for brand consistency.</p>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 w-20 h-20 bg-coral-accent/20 rounded-full blur-xl" />
              <div className="absolute -bottom-5 -left-5 w-28 h-28 bg-plum-deep/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 lg:py-20 bg-plum-deep text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 cta-glow-bg pointer-events-none" />
        <div className="max-w-[800px] mx-auto relative z-10">
          <h2 className="text-[2rem] md:text-[2.75rem] font-bold text-white mb-5 leading-tight tracking-[-0.02em]">Ready to Print at Scale?</h2>
          <p className="text-white/70 text-base md:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Join 500+ businesses who trust Vijetha Digital for their printing needs. Quality guaranteed, every order.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-11 sm:h-[52px] px-6 sm:px-10 lg:px-14 bg-coral-accent hover:bg-coral-dark text-white text-sm sm:text-lg font-bold rounded-full shadow-card-enhanced transition-all hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Start Your Order
            </Link>
            <a
              href="tel:+917942643004"
              className="inline-flex items-center justify-center h-11 sm:h-[52px] px-6 sm:px-10 lg:px-12 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all text-sm sm:text-lg cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base sm:text-lg mr-2">call</span>
              +91 79426 43004
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
