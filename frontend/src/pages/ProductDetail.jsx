import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../api/products";
import { getReviews, getReviewSummary, getMyReview, postReview, uploadReviewMedia } from "../api/reviews";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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

/* ── Format helper ──────────────────────────────────────────────────── */
const fmtPrice = (p) => Number(p).toLocaleString("en-IN");

/* ── Component ─────────────────────────────────────────────────────── */
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
  const [mainThumb,   setMainThumb]   = useState(0);
  const [designFile,  setDesignFile]  = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    getProducts().then(setAllProducts).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const product = useMemo(() => allProducts.find(p => String(p.id) === String(id)) || null, [allProducts, id]);

  // Reset config when product changes
  useEffect(() => {
    setFinish(0);
    setSizeIdx(0);
    setWidth("");
    setHeight("");
    setMainThumb(0);
    setActiveTab("description");
    setDesignFile(null);
    if (product) {
      const opts = getQtyOptions(product);
      setQty(opts ? opts[0] : 1);
    }
  }, [id, product?.id]);

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
  const doAddToCart = () => {
    if (!user) { navigate("/login?redirect=" + encodeURIComponent("/products/" + id)); return; }
    if (!product) return;

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
      if (!w || !h || w <= 0 || h <= 0) { alert("Please enter valid width and height"); return; }
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
    navigate("/cart");
  };

  /* ── Loading / not found ──────────────────────────────────────────── */
  if (loading) return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 font-display animate-pulse">
      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7"><div className="aspect-[4/3] bg-stone-light rounded-[16px]" /></div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-10 bg-stone-light rounded w-3/4" />
          <div className="h-5 bg-stone-light rounded w-1/2" />
          <div className="h-5 bg-stone-light rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-24 text-center font-display">
      <span className="material-symbols-outlined text-5xl text-plum-deep/30 mb-4 block">search_off</span>
      <p className="text-xl font-bold text-plum-deep mb-2">Product not found</p>
      <Link to="/products" className="text-coral-accent font-semibold underline">Browse all products</Link>
    </div>
  );

  const thumbImages = [product.image_url, product.image_url, product.image_url, null];
  const unitLabel   = getUnitLabel(product);

  return (
    <div className="min-h-screen bg-warm-white font-display">

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-6">
        <nav className="flex items-center text-xs text-text-muted overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-plum-deep transition-colors">Home</Link>
          <span className="material-symbols-outlined text-xs mx-1 text-stone-400">chevron_right</span>
          <Link to="/products" className="hover:text-plum-deep transition-colors">Products</Link>
          <span className="material-symbols-outlined text-xs mx-1 text-stone-400">chevron_right</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-plum-deep transition-colors">{product.category}</Link>
          <span className="material-symbols-outlined text-xs mx-1 text-stone-400">chevron_right</span>
          <span className="text-plum-deep font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Main grid */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-16">

          {/* Left: images */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="relative w-full aspect-[4/3] bg-stone-light rounded-[16px] overflow-hidden shadow-architectural border border-stone-border group">
              {product.image_url
                ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-plum-deep/20 text-8xl">image</span></div>}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-plum-deep shadow-sm border border-plum-deep/5 tracking-wide uppercase">In Stock</div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {thumbImages.map((src, i) => (
                <button key={i} onClick={() => src && setMainThumb(i)}
                  className={`aspect-square rounded-[16px] overflow-hidden transition-all shadow-sm hover:shadow-md ${mainThumb === i ? "border-2 border-plum-deep ring-2 ring-plum-deep/10 ring-offset-2" : "border border-stone-border opacity-70 hover:opacity-100"}`}>
                  {src
                    ? <img src={src} alt={`view ${i + 1}`} className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-stone-light flex items-center justify-center"><span className="material-symbols-outlined text-plum-deep text-3xl opacity-40">play_circle</span></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Right: order panel */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-plum-deep tracking-tight mb-3 leading-[1.1]">{product.name}</h1>
              <p className="text-text-muted leading-relaxed mb-6 text-base lg:text-lg">{product.description || product.category}</p>

              {/* Base price */}
              <div className="flex items-center gap-3 mb-8 border-b border-stone-border pb-6">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-plum-deep tracking-tight">&#8377;{fmtPrice(product.base_price)}</span>
                    <span className="text-lg text-text-muted font-medium">/ {unitLabel}</span>
                  </div>
                  <span className="text-xs text-text-muted mt-1 font-medium inline-block">(Excl. GST)</span>
                </div>
                <span className="ml-auto text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 flex items-center gap-1 flex-shrink-0">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> In Stock
                </span>
              </div>

              <form className="space-y-8" onSubmit={e => e.preventDefault()}>

                {/* ── 1. Finish / Material ───────────────────────────── */}
                <div>
                  <label className="block text-sm font-bold text-plum-deep uppercase tracking-wide mb-3">
                    {product.category === "Printing Services" ? "Paper Finish" : "Material / Type"}
                  </label>
                  <div className={`grid gap-3 ${finishOptions.length <= 2 ? "grid-cols-2" : finishOptions.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4"}`}>
                    {finishOptions.map((opt, i) => (
                      <label key={opt.label} className="cursor-pointer relative">
                        <input type="radio" name="finish" className="sr-only" checked={finish === i} onChange={() => setFinish(i)} />
                        <div className={`border rounded-[12px] p-3 text-center transition-all duration-200 h-full flex flex-col justify-center ${finish === i ? "border-plum-deep bg-plum-deep" : "bg-white border-stone-border hover:border-plum-deep/50"}`}>
                          <span className={`block text-sm font-bold ${finish === i ? "text-white" : "text-text-dark"}`}>{opt.label}</span>
                          <span className={`block text-[10px] mt-1 ${finish === i ? "text-white/80" : "text-text-muted"}`}>{opt.sub}</span>
                          {finish === i && <span className="material-symbols-outlined absolute top-2 right-2 text-[14px] text-white">check_circle</span>}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ── 2. Size selection ──────────────────────────────── */}

                {/* A) Custom width × height (Sign Boards, Flex, Canvas) */}
                {usesDimensions(product) && (
                  <div>
                    <label className="block text-sm font-bold text-plum-deep uppercase tracking-wide mb-3">
                      Size — Custom Dimensions (in feet)
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-text-muted font-semibold mb-1.5 block">Width (ft)</label>
                        <input type="number" min="0.5" step="0.5" value={width} onChange={e => setWidth(e.target.value)} placeholder="e.g. 4"
                          className="w-full border border-stone-border rounded-[12px] px-4 py-3 text-sm font-semibold text-plum-deep focus:outline-none focus:ring-2 focus:ring-plum-deep/20 bg-white" />
                      </div>
                      <div>
                        <label className="text-xs text-text-muted font-semibold mb-1.5 block">Height (ft)</label>
                        <input type="number" min="0.5" step="0.5" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 3"
                          className="w-full border border-stone-border rounded-[12px] px-4 py-3 text-sm font-semibold text-plum-deep focus:outline-none focus:ring-2 focus:ring-plum-deep/20 bg-white" />
                      </div>
                    </div>
                    {Number(width) > 0 && Number(height) > 0 && (
                      <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-coral-accent">straighten</span>
                        Area: <strong className="text-plum-deep">{(Number(width) * Number(height)).toFixed(1)} sq ft</strong>
                        <span className="text-plum-deep/40 mx-1">·</span>
                        <strong className="text-plum-deep">{Number(width)} × {Number(height)} ft</strong>
                      </p>
                    )}
                  </div>
                )}

                {/* B) Paper size pills (Printing Services excluding Flex/Canvas) */}
                {usesPaperSize(product) && (
                  <div>
                    <label className="block text-sm font-bold text-plum-deep uppercase tracking-wide mb-3">
                      Paper Size
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {PAPER_SIZES.map((opt, i) => (
                        <label key={opt.label} className="cursor-pointer relative">
                          <input type="radio" name="size" className="sr-only" checked={sizeIdx === i} onChange={() => setSizeIdx(i)} />
                          <div className={`border rounded-[12px] p-3 text-center transition-all duration-200 h-full flex flex-col justify-center ${sizeIdx === i ? "border-coral-accent bg-coral-accent" : "bg-white border-stone-border hover:border-coral-accent/50"}`}>
                            <span className={`block text-sm font-bold ${sizeIdx === i ? "text-white" : "text-text-dark"}`}>{opt.label}</span>
                            <span className={`block text-[9px] mt-0.5 ${sizeIdx === i ? "text-white/80" : "text-text-muted"}`}>{opt.sub}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* C) Banner sizes */}
                {usesBannerSize(product) && (
                  <div>
                    <label className="block text-sm font-bold text-plum-deep uppercase tracking-wide mb-3">
                      Banner Size
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {BANNER_SIZES.map((opt, i) => (
                        <label key={opt.label} className="cursor-pointer relative">
                          <input type="radio" name="size" className="sr-only" checked={sizeIdx === i} onChange={() => setSizeIdx(i)} />
                          <div className={`border rounded-[12px] p-3 text-center transition-all duration-200 h-full flex flex-col justify-center ${sizeIdx === i ? "border-coral-accent bg-coral-accent" : "bg-white border-stone-border hover:border-coral-accent/50"}`}>
                            <span className={`block text-xs font-bold ${sizeIdx === i ? "text-white" : "text-text-dark"}`}>{opt.label}</span>
                            <span className={`block text-[9px] mt-0.5 ${sizeIdx === i ? "text-white/80" : "text-text-muted"}`}>{opt.sub}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* D) Tent sizes */}
                {usesTentSize(product) && (
                  <div>
                    <label className="block text-sm font-bold text-plum-deep uppercase tracking-wide mb-3">
                      Tent Size
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {TENT_SIZES.map((opt, i) => (
                        <label key={opt.label} className="cursor-pointer relative">
                          <input type="radio" name="size" className="sr-only" checked={sizeIdx === i} onChange={() => setSizeIdx(i)} />
                          <div className={`border rounded-[12px] p-3 py-4 text-center transition-all duration-200 h-full flex flex-col justify-center ${sizeIdx === i ? "border-coral-accent bg-coral-accent" : "bg-white border-stone-border hover:border-coral-accent/50"}`}>
                            <span className={`block text-sm font-bold ${sizeIdx === i ? "text-white" : "text-text-dark"}`}>{opt.label}</span>
                            <span className={`block text-[10px] mt-0.5 ${sizeIdx === i ? "text-white/80" : "text-text-muted"}`}>{opt.sub}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 3. Quantity ────────────────────────────────────── */}
                {qtyOptions && qty !== null && (
                  <div>
                    <label className="block text-sm font-bold text-plum-deep uppercase tracking-wide mb-3">
                      {usesPaperSize(product) ? "Quantity (pieces)" : "Quantity"}
                    </label>
                    <div className={`grid gap-3 ${qtyOptions.length <= 4 ? "grid-cols-4" : "grid-cols-5"}`}>
                      {qtyOptions.map((q, i) => (
                        <label key={q} className="cursor-pointer relative">
                          <input type="radio" name="quantity" className="sr-only" checked={qty === q} onChange={() => setQty(q)} />
                          <div className={`border rounded-[12px] p-3 py-4 text-center transition-all relative ${qty === q ? "border-plum-deep bg-plum-deep" : "bg-white border-stone-border hover:border-plum-deep/50"}`}>
                            <span className={`block text-sm font-bold ${qty === q ? "text-white" : "text-text-dark"}`}>
                              {usesPaperSize(product) ? q.toLocaleString("en-IN") : q}
                            </span>
                            {usesPaperSize(product) && (
                              <span className={`block text-[9px] mt-0.5 font-medium ${qty === q ? "text-white/70" : "text-text-muted"}`}>pcs</span>
                            )}
                            {i === qtyOptions.length - 1 && (
                              <div className="absolute -top-2.5 -right-2 bg-coral-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm z-10 border border-white">-20%</div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── 4. Upload design ──────────────────────────────── */}
                <div>
                  <label className="block text-sm font-bold text-plum-deep uppercase tracking-wide mb-3">
                    Upload Your Design <span className="text-text-muted text-xs normal-case font-normal">(optional)</span>
                  </label>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.ai,.psd,.png,.jpg,.jpeg,.eps,.tiff,.svg"
                    className="sr-only"
                    onChange={e => {
                      const f = e.target.files?.[0];
                      if (f) setDesignFile(f);
                      e.target.value = "";
                    }}
                  />

                  {designFile ? (
                    /* File selected state */
                    <div className="border-2 border-plum-deep/40 bg-plum-deep/[0.03] rounded-[16px] p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-plum-deep flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-white text-xl">description</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-plum-deep text-sm truncate">{designFile.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {(designFile.size / 1024).toFixed(0)} KB
                          <span className="mx-1.5 text-stone-300">·</span>
                          <span className="text-green-700 font-semibold">Ready to upload</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs font-bold text-plum-deep hover:text-coral-accent transition-colors underline underline-offset-2"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => setDesignFile(null)}
                          className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-red-50 text-text-muted hover:text-red-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">close</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Drop zone */
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => fileInputRef.current?.click()}
                      onKeyDown={e => e.key === "Enter" && fileInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const f = e.dataTransfer.files?.[0];
                        if (f) setDesignFile(f);
                      }}
                      className="border-2 border-dashed border-plum-deep/30 rounded-[16px] p-6 text-center hover:bg-plum-deep/5 hover:border-plum-deep/60 transition-colors cursor-pointer group bg-white/50 outline-none focus:ring-2 focus:ring-plum-deep/20"
                    >
                      <div className="flex flex-col items-center">
                        <div className="bg-plum-deep/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl text-plum-deep">cloud_upload</span>
                        </div>
                        <h4 className="font-bold text-plum-deep text-sm mb-1">Upload Your Design</h4>
                        <p className="text-xs text-text-muted">Drag &amp; drop or <span className="text-plum-deep font-semibold underline underline-offset-2">click to browse</span></p>
                        <p className="text-[10px] text-text-muted/70 mt-1">PDF, AI, PSD, PNG · Min 150 DPI</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* ── 5. Price summary ──────────────────────────────── */}
                {totalPrice > 0 && (
                  <div className="bg-stone-light/50 border border-stone-border rounded-[12px] px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-muted font-medium">Estimated Total</p>
                      <p className="text-2xl font-extrabold text-plum-deep">&#8377;{fmtPrice(totalPrice)}</p>
                    </div>
                    <div className="text-right text-xs text-text-muted">
                      {pcsUnitProduct && usesPaperSize(product) ? (
                        <p>&#8377;{fmtPrice(product.base_price)} / 1,000 pcs</p>
                      ) : (
                        <p>&#8377;{fmtPrice(product.base_price)} × {displayUnit}</p>
                      )}
                      <p className="text-green-700 font-semibold mt-0.5">Excl. GST</p>
                    </div>
                  </div>
                )}

                {/* ── 6. CTA buttons ────────────────────────────────── */}
                <div className="flex gap-4 flex-col sm:flex-row">
                  <button type="button" onClick={doAddToCart}
                    className="flex-1 border border-plum-deep text-plum-deep font-bold py-4 rounded-[12px] hover:bg-plum-deep/5 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wide">
                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span> Add to Cart
                  </button>
                  <button type="button" onClick={doAddToCart}
                    className="flex-[1.5] bg-plum-deep text-white font-bold py-4 rounded-[12px] hover:bg-plum-hover shadow-soft-plum transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm uppercase tracking-wide">
                    Order Now <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                  </button>
                </div>

                {/* ── 7. Trust badges ───────────────────────────────── */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-text-muted/80 justify-center sm:justify-start">
                    <span className="material-symbols-outlined text-[18px] text-green-600">local_shipping</span>
                    <span>Ready in <strong className="text-text-dark">24–48 hours</strong> · Hyderabad delivery</span>
                  </div>
                  <div className="flex items-center flex-wrap gap-3 justify-center sm:justify-start">
                    {[["verified_user","GST Invoice"],["security","Secure Pay"],["thumb_up","Quality Check"]].map(([icon,lbl]) => (
                      <span key={lbl} className="flex items-center gap-1.5 text-[10px] font-semibold text-text-muted uppercase tracking-wide bg-stone-100 px-2 py-1 rounded-md border border-stone-border/50">
                        <span className="material-symbols-outlined text-[14px] text-plum-deep">{icon}</span>{lbl}
                      </span>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* ── Description / Tabs ──────────────────────────────────── */}
        <div className="mt-16 lg:mt-24 border-t border-stone-border pt-10">
          <div className="flex flex-wrap gap-8 border-b border-stone-border/60 mb-8 overflow-x-auto pb-1">
            {[["description","Description"],["specifications","Specifications"],["shipping","Shipping Info"],["faq","FAQ"]].map(([k,v]) => (
              <button key={k} onClick={() => setActiveTab(k)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${activeTab === k ? "border-plum-deep text-plum-deep font-bold" : "border-transparent text-text-muted hover:text-plum-deep"}`}>
                {v}
              </button>
            ))}
          </div>
          <div className="max-w-4xl">
            {activeTab === "description" && (
              <div>
                <h3 className="text-xl font-bold text-plum-deep mb-4">About This Product</h3>
                <p className="text-text-muted leading-relaxed mb-8 text-lg">{product.description || `${product.name} from Vijetha Digital, Hyderabad. Est. 2002, serving 500+ businesses across Telangana.`}</p>
                <ul className="grid md:grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    "High-resolution printing with sharp text and vibrant colors",
                    "Premium materials sourced from trusted suppliers",
                    "Quality checked before dispatch — zero compromise",
                    "GST invoice with every order (36AGBPC3175H1ZP)",
                  ].map(pt => (
                    <li key={pt} className="flex items-start gap-3 bg-white p-3 rounded-lg border border-stone-border/30">
                      <span className="material-symbols-outlined text-coral-accent text-xl mt-0.5">check_circle</span>
                      <span className="font-medium text-sm text-text-muted">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-bold text-plum-deep mb-4">Specifications</h3>
                {[
                  ["Category",    product.category],
                  ["Unit",        unitLabel],
                  ["Base Price",  `\u20b9${fmtPrice(product.base_price)} / ${unitLabel}`],
                  ["Finish",      finishOptions.map(f => f.label).join(", ")],
                  ...(usesPaperSize(product) ? [["Paper Sizes", PAPER_SIZES.map(s => s.label).join(", ")]] : []),
                  ...(usesBannerSize(product) ? [["Banner Sizes", BANNER_SIZES.map(s => s.label).join(", ")]] : []),
                  ...(usesTentSize(product)   ? [["Tent Sizes",   TENT_SIZES.map(s => s.label).join(", ")]] : []),
                  ["GST",         "Applicable per government norms"],
                  ["Turnaround",  "24–48 business hours"],
                  ["Delivery",    "Hyderabad & surrounding areas"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start gap-4 py-3 border-b border-stone-border/40">
                    <span className="w-36 text-sm font-bold text-plum-deep flex-shrink-0">{k}</span>
                    <span className="text-sm text-text-muted">{v}</span>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-plum-deep mb-4">Shipping &amp; Delivery</h3>
                {[
                  { icon: "local_shipping", title: "Hyderabad Delivery",  desc: "Free delivery within city limits for orders above ₹2,000. Delivered within 2–3 business days." },
                  { icon: "bolt",           title: "Express Turnaround",   desc: "Most orders processed and ready within 24–48 hours. Contact us for same-day emergency orders." },
                  { icon: "storefront",     title: "Shop Pickup",          desc: "Pick up from our Lakdikapool or Indira Park showrooms. Call +91 79426 43004 to schedule." },
                  { icon: "receipt_long",   title: "GST Invoice",          desc: "All orders include a valid GST invoice (GSTIN: 36AGBPC3175H1ZP)." },
                ].map(item => (
                  <div key={item.title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-stone-border/50">
                    <span className="material-symbols-outlined text-coral-accent text-2xl mt-0.5">{item.icon}</span>
                    <div><h4 className="font-bold text-plum-deep text-sm mb-1">{item.title}</h4><p className="text-xs text-text-muted leading-relaxed">{item.desc}</p></div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "faq" && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-plum-deep mb-4">Frequently Asked Questions</h3>
                {[
                  { q: "Do you provide design services?",   a: "Yes! We offer in-house design support. Share your brand guidelines and we'll create a print-ready file at no extra charge for orders above ₹2,000." },
                  { q: "What file formats do you accept?",  a: "We accept PDF, AI, PSD, EPS, TIFF, and high-resolution PNG. Files should be at minimum 150 DPI (300 DPI preferred for print)." },
                  { q: "Can I get bulk/corporate pricing?", a: "Absolutely. Corporate and bulk orders get special pricing tiers. Call us at +91 79426 43004 or register a business account." },
                  { q: "Do you deliver outside Hyderabad?", a: "We primarily serve Hyderabad and Telangana. For outstation orders, courier is available at actuals. Contact us for a quote." },
                ].map(item => (
                  <div key={item.q} className="p-5 bg-white rounded-xl border border-stone-border/50">
                    <h4 className="font-bold text-plum-deep text-sm mb-2 flex items-start gap-2">
                      <span className="material-symbols-outlined text-coral-accent text-lg mt-0.5">help_outline</span>{item.q}
                    </h4>
                    <p className="text-xs text-text-muted leading-relaxed pl-7">{item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews ─────────────────────────────────────────────── */}
        <ReviewSection productId={product.id} user={user} />

        {/* ── Related products ────────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-20 border-t border-stone-border pt-16">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-bold text-plum-deep">Related Products</h2>
              <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-sm font-bold text-coral-accent hover:text-coral-dark transition-colors hidden sm:block">
                View All {product.category} →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(rp => (
                <div key={rp.id} onClick={() => navigate(`/products/${rp.id}`)}
                  className="bg-white rounded-[16px] overflow-hidden shadow-product-card hover:shadow-card-hover transition-all duration-300 group border border-stone-border/50 flex flex-col cursor-pointer transform hover:-translate-y-1">
                  <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                    {rp.image_url
                      ? <img src={rp.image_url} alt={rp.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      : <div className="w-full h-full bg-stone-light flex items-center justify-center"><span className="material-symbols-outlined text-plum-deep/20 text-4xl">image</span></div>}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-bold text-plum-deep mb-1 group-hover:text-coral-accent transition-colors line-clamp-1">{rp.name}</h3>
                    <p className="text-text-muted/80 text-xs mb-4 font-medium line-clamp-2">{rp.description || rp.category}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-stone-border/40 pt-3">
                      <span className="text-sm font-extrabold text-plum-deep">&#8377;{fmtPrice(rp.base_price)}</span>
                      <span className="text-xs text-coral-accent font-bold group-hover:translate-x-1 transition-transform">View Details →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ── B2B CTA ─────────────────────────────────────────────── */}
      <section className="py-20 bg-warm-white border-t border-stone-border relative overflow-hidden"
        style={{ backgroundImage: "radial-gradient(#CFC8BD 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="bg-white rounded-[24px] p-8 lg:p-12 shadow-architectural-lg border border-stone-border/50 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-plum-deep/5 border border-plum-deep/10 mb-5">
                <span className="w-2 h-2 rounded-full bg-coral-accent animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-plum-deep">B2B Solutions</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-plum-deep mb-3">Bulk Orders &amp; Corporate Accounts</h2>
              <p className="text-text-muted text-lg max-w-xl">Exclusive pricing tiers, dedicated account support &amp; simplified monthly invoicing for high-volume business needs.</p>
            </div>
            <Link to="/register" className="inline-flex items-center gap-2 bg-plum-deep hover:bg-plum-hover text-white font-bold py-4 px-8 rounded-[12px] shadow-soft-plum transition-all transform hover:-translate-y-1 text-sm uppercase tracking-wide whitespace-nowrap">
              Open Corporate Account <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


/* ════════════════════════════════════════════════════════════════════════
   ReviewSection — full production review UI
   ════════════════════════════════════════════════════════════════════════ */

const STAR_LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

function StarRating({ value, max = 5, size = "text-xl", interactive, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => {
        const star = i + 1;
        const filled = star <= (interactive ? (hover || value) : value);
        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            onMouseEnter={() => interactive && setHover(star)}
            onMouseLeave={() => interactive && setHover(0)}
            className={`${size} transition-colors ${interactive ? "cursor-pointer" : "cursor-default"} ${filled ? "text-amber-400" : "text-stone-300"}`}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: filled ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 400" }}>star</span>
          </button>
        );
      })}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-6 text-right font-semibold text-plum-deep">{stars}</span>
      <span className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      <div className="flex-1 h-2.5 bg-stone-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-xs text-text-muted font-medium">{count}</span>
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const initials = (review.user_name || "A").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const longBody = review.body && review.body.length > 200;

  return (
    <div className="bg-white rounded-2xl border border-stone-border/50 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-plum-deep/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-plum-deep">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-plum-deep text-sm">{review.user_name}</span>
            {review.is_verified_purchase && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                <span className="material-symbols-outlined text-[12px]">verified</span> Verified Purchase
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={review.rating} size="text-base" />
            <span className="text-xs text-text-muted">
              {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && <h4 className="font-bold text-plum-deep text-sm mb-2">{review.title}</h4>}

      {/* Body */}
      {review.body && (
        <p className="text-sm text-text-muted leading-relaxed">
          {longBody && !expanded ? review.body.slice(0, 200) + "…" : review.body}
          {longBody && (
            <button onClick={() => setExpanded(!expanded)} className="ml-1 text-plum-deep font-semibold text-xs hover:text-coral-accent">
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </p>
      )}

      {/* Images */}
      {review.image_urls?.length > 0 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {review.image_urls.map((url, i) => (
            <a key={i} href={url} target="_blank" rel="noopener noreferrer"
              className="w-20 h-20 rounded-xl overflow-hidden border border-stone-border hover:border-plum-deep transition-colors shadow-sm">
              <img src={url} alt={`Review image ${i + 1}`} className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}
    </div>
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
      setSubmitError(err.response?.data?.detail || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avg = summary?.average_rating || 0;
  const total = summary?.total_reviews || 0;

  return (
    <div className="mt-16 lg:mt-24 border-t border-stone-border pt-10" id="reviews">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-bold text-plum-deep">Customer Reviews</h2>
        {user && !myReview && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-plum-deep hover:bg-plum-hover text-white font-bold py-2.5 px-6 rounded-xl transition-all text-sm shadow-soft-plum"
          >
            <span className="material-symbols-outlined text-lg">rate_review</span> Write a Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left — Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-2xl border border-stone-border/50 p-8 shadow-sm sticky top-32">
            {total > 0 ? (
              <>
                <div className="text-center mb-6">
                  <div className="text-6xl font-extrabold text-plum-deep leading-none mb-2">{avg}</div>
                  <StarRating value={Math.round(avg)} size="text-2xl" />
                  <p className="text-sm text-text-muted mt-2 font-medium">
                    Based on <strong className="text-plum-deep">{total}</strong> review{total !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <RatingBar key={s} stars={s} count={summary?.distribution?.[s] || 0} total={total} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <span className="material-symbols-outlined text-4xl text-plum-deep/20 mb-3 block">reviews</span>
                <p className="font-semibold text-plum-deep mb-1">No Reviews Yet</p>
                <p className="text-xs text-text-muted">Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right — Reviews list + form */}
        <div className="lg:col-span-8">
          {/* Write review form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border-2 border-plum-deep/20 p-8 shadow-md mb-8">
              <h3 className="text-lg font-bold text-plum-deep mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-coral-accent">edit_note</span> Write Your Review
              </h3>

              {/* Stars */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-plum-deep mb-2">Your Rating *</label>
                <div className="flex items-center gap-3">
                  <StarRating value={formRating} size="text-3xl" interactive onChange={setFormRating} />
                  {formRating > 0 && <span className="text-sm font-semibold text-coral-accent">{STAR_LABELS[formRating]}</span>}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-plum-deep mb-2">Title <span className="text-text-muted font-normal">(optional)</span></label>
                <input type="text" maxLength={200} value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  className="w-full border border-stone-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum-deep/20 bg-white" />
              </div>

              {/* Body */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-plum-deep mb-2">Your Review <span className="text-text-muted font-normal">(optional)</span></label>
                <textarea rows={4} value={formBody} onChange={(e) => setFormBody(e.target.value)}
                  placeholder="What did you like or dislike? How was the quality?"
                  className="w-full border border-stone-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-plum-deep/20 bg-white resize-none" />
              </div>

              {/* Upload images / videos */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-plum-deep mb-2">
                  Photos / Videos <span className="text-text-muted font-normal">(optional — up to 5, max 10 MB each)</span>
                </label>

                {/* preview grid */}
                {previewUrls.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {previewUrls.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-border group">
                        {formFiles[i]?.type?.startsWith("video") ? (
                          <video src={url} className="w-full h-full object-cover" muted />
                        ) : (
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        )}
                        <button type="button" onClick={() => removeFile(i)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formFiles.length < 5 && (
                  <label className="flex items-center gap-3 border-2 border-dashed border-stone-border rounded-xl px-4 py-3 cursor-pointer hover:border-plum-deep/40 transition-colors bg-stone-light/30">
                    <span className="material-symbols-outlined text-plum-deep text-xl">add_photo_alternate</span>
                    <span className="text-sm text-text-muted">
                      {formFiles.length === 0 ? "Tap to add photos or videos" : `Add more (${formFiles.length}/5)`}
                    </span>
                    <input type="file" multiple accept="image/*,video/mp4,video/webm" onChange={handleFilePick}
                      className="hidden" />
                  </label>
                )}
              </div>

              {submitError && (
                <div className="bg-red-50 text-red-700 text-sm font-semibold p-3 rounded-xl mb-4 border border-red-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">error</span> {submitError}
                </div>
              )}

              <div className="flex gap-3">
                <button type="submit" disabled={submitting || uploading}
                  className="flex-1 bg-plum-deep hover:bg-plum-hover text-white font-bold py-3 rounded-xl transition-all text-sm shadow-soft-plum disabled:opacity-50 flex items-center justify-center gap-2">
                  {uploading ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading files…</>
                  ) : submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</>
                  ) : (
                    <><span className="material-symbols-outlined text-lg">send</span> Submit Review</>
                  )}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setSubmitError(""); }}
                  className="px-6 py-3 border border-stone-border text-plum-deep font-bold rounded-xl hover:bg-stone-light transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Existing user review */}
          {myReview && (
            <div className="mb-6">
              <div className="text-xs font-bold text-plum-deep uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-coral-accent">person</span> Your Review
              </div>
              <ReviewCard review={myReview} />
            </div>
          )}

          {/* Reviews list */}
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.filter((r) => r.id !== myReview?.id).map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          ) : (
            !showForm && (
              <div className="text-center py-12 text-text-muted">
                <span className="material-symbols-outlined text-4xl opacity-30 mb-3 block">forum</span>
                <p className="font-semibold">No reviews yet</p>
                <p className="text-xs mt-1">
                  {user ? "Be the first to share your experience!" : "Log in to write a review."}
                </p>
              </div>
            )
          )}

          {/* Load more */}
          {hasMore && reviews.length > 0 && (
            <div className="text-center mt-8">
              <button onClick={handleLoadMore} disabled={loadingMore}
                className="inline-flex items-center gap-2 text-sm font-bold text-plum-deep border border-stone-border bg-white px-6 py-3 rounded-xl hover:bg-stone-light transition-colors shadow-sm disabled:opacity-50">
                {loadingMore ? (
                  <><span className="w-4 h-4 border-2 border-plum-deep/30 border-t-plum-deep rounded-full animate-spin" /> Loading…</>
                ) : (
                  <><span className="material-symbols-outlined text-base">expand_more</span> Load More Reviews</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
