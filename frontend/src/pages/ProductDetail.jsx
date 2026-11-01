import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { getReviews, getReviewSummary, getMyReview, postReview, uploadReviewMedia } from "../api/reviews";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/product/ProductCard";
import Breadcrumbs from "../components/store/Breadcrumbs";
import StickyBar from "../components/store/StickyBar";
import usePageTitle from "../hooks/usePageTitle";
import { BUSINESS, CATEGORY_ICON, CATEGORY_LINK, isTallCategory, rupees, whatsappUrl } from "../config/business";

/* ── Finish options by category ─────────────────────────────────────── */
const FINISH_OPTIONS = {
  "Sign Boards": [
    { label: "Vinyl",   sub: "Standard Flex"   },
    { label: "ACP",     sub: "Aluminium Panel"  },
    { label: "Acrylic", sub: "+\u20b9200"       },
    { label: "LED",     sub: "Illuminated"      },
  ],
  "Printing Services": [
    { label: "Matte",   sub: "Smooth & Elegant" },
    { label: "Glossy",  sub: "Shiny & Vibrant"  },
    { label: "Spot UV", sub: "+\u20b9100"        },
  ],
  "Banner Stands": [
    { label: "Single",  sub: "One Sided"        },
    { label: "Double",  sub: "Both Sides"       },
  ],
  "Demo Tents": [
    { label: "Plain",   sub: "No Print"         },
    { label: "Branded", sub: "Full Custom Print"},
  ],
};
const DEFAULT_FINISH = [
  { label: "Standard", sub: "Base Option" },
  { label: "Premium",  sub: "+\u20b9200"  },
];

/* ── Size options per category ──────────────────────────────────────── */
const PAPER_SIZES = [
  { label: "A4",     sub: "21×29.7 cm"  },
  { label: "A5",     sub: "14.8×21 cm"  },
  { label: "A3",     sub: "29.7×42 cm"  },
  { label: "DL",     sub: "9.9×21 cm"   },
  { label: "Custom", sub: "Ask us"      },
];

const BANNER_SIZES = [
  { label: "2×6 ft", sub: "Standard"  },
  { label: "2×7 ft", sub: "Popular"   },
  { label: "3×6 ft", sub: "Wide"      },
  { label: "3×7 ft", sub: "Large"     },
  { label: "Custom", sub: "Ask us"    },
];

const TENT_SIZES = [
  { label: "4×4×7 ft",   sub: "Standard" },
  { label: "6×6×7 ft",   sub: "Popular"  },
  { label: "10×10×7 ft", sub: "Large"    },
  { label: "Custom",     sub: "Ask us"   },
];

/* ── Category-based helpers ─────────────────────────────────────────── */
const usesDimensions = (p) => {
  if (!p) return false;
  if (p.category === "Sign Boards") return true;
  const n = p.name || "";
  return n === "Flex Printing" || n === "Canvas Printing";
};
const usesPaperSize  = (p) => p?.category === "Printing Services" && !usesDimensions(p);
const usesBannerSize = (p) => p?.category === "Banner Stands";
const usesTentSize   = (p) => p?.category === "Demo Tents";

/* ── Qty options by category ────────────────────────────────────────── */
function getQtyOptions(p) {
  if (!p) return [1];
  if (usesDimensions(p))  return null;           // uses width×height
  if (usesPaperSize(p))   return [100, 250, 500, 1000]; // pieces
  if (usesBannerSize(p))  return [1, 2, 5, 10];
  if (usesTentSize(p))    return [1, 2, 3, 5];
  // fallback (per piece products)
  const u = (p.unit || "").toLowerCase();
  if (u.includes("1000")) return [100, 250, 500, 1000];
  return [1, 5, 10, 25, 50, 100];
}

/* ── Unit label ─────────────────────────────────────────────────────── */
function getUnitLabel(p) {
  if (!p) return "unit";
  if (usesDimensions(p)) return "per sq ft";
  return p.unit || "per piece";
}

/* ── Component ─────────────────────────────────────────────────────── */
const GST_RATE = 0.18;

/* Common board sizes, so most customers never have to type */
const SIZE_PRESETS = [
  { w: 3, h: 2 },
  { w: 4, h: 3 },
  { w: 6, h: 3 },
  { w: 8, h: 4 },
];

const SERVICE_TABS = [["description", "Description"], ["specifications", "Specifications"], ["shipping", "Shipping Info"], ["faq", "FAQ"]];

/* A labelled group of option tiles. Native radios keep keyboard use working. */
function OptionGroup({ step, title, name, options, selected, onSelect, columns }) {
  return (
    <fieldset>
      <legend className="mb-2.5 flex items-baseline gap-2 text-[0.9375rem] font-semibold">
        <span className="vd-price text-ink-3">{step}</span>{title}
      </legend>
      <div className={`grid gap-2 ${columns}`}>
        {options.map((opt, i) => (
          <label key={opt.label} className="relative block cursor-pointer">
            <input type="radio" name={name} className="peer sr-only" checked={selected === i} onChange={() => onSelect(i)} />
            <span className="vd-option">
              <span className="material-symbols-outlined vd-option-tick text-base" aria-hidden="true">check_circle</span>
              <span className="block pr-4 text-sm font-semibold leading-tight">{opt.label}</span>
              {opt.sub && <span className="vd-price mt-0.5 block text-[0.75rem] leading-tight text-ink-2">{opt.sub}</span>}
            </span>
            {opt.badge && (
              <span className="vd-chip absolute -right-1 -top-2 !bg-accent !text-white">{opt.badge}</span>
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function ProductDetail() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const { user }      = useAuth();

  const [allProducts, setAllProducts] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [finish,      setFinish]      = useState(0);
  const [sizeIdx,     setSizeIdx]     = useState(0);
  const [width,       setWidth]       = useState("");
  const [height,      setHeight]      = useState("");
  const [qty,         setQty]         = useState(null);
  const [activeTab,   setActiveTab]   = useState("description");
  const [designFile,  setDesignFile]  = useState(null);
  const [sizeError,   setSizeError]   = useState("");
  const [justAdded,   setJustAdded]   = useState(false);
  const [dragOver,    setDragOver]    = useState(false);
  const fileInputRef = useRef(null);
  const widthInputRef = useRef(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getProducts().then(setAllProducts).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const product = useMemo(() => allProducts.find(p => String(p.id) === String(id)) || null, [allProducts, id]);
  usePageTitle(product?.name);

  // Reset config when product changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFinish(0);
    setSizeIdx(0);
    setWidth("");
    setHeight("");
    setActiveTab("description");
    setDesignFile(null);
    setSizeError("");
    setJustAdded(false);
    if (product) {
      const opts = getQtyOptions(product);
      setQty(opts ? opts[0] : 1);
    }
  }, [id, product]);

  const related = useMemo(() => {
    if (!product) return [];
    return allProducts.filter(p => p.category === product.category && String(p.id) !== String(id)).slice(0, 4);
  }, [allProducts, product, id]);

  const finishOptions = product ? (FINISH_OPTIONS[product.category] || DEFAULT_FINISH) : DEFAULT_FINISH;
  const qtyOptions    = product ? getQtyOptions(product) : [1];
  const pcsUnitProduct = product ? (product.unit || "").toLowerCase().includes("1000") : false;
  const sizeOptions   = product
    ? (usesPaperSize(product)  ? PAPER_SIZES
     : usesBannerSize(product) ? BANNER_SIZES
     : usesTentSize(product)   ? TENT_SIZES
     : null)
    : null;

  /* ── Price calculation ────────────────────────────────────────────── */
  const { totalPrice, displayUnit } = useMemo(() => {
    if (!product) return { totalPrice: 0, displayUnit: "" };
    const base = Number(product.base_price);

    if (usesDimensions(product)) {
      const area = (Number(width) || 0) * (Number(height) || 0);
      return {
        totalPrice: base * area,
        displayUnit: area > 0 ? `${area.toFixed(1)} sq ft` : "",
      };
    }

    // Paper size products priced per piece or per 1000 pcs
    if (usesPaperSize(product)) {
      const pcs = qty || 100;
      const u   = (product.unit || "").toLowerCase();
      if (u.includes("1000")) {
        return { totalPrice: base * (pcs / 1000), displayUnit: `${pcs.toLocaleString("en-IN")} pcs` };
      }
      return { totalPrice: base * pcs, displayUnit: `${pcs.toLocaleString("en-IN")} pcs` };
    }

    const q = qty || 1;
    return { totalPrice: base * q, displayUnit: `${q} piece${q !== 1 ? "s" : ""}` };
  }, [product, width, height, qty]);

  /* ── Add to cart ──────────────────────────────────────────────────── */
  const addConfiguredItem = () => {
    if (!product) return false;

    const finish_label = finishOptions[finish]?.label;
    const size_label   = sizeOptions ? sizeOptions[sizeIdx]?.label : null;

    // For "1000 pcs" products, store price per piece so cart maths is correct
    const pcsUnit      = (product.unit || "").toLowerCase().includes("1000");
    const cartUnitPrice = (usesPaperSize(product) && pcsUnit)
      ? Number(product.base_price) / 1000   // e.g. ₹1,200 / 1000 → ₹1.20 / pc
      : Number(product.base_price);

    // Batch pricing metadata so Cart can display the original price correctly
    const batchMeta = (usesPaperSize(product) && pcsUnit)
      ? { batch_price: Number(product.base_price), batch_size: 1000 }
      : {};

    if (usesDimensions(product)) {
      const w = Number(width), h = Number(height);
      if (!w || !h || w <= 0 || h <= 0) {
        setSizeError("Enter a width and height, or pick a common size.");
        widthInputRef.current?.focus();
        widthInputRef.current?.scrollIntoView({ block: "center" });
        return false;
      }
      addToCart({
        product_id: product.id, name: product.name, category: product.category,
        image_url: product.image_url || null,
        unit_price: cartUnitPrice, quantity: w * h,
        config: { finish: finish_label, width: w, height: h, design_file: designFile?.name || null },
      });
    } else {
      addToCart({
        product_id: product.id, name: product.name, category: product.category,
        image_url: product.image_url || null,
        unit_price: cartUnitPrice, quantity: qty || 1,
        config: {
          finish: finish_label,
          ...(size_label ? { size: size_label } : {}),
          qty: displayUnit,
          design_file: designFile?.name || null,
          ...batchMeta,
        },
      });
    }
    return true;
  };

  const handleAddToCart = () => {
    if (addConfiguredItem()) setJustAdded(true);
  };

  const handleOrderNow = () => {
    if (addConfiguredItem()) navigate("/checkout");
  };

  /* ── Loading / not found ──────────────────────────────────────────── */
  if (loading) return (
    <main id="main" className="vd-wrap py-10 font-display" aria-busy="true">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="aspect-[4/3] vd-skeleton lg:col-span-7" />
        <div className="space-y-4 lg:col-span-5">
          <div className="h-10 w-3/4 vd-skeleton" />
          <div className="h-5 w-1/2 vd-skeleton" />
          <div className="h-24 vd-skeleton" />
          <div className="h-24 vd-skeleton" />
        </div>
      </div>
    </main>
  );

  if (!product) return (
    <main id="main" className="vd-wrap py-24 font-display">
      <h1 className="vd-h2">Product not found</h1>
      <p className="mt-2 text-ink-2">This product may have moved or is no longer available.</p>
      <Link to="/products" className="vd-btn vd-btn-ink mt-6">Browse all products</Link>
    </main>
  );

  const unitText = getUnitLabel(product);
  const dimensional = usesDimensions(product);
  const area = (Number(width) || 0) * (Number(height) || 0);
  const gstAmount = totalPrice * GST_RATE;
  const customSizeSelected = sizeOptions?.[sizeIdx]?.label === "Custom";

  // Step numbers follow what this product actually asks for
  const sizeStep = 2;
  const quantityStep = dimensional || sizeOptions ? 3 : 2;
  const artworkStep = qtyOptions ? quantityStep + 1 : quantityStep;

  const priceLabel = totalPrice > 0 ? rupees(totalPrice) : dimensional ? "Enter size" : rupees(product.base_price);

  return (
    <main id="main" className="font-display pb-[var(--sticky-bar,0px)]">
      <div className="vd-wrap pt-5">
        <Breadcrumbs items={[
          { label: "Home", to: "/" },
          { label: "Products", to: "/products" },
          { label: product.category, to: CATEGORY_LINK(product.category) },
          { label: product.name },
        ]} />
      </div>

      <div className="vd-wrap pb-12 pt-5 lg:pb-16">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">

          {/* Left: image, then product information */}
          <div className="min-w-0 lg:col-span-7">
            <div className={`vd-frame aspect-[4/3] ${isTallCategory(product.category) ? "vd-frame-contain" : ""}`}>
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} width="800" height="600" fetchPriority="high" />
              ) : (
                <div className="flex h-full items-center justify-center text-ink-3">
                  <span className="material-symbols-outlined text-5xl">{CATEGORY_ICON[product.category] || "image"}</span>
                </div>
              )}
              <span className="vd-chip absolute left-3 top-3 !bg-surface">
                <span className="material-symbols-outlined text-sm text-ok">check_circle</span> In Stock
              </span>
            </div>

            {/* Info tabs (desktop position; repeats below the panel order on mobile) */}
            <section className="mt-10 hidden lg:block" aria-label="Product information">
              <ProductTabs product={product} activeTab={activeTab} setActiveTab={setActiveTab} finishOptions={finishOptions} unitText={unitText} />
            </section>
          </div>

          {/* Right: order panel */}
          <div className="min-w-0 lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
              <h1 className="vd-h1 !text-[1.75rem] lg:!text-[2.125rem]">{product.name}</h1>
              <p className="mt-2 text-[0.9375rem] leading-snug text-ink-2">{product.description || product.category}</p>
              <p className="vd-price mt-3 text-sm text-ink-2">
                <span className="text-2xl font-bold text-ink">{rupees(product.base_price)}</span> / {unitText} <span className="whitespace-nowrap">(Excl. GST)</span>
              </p>

              <form className="mt-6 space-y-6 border-t border-line pt-6" onSubmit={(e) => e.preventDefault()}>
                <OptionGroup
                  step={1}
                  title={product.category === "Printing Services" ? "Paper Finish" : "Material / Type"}
                  name="finish"
                  options={finishOptions}
                  selected={finish}
                  onSelect={setFinish}
                  columns={finishOptions.length === 3 ? "grid-cols-3" : finishOptions.length <= 2 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}
                />

                {dimensional && (
                  <fieldset>
                    <legend className="mb-2.5 flex items-baseline gap-2 text-[0.9375rem] font-semibold">
                      <span className="vd-price text-ink-3">{sizeStep}</span>Size in feet
                    </legend>
                    <div className="mb-3 grid grid-cols-4 gap-2">
                      {SIZE_PRESETS.map((preset) => {
                        const active = Number(width) === preset.w && Number(height) === preset.h;
                        return (
                          <button
                            key={`${preset.w}x${preset.h}`}
                            type="button"
                            aria-pressed={active}
                            onClick={() => { setWidth(String(preset.w)); setHeight(String(preset.h)); setSizeError(""); }}
                            className={`vd-price min-h-[44px] rounded-lg text-sm font-semibold transition-shadow ${active ? "shadow-[inset_0_0_0_2px_#14181F]" : "bg-surface shadow-[inset_0_0_0_1px_#DEDAD0] hover:shadow-[inset_0_0_0_1px_#14181F]"}`}
                          >
                            {preset.w}×{preset.h}
                          </button>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="size-width" className="vd-label">Width (ft)</label>
                        <input
                          ref={widthInputRef} id="size-width" name="width" type="number" inputMode="decimal"
                          min="0.5" step="0.5" value={width} placeholder="e.g. 4"
                          aria-invalid={!!sizeError && !(Number(width) > 0)}
                          onChange={(e) => { setWidth(e.target.value); setSizeError(""); }}
                          className="vd-input vd-price"
                        />
                      </div>
                      <div>
                        <label htmlFor="size-height" className="vd-label">Height (ft)</label>
                        <input
                          id="size-height" name="height" type="number" inputMode="decimal"
                          min="0.5" step="0.5" value={height} placeholder="e.g. 3"
                          aria-invalid={!!sizeError && !(Number(height) > 0)}
                          onChange={(e) => { setHeight(e.target.value); setSizeError(""); }}
                          className="vd-input vd-price"
                        />
                      </div>
                    </div>
                    {sizeError && <p className="vd-error" role="alert">{sizeError}</p>}
                    {area > 0 && (
                      <p className="vd-hint vd-price">Area: <strong className="font-semibold text-ink">{area.toFixed(1)} sq ft</strong> · {Number(width)} × {Number(height)} ft</p>
                    )}
                  </fieldset>
                )}

                {sizeOptions && (
                  <div>
                    <OptionGroup
                      step={sizeStep}
                      title={usesPaperSize(product) ? "Paper Size" : usesBannerSize(product) ? "Banner Size" : "Tent Size"}
                      name="size"
                      options={sizeOptions}
                      selected={sizeIdx}
                      onSelect={setSizeIdx}
                      columns={sizeOptions.length === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3 sm:grid-cols-5"}
                    />
                    {customSizeSelected && (
                      <p className="vd-hint">
                        Tell us the size on <a className="vd-link" href={whatsappUrl(`Hello Vijetha Digital, I need a custom size for ${product.name}.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a> or call <a className="vd-link vd-price" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> for an exact price.
                      </p>
                    )}
                  </div>
                )}

                {qtyOptions && qty !== null && (
                  <OptionGroup
                    step={quantityStep}
                    title={usesPaperSize(product) ? "Quantity (pieces)" : "Quantity"}
                    name="quantity"
                    options={qtyOptions.map((q, i) => ({
                      label: usesPaperSize(product) ? q.toLocaleString("en-IN") : String(q),
                      badge: i === qtyOptions.length - 1 ? "-20%" : null,
                    }))}
                    selected={qtyOptions.indexOf(qty)}
                    onSelect={(i) => setQty(qtyOptions[i])}
                    columns={qtyOptions.length <= 4 ? "grid-cols-4" : "grid-cols-3 sm:grid-cols-6"}
                  />
                )}

                {/* Artwork */}
                <div>
                  <p className="mb-2.5 flex items-baseline gap-2 text-[0.9375rem] font-semibold">
                    <span className="vd-price text-ink-3">{artworkStep}</span>Upload Your Design <span className="font-normal text-ink-2">(optional)</span>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    aria-label="Upload your design"
                    accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.eps,.tiff,.svg"
                    className="sr-only"
                    tabIndex={-1}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) setDesignFile(f);
                      e.target.value = "";
                    }}
                  />
                  {designFile ? (
                    <div className="flex items-center gap-3 rounded-lg bg-surface p-3 shadow-[inset_0_0_0_1px_#DEDAD0]">
                      <span className="material-symbols-outlined text-2xl text-ink-2">description</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{designFile.name}</p>
                        <p className="vd-price text-[0.8125rem] text-ink-2">{(designFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="vd-link min-h-[44px] px-1 text-sm">Change</button>
                      <button type="button" onClick={() => setDesignFile(null)} className="vd-icon-btn" aria-label="Remove file">
                        <span className="material-symbols-outlined text-xl">close</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragOver(false);
                        const f = e.dataTransfer.files?.[0];
                        if (f) setDesignFile(f);
                      }}
                      className={`flex w-full items-center gap-3 rounded-lg border border-dashed p-3 text-left transition-colors hover:border-ink ${dragOver ? "border-ink bg-shade" : "border-line-strong bg-surface"}`}
                    >
                      <span className="material-symbols-outlined text-2xl text-ink-2">cloud_upload</span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">Drag &amp; drop or click to browse</span>
                        <span className="block text-[0.8125rem] text-ink-2">PDF, AI, PSD, PNG · Min 150 DPI</span>
                      </span>
                    </button>
                  )}
                  <p className="vd-hint">No design yet? Order now and share it after. Our team will follow up by phone or WhatsApp.</p>
                </div>

                {/* Live price */}
                <div className="rounded-lg bg-shade p-4" aria-live="polite">
                  {totalPrice > 0 ? (
                    <dl className="vd-price text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-ink-2">
                          {pcsUnitProduct && usesPaperSize(product)
                            ? `${rupees(product.base_price)} / 1,000 pcs × ${displayUnit}`
                            : `${rupees(product.base_price)} × ${displayUnit}`}
                        </dt>
                        <dd className="font-medium">{rupees(totalPrice, 2)}</dd>
                      </div>
                      <div className="mt-1 flex justify-between gap-4">
                        <dt className="text-ink-2">GST (18%)</dt>
                        <dd className="font-medium">{rupees(gstAmount, 2)}</dd>
                      </div>
                      <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-line-strong/60 pt-3">
                        <dt className="font-semibold">Estimated Total</dt>
                        <dd className="text-2xl font-bold tracking-tight">{rupees(totalPrice + gstAmount, 2)}</dd>
                      </div>
                    </dl>
                  ) : (
                    <p className="text-sm text-ink-2">Enter a size to see your exact price, including GST.</p>
                  )}
                </div>

                {/* CTAs */}
                <div>
                  <div className="hidden gap-3 lg:flex">
                    <button type="button" onClick={handleAddToCart} className="vd-btn vd-btn-lg vd-btn-outline flex-1">
                      <span className="material-symbols-outlined text-xl">shopping_cart</span> Add to Cart
                    </button>
                    <button type="button" onClick={handleOrderNow} className="vd-btn vd-btn-lg vd-btn-accent flex-[1.3]">
                      Order Now <span className="material-symbols-outlined text-xl">arrow_forward</span>
                    </button>
                  </div>
                  {/* Mobile keeps Add to Cart inline; Order Now lives in the sticky bar */}
                  <button type="button" onClick={handleAddToCart} className="vd-btn vd-btn-lg vd-btn-outline w-full lg:hidden">
                    <span className="material-symbols-outlined text-xl">shopping_cart</span> Add to Cart
                  </button>

                  {justAdded && (
                    <div className="vd-alert vd-alert-ok mt-3 items-center justify-between" role="status">
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">check_circle</span>Added to your cart
                      </span>
                      <Link to="/cart" className="vd-link whitespace-nowrap">View cart</Link>
                    </div>
                  )}
                </div>

                <ul className="space-y-1.5 text-[0.8125rem] text-ink-2">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    <span>Ready in <strong className="font-semibold text-ink">24–48 hours</strong> · Hyderabad delivery</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    GST Invoice · Secure Pay · Quality Check
                  </li>
                </ul>
              </form>
            </div>
          </div>
        </div>

        {/* Mobile position for product information */}
        <section className="mt-10 lg:hidden" aria-label="Product information">
          <ProductTabs product={product} activeTab={activeTab} setActiveTab={setActiveTab} finishOptions={finishOptions} unitText={unitText} />
        </section>

        <ReviewSection productId={product.id} user={user} />

        {related.length > 0 && (
          <section className="mt-16 border-t border-line pt-10 lg:mt-20 lg:pt-14">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <h2 className="vd-h2">Related Products</h2>
              <Link to={CATEGORY_LINK(product.category)} className="vd-link hidden text-[0.9375rem] sm:inline-block">View All {product.category}</Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
              {related.map((rp) => <ProductCard key={rp.id} product={rp} />)}
            </div>
          </section>
        )}
      </div>

      {/* B2B CTA */}
      <section className="bg-shade">
        <div className="vd-wrap flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between lg:py-14">
          <div className="max-w-2xl">
            <p className="vd-kicker mb-2">B2B Solutions</p>
            <h2 className="vd-h2">Bulk Orders &amp; Corporate Accounts</h2>
            <p className="mt-2 text-ink-2">Exclusive pricing tiers, dedicated account support &amp; simplified monthly invoicing for high-volume business needs.</p>
          </div>
          <Link to="/register" className="vd-btn vd-btn-lg vd-btn-ink">Open Corporate Account</Link>
        </div>
      </section>

      {/* Mobile purchase bar */}
      <StickyBar>
        <div className="min-w-0">
          <p className="text-[0.75rem] leading-tight text-ink-2">{totalPrice > 0 ? "Before GST" : `${rupees(product.base_price)} / ${unitText}`}</p>
          <p className="vd-price truncate text-lg font-bold leading-tight">{priceLabel}</p>
        </div>
        <button type="button" onClick={handleOrderNow} className="vd-btn vd-btn-accent flex-shrink-0 !min-h-[48px] px-6">
          Order Now <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </StickyBar>
    </main>
  );
}

/* ── Product information tabs ───────────────────────────────────────── */
function ProductTabs({ product, activeTab, setActiveTab, finishOptions, unitText }) {
  return (
    <>
      <div className="flex gap-6 overflow-x-auto border-b border-line no-scrollbar" role="tablist" aria-label="Product information">
        {SERVICE_TABS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={`-mb-px min-h-[44px] whitespace-nowrap border-b-2 text-[0.9375rem] transition-colors ${activeTab === key ? "border-accent font-semibold text-ink" : "border-transparent text-ink-2 hover:text-ink"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="pt-6" role="tabpanel">
        {activeTab === "description" && (
          <div>
            <h3 className="vd-h3 mb-2">About This Product</h3>
            <p className="max-w-2xl text-ink-2">{product.description || `${product.name} from Vijetha Digital, Hyderabad. Est. 2002, serving 500+ businesses across Telangana.`}</p>
            <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {[
                "High-resolution printing with sharp text and vibrant colors",
                "Premium materials sourced from trusted suppliers",
                "Quality checked before dispatch, zero compromise",
                `GST invoice with every order (${BUSINESS.gstin})`,
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-[0.9375rem] leading-snug">
                  <span className="material-symbols-outlined mt-0.5 text-lg text-ok">check</span>
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <dl className="vd-rows max-w-2xl text-[0.9375rem]">
            {[
              ["Category", product.category],
              ["Unit", unitText],
              ["Base Price", `${rupees(product.base_price)} / ${unitText}`],
              ["Finish", finishOptions.map((f) => f.label).join(", ")],
              ...(usesPaperSize(product) ? [["Paper Sizes", PAPER_SIZES.map((s) => s.label).join(", ")]] : []),
              ...(usesBannerSize(product) ? [["Banner Sizes", BANNER_SIZES.map((s) => s.label).join(", ")]] : []),
              ...(usesTentSize(product) ? [["Tent Sizes", TENT_SIZES.map((s) => s.label).join(", ")]] : []),
              ["GST", "Applicable per government norms"],
              ["Turnaround", "24–48 business hours"],
              ["Delivery", "Hyderabad & surrounding areas"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-semibold">{k}</dt>
                <dd className="vd-price text-right text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {activeTab === "shipping" && (
          <ul className="grid max-w-2xl gap-5 sm:grid-cols-2">
            {[
              { icon: "local_shipping", title: "Hyderabad Delivery", desc: "Free delivery within city limits for orders above ₹2,000. Delivered within 2–3 business days." },
              { icon: "bolt", title: "Express Turnaround", desc: "Most orders processed and ready within 24–48 hours. Contact us for same-day emergency orders." },
              { icon: "storefront", title: "Shop Pickup", desc: `Pick up from our Lakdikapool or Indira Park showrooms. Call ${BUSINESS.phone} to schedule.` },
              { icon: "receipt_long", title: "GST Invoice", desc: `All orders include a valid GST invoice (GSTIN: ${BUSINESS.gstin}).` },
            ].map((item) => (
              <li key={item.title} className="flex items-start gap-3">
                <span className="material-symbols-outlined text-2xl text-ink-2">{item.icon}</span>
                <div>
                  <h3 className="text-[0.9375rem] font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm leading-snug text-ink-2">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        {activeTab === "faq" && (
          <div className="max-w-2xl divide-y divide-line border-y border-line">
            {[
              { q: "Do you provide design services?", a: "Yes! We offer in-house design support. Share your brand guidelines and we'll create a print-ready file at no extra charge for orders above ₹2,000." },
              { q: "What file formats do you accept?", a: "We accept PDF, AI, PSD, EPS, TIFF, and high-resolution PNG. Files should be at minimum 150 DPI (300 DPI preferred for print)." },
              { q: "Can I get bulk/corporate pricing?", a: `Absolutely. Corporate and bulk orders get special pricing tiers. Call us at ${BUSINESS.phone} or register a business account.` },
              { q: "Do you deliver outside Hyderabad?", a: "We primarily serve Hyderabad and Telangana. For outstation orders, courier is available at actuals. Contact us for a quote." },
            ].map((item, i) => (
              <details key={item.q} className="group/faq py-1" open={i === 0}>
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 text-[0.9375rem] font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span className="material-symbols-outlined text-xl text-ink-3 transition-transform group-open/faq:rotate-180">expand_more</span>
                </summary>
                <p className="pb-3 text-[0.9375rem] leading-snug text-ink-2">{item.a}</p>
              </details>
            ))}
          </div>
        )}
      </div>
    </>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   ReviewSection — full production review UI
   ════════════════════════════════════════════════════════════════════════ */

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function StarRating({ value, max = 5, size = 20, interactive, onChange }) {
  const [hover, setHover] = useState(0);
  const stars = Array.from({ length: max }, (_, i) => {
    const star = i + 1;
    const filled = star <= (interactive ? (hover || value) : value);
    const icon = (
      <span
        className={`material-symbols-outlined ${filled ? "text-[#B7791F]" : "text-line-strong"}`}
        style={{ fontSize: size, fontVariationSettings: filled ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400" }}
        aria-hidden="true"
      >
        star
      </span>
    );
    if (!interactive) return <span key={star}>{icon}</span>;
    return (
      <button
        key={star}
        type="button"
        aria-label={`${star} ${star === 1 ? "star" : "stars"}, ${STAR_LABELS[star]}`}
        aria-pressed={value === star}
        onClick={() => onChange?.(star)}
        onMouseEnter={() => setHover(star)}
        onMouseLeave={() => setHover(0)}
        className="flex h-11 w-11 items-center justify-center"
      >
        {icon}
      </button>
    );
  });
  return (
    <div className="inline-flex items-center" {...(interactive ? {} : { role: "img", "aria-label": `${value} out of ${max} stars` })}>
      {stars}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="vd-price flex items-center gap-2 text-sm">
      <span className="w-3 text-right font-medium">{stars}</span>
      <span className="material-symbols-outlined text-sm text-[#B7791F]" style={{ fontVariationSettings: "'FILL' 1" }} aria-hidden="true">star</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-sm bg-shade">
        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-6 text-right text-[0.8125rem] text-ink-2">{count}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const longBody = review.body && review.body.length > 200;

  return (
    <article className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <StarRating value={review.rating} size={16} />
        <span className="text-[0.9375rem] font-semibold">{review.user_name}</span>
        {review.is_verified_purchase && (
          <span className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-ok">
            <span className="material-symbols-outlined text-sm">verified</span> Verified Purchase
          </span>
        )}
        <span className="text-[0.8125rem] text-ink-2">
          {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>

      {review.title && <h3 className="mt-2 text-[0.9375rem] font-semibold">{review.title}</h3>}

      {review.body && (
        <p className="mt-1 text-[0.9375rem] leading-relaxed text-ink-2">
          {longBody && !expanded ? review.body.slice(0, 200) + "…" : review.body}
          {longBody && (
            <button onClick={() => setExpanded(!expanded)} className="vd-link ml-1 text-sm text-ink">
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      )}

      {review.image_urls?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {review.image_urls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="vd-frame block h-20 w-20">
              <img src={url} alt={`Review image ${i + 1}`} width="80" height="80" loading="lazy" />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function ReviewSection({ productId, user }) {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [myReview, setMyReview] = useState(undefined); // undefined = not loaded
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formTitle, setFormTitle] = useState("");
  const [formBody, setFormBody] = useState("");
  const [formFiles, setFormFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const loadSummary = useCallback(() => {
    getReviewSummary(productId).then(setSummary).catch(() => {});
  }, [productId]);

  const loadReviews = useCallback((p = 1) => {
    setLoadingMore(true);
    getReviews(productId, p)
      .then((data) => {
        if (p === 1) setReviews(data);
        else setReviews((prev) => [...prev, ...data]);
        setHasMore(data.length >= 10);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [productId]);

  useEffect(() => {
    loadSummary();
    loadReviews(1);
    setPage(1);
    setShowForm(false);
    setMyReview(undefined);
  }, [productId, loadSummary, loadReviews]);

  useEffect(() => {
    if (user) {
      getMyReview(productId).then(setMyReview).catch(() => setMyReview(null));
    } else {
      setMyReview(null);
    }
  }, [productId, user]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadReviews(next);
  };

  const handleFilePick = (e) => {
    const picked = Array.from(e.target.files || []);
    const total = formFiles.length + picked.length;
    if (total > 5) { setSubmitError("Maximum 5 files allowed"); return; }
    setSubmitError("");
    const newFiles = [...formFiles, ...picked];
    setFormFiles(newFiles);
    setPreviewUrls(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const removeFile = (idx) => {
    URL.revokeObjectURL(previewUrls[idx]);
    const newFiles = formFiles.filter((_, i) => i !== idx);
    setFormFiles(newFiles);
    setPreviewUrls(newFiles.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formRating) { setSubmitError("Please select a star rating"); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      let uploadedUrls = null;
      if (formFiles.length > 0) {
        setUploading(true);
        uploadedUrls = await uploadReviewMedia(productId, formFiles);
        setUploading(false);
      }
      await postReview(productId, {
        rating: formRating,
        title: formTitle || null,
        body: formBody || null,
        image_urls: uploadedUrls,
      });
      // Refresh everything
      setShowForm(false);
      setFormRating(0);
      setFormTitle("");
      setFormBody("");
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
      setFormFiles([]);
      setPreviewUrls([]);
      loadSummary();
      loadReviews(1);
      setPage(1);
      getMyReview(productId).then(setMyReview).catch(() => {});
    } catch (err) {
      setUploading(false);
      setSubmitError(err.response?.data?.detail || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avg = summary?.average_rating || 0;
  const total = summary?.total_reviews || 0;

  return (
    <section className="mt-14 border-t border-line pt-10 lg:mt-16 lg:pt-14" id="reviews">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="vd-h2">Customer Reviews</h2>
        {user && !myReview && !showForm && (
          <button onClick={() => setShowForm(true)} className="vd-btn vd-btn-outline">
            <span className="material-symbols-outlined text-lg">rate_review</span> Write a Review
          </button>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          {total > 0 ? (
            <div className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
              <div className="flex items-center gap-4">
                <span className="vd-price text-5xl font-bold leading-none tracking-tight">{avg}</span>
                <div>
                  <StarRating value={Math.round(avg)} size={20} />
                  <p className="text-sm text-ink-2">Based on {total} review{total !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1.5">
                {[5, 4, 3, 2, 1].map((s) => (
                  <RatingBar key={s} stars={s} count={summary?.distribution?.[s] || 0} total={total} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="font-semibold">No Reviews Yet</p>
              <p className="text-sm text-ink-2">Be the first to review this product!</p>
            </div>
          )}
        </div>

        <div className="min-w-0 lg:col-span-8">
          {showForm && (
            <form onSubmit={handleSubmit} className="mb-8 rounded-lg bg-surface p-5 shadow-[inset_0_0_0_1px_#DEDAD0] sm:p-6">
              <h3 className="vd-h3 mb-4">Write Your Review</h3>

              <div className="mb-4">
                <p className="vd-label">Your Rating *</p>
                <div className="flex items-center gap-2">
                  <div className="-ml-2.5"><StarRating value={formRating} size={28} interactive onChange={setFormRating} /></div>
                  {formRating > 0 && <span className="text-sm font-semibold">{STAR_LABELS[formRating]}</span>}
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="review-title" className="vd-label">Title <span className="font-normal text-ink-2">(optional)</span></label>
                <input id="review-title" name="title" type="text" maxLength={200} value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Summarize your experience" className="vd-input" />
              </div>

              <div className="mb-4">
                <label htmlFor="review-body" className="vd-label">Your Review <span className="font-normal text-ink-2">(optional)</span></label>
                <textarea id="review-body" name="body" rows={4} value={formBody} onChange={(e) => setFormBody(e.target.value)} placeholder="What did you like or dislike? How was the quality?" className="vd-input resize-y" />
              </div>

              <div className="mb-5">
                <p className="vd-label">Photos / Videos <span className="font-normal text-ink-2">(optional, up to 5, max 10 MB each)</span></p>
                {previewUrls.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {previewUrls.map((url, i) => (
                      <div key={url} className="vd-frame relative h-20 w-20">
                        {formFiles[i]?.type?.startsWith("video") ? (
                          <video src={url} className="h-full w-full object-cover" muted />
                        ) : (
                          <img src={url} alt="" />
                        )}
                        <button type="button" onClick={() => removeFile(i)} aria-label="Remove file" className="absolute right-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded bg-ink/80 text-white">
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {formFiles.length < 5 && (
                  <label className="flex min-h-[46px] cursor-pointer items-center gap-3 rounded-lg border border-dashed border-line-strong px-3 py-2 transition-colors hover:border-ink">
                    <span className="material-symbols-outlined text-xl text-ink-2">add_photo_alternate</span>
                    <span className="text-sm text-ink-2">
                      {formFiles.length === 0 ? "Tap to add photos or videos" : `Add more (${formFiles.length}/5)`}
                    </span>
                    <input type="file" multiple accept="image/*,video/mp4,video/webm" onChange={handleFilePick} className="sr-only" />
                  </label>
                )}
              </div>

              {submitError && (
                <div className="vd-alert vd-alert-error mb-4" role="alert">
                  <span className="material-symbols-outlined text-lg">error</span>{submitError}
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="submit" disabled={submitting || uploading} className="vd-btn vd-btn-ink flex-1">
                  {uploading ? "Uploading files…" : submitting ? "Submitting…" : "Submit Review"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setSubmitError(""); }} className="vd-btn vd-btn-quiet">Cancel</button>
              </div>
            </form>
          )}

          {myReview && (
            <div className="mb-6 rounded-lg bg-shade p-4">
              <p className="mb-3 text-sm font-semibold">Your Review</p>
              <ReviewCard review={myReview} />
            </div>
          )}

          {reviews.length > 0 ? (
            <div>
              {reviews.filter((r) => r.id !== myReview?.id).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          ) : (
            !showForm && (
              <p className="text-[0.9375rem] text-ink-2">
                {user ? "Be the first to share your experience!" : "Log in to write a review."}
              </p>
            )
          )}

          {hasMore && reviews.length > 0 && (
            <div className="mt-6">
              <button onClick={handleLoadMore} disabled={loadingMore} className="vd-btn vd-btn-quiet">
                {loadingMore ? "Loading…" : "Load More Reviews"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
