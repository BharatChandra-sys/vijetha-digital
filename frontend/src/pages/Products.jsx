import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";

/* ── Static data ────────────────────────────────────────────────────── */

const CATEGORIES = ["Sign Boards", "Printing Services", "Banner Stands", "Demo Tents", "Promotional Items"];

const CATEGORY_META = {
  "": {
    title: "All Products", highlight: "Print Catalog",
    desc: "Explore our complete range of sign boards, printing services, banner stands, and demo tents.",
    image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&q=80&auto=format&fit=crop",
  },
  "Sign Boards": {
    title: "Sign Boards", highlight: "Premium Signage",
    desc: "Vinyl, Glow, Aluminium, Open LED & 3D sign boards for shops, offices & hoardings.",
    image: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600&q=80&auto=format&fit=crop",
  },
  "Printing Services": {
    title: "Printing Services", highlight: "Quality Printing",
    desc: "Offset, flex, letterhead, catalogue, canvas & gift voucher printing — all under one roof.",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format&fit=crop",
  },
  "Banner Stands": {
    title: "Banner Stands", highlight: "Display Solutions",
    desc: "Roll-up standees, roller & heavy banner stands for exhibitions, events & retail displays.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&auto=format&fit=crop",
  },
  "Demo Tents": {
    title: "Demo Tents", highlight: "Outdoor Events",
    desc: "Custom branded canopy & demo tents for outdoor events, promotions & road shows.",
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80&auto=format&fit=crop",
  },
  "Promotional Items": {
    title: "Promotional Items", highlight: "Marketing Essentials",
    desc: "Business cards, brochures, flute boards, cutouts, promo tables & more — everything for your next campaign.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
  },
};

const BADGE_MAP = {
  "3D Sign Board":              { label: "Premium",      cls: "bg-purple-700" },
  "Aluminium Sign Board":       { label: "Premium",      cls: "bg-purple-700" },
  "Glow Sign Board":            { label: "Best Seller",  cls: "bg-red-600"    },
  "Vinyl Sign Board":           { label: "Best Seller",  cls: "bg-red-600"    },
  "Open LED Sign Board":        { label: "Best Seller",  cls: "bg-red-600"    },
  "Canvas Printing":            { label: "Premium",      cls: "bg-purple-700" },
  "Catalogue Printing":         { label: "Popular",      cls: "bg-blue-600"   },
  "Flex Printing":              { label: "Best Seller",  cls: "bg-red-600"    },
  "Gift Voucher Printing":      { label: "Eco Friendly", cls: "bg-green-600"  },
  "Offset Printing":            { label: "Best Seller",  cls: "bg-red-600"    },
  "Heavy Roll Up Banner Stand": { label: "Premium",      cls: "bg-purple-700" },
  "Roller Banner Stand":        { label: "Best Seller",  cls: "bg-red-600"    },
  "Outdoor Demo Tent":          { label: "Premium",      cls: "bg-purple-700" },
  "Demo Tent 6×6×7 ft":         { label: "Best Seller",  cls: "bg-red-600"    },
  "Demo Tent 4×4×7 ft":         { label: "Popular",      cls: "bg-blue-600"   },
  "Acrylic Sign Board":          { label: "Popular",      cls: "bg-blue-600"   },
  "LED Acrylic Sign Board":      { label: "Premium",      cls: "bg-purple-700" },
  "ACP Board":                   { label: "Best Seller",  cls: "bg-red-600"    },
  "Star Flex Printing":          { label: "Popular",      cls: "bg-blue-600"   },
  "Vinyl Printing":              { label: "Best Seller",  cls: "bg-red-600"    },
  "Business Card Printing":      { label: "Best Seller",  cls: "bg-red-600"    },
  "Promo Table":                 { label: "Popular",      cls: "bg-blue-600"   },
  "Cutout Sprint":               { label: "Popular",      cls: "bg-blue-600"   },
  "Vehicle Branding":              { label: "Premium",      cls: "bg-purple-700" },
  "T-Shirt Printing":              { label: "Popular",      cls: "bg-blue-600"   },
  "SS Letter Sign Board":           { label: "Premium",      cls: "bg-purple-700" },
  "ACP Cladding":                   { label: "Best Seller",  cls: "bg-red-600"    },
  "In-Shop Branding":               { label: "Popular",      cls: "bg-blue-600"   },
  "Translite Printing":             { label: "Popular",      cls: "bg-blue-600"   },
};

const PRICE_RANGES = [
  { label: "Under \u20b9500",                 min: 0,    max: 500      },
  { label: "\u20b9500 \u2013 \u20b92,000",    min: 500,  max: 2000     },
  { label: "\u20b92,000 \u2013 \u20b95,000",  min: 2000, max: 5000     },
  { label: "Above \u20b95,000",               min: 5000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Most Popular",       value: "popular"    },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First",       value: "newest"     },
];

const ITEMS_PER_PAGE = 12;

/* ── Main component ─────────────────────────────────────────────────── */

export default function Products() {
  const navigate                        = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]         = useState([]);
  const [loading,  setLoading]          = useState(true);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const [sort,     setSort]             = useState("popular");
  const [priceFilters, setPriceFilters] = useState([]);
  const [bulkOnly, setBulkOnly]         = useState(false);
  const [page,     setPage]             = useState(1);

  const activeCategory = searchParams.get("category") ?? "";

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCategory = (cat) => {
    setPriceFilters([]);
    setPage(1);
    cat ? setSearchParams({ category: cat }) : setSearchParams({});
  };

  const togglePrice = (label) => {
    setPage(1);
    setPriceFilters(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };
  const clearAll = () => { setPriceFilters([]); setBulkOnly(false); setPage(1); };

  const allFiltered = useMemo(() => {
    let list = products.filter(p => !activeCategory || p.category === activeCategory);
    if (priceFilters.length) {
      list = list.filter(p => {
        const price = Number(p.base_price);
        return priceFilters.some(label => {
          const range = PRICE_RANGES.find(r => r.label === label);
          return range && price >= range.min && price < range.max;
        });
      });
    }
    if (bulkOnly) {
      list = list.filter(p => {
        const u = (p.unit || "").toLowerCase();
        return u.includes("1000") || u.includes("sq ft") || Number(p.base_price) >= 1000;
      });
    }
    if (sort === "price_asc")  list = [...list].sort((a,b) => Number(a.base_price) - Number(b.base_price));
    if (sort === "price_desc") list = [...list].sort((a,b) => Number(b.base_price) - Number(a.base_price));
    return list;
  }, [products, activeCategory, priceFilters, bulkOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(allFiltered.length / ITEMS_PER_PAGE));
  const visible    = allFiltered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const meta = CATEGORY_META[activeCategory] || CATEGORY_META[""];

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-warm-white font-display">

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[85%] max-w-sm bg-white z-10 flex flex-col overflow-y-auto shadow-2xl slide-in-left">
            <div className="flex justify-between items-center px-5 py-4 border-b border-stone-border">
              <span className="text-[1.125rem] font-bold text-plum-deep">Filters</span>
              <button onClick={() => setDrawerOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-stone-light transition-colors">
                <span className="material-symbols-outlined text-plum-deep text-xl">close</span>
              </button>
            </div>
            <div className="p-5 space-y-2 border-b border-stone-border">
              <h3 className="font-bold text-plum-deep text-[0.8125rem] mb-3 uppercase tracking-wide">Category</h3>
              {["", ...CATEGORIES].map(cat => (
                <button key={cat || "all"} onClick={() => { handleCategory(cat); setDrawerOpen(false); }}
                  className={`block w-full text-left text-sm px-3 py-2.5 rounded-[8px] font-medium transition-colors ${activeCategory === cat ? "bg-plum-deep text-white" : "text-text-muted hover:text-plum-deep hover:bg-stone-light"}`}>
                  {cat || "All Products"}
                </button>
              ))}
            </div>
            <div className="p-5">
              <SidebarContent priceFilters={priceFilters} togglePrice={togglePrice} bulkOnly={bulkOnly} setBulkOnly={v => { setBulkOnly(v); setPage(1); }} />
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-warm-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
            <div className="w-full lg:w-1/2 space-y-3">
              <nav className="flex items-center text-[0.75rem] text-text-muted">
                <Link to="/" className="hover:text-plum-deep transition-colors">Home</Link>
                <span className="material-symbols-outlined text-xs mx-1">chevron_right</span>
                <span className="text-plum-deep font-semibold">{meta.title}</span>
              </nav>
              {/* H1: 28px mobile → 44px desktop */}
              <h1 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-extrabold text-plum-deep leading-[1.1] tracking-[-0.02em]">
                {meta.highlight.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-coral-accent">{meta.highlight.split(" ").slice(-1)[0]}</span>
              </h1>
              <p className="text-[0.875rem] sm:text-base text-text-muted max-w-xl leading-relaxed">{meta.desc}</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: "verified",       label: "Quality Guaranteed" },
                  { icon: "receipt_long",   label: "GST Invoice"        },
                  { icon: "local_shipping", label: "Fast Delivery"      },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-1.5 text-[0.75rem] font-medium text-plum-deep/80 bg-white border border-stone-border px-2.5 py-1 rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-coral-accent text-sm">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
            {/* Hero image — desktop only */}
            <div className="hidden lg:flex lg:w-1/2 justify-end">
              <div className="relative w-full max-w-[320px] aspect-[4/3]">
                <div className="absolute inset-0 bg-coral-accent/5 rounded-full blur-3xl transform translate-x-8 translate-y-8" />
                <img key={meta.image} src={meta.image} alt={meta.title}
                  className="relative z-10 w-full h-full object-cover rounded-[12px] shadow-architectural-xl hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute -bottom-3 -left-3 z-20 bg-white py-2 px-3 rounded-[10px] shadow-card-enhanced border border-stone-border/50 max-w-[160px]">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="material-symbols-outlined text-coral-accent text-sm">stars</span>
                    <span className="text-[0.625rem] font-bold text-plum-deep uppercase tracking-wider">Top Rated</span>
                  </div>
                  <p className="text-[0.625rem] text-text-muted leading-tight">Trusted by 500+ businesses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-stone-border/60" />

      {/* Category tabs */}
      <div className="bg-white border-b border-stone-border sticky top-[57px] z-30">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            {["", ...CATEGORIES].map(cat => (
              <button key={cat || "all"} onClick={() => handleCategory(cat)}
                className={`whitespace-nowrap px-3 sm:px-4 py-2.5 sm:py-3 text-[0.75rem] sm:text-[0.8125rem] font-semibold transition-all duration-150 border-b-2 ${
                  activeCategory === cat
                    ? "border-plum-deep text-plum-deep"
                    : "border-transparent text-text-muted hover:text-plum-deep hover:border-plum-deep/30"
                }`}>
                {cat || "All"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-[#fbf9f4] min-h-screen pt-4 sm:pt-6">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">

          {/* Count + sort */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-border/60 mb-4">
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-plum-deep border border-stone-border bg-white px-3 h-9 rounded-[8px] shadow-sm"
                onClick={() => setDrawerOpen(true)}
              >
                <span className="material-symbols-outlined text-base">tune</span>
                Filters
                {(priceFilters.length > 0 || bulkOnly) && (
                  <span className="w-4 h-4 rounded-full bg-coral-accent text-white text-[0.5625rem] font-bold flex items-center justify-center">
                    {priceFilters.length + (bulkOnly ? 1 : 0)}
                  </span>
                )}
              </button>
              <p className="text-text-muted text-[0.8125rem]">
                <span className="text-plum-deep font-bold">{allFiltered.length}</span>
                <span className="hidden sm:inline"> Products</span>
              </p>
            </div>
            <div className="relative">
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-stone-border text-plum-deep text-[0.8125rem] font-semibold h-9 pl-3 pr-8 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-plum-deep/20 cursor-pointer shadow-sm">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-plum-deep">
                <span className="material-symbols-outlined text-sm">expand_more</span>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {(priceFilters.length > 0 || bulkOnly) && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-semibold text-text-muted mr-1">Active Filters:</span>
              {priceFilters.map(label => (
                <div key={label} className="inline-flex items-center bg-white border border-stone-border rounded-full px-3 py-1 text-xs font-medium text-plum-deep shadow-sm">
                  {label}
                  <button className="ml-2 hover:text-coral-accent flex items-center" onClick={() => togglePrice(label)}>
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
              {bulkOnly && (
                <div className="inline-flex items-center bg-white border border-stone-border rounded-full px-3 py-1 text-xs font-medium text-plum-deep shadow-sm">
                  Bulk Orders
                  <button className="ml-2 hover:text-coral-accent flex items-center" onClick={() => { setBulkOnly(false); setPage(1); }}>
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              )}
              <button className="text-xs font-bold text-coral-accent hover:text-coral-dark ml-1 underline decoration-dashed underline-offset-4" onClick={clearAll}>Clear All</button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop sidebar */}
            <aside className="w-full lg:w-56 flex-shrink-0 hidden lg:block h-fit sticky top-[120px]">
              <div className="bg-sidebar-bg p-5 rounded-[12px] border border-stone-border/60 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-plum-deep text-[0.9375rem]">Filters</h2>
                  {(priceFilters.length > 0 || bulkOnly) && (
                    <button className="text-[0.75rem] font-bold text-coral-accent hover:text-coral-dark" onClick={clearAll}>Clear All</button>
                  )}
                </div>
                <SidebarContent priceFilters={priceFilters} togglePrice={togglePrice} bulkOnly={bulkOnly} setBulkOnly={v => { setBulkOnly(v); setPage(1); }} />
              </div>
            </aside>

            {/* Grid */}
            <main className="flex-1">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                  {[...Array(8)].map((_,i) => (
                    <div key={i} className="bg-white rounded-[12px] overflow-hidden border border-stone-border/50">
                      <div className="aspect-[4/3] skeleton" />
                      <div className="p-3 sm:p-4 space-y-2">
                        <div className="h-3 skeleton rounded w-3/4" />
                        <div className="h-3 skeleton rounded w-1/2" />
                        <div className="h-8 skeleton rounded w-full mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : allFiltered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-full bg-stone-light flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-5xl text-plum-deep/30">search_off</span>
                  </div>
                  <h3 className="text-xl font-bold text-plum-deep mb-2">No products found</h3>
                  <p className="text-text-muted text-sm max-w-xs mb-6">
                    {priceFilters.length > 0 || bulkOnly
                      ? "No products match your current filters. Try adjusting or clearing them."
                      : "We couldn't find any products in this category right now."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {(priceFilters.length > 0 || bulkOnly) && (
                      <button
                        onClick={clearAll}
                        className="h-11 px-6 rounded-xl bg-plum-deep text-white font-semibold text-sm hover:bg-plum-light transition-all hover:-translate-y-0.5"
                      >
                        Clear Filters
                      </button>
                    )}
                    <button
                      onClick={() => handleCategory("")}
                      className="h-11 px-6 rounded-xl border-2 border-plum-deep text-plum-deep font-semibold text-sm hover:bg-plum-deep hover:text-white transition-all"
                    >
                      Browse All Products
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 stagger-children">
                    {visible.map(product => <ProductCard key={product.id} product={product} navigate={navigate} />)}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-border bg-white text-plum-deep hover:bg-stone-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors shadow-sm ${
                            p === page
                              ? "bg-plum-deep text-white border border-plum-deep"
                              : "border border-stone-border bg-white text-plum-deep hover:bg-stone-light"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-border bg-white text-plum-deep hover:bg-stone-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                      </button>
                    </div>
                  )}

                  {/* Page info */}
                  {totalPages > 1 && (
                    <p className="text-center text-xs text-text-muted mt-3">
                      Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, allFiltered.length)} of {allFiltered.length} products
                    </p>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* B2B section */}
      <section className="py-12 bg-beige-warm border-t border-stone-border relative overflow-hidden"
        style={{ backgroundImage: "radial-gradient(#CFC8BD 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-10 bg-white rounded-[12px] p-8 lg:p-12 shadow-architectural-lg border border-stone-border/50 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#3B2F63 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
            <div className="w-full md:w-1/2 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-deep/5 border border-plum-deep/10 mb-5">
                <span className="w-2 h-2 rounded-full bg-coral-accent" />
                <span className="text-[0.75rem] font-bold uppercase tracking-wider text-plum-deep">For Enterprise</span>
              </div>
              <h2 className="text-[2rem] font-bold text-plum-deep mb-4 leading-tight tracking-[-0.01em]">Streamline Corporate Ordering</h2>
              <p className="text-base text-text-muted mb-7 leading-relaxed">Ensure brand consistency across all branches. Dedicated bulk pricing, account support &amp; monthly invoicing for high-volume needs.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register" className="inline-flex items-center justify-center h-11 px-7 bg-plum-deep hover:bg-plum-light text-white font-bold rounded-[8px] shadow-soft-plum transition-all hover:-translate-y-0.5 text-sm">
                  Open Business Account
                </Link>
                <a href="tel:+917942643004" className="inline-flex items-center justify-center h-11 px-7 border border-plum-deep text-plum-deep hover:bg-plum-deep/5 font-bold rounded-[8px] transition-all text-sm">
                  Call +91 79426 43004
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/2 z-10">
              <div className="relative h-56 md:h-64 w-full bg-stone-light/50 rounded-[12px] overflow-hidden border border-stone-border flex items-center justify-center shadow-inner">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#3B2F63 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-[60%] -translate-y-[40%] -rotate-6 w-48 h-24 bg-white rounded-[8px] shadow-2xl border-l-4 border-plum-deep flex flex-col p-3 z-10">
                  <div className="w-7 h-7 rounded bg-plum-deep/10 mb-2" /><div className="h-2 w-20 bg-stone-200 rounded mb-1.5" /><div className="h-2 w-14 bg-stone-200 rounded" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-[40%] -translate-y-[60%] rotate-3 w-48 h-24 bg-white rounded-[8px] shadow-2xl border-l-4 border-coral-accent flex flex-col p-3 z-20">
                  <div className="flex justify-between mb-2"><div className="w-7 h-7 rounded bg-coral-accent/10" /><div className="text-[8px] font-bold text-stone-400">VIJETHA</div></div>
                  <div className="h-2 w-24 bg-stone-800 rounded mb-1.5" /><div className="h-2 w-16 bg-stone-300 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────── */
function SidebarContent({ priceFilters, togglePrice, bulkOnly, setBulkOnly }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-stone-border/50 pb-5">
        <h3 className="font-bold text-plum-deep text-sm mb-3">Price Range</h3>
        <div className="space-y-2.5">
          {PRICE_RANGES.map(r => (
            <label key={r.label} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="form-checkbox text-plum-deep rounded border-stone-300 w-5 h-5 cursor-pointer"
                checked={priceFilters.includes(r.label)} onChange={() => togglePrice(r.label)} />
              <span className="text-sm text-text-muted group-hover:text-plum-deep transition-colors">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-b border-stone-border/50 pb-5">
        <h3 className="font-bold text-plum-deep text-sm mb-3">Order Type</h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div
            onClick={() => setBulkOnly(!bulkOnly)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${bulkOnly ? "bg-plum-deep" : "bg-stone-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${bulkOnly ? "translate-x-5" : "translate-x-0"}`} />
          </div>
          <span className="text-sm text-text-muted group-hover:text-plum-deep transition-colors">Bulk Orders Only</span>
        </label>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-coral-accent text-lg">receipt_long</span>
          <span className="text-sm font-bold text-plum-deep">GST Invoice</span>
        </div>
        <p className="text-xs text-text-muted leading-tight">All orders include a valid GST invoice · 36AGBPC3175H1ZP</p>
      </div>
      <div className="bg-white p-4 rounded-xl border border-stone-border shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-coral-accent text-lg">bolt</span>
          <span className="text-sm font-bold text-plum-deep">Fast Turnaround</span>
        </div>
        <p className="text-xs text-text-muted leading-tight">Most orders ready within 24–48 hours</p>
      </div>
    </div>
  );
}

/* ── Product card ──────────────────────────────────────────────────── */
function ProductCard({ product, navigate }) {
  const badge = BADGE_MAP[product.name];
  return (
    <div
      className="bg-white rounded-[12px] overflow-hidden shadow-product-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 group border border-stone-border/50 flex flex-col h-full cursor-pointer active:scale-[0.98]"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image — square-ish on mobile, 4:3 on desktop */}
      <div className="aspect-square sm:aspect-[4/3] bg-stone-light relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1">
            <span className="material-symbols-outlined text-plum-deep/20 text-3xl">image</span>
            <span className="text-[0.625rem] text-text-muted/50 font-medium text-center px-2 leading-tight">{product.category}</span>
          </div>
        )}
        {badge && (
          <div className={`absolute top-2 left-2 ${badge.cls} text-white text-[0.5625rem] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide shadow-sm`}>
            {badge.label}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <span className="text-[0.5625rem] sm:text-[0.6875rem] font-semibold text-text-muted uppercase tracking-wide mb-0.5 truncate">{product.category}</span>
        <h3 className="text-[0.8125rem] sm:text-[0.9375rem] font-bold text-plum-deep mb-1 group-hover:text-coral-accent transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-[0.75rem] text-text-muted line-clamp-2 mb-2 leading-relaxed hidden sm:block">{product.description}</p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-2 border-t border-stone-border/40">
          <div className="flex items-center justify-between gap-1.5">
            <div className="min-w-0">
              <span className="text-[0.5625rem] text-text-muted font-medium hidden sm:block">From</span>
              <div className="flex items-baseline gap-0.5 flex-wrap">
                <span className="text-[0.9375rem] sm:text-[1.0625rem] font-extrabold text-plum-deep leading-none">
                  &#8377;{Number(product.base_price).toLocaleString("en-IN")}
                </span>
                <span className="text-[0.5625rem] sm:text-[0.6875rem] text-text-muted hidden sm:inline">/ {product.unit || "unit"}</span>
              </div>
            </div>
            <button
              className="inline-flex items-center justify-center h-8 sm:h-9 px-2.5 sm:px-4 bg-plum-deep text-white hover:bg-plum-light font-bold rounded-[8px] transition-all text-[0.6875rem] sm:text-[0.8125rem] active:scale-[0.97] flex-shrink-0 whitespace-nowrap"
              onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`); }}
            >
              Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
