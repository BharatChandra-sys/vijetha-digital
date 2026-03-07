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
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-deep/5 border border-plum-deep/10">
              <span className="w-2 h-2 rounded-full bg-coral-accent" />
              <span className="text-xs font-bold uppercase tracking-wider text-plum-deep">Premium Print Solutions</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-plum-deep leading-tight tracking-tight">
              Premium Printing for <span className="text-coral-accent font-bold">Businesses</span> &amp; Brands
            </h1>

            <p className="text-lg text-text-muted max-w-lg leading-relaxed">
              From business cards to large-format signage, we deliver premium-quality prints that elevate your brand presence and visibility.
            </p>

            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/products" className="bg-plum-deep hover:bg-plum-light text-white font-bold py-4 px-8 rounded-lg shadow-soft-plum transition-all transform hover:-translate-y-1 text-center">
                  Explore Products
                </Link>
                <button className="bg-transparent border-2 border-plum-deep text-plum-deep hover:bg-plum-deep hover:text-white font-bold py-4 px-8 rounded-lg transition-all">
                  Get Custom Quote
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-plum-deep/80 font-medium">
                <span className="material-symbols-outlined text-coral-accent text-lg">verified_user</span>
                <span>Trusted by businesses across Hyderabad</span>
              </div>
            </div>
          </div>

          {/* Right: floating image cards */}
          <div className="relative h-[550px] hidden lg:flex items-center justify-center">
            <div className="absolute inset-0 plum-glow-bg scale-150 transform translate-x-10 translate-y-10 blur-3xl opacity-60" />
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Small card top-left */}
              <div className="absolute top-16 left-4 z-10 transform -rotate-6 hover:rotate-0 transition-all duration-500 w-48 opacity-90 hover:z-20">
                <div className="bg-white p-2 rounded-xl shadow-architectural">
                  <img src="https://images.pexels.com/photos/8381085/pexels-photo-8381085.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Business Cards" className="w-full h-32 object-cover rounded-lg" />
                </div>
              </div>
              {/* Small card bottom-left */}
              <div className="absolute bottom-16 left-12 z-10 transform rotate-3 hover:rotate-0 transition-all duration-500 w-56 opacity-90 hover:z-20">
                <div className="bg-white p-2 rounded-xl shadow-architectural">
                  <img src="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Brochure" className="w-full h-40 object-cover rounded-lg" />
                </div>
              </div>
              {/* Small card top-right */}
              <div className="absolute top-24 right-8 z-10 transform rotate-6 hover:rotate-0 transition-all duration-500 w-48 opacity-90 hover:z-20">
                <div className="bg-white p-2 rounded-xl shadow-architectural">
                  <img src="https://images.pexels.com/photos/270082/pexels-photo-270082.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Packaging" className="w-full h-32 object-cover rounded-lg" />
                </div>
              </div>
              {/* Large center card */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 w-[420px] lg:w-[500px]">
                <div className="bg-white p-3 rounded-2xl shadow-architectural-xl hover:scale-[1.02] transition-transform duration-500">
                  <img src="https://images.pexels.com/photos/1126384/pexels-photo-1126384.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Large Format LED Signage" className="w-full h-80 lg:h-96 object-cover rounded-xl brightness-105 contrast-105" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile hero image */}
          <div className="lg:hidden">
            <div className="bg-white p-3 rounded-2xl shadow-architectural-xl">
              <img src="https://images.pexels.com/photos/1126384/pexels-photo-1126384.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Large Format LED Signage" className="w-full h-64 object-cover rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE BAR ─────────────────────────────────────────── */}
      <div className="border-y border-stone-border bg-white/50 backdrop-blur-sm z-20 relative">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap justify-between items-center gap-4 lg:gap-8">
            {FEATURES.map((f, i) => (
              <Fragment key={f.label}>
                {i > 0 && <div className="hidden md:block w-px h-4 bg-stone-border" />}
                <div className="flex items-center gap-2 text-sm font-semibold text-plum-deep/80">
                  <span className="material-symbols-outlined text-coral-accent" style={{ fontSize: "1.35rem" }}>{f.icon}</span>
                  {f.label}
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── CORE SERVICES ───────────────────────────────────────── */}
      <section className="py-20 bg-white z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-bold text-plum-deep mb-2">Our Core Services</h2>
              <p className="text-text-muted/80">Specialized printing solutions for every need.</p>
            </div>
            <Link to="/products" className="hidden sm:flex items-center gap-1 text-coral-accent font-bold hover:gap-2 transition-all">
              View All Services <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map(svc => (
              <div key={svc.title} onClick={() => navigate("/products")}
                className="group coral-top-border bg-warm-white p-8 rounded-[20px] shadow-card-enhanced hover:shadow-card-hover border border-transparent hover:border-stone-border cursor-pointer transition-all duration-300">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:bg-plum-deep transition-colors">
                  <span className="material-symbols-outlined text-plum-deep group-hover:text-white text-2xl">{svc.icon}</span>
                </div>
                <h3 className="text-lg font-black text-plum-darker mb-2">{svc.title}</h3>
                <p className="text-sm text-text-muted/80 leading-relaxed">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR PRODUCTS ────────────────────────────────────── */}
      <section className="py-24 bg-[#fbf9f4] z-10 relative">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-plum-deep mb-10 text-center">Popular Products</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-stone-border/50 animate-pulse">
                  <div className="h-80 bg-stone-light" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-stone-light rounded w-3/4" />
                    <div className="h-4 bg-stone-light rounded w-1/2" />
                    <div className="h-8 bg-stone-light rounded w-full mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {popular.map((product, idx) => (
                <div key={product.id} onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-product-card hover:shadow-card-hover transition-all duration-300 group border border-stone-border/50 cursor-pointer">
                  <div className="h-80 bg-gray-100 relative overflow-hidden shadow-sm">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-plum-deep/20 text-5xl">image</span>
                      </div>
                    )}
                    <div className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md ${idx === 1 ? "bg-plum-deep" : "bg-coral-accent"}`}>
                      {BADGES[idx]}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-plum-deep mb-2 mt-4 group-hover:text-coral-accent transition-colors">{product.name}</h3>
                    <p className="text-text-muted/70 text-sm mb-4 font-medium line-clamp-2">{product.description || product.category}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div>
                        <span className="text-xs text-text-muted block opacity-70 font-semibold uppercase tracking-wide">Starting from</span>
                        <span className="text-2xl font-[900] text-plum-deep tracking-tight">
                          &#8377;{Number(product.base_price).toLocaleString("en-IN")}
                          <span className="text-sm font-semibold text-text-muted opacity-60 ml-1">/ {product.unit || "unit"}</span>
                        </span>
                      </div>
                      <button onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
                        className="bg-plum-deep text-white hover:bg-plum-light font-bold py-2.5 px-6 rounded-lg transition-colors text-sm shadow-md">
                        Order Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Explore All Products Button */}
          <div className="text-center mt-12">
            <Link 
              to="/products" 
              className="inline-block bg-plum-deep hover:bg-plum-light text-white font-bold py-4 px-10 rounded-lg shadow-soft-plum transition-all transform hover:-translate-y-1"
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── BULK / CORPORATE ────────────────────────────────────── */}
      <section className="py-24 bg-beige-warm relative overflow-hidden z-10">
        {/* Watermark: Corporate Printing */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 w-full text-center">
          <span className="text-[120px] md:text-[230px] font-black text-plum-deep opacity-[0.05] blur-[4px] whitespace-nowrap uppercase tracking-widest scale-105">
            Corporate Printing
          </span>
        </div>
        {/* Watermark: BULK */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 pointer-events-none select-none z-0">
          <span className="text-[140px] md:text-[240px] font-black text-plum-deep opacity-[0.06] blur-[2px] whitespace-nowrap">BULK</span>
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">For Business</span>
              <h2 className="text-4xl font-bold text-plum-deep mb-6">Bulk Orders &amp; Corporate Accounts</h2>
              <p className="text-text-muted mb-8 text-lg">
                Streamline your procurement process with a dedicated business account. Get exclusive pricing, priority support, and easy reordering.
              </p>
              <ul className="space-y-6 mb-10">
                {[
                  { title: "Volume Discounts",          desc: "Save up to 30% on bulk printing orders." },
                  { title: "Dedicated Design Support",  desc: "Access to our professional design team for adjustments." },
                  { title: "GST Invoicing",             desc: "Compliant billing for easy input credit claims." },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-coral-accent mt-0.5">check_circle</span>
                    <div>
                      <strong className="text-plum-deep block">{item.title}</strong>
                      <span className="text-sm text-text-muted">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/register" className="inline-block bg-plum-deep text-white px-8 py-3 rounded-lg font-bold shadow-soft-plum hover:bg-plum-light transition-colors">
                Open Business Account
              </Link>
            </div>

            {/* Right: Corporate Brand Kit mockup card */}
            <div className="relative hidden lg:block">
              <div className="bg-white p-8 rounded-2xl shadow-architectural-lg relative z-10 overflow-hidden transform transition-transform hover:scale-[1.01]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-coral-accent/5 rounded-bl-[100px]" />
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-plum-deep flex items-center justify-center text-white font-bold text-xl">V</div>
                  <div>
                    <h4 className="font-bold text-plum-deep">Corporate Brand Kit</h4>
                    <p className="text-xs text-text-muted">Unified branding across all assets</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="col-span-2 h-32 rounded-lg bg-stone-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-plum-deep/10 flex items-center justify-center">
                      <span className="font-bold text-plum-deep/40 text-xl tracking-widest">EVENT BANNER</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded text-[10px] font-bold text-plum-deep shadow-sm">6ft x 3ft</div>
                  </div>
                  <div className="h-24 rounded-lg bg-stone-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-coral-accent/10 flex items-center justify-center">
                      <span className="font-bold text-coral-accent/40 text-xs">LETTERHEAD</span>
                    </div>
                  </div>
                  <div className="h-24 rounded-lg bg-stone-light relative overflow-hidden">
                    <div className="absolute inset-0 bg-plum-deep/5 flex items-center justify-center">
                      <div className="w-12 h-8 bg-white shadow-sm border border-stone-200" />
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-text-muted">Biz Cards</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-stone-light/30 rounded-lg border border-stone-border/50">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">+40</div>
                  </div>
                  <div className="text-xs text-text-muted">
                    <strong>Trusted by 40+ Corporates</strong> for brand consistency.
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-coral-accent/20 rounded-full blur-xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-plum-deep/10 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-24 bg-plum-deep text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 cta-glow-bg pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-wide">Ready to Print at Scale?</h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of businesses who trust Vijetha Digital for their printing needs. Quality guaranteed.
          </p>
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-coral-accent rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
            <Link to="/products"
              className="relative inline-flex items-center gap-2 bg-coral-accent hover:bg-coral-dark text-white text-xl font-bold py-6 px-16 rounded-full shadow-glow-coral transition-all transform hover:-translate-y-1">
              Start Your Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
