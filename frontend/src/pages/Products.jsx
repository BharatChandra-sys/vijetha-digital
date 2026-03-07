import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";

/* ── Static data ────────────────────────────────────────────────────── */

const CATEGORIES = ["Sign Boards", "Printing Services", "Banner Stands", "Demo Tents", "Promotional Items"];

const CATEGORY_META = {
  "": {
    title: "All Products", highlight: "Print Catalog",
    desc: "Explore our complete range of sign boards, printing services, banner stands, and demo tents.",
    image: "https://images.pexels.com/photos/8381085/pexels-photo-8381085.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  "Sign Boards": {
    title: "Sign Boards", highlight: "Premium Signage",
    desc: "Vinyl, Glow, Aluminium, Open LED & 3D sign boards for shops, offices & hoardings.",
    image: "https://images.pexels.com/photos/1126384/pexels-photo-1126384.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  "Printing Services": {
    title: "Printing Services", highlight: "Quality Printing",
    desc: "Offset, flex, letterhead, catalogue, canvas & gift voucher printing — all under one roof.",
    image: "https://images.pexels.com/photos/8381085/pexels-photo-8381085.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  "Banner Stands": {
    title: "Banner Stands", highlight: "Display Solutions",
    desc: "Roll-up standees, roller & heavy banner stands for exhibitions, events & retail displays.",
    image: "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  "Demo Tents": {
    title: "Demo Tents", highlight: "Outdoor Events",
    desc: "Custom branded canopy & demo tents for outdoor events, promotions & road shows.",
    image: "https://images.pexels.com/photos/270082/pexels-photo-270082.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  "Promotional Items": {
    title: "Promotional Items", highlight: "Marketing Essentials",
    desc: "Business cards, brochures, flute boards, cutouts, promo tables & more — everything for your next campaign.",
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=600",
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
    setLoading(true);
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

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [activeCategory]);

  return (
    <div className="min-h-screen bg-warm-white font-display">

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-[85%] max-w-sm bg-white z-10 flex flex-col overflow-y-auto p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-bold text-plum-deep">Filters</span>
              <button onClick={() => setDrawerOpen(false)}>
                <span className="material-symbols-outlined text-plum-deep">close</span>
              </button>
            </div>
            <div className="mb-6 space-y-2 border-b border-stone-border pb-6">
              <h3 className="font-bold text-plum-deep text-sm mb-3">Category</h3>
              {["", ...CATEGORIES].map(cat => (
                <button key={cat || "all"} onClick={() => { handleCategory(cat); setDrawerOpen(false); }}
                  className={`block w-full text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${activeCategory === cat ? "bg-plum-deep text-white" : "text-text-muted hover:text-plum-deep hover:bg-stone-light"}`}>
                  {cat || "All Products"}
                </button>
              ))}
            </div>
            <SidebarContent priceFilters={priceFilters} togglePrice={togglePrice} bulkOnly={bulkOnly} setBulkOnly={v => { setBulkOnly(v); setPage(1); }} />
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-warm-white overflow-hidden">
        {/* Background watermark */}
        <div className="absolute right-0 top-0 h-full w-1/2 overflow-hidden pointer-events-none z-0">
          <div className="absolute -right-20 -top-20 text-[140px] font-black text-plum-deep opacity-[0.03] leading-none whitespace-nowrap select-none">
            {meta.title}
          </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8 lg:py-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            <div className="lg:w-1/2 space-y-4">
              <nav className="flex items-center text-xs text-text-muted">
                <Link to="/" className="hover:text-plum-deep transition-colors">Home</Link>
                <span className="material-symbols-outlined text-xs mx-1">chevron_right</span>
                <span className="text-plum-deep font-semibold">{meta.title}</span>
              </nav>
              <h1 className="text-3xl lg:text-5xl font-extrabold text-plum-deep leading-tight tracking-tight">
                {meta.highlight.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-coral-accent">{meta.highlight.split(" ").slice(-1)[0]}</span>
              </h1>
              <p className="text-base text-text-muted max-w-xl leading-relaxed">{meta.desc}</p>
              <div className="flex flex-wrap gap-3 pt-1">
                {[
                  { icon: "verified",       label: "Quality Guaranteed" },
                  { icon: "receipt_long",   label: "GST Invoice"        },
                  { icon: "local_shipping", label: "Fast Turnaround"    },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2 text-xs font-medium text-plum-deep/80 bg-white border border-stone-border px-3 py-1.5 rounded-full shadow-sm">
                    <span className="material-symbols-outlined text-coral-accent text-base">{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[360px] aspect-[4/3]">
                <div className="absolute inset-0 bg-coral-accent/5 rounded-full blur-3xl transform translate-x-8 translate-y-8" />
                <img key={meta.image} src={meta.image} alt={meta.title}
                  className="relative z-10 w-full h-full object-cover rounded-2xl shadow-architectural-xl hover:scale-[1.02] transition-transform duration-500" />
                <div className="absolute -bottom-4 -left-4 z-20 bg-white py-3 px-4 rounded-xl shadow-card-enhanced border border-stone-border/50 max-w-[180px]">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-coral-accent text-lg">stars</span>
                    <span className="text-[10px] font-bold text-plum-deep uppercase tracking-wider">Top Rated</span>
                  </div>
                  <p className="text-[10px] text-text-muted leading-tight">Trusted by 500+ businesses in Hyderabad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-stone-border/60" />

      {/* Category tabs */}
      <div className="bg-white border-b border-stone-border sticky top-[60px] z-30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center gap-1 overflow-x-auto py-1" style={{ scrollbarWidth: "none" }}>
            {["", ...CATEGORIES].map(cat => (
              <button key={cat || "all"} onClick={() => handleCategory(cat)}
                className={`whitespace-nowrap px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                  activeCategory === cat ? "border-plum-deep text-plum-deep" : "border-transparent text-text-muted hover:text-plum-deep"
                }`}>
                {cat || "All Products"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-[#fbf9f4] min-h-screen pt-8">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-16">

          {/* Count + sort */}
          <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center pb-4 border-b border-stone-border/60 mb-4">
            <div className="flex items-center gap-3">
              <button className="lg:hidden flex items-center gap-2 text-sm font-semibold text-plum-deep border border-stone-border bg-white px-3 py-2 rounded-lg shadow-sm" onClick={() => setDrawerOpen(true)}>
                <span className="material-symbols-outlined text-base">tune</span> Filters
              </button>
              <p className="text-text-muted font-medium text-sm">
                <span className="text-plum-deep font-bold text-lg">{allFiltered.length}</span> Products Found
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 sm:mt-0">
              <span className="text-sm text-text-muted hidden sm:inline font-medium">Sort by:</span>
              <div className="relative">
                <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="appearance-none bg-white border border-stone-border text-plum-deep text-sm font-semibold py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-plum-deep/20 cursor-pointer shadow-sm">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-plum-deep">
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </div>
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
            <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block h-fit sticky top-[120px]">
              <div className="bg-sidebar-bg p-6 rounded-[20px] border border-stone-border/60 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-plum-deep text-lg">Filters</h2>
                  {(priceFilters.length > 0 || bulkOnly) && (
                    <button className="text-xs font-bold text-coral-accent hover:text-coral-dark" onClick={clearAll}>Clear All</button>
                  )}
                </div>
                <SidebarContent priceFilters={priceFilters} togglePrice={togglePrice} bulkOnly={bulkOnly} setBulkOnly={v => { setBulkOnly(v); setPage(1); }} />
              </div>
            </aside>

            {/* Grid */}
            <main className="flex-1">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_,i) => (
                    <div key={i} className="bg-white rounded-[16px] overflow-hidden border border-stone-border/50 animate-pulse">
                      <div className="aspect-[4/2.8] bg-stone-light" />
                      <div className="p-5 space-y-3">
                        <div className="h-4 bg-stone-light rounded w-3/4" />
                        <div className="h-3 bg-stone-light rounded w-1/2" />
                        <div className="h-8 bg-stone-light rounded w-full mt-4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : allFiltered.length === 0 ? (
                <div className="text-center py-24 text-text-muted">
                  <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">search_off</span>
                  <p className="font-semibold text-lg">No products match your filters.</p>
                  <button className="mt-4 text-coral-accent font-bold underline" onClick={clearAll}>Clear filters</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      <section className="py-20 bg-beige-warm border-t border-stone-border relative overflow-hidden"
        style={{ backgroundImage: "radial-gradient(#CFC8BD 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-white rounded-[24px] p-10 lg:p-16 shadow-architectural-lg border border-stone-border/50 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#3B2F63 1px, transparent 1px)", backgroundSize: "12px 12px" }} />
            <div className="w-full md:w-1/2 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-deep/5 border border-plum-deep/10 mb-6">
                <span className="w-2 h-2 rounded-full bg-coral-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-plum-deep">For Enterprise</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-plum-deep mb-4">Streamline Corporate Ordering</h2>
              <p className="text-text-muted mb-8 text-lg leading-relaxed">Ensure brand consistency across all branches. Dedicated bulk pricing, account support &amp; monthly invoicing for high-volume needs.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-block bg-plum-deep hover:bg-plum-light text-white font-bold py-3.5 px-8 rounded-lg shadow-soft-plum transition-all transform hover:-translate-y-1 text-sm text-center">
                  Open Business Account
                </Link>
                <a href="tel:+917942643004" className="inline-block border border-plum-deep text-plum-deep hover:bg-plum-deep/5 font-bold py-3.5 px-8 rounded-lg transition-all text-sm text-center">
                  Call +91 79426 43004
                </a>
              </div>
            </div>
            <div className="w-full md:w-1/2 z-10">
              <div className="relative h-64 md:h-72 w-full bg-stone-light/50 rounded-2xl overflow-hidden border border-stone-border flex items-center justify-center shadow-inner transform scale-[1.25] md:scale-[1.3]">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#3B2F63 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-[60%] -translate-y-[40%] -rotate-6 w-52 h-28 bg-white rounded-lg shadow-2xl border-l-4 border-plum-deep flex flex-col p-4 z-10">
                  <div className="w-8 h-8 rounded bg-plum-deep/10 mb-2" /><div className="h-2 w-24 bg-stone-200 rounded mb-1.5" /><div className="h-2 w-16 bg-stone-200 rounded" />
                </div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-[40%] -translate-y-[60%] rotate-3 w-52 h-28 bg-white rounded-lg shadow-2xl border-l-4 border-coral-accent flex flex-col p-4 z-20">
                  <div className="flex justify-between mb-3"><div className="w-8 h-8 rounded bg-coral-accent/10" /><div className="text-[9px] font-bold text-stone-400">VIJETHA</div></div>
                  <div className="h-2.5 w-28 bg-stone-800 rounded mb-1.5" /><div className="h-2 w-20 bg-stone-300 rounded" />
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
    <div className="bg-white rounded-[16px] overflow-hidden shadow-product-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 group border border-stone-border/50 flex flex-col h-full product-card-hover cursor-pointer"
      onClick={() => navigate(`/products/${product.id}`)}>
      <div className="aspect-[4/2.8] bg-gray-100 relative overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-img w-full h-full object-cover transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-light">
            <span className="material-symbols-outlined text-plum-deep/30 text-5xl">image</span>
          </div>
        )}
        {badge && (
          <div className={`absolute top-3 left-3 ${badge.cls} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm`}>{badge.label}</div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-plum-deep mb-1 group-hover:text-coral-accent transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-text-muted/70 text-xs mb-4 font-medium line-clamp-2">{product.description || product.category}</p>
        <div className="mt-auto pt-3 border-t border-stone-border/40">
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-xl font-extrabold text-plum-deep leading-none">&#8377;{Number(product.base_price).toLocaleString("en-IN")}</span>
            <span className="text-[11px] text-text-muted/80 font-medium">/ {product.unit || "unit"}</span>
          </div>
          <button className="w-full bg-plum-deep text-white hover:bg-plum-hover font-bold py-2.5 rounded-lg transition-colors text-xs shadow-md uppercase tracking-wide"
            onClick={e => { e.stopPropagation(); navigate(`/products/${product.id}`); }}>
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
}
