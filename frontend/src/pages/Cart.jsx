import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

/* ── helpers ──────────────────────────────────────────────────────── */
function configColumns(item) {
  const cfg    = item.config || {};
  const isDim  = !!(cfg.width && cfg.height);
  const cols   = [];

  if (isDim) {
    cols.push({ label: "Size",       value: `${cfg.width} × ${cfg.height} ft` });
  } else if (cfg.size) {
    cols.push({ label: "Size",       value: cfg.size });
  }

  if (cfg.finish) {
    cols.push({ label: "Finish",     value: cfg.finish });
  }

  /* Unit price — show original batch price if stored (1000-pcs products) */
  const unitPriceDisplay = cfg.batch_price
    ? `₹${Number(cfg.batch_price).toLocaleString("en-IN")} / ${Number(cfg.batch_size || 1000).toLocaleString("en-IN")} pcs`
    : isDim
      ? `₹${Number(item.unit_price).toLocaleString("en-IN")} / sq ft`
      : `₹${Number(item.unit_price).toLocaleString("en-IN")} / pc`;
  cols.push({ label: "Unit Price", value: unitPriceDisplay });

  /* Total qty — use the pre-formatted string stored from ProductDetail, or compute */
  const area    = isDim ? (cfg.width * cfg.height) : 0;
  const copies  = isDim ? Math.round((item.quantity || area) / area) || 1 : 1;
  const totalDisplay = isDim
    ? copies > 1 ? `${copies} × ${area} = ${item.quantity} sq ft` : `${item.quantity} sq ft`
    : (cfg.qty || `${item.quantity} pc${item.quantity !== 1 ? "s" : ""}`);
  cols.push({
    label: isDim ? "Total Area" : "Total Qty",
    value: totalDisplay,
  });

  return cols;
}

function categoryIcon(cat) {
  if (cat === "Sign Boards")       return "storefront";
  if (cat === "Printing Services") return "print";
  if (cat === "Banner Stands")     return "flag";
  if (cat === "Demo Tents")        return "holiday_village";
  return "inventory_2";
}

/* ── main component ──────────────────────────────────────────────── */
export default function Cart() {
  const { items, cartLoaded, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");

  const gst        = total * 0.18;
  const grandTotal = total + gst;

  if (!cartLoaded) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── empty ────────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-stone-light flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-5xl text-plum-deep/30">shopping_cart</span>
        </div>
        <h1 className="text-3xl font-extrabold text-plum-deep mb-2">Your cart is empty</h1>
        <p className="text-text-muted text-sm mb-8">Add products to your cart to get started.</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-plum-deep hover:bg-plum-light text-white font-bold py-3 px-8 rounded-full shadow-soft-plum transition-all text-sm uppercase tracking-wide"
        >
          <span className="material-symbols-outlined text-lg">storefront</span>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white font-display">

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 pb-2">
        <nav className="flex items-center text-sm text-text-muted overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-plum-deep transition-colors">Home</Link>
          <span className="material-symbols-outlined text-sm mx-2 text-stone-400">chevron_right</span>
          <span className="text-plum-deep font-semibold">Shopping Cart</span>
        </nav>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">

          {/* ── LEFT: items ────────────────────────────────────────── */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Heading */}
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-plum-deep tracking-tight mb-2">
                  Your Cart
                </h1>
                <p className="text-text-muted text-sm">
                  You have {items.length} {items.length === 1 ? "item" : "items"} in your cart ready for checkout.
                </p>
              </div>
            </div>

            {/* Cart items */}
            {items.map((item, idx) => {
              const cols      = configColumns(item);
              const lineTotal = Number(item.unit_price) * Number(item.quantity);
              const isDimItem = !!(item.config?.width && item.config?.height);

              return (
                <div
                  key={idx}
                  className="bg-white rounded-[16px] border border-stone-border shadow-product-card p-8 flex flex-col md:flex-row gap-8 items-start md:items-center relative group hover:border-plum-deep/20 transition-colors"
                >
                  {/* Image / icon */}
                  <div className="w-full md:w-36 h-36 flex-shrink-0 bg-stone-light rounded-[12px] overflow-hidden border border-stone-border/50">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-plum-deep/30 text-5xl">
                          {categoryIcon(item.category)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-grow flex flex-col gap-4 w-full">

                    {/* Name + delete */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-plum-deep leading-tight">{item.name}</h3>
                        <p className="text-sm text-text-muted mt-1">{item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(idx)}
                        className="text-text-muted hover:text-coral-accent transition-colors p-2 -mr-2 rounded-full hover:bg-coral-accent/5"
                        title="Remove Item"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>

                    {/* Config columns grid */}
                    <div className={`grid grid-cols-2 ${cols.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-y-4 gap-x-8 mt-1 text-sm`}>
                      {cols.map(col => (
                        <div key={col.label} className="flex flex-col">
                          <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">{col.label}</span>
                          <span className="font-medium text-text-dark text-base">{col.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer row */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-6 border-t border-stone-border/50 gap-6">

                      {/* Left: badges + edit + stepper */}
                      <div className="flex items-center gap-3 text-xs text-text-muted order-2 sm:order-1 w-full sm:w-auto justify-start flex-wrap">
                        <div className="flex items-center gap-2 bg-stone-100/80 text-plum-deep px-3 py-1.5 rounded-full border border-stone-200">
                          <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                          <span className="font-bold">24–48 hrs</span>
                        </div>
                        <div className="flex items-center gap-2 bg-stone-100/80 text-plum-deep px-3 py-1.5 rounded-full border border-stone-200">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span className="font-bold">GST Eligible</span>
                        </div>
                        <Link
                          to={`/products/${item.product_id}`}
                          className="text-sm font-semibold text-text-muted hover:text-plum-deep underline decoration-stone-border hover:decoration-plum-deep underline-offset-4"
                        >
                          Edit
                        </Link>
                      </div>

                      {/* Right: qty/dims display + price */}
                      <div className="flex items-center gap-6 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
                        {isDimItem ? (
                          /* Dimension badge + copies stepper — same style as regular stepper */
                          (() => {
                            const area   = item.config.width * item.config.height;
                            const copies = Math.round(item.quantity / area) || 1;
                            return (
                              <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-sm font-bold text-plum-deep bg-plum-deep/10 border border-plum-deep/20 px-3 py-2 rounded-full whitespace-nowrap">
                                  <span className="material-symbols-outlined text-[15px]">straighten</span>
                                  {item.config.width} × {item.config.height} ft
                                </span>
                                <div className="flex items-center border border-stone-border rounded-full bg-warm-white overflow-hidden shadow-sm">
                                  <button
                                    onClick={() => copies > 1 && updateQuantity(idx, (copies - 1) * area)}
                                    className="w-10 h-9 flex items-center justify-center text-text-muted hover:text-plum-deep hover:bg-white transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm">remove</span>
                                  </button>
                                  <span className="text-sm font-bold text-plum-deep w-10 text-center bg-white h-9 flex items-center justify-center border-x border-stone-border">
                                    {copies}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(idx, (copies + 1) * area)}
                                    className="w-10 h-9 flex items-center justify-center text-text-muted hover:text-plum-deep hover:bg-white transition-colors"
                                  >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })()
                        ) : (
                          /* Qty-based: stepper */
                          <div className="flex items-center border border-stone-border rounded-full bg-warm-white overflow-hidden shadow-sm">
                            <button
                              onClick={() => updateQuantity(idx, item.quantity - 1)}
                              className="w-10 h-9 flex items-center justify-center text-text-muted hover:text-plum-deep hover:bg-white transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">remove</span>
                            </button>
                            <span className="text-sm font-bold text-plum-deep w-10 text-center bg-white h-9 flex items-center justify-center border-x border-stone-border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(idx, item.quantity + 1)}
                              className="w-10 h-9 flex items-center justify-center text-text-muted hover:text-plum-deep hover:bg-white transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">add</span>
                            </button>
                          </div>
                        )}
                        <div className="text-right">
                          <span className="block text-2xl font-extrabold text-plum-deep">
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-plum-deep transition-colors self-start"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Continue Shopping
            </Link>

            {/* B2B CTA card */}
            <div className="relative overflow-hidden bg-white rounded-[16px] p-8 shadow-soft-plum border border-plum-deep/10 mt-2">
              <div
                className="absolute inset-0 opacity-40"
                style={{ backgroundImage: "radial-gradient(#CFC8BD 1px, transparent 1px)", backgroundSize: "16px 16px" }}
              />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-plum-deep shadow-sm border border-stone-border flex-shrink-0">
                    <span className="material-symbols-outlined text-3xl">domain</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-plum-deep text-lg">Ordering for a Business?</h3>
                    <p className="text-sm text-text-muted mt-1 max-w-md">
                      Open a corporate account for GST invoices, bulk discounts, and dedicated support.
                    </p>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="whitespace-nowrap bg-transparent border-2 border-plum-deep text-plum-deep hover:bg-plum-deep hover:text-white font-bold py-3 px-6 rounded-[10px] transition-all shadow-sm text-sm flex-shrink-0"
                >
                  Create Account
                </Link>
              </div>
            </div>

          </div>

          {/* ── RIGHT: summary ─────────────────────────────────────── */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-28 space-y-6">

              {/* Summary card */}
              <div className="bg-white rounded-[16px] shadow-architectural border border-stone-border p-6 lg:p-8">
                <h2 className="text-xl font-bold text-plum-deep mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 border-b border-stone-border pb-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-semibold text-text-dark">₹{total.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">GST (18%)</span>
                    <span className="font-semibold text-text-dark">₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Delivery</span>
                    <span className="font-bold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Discount</span>
                    <span className="font-semibold text-text-dark">-₹0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-lg font-bold text-plum-deep">Grand Total</span>
                  <span className="text-3xl font-extrabold text-plum-deep">
                    ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-text-muted uppercase tracking-wide mb-2" htmlFor="coupon">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="coupon"
                      type="text"
                      value={coupon}
                      onChange={e => setCoupon(e.target.value)}
                      placeholder="Enter code"
                      className="flex-grow bg-stone-50 border border-stone-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all placeholder:text-stone-400"
                    />
                    <button className="bg-stone-200 hover:bg-stone-300 text-text-dark font-bold px-4 rounded-lg text-sm transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-plum-deep text-white font-bold py-4 rounded-[12px] hover:bg-plum-light shadow-soft-plum hover:shadow-card-hover transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm uppercase tracking-wide focus:ring-4 focus:ring-plum-deep/30"
                >
                  Proceed to Checkout
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-text-muted flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock</span>
                    Secure Checkout guaranteed
                  </p>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: "workspace_premium", label: "Quality Check"  },
                  { icon: "assignment_return", label: "Easy Returns"   },
                  { icon: "support_agent",     label: "24/7 Support"   },
                ].map((b, i) => (
                  <div
                    key={b.label}
                    className={`flex flex-col items-center justify-center text-center p-3 ${i === 1 ? "border-x border-stone-border/60" : ""}`}
                  >
                    <span className="material-symbols-outlined text-plum-deep text-2xl mb-1">{b.icon}</span>
                    <p className="text-[10px] font-bold text-text-muted leading-tight mt-1">{b.label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
