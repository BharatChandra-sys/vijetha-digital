import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import ProductCard, { ProductCardSkeleton } from "../components/product/ProductCard";
import Breadcrumbs from "../components/store/Breadcrumbs";
import usePageTitle from "../hooks/usePageTitle";
import { BUSINESS, CATEGORIES, CATEGORY_LINK } from "../config/business";

const CATEGORY_META = {
  "": {
    title: "All Products", highlight: "Print Catalog",
    desc: "Explore our complete range of sign boards, printing services, banner stands, and demo tents.",
  },
  "Sign Boards": {
    title: "Sign Boards", highlight: "Premium Signage",
    desc: "Vinyl, Glow, Aluminium, Open LED & 3D sign boards for shops, offices & hoardings.",
  },
  "Printing Services": {
    title: "Printing Services", highlight: "Quality Printing",
    desc: "Offset, flex, letterhead, catalogue, canvas & gift voucher printing, all under one roof.",
  },
  "Banner Stands": {
    title: "Banner Stands", highlight: "Display Solutions",
    desc: "Roll-up standees, roller & heavy banner stands for exhibitions, events & retail displays.",
  },
  "Demo Tents": {
    title: "Demo Tents", highlight: "Outdoor Events",
    desc: "Custom branded canopy & demo tents for outdoor events, promotions & road shows.",
  },
  "Promotional Items": {
    title: "Promotional Items", highlight: "Marketing Essentials",
    desc: "Business cards, brochures, flute boards, cutouts, promo tables & more, for your next campaign.",
  },
};

const PRICE_RANGES = [
  { id: "u500",  label: "Under ₹500",        min: 0,    max: 500      },
  { id: "500",   label: "₹500 – ₹2,000",     min: 500,  max: 2000     },
  { id: "2000",  label: "₹2,000 – ₹5,000",   min: 2000, max: 5000     },
  { id: "5000",  label: "Above ₹5,000",      min: 5000, max: Infinity },
];

const SORT_OPTIONS = [
  { label: "Most Popular",       value: "popular"    },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest First",       value: "newest"     },
];

const ITEMS_PER_PAGE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const gridTopRef = useRef(null);

  // Filter state lives in the URL so filtered views can be shared and survive Back
  const activeCategory = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") || "popular";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const priceFilters = useMemo(() => (searchParams.get("price") || "").split(",").filter(Boolean), [searchParams]);
  const bulkOnly = searchParams.get("bulk") === "1";
  const activeFilterCount = priceFilters.length + (bulkOnly ? 1 : 0);

  const meta = CATEGORY_META[activeCategory] || CATEGORY_META[""];
  usePageTitle(meta.title);

  const fetchProducts = () =>
    getProducts()
      .then(setProducts)
      .catch((err) => { console.error(err); setLoadError(true); })
      .finally(() => setLoading(false));

  useEffect(() => { fetchProducts(); }, []);

  const load = () => {
    setLoading(true);
    setLoadError(false);
    fetchProducts();
  };

  const updateParams = (changes, { keepPage = false } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!keepPage) next.delete("page");
    setSearchParams(next);
  };

  const togglePrice = (id) => {
    const nextIds = priceFilters.includes(id) ? priceFilters.filter((p) => p !== id) : [...priceFilters, id];
    updateParams({ price: nextIds.join(",") });
  };
  const clearAll = () => updateParams({ price: null, bulk: null });

  const allFiltered = useMemo(() => {
    let list = products.filter((p) => !activeCategory || p.category === activeCategory);
    if (priceFilters.length) {
      list = list.filter((p) => {
        const price = Number(p.base_price);
        return priceFilters.some((id) => {
          const range = PRICE_RANGES.find((r) => r.id === id);
          return range && price >= range.min && price < range.max;
        });
      });
    }
    if (bulkOnly) {
      list = list.filter((p) => {
        const u = (p.unit || "").toLowerCase();
        return u.includes("1000") || u.includes("sq ft") || Number(p.base_price) >= 1000;
      });
    }
    if (sort === "price_asc")  list = [...list].sort((a, b) => Number(a.base_price) - Number(b.base_price));
    if (sort === "price_desc") list = [...list].sort((a, b) => Number(b.base_price) - Number(a.base_price));
    if (sort === "newest")     list = [...list].sort((a, b) => Number(b.id) - Number(a.id));
    return list;
  }, [products, activeCategory, priceFilters, bulkOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(allFiltered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const visible = allFiltered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const goToPage = (p) => {
    updateParams({ page: p > 1 ? String(p) : null }, { keepPage: true });
    gridTopRef.current?.scrollIntoView({ block: "start" });
  };

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onEsc = (e) => { if (e.key === "Escape") setDrawerOpen(false); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [drawerOpen]);

  const sidebarProps = {
    priceFilters, togglePrice, bulkOnly,
    setBulkOnly: (v) => updateParams({ bulk: v ? "1" : null }),
  };

  return (
    <main id="main" className="font-display">

      {/* Mobile filters: bottom sheet */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-ink/50 animate-fade-in" onClick={() => setDrawerOpen(false)} />
          <div className="relative flex max-h-[85vh] flex-col rounded-t-xl bg-surface">
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <h2 className="vd-h3">Filters</h2>
              <button onClick={() => setDrawerOpen(false)} className="vd-icon-btn -mr-2" aria-label="Close filters">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-5">
              <SidebarContent {...sidebarProps} />
            </div>
            <div className="flex gap-3 border-t border-line p-4" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
              <button className="vd-btn vd-btn-quiet flex-1" onClick={clearAll} disabled={!activeFilterCount}>Clear All</button>
              <button className="vd-btn vd-btn-ink flex-[2]" onClick={() => setDrawerOpen(false)}>
                Show {allFiltered.length} {allFiltered.length === 1 ? "product" : "products"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page heading: compact, so products sit above the fold */}
      <section className="vd-wrap pb-5 pt-5 lg:pb-7 lg:pt-8">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: meta.title }]} />
        <div className="mt-3 grid gap-3 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h1 className="vd-h1">{meta.highlight}</h1>
            <p className="mt-2 max-w-xl text-ink-2">{meta.desc}</p>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2 lg:col-span-5 lg:justify-end">
            <li>Quality Guaranteed</li>
            <li>GST Invoice</li>
            <li>Fast Delivery</li>
          </ul>
        </div>
      </section>

      {/* Category tabs */}
      <div className="sticky top-[var(--header-h)] z-30 border-y border-line bg-surface">
        <nav aria-label="Product categories" className="vd-wrap">
          <div className="flex gap-5 overflow-x-auto no-scrollbar lg:gap-7">
            {["", ...CATEGORIES].map((cat) => (
              <Link
                key={cat || "all"}
                to={cat ? CATEGORY_LINK(cat) : "/products"}
                aria-current={activeCategory === cat ? "page" : undefined}
                className={`flex h-12 flex-shrink-0 items-center whitespace-nowrap border-b-2 -mb-px text-[0.9375rem] transition-colors ${
                  activeCategory === cat ? "border-accent font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"
                }`}
              >
                {cat || "All"}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      <div ref={gridTopRef} className="vd-wrap scroll-mt-[calc(var(--header-h)+3.5rem)] pb-16 pt-5 lg:pt-8">
        <div className="lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">

          {/* Desktop filters */}
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-[calc(var(--header-h)+4.5rem)]">
              <div className="mb-4 flex min-h-[44px] items-center justify-between">
                <h2 className="text-[0.9375rem] font-semibold">Filters</h2>
                {activeFilterCount > 0 && <button className="vd-link text-sm" onClick={clearAll}>Clear All</button>}
              </div>
              <SidebarContent {...sidebarProps} />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Count + sort */}
            <div className="mb-4 grid grid-cols-2 items-center gap-x-3 gap-y-3 lg:flex lg:justify-between">
              <button className="vd-btn vd-btn-quiet w-full lg:hidden" onClick={() => setDrawerOpen(true)}>
                <span className="material-symbols-outlined text-lg">tune</span>
                Filters
                {activeFilterCount > 0 && <span className="vd-chip vd-price !bg-ink !text-white">{activeFilterCount}</span>}
              </button>
              <p className="order-last col-span-2 text-sm text-ink-2 lg:order-none" aria-live="polite">
                {loading ? "Loading…" : <><span className="vd-price font-semibold text-ink">{allFiltered.length}</span> Products</>}
              </p>
              <div className="relative min-w-0">
                <select
                  value={sort}
                  onChange={(e) => updateParams({ sort: e.target.value === "popular" ? null : e.target.value })}
                  aria-label="Sort products"
                  className="vd-input !min-h-[44px] appearance-none truncate !pr-9 font-medium lg:!w-auto"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg">expand_more</span>
              </div>
            </div>

            {/* Applied filters */}
            {activeFilterCount > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {priceFilters.map((id) => {
                  const range = PRICE_RANGES.find((r) => r.id === id);
                  if (!range) return null;
                  return <FilterChip key={id} label={range.label} onRemove={() => togglePrice(id)} />;
                })}
                {bulkOnly && <FilterChip label="Bulk Orders" onRemove={() => updateParams({ bulk: null })} />}
                <button className="vd-link ml-1 text-sm lg:hidden" onClick={clearAll}>Clear All</button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6">
                {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : loadError ? (
              <div className="border-t border-line py-14">
                <h2 className="vd-h3">We couldn't load the catalog</h2>
                <p className="mt-2 max-w-md text-ink-2">
                  This is usually temporary. Try again, or call us on{" "}
                  <a className="vd-link" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> and we'll quote directly.
                </p>
                <button onClick={load} className="vd-btn vd-btn-ink mt-5">Try Again</button>
              </div>
            ) : allFiltered.length === 0 ? (
              <div className="border-t border-line py-14">
                <h2 className="vd-h3">No products found</h2>
                <p className="mt-2 max-w-md text-ink-2">
                  {activeFilterCount
                    ? "No products match your current filters. Try adjusting or clearing them."
                    : "We couldn't find any products in this category right now."}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  {activeFilterCount > 0 && <button onClick={clearAll} className="vd-btn vd-btn-ink">Clear Filters</button>}
                  <Link to="/products" className="vd-btn vd-btn-outline">Browse All Products</Link>
                </div>
              </div>
            ) : (
              <>
                <div className="vd-reveal grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:gap-x-6 lg:gap-y-10">
                  {visible.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Pagination" className="mt-12 border-t border-line pt-6">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="vd-icon-btn disabled:opacity-40 disabled:hover:bg-transparent" aria-label="Previous page">
                        <span className="material-symbols-outlined text-xl">chevron_left</span>
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => goToPage(p)}
                          aria-current={p === currentPage ? "page" : undefined}
                          className={`vd-price h-11 w-11 rounded-lg text-sm font-semibold transition-colors ${p === currentPage ? "bg-night text-white" : "hover:bg-shade"}`}
                        >
                          {p}
                        </button>
                      ))}
                      <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="vd-icon-btn disabled:opacity-40 disabled:hover:bg-transparent" aria-label="Next page">
                        <span className="material-symbols-outlined text-xl">chevron_right</span>
                      </button>
                    </div>
                    <p className="vd-price mt-2 text-center text-[0.8125rem] text-ink-2">
                      Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, allFiltered.length)} of {allFiltered.length} products
                    </p>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* B2B section */}
      <section className="bg-night text-white">
        <div className="vd-wrap grid gap-8 py-12 lg:grid-cols-12 lg:items-center lg:py-16">
          <div className="lg:col-span-7">
            <p className="mb-2 text-sm font-semibold text-white/80">For Enterprise</p>
            <h2 className="vd-h2">Streamline Corporate Ordering</h2>
            <p className="mt-3 max-w-xl text-[1.0625rem] leading-relaxed text-white/85">
              Ensure brand consistency across all branches. Dedicated bulk pricing, account support &amp; monthly invoicing for high-volume needs.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <Link to="/register" className="vd-btn vd-btn-lg bg-white text-ink hover:bg-paper">Open Business Account</Link>
            <a href={BUSINESS.phoneHref} className="vd-btn vd-btn-lg vd-btn-on-dark vd-price">Call {BUSINESS.phone}</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-shade py-0.5 pl-2.5 pr-0.5 text-sm font-medium">
      {label}
      <button onClick={onRemove} className="flex h-8 w-8 items-center justify-center rounded hover:bg-line" aria-label={`Remove filter ${label}`}>
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </span>
  );
}

function SidebarContent({ priceFilters, togglePrice, bulkOnly, setBulkOnly }) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-1 text-sm font-semibold">Price Range</legend>
        {PRICE_RANGES.map((r) => (
          <label key={r.id} className="flex min-h-[40px] cursor-pointer items-center gap-3 text-[0.9375rem] text-ink-2 hover:text-ink">
            <input
              type="checkbox"
              className="h-5 w-5 flex-shrink-0 cursor-pointer accent-[#1A2332]"
              checked={priceFilters.includes(r.id)}
              onChange={() => togglePrice(r.id)}
            />
            <span className="vd-price">{r.label}</span>
          </label>
        ))}
      </fieldset>

      <div>
        <p className="mb-1 text-sm font-semibold" id="order-type">Order Type</p>
        <button
          type="button"
          role="switch"
          aria-checked={bulkOnly}
          aria-labelledby="order-type bulk-label"
          onClick={() => setBulkOnly(!bulkOnly)}
          className="flex min-h-[40px] w-full items-center gap-3 text-left text-[0.9375rem] text-ink-2 hover:text-ink"
        >
          <span className={`relative h-6 w-10 flex-shrink-0 rounded-full transition-colors ${bulkOnly ? "bg-night" : "bg-line-strong"}`}>
            <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${bulkOnly ? "translate-x-4" : ""}`} />
          </span>
          <span id="bulk-label">Bulk Orders Only</span>
        </button>
      </div>

      <dl className="space-y-3 border-t border-line pt-5 text-sm">
        <div>
          <dt className="font-semibold">GST Invoice</dt>
          <dd className="mt-0.5 leading-snug text-ink-2">All orders include a valid GST invoice · {BUSINESS.gstin}</dd>
        </div>
        <div>
          <dt className="font-semibold">Fast Turnaround</dt>
          <dd className="mt-0.5 leading-snug text-ink-2">Most orders ready within 24–48 hours</dd>
        </div>
      </dl>
    </div>
  );
}
