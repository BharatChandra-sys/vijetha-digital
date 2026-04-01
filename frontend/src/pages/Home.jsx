import { useEffect, useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { useAuth } from "../context/AuthContext";

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

const BADGES = ["Best Seller", "Bulk Discount", "Best Seller"];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const popular = products.slice(0, 3);

  return (
    <div className="font-display overflow-x-hidden relative">

      {/* Global watermark – right edge */}
      <div className="fixed right-0 top-0 h-full w-[200px] pointer-events-none z-0 hidden lg:flex items-center justify-center opacity-[0.03]">
        <div className="vertical-watermark text-[120px] font-black text-plum-deep leading-none whitespace-nowrap">
          PRINT. BRAND. SCALE.
        </div>
      </div>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-8 pb-10 lg:pt-14 lg:pb-20 overflow-hidden z-10">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12 items-center">
          {/* Left: copy */}
          <div className="relative z-10 space-y-5 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-plum-deep/5 border border-plum-deep/10">
              <span className="w-1.5 h-1.5 rounded-full bg-coral-accent flex-shrink-0" />
              <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-plum-deep">Premium Print Solutions · Since 2002</span>
            </div>

            <h1 className="text-[1.875rem] sm:text-[2.375rem] lg:text-[2.75rem] font-extrabold text-plum-deep leading-[1.1] tracking-[-0.025em]">
              Premium Printing for{" "}
              <span className="text-coral-accent">Businesses</span>{" "}
              &amp; Brands
            </h1>

            <p className="text-[0.9375rem] text-text-muted leading-relaxed max-w-[480px]">
              From business cards to large-format signage — premium-quality prints that elevate your brand across Hyderabad.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center h-11 px-7 bg-plum-deep hover:bg-plum-light text-white font-bold rounded-lg shadow-soft-plum transition-all hover:-translate-y-0.5 active:scale-[0.98] text-sm"
              >
                Explore Products
              </Link>
              <a
                href="tel:+917942643004"
                className="inline-flex items-center justify-center h-11 px-7 border-2 border-plum-deep text-plum-deep hover:bg-plum-deep hover:text-white font-bold rounded-lg transition-all text-sm"
              >
                <span className="material-symbols-outlined text-base mr-1.5">call</span>
                Get Custom Quote
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4">
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
              />
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0" style={{background:"linear-gradient(135deg, rgba(59,47,99,0.15) 0%, transparent 60%)"}} />
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
            <div className="absolute -top-3 -right-3 bg-plum-deep text-white rounded-xl shadow-soft-plum px-3 py-2 flex items-center gap-2">
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
              />
              <div className="absolute inset-0" style={{background:"linear-gradient(135deg, rgba(59,47,99,0.1) 0%, transparent 60%)"}} />
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
      <section className="py-10 bg-white border-b border-stone-border z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[0.6875rem] font-bold uppercase tracking-widest text-text-muted/40 mb-6">
            Trusted by businesses across Hyderabad since 2002
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
            {[
              { icon: "groups",         stat: "500+",   label: "Happy Businesses"    },
              { icon: "local_shipping", stat: "24–48h", label: "Turnaround Time"     },
              { icon: "receipt_long",   stat: "GST",    label: "Tax Invoice"         },
              { icon: "verified_user",  stat: "100%",   label: "Quality Guaranteed"  },
            ].map(t => (
              <div key={t.label} className="flex flex-col items-center text-center gap-1.5 p-3 sm:p-4 rounded-[12px] bg-warm-white border border-stone-border/60 hover:border-plum-deep/20 hover:shadow-card-default transition-all duration-200">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[8px] bg-plum-deep/5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-plum-deep text-lg sm:text-xl">{t.icon}</span>
                </div>
                <span className="text-[1.25rem] sm:text-[1.625rem] font-black text-plum-deep tracking-tight leading-none">{t.stat}</span>
                <span className="text-[0.625rem] sm:text-[0.75rem] font-semibold text-text-muted leading-tight">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ───────────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-white z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-8 lg:mb-10">
            <div>
              {/* H2: 32px per spec */}
              <h2 className="text-[2rem] font-bold text-plum-deep mb-2 leading-tight tracking-[-0.01em]">Our Core Services</h2>
              <p className="text-base text-text-muted">Specialized printing solutions for every need.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-coral-accent font-bold text-sm hover:gap-2 transition-all whitespace-nowrap">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
            {SERVICES.map(svc => (
              <div key={svc.title} onClick={() => navigate("/products")}
                className="group coral-top-border bg-warm-white p-4 rounded-[12px] shadow-card-default hover:shadow-card-hover border border-stone-border/60 hover:border-stone-border cursor-pointer transition-all duration-200 active:scale-[0.98]">
                <div className="w-9 h-9 bg-white rounded-[8px] flex items-center justify-center shadow-sm mb-3 group-hover:bg-plum-deep transition-colors duration-200 flex-shrink-0">
                  <span className="material-symbols-outlined text-plum-deep group-hover:text-white text-lg">{svc.icon}</span>
                </div>
                <h3 className="text-[0.875rem] sm:text-[1rem] font-semibold text-plum-deep mb-1 leading-snug">{svc.title}</h3>
                <p className="text-[0.6875rem] sm:text-[0.8125rem] text-text-muted leading-relaxed line-clamp-2">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR PRODUCTS ────────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-[#fbf9f4] z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-[2rem] font-bold text-plum-deep mb-2 leading-tight tracking-[-0.01em]">Popular Products</h2>
              <p className="text-base text-text-muted">Our most-ordered items by Hyderabad businesses.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-coral-accent font-bold text-sm hover:gap-2 transition-all whitespace-nowrap">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-[12px] overflow-hidden border border-stone-border/50">
                  <div className="aspect-[4/3] skeleton" />
                  <div className="p-3 sm:p-5 space-y-2">
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-3 skeleton rounded w-1/2" />
                    <div className="h-8 skeleton rounded w-full mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 stagger-children">
              {popular.map((product, idx) => (
                <div key={product.id} onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-[12px] overflow-hidden shadow-product-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group border border-stone-border/50 cursor-pointer active:scale-[0.98]">
                  <div className="aspect-[4/3] bg-stone-light relative overflow-hidden">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-light">
                        <span className="material-symbols-outlined text-plum-deep/20 text-4xl">image</span>
                      </div>
                    )}
                    <div className={`absolute top-2 left-2 text-white text-[0.625rem] sm:text-[0.75rem] font-bold px-2 py-0.5 rounded-full shadow-sm ${idx === 1 ? "bg-plum-deep" : "bg-coral-accent"}`}>
                      {BADGES[idx]}
                    </div>
                  </div>
                  <div className="p-3 sm:p-5">
                    <h3 className="text-[0.8125rem] sm:text-[1rem] font-bold text-plum-deep mb-1 group-hover:text-coral-accent transition-colors leading-snug line-clamp-2">{product.name}</h3>
                    <p className="text-text-muted text-[0.75rem] mb-3 line-clamp-2 hidden sm:block">{product.description || product.category}</p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[0.625rem] text-text-muted font-semibold uppercase tracking-wide hidden sm:block">From</span>
                        <span className="text-[0.9375rem] sm:text-lg font-black text-plum-deep tracking-tight leading-none">
                          &#8377;{Number(product.base_price).toLocaleString("en-IN")}
                        </span>
                        <span className="text-[0.625rem] text-text-muted ml-0.5 hidden sm:inline">/ {product.unit || "unit"}</span>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
                        className="inline-flex items-center justify-center h-8 sm:h-10 px-3 sm:px-5 bg-plum-deep text-white hover:bg-plum-light font-bold rounded-[8px] transition-all text-[0.75rem] sm:text-sm active:scale-[0.97] flex-shrink-0"
                      >
                        Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/products"
              className="inline-flex items-center justify-center h-12 px-10 bg-plum-deep hover:bg-plum-light text-white font-bold rounded-[8px] shadow-soft-plum transition-all hover:-translate-y-0.5 active:scale-[0.98] text-sm"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-12 lg:py-16 bg-white border-y border-stone-border z-10 relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 lg:mb-10">
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
                {i < 3 && <div className="hidden lg:block absolute top-7 -right-2 w-4 h-px bg-stone-border z-10" />}
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
      <section className="py-12 lg:py-16 bg-beige-warm relative overflow-hidden z-10">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 w-full text-center">
          <span className="text-[80px] md:text-[160px] font-black text-plum-deep opacity-[0.04] blur-[3px] whitespace-nowrap uppercase tracking-widest">
            Corporate Printing
          </span>
        </div>
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-coral-accent font-bold tracking-widest uppercase text-[0.8125rem] mb-3 block">For Business</span>
              <h2 className="text-[2rem] font-bold text-plum-deep mb-5 leading-tight tracking-[-0.01em]">Bulk Orders &amp; Corporate Accounts</h2>
              <p className="text-base text-text-muted mb-8 leading-relaxed">
                Streamline your procurement with a dedicated business account. Get exclusive pricing, priority support, and easy reordering.
              </p>
              <ul className="space-y-5 mb-8">
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
                className="inline-flex items-center justify-center h-12 px-8 bg-plum-deep text-white font-bold rounded-[8px] shadow-soft-plum hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.98] text-sm"
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
      <section className="py-20 lg:py-24 bg-plum-deep text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 cta-glow-bg pointer-events-none" />
        <div className="max-w-[800px] mx-auto relative z-10">
          <h2 className="text-[2rem] md:text-[2.75rem] font-bold text-white mb-5 leading-tight tracking-[-0.02em]">Ready to Print at Scale?</h2>
          <p className="text-white/70 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Join 500+ businesses who trust Vijetha Digital for their printing needs. Quality guaranteed, every order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-coral-accent rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
              <Link
                to="/products"
                className="relative inline-flex items-center gap-2 h-14 px-12 bg-coral-accent hover:bg-coral-dark text-white text-base font-bold rounded-full shadow-glow-coral transition-all hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Start Your Order
              </Link>
            </div>
            <a
              href="tel:+917942643004"
              className="inline-flex items-center justify-center h-14 px-10 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all text-base"
            >
              <span className="material-symbols-outlined text-base mr-2">call</span>
              +91 79426 43004
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
