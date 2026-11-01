import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Breadcrumbs from "../components/store/Breadcrumbs";
import StickyBar from "../components/store/StickyBar";
import usePageTitle from "../hooks/usePageTitle";
import { BUSINESS, CATEGORY_ICON, rupees } from "../config/business";

/* ── helpers ──────────────────────────────────────────────────────── */
function configColumns(item) {
  const cfg = item.config || {};
  const isDim = !!(cfg.width && cfg.height);
  const cols = [];

  if (isDim) {
    cols.push({ label: "Size", value: `${cfg.width} × ${cfg.height} ft` });
  } else if (cfg.size) {
    cols.push({ label: "Size", value: cfg.size });
  }

  if (cfg.finish) {
    cols.push({ label: "Finish", value: cfg.finish });
  }

  /* Unit price: show the original batch price if stored (1000-pcs products) */
  const unitPriceDisplay = cfg.batch_price
    ? `${rupees(cfg.batch_price)} / ${Number(cfg.batch_size || 1000).toLocaleString("en-IN")} pcs`
    : isDim
      ? `${rupees(item.unit_price)} / sq ft`
      : `${rupees(item.unit_price)} / pc`;
  cols.push({ label: "Unit Price", value: unitPriceDisplay });

  /* Total quantity: always from the live quantity, so it follows the stepper */
  const area = isDim ? cfg.width * cfg.height : 0;
  const copies = isDim ? Math.round((item.quantity || area) / area) || 1 : 1;
  const totalDisplay = isDim
    ? copies > 1 ? `${copies} × ${area} = ${item.quantity} sq ft` : `${item.quantity} sq ft`
    : `${Number(item.quantity).toLocaleString("en-IN")} pc${item.quantity !== 1 ? "s" : ""}`;
  cols.push({ label: isDim ? "Total Area" : "Total Qty", value: totalDisplay });

  if (cfg.design_file) {
    cols.push({ label: "Your Design", value: cfg.design_file });
  }

  return cols;
}

function Stepper({ value, label, onDecrease, onIncrease, canDecrease = true }) {
  const btn = "flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-shade disabled:opacity-35 disabled:hover:bg-transparent";
  return (
    <div className="inline-flex items-center rounded-lg shadow-[inset_0_0_0_1px_#B9B4A8]" role="group" aria-label={label}>
      <button type="button" className={`${btn} rounded-l-lg`} onClick={onDecrease} disabled={!canDecrease} aria-label={`Decrease ${label}`}>
        <span className="material-symbols-outlined text-lg">remove</span>
      </button>
      <span className="vd-price min-w-[2.75rem] px-1 text-center text-sm font-semibold" aria-live="polite">{value.toLocaleString("en-IN")}</span>
      <button type="button" className={`${btn} rounded-r-lg`} onClick={onIncrease} aria-label={`Increase ${label}`}>
        <span className="material-symbols-outlined text-lg">add</span>
      </button>
    </div>
  );
}

/* ── main component ──────────────────────────────────────────────── */
export default function Cart() {
  usePageTitle("Your Cart");
  const { items, cartLoaded, removeFromCart, restoreItem, updateQuantity, total } = useCart();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [removed, setRemoved] = useState(null);

  const gst = total * 0.18;
  const grandTotal = total + gst;

  /* Offer undo for a few seconds after removing a line */
  useEffect(() => {
    if (!removed) return undefined;
    const timer = setTimeout(() => setRemoved(null), 7000);
    return () => clearTimeout(timer);
  }, [removed]);

  const removeLine = (item, idx) => {
    removeFromCart(idx);
    setRemoved({ item, idx });
  };

  const undoRemove = () => {
    restoreItem(removed.item, removed.idx);
    setRemoved(null);
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    if (!coupon.trim()) return;
    setCouponMessage(`We can't apply codes online yet. Call ${BUSINESS.phone} and we'll honour a valid code.`);
  };

  if (!cartLoaded) {
    return (
      <main id="main" className="vd-wrap py-16 font-display" aria-busy="true">
        <div className="h-40 vd-skeleton" />
      </main>
    );
  }

  const undoBar = removed && (
    <div className="vd-alert vd-alert-info mb-4 items-center justify-between" role="status">
      <span className="min-w-0 truncate">Removed {removed.item.name}</span>
      <button onClick={undoRemove} className="vd-link whitespace-nowrap">Undo</button>
    </div>
  );

  /* ── empty ────────────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <main id="main" className="vd-wrap min-h-[60vh] py-14 font-display lg:py-20">
        {undoBar}
        <h1 className="vd-h1">Your cart is empty</h1>
        <p className="vd-lede mt-3">Add products to your cart to get started.</p>
        <Link to="/products" className="vd-btn vd-btn-lg vd-btn-accent mt-7">Browse Products</Link>
      </main>
    );
  }

  return (
    <main id="main" className="font-display pb-[var(--sticky-bar,0px)]">
      <div className="vd-wrap pb-14 pt-5 lg:pb-20">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shopping Cart" }]} />

        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h1 className="vd-h1">Your Cart</h1>
          <p className="text-ink-2">
            You have {items.length} {items.length === 1 ? "item" : "items"} in your cart ready for checkout.
          </p>
        </div>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Items */}
          <div className="min-w-0 lg:col-span-8">
            {undoBar}

            <ul className="border-y border-line">
              {items.map((item, idx) => {
                const cols = configColumns(item);
                const lineTotal = Number(item.unit_price) * Number(item.quantity);
                const isDimItem = !!(item.config?.width && item.config?.height);
                const area = isDimItem ? item.config.width * item.config.height : 0;
                const copies = isDimItem ? Math.round(item.quantity / area) || 1 : 0;
                // Per-1000 products move in lots of 50, not single sheets
                const step = item.config?.batch_size ? 50 : 1;

                return (
                  <li key={`${item.product_id}-${idx}`} className="border-t border-line py-5 first:border-t-0">
                    <div className="flex gap-4">
                      <Link to={`/products/${item.product_id}`} className="vd-frame block h-20 w-20 flex-shrink-0 sm:h-28 sm:w-28" aria-hidden="true" tabIndex={-1}>
                        {item.image_url ? (
                          <img src={item.image_url} alt="" width="112" height="112" />
                        ) : (
                          <span className="flex h-full items-center justify-center text-ink-3">
                            <span className="material-symbols-outlined text-3xl">{CATEGORY_ICON[item.category] || "inventory_2"}</span>
                          </span>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h2 className="text-[1.0625rem] font-semibold leading-snug">
                              <Link to={`/products/${item.product_id}`} className="hover:underline underline-offset-2">{item.name}</Link>
                            </h2>
                            <p className="text-sm text-ink-2">{item.category}</p>
                          </div>
                          <p className="vd-price whitespace-nowrap text-[1.0625rem] font-bold">{rupees(lineTotal, 2)}</p>
                        </div>

                        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                          {cols.map((col) => (
                            <div key={col.label} className="min-w-0">
                              <dt className="text-[0.8125rem] text-ink-2">{col.label}</dt>
                              <dd className="vd-price truncate font-medium">{col.value}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:pl-32">
                      {isDimItem ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-ink-2">Copies</span>
                          <Stepper
                            value={copies}
                            label={`copies of ${item.name}`}
                            canDecrease={copies > 1}
                            onDecrease={() => updateQuantity(idx, (copies - 1) * area)}
                            onIncrease={() => updateQuantity(idx, (copies + 1) * area)}
                          />
                        </div>
                      ) : (
                        <Stepper
                          value={item.quantity}
                          label={`quantity of ${item.name}`}
                          canDecrease={item.quantity > step}
                          onDecrease={() => updateQuantity(idx, item.quantity - step)}
                          onIncrease={() => updateQuantity(idx, item.quantity + step)}
                        />
                      )}
                      <div className="flex items-center gap-1">
                        <Link to={`/products/${item.product_id}`} className="vd-btn !font-medium text-ink-2 hover:bg-shade hover:text-ink">Edit</Link>
                        <button onClick={() => removeLine(item, idx)} className="vd-btn !font-medium text-ink-2 hover:bg-shade hover:text-ink" aria-label={`Remove ${item.name}`}>
                          <span className="material-symbols-outlined text-lg">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link to="/products" className="vd-link mt-5 inline-flex items-center gap-1 text-[0.9375rem]">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Continue Shopping
            </Link>

            {/* B2B */}
            <div className="mt-10 flex flex-col gap-4 rounded-lg bg-shade p-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-[1.0625rem] font-semibold">Ordering for a Business?</h2>
                <p className="mt-0.5 text-sm text-ink-2">Open a corporate account for GST invoices, bulk discounts, and dedicated support.</p>
              </div>
              <Link to="/register" className="vd-btn vd-btn-outline flex-shrink-0">Create Account</Link>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)] lg:col-span-4" aria-label="Order summary">
            <div className="rounded-lg bg-surface p-5 shadow-[inset_0_0_0_1px_#DEDAD0] lg:p-6">
              <h2 className="vd-h3">Order Summary</h2>

              <dl className="vd-rows vd-price mt-3 text-[0.9375rem]">
                <div><dt className="text-ink-2">Subtotal</dt><dd className="font-medium">{rupees(total, 2)}</dd></div>
                <div><dt className="text-ink-2">GST (18%)</dt><dd className="font-medium">{rupees(gst, 2)}</dd></div>
                <div><dt className="text-ink-2">Delivery</dt><dd className="font-semibold text-ok">Free</dd></div>
                <div><dt className="text-ink-2">Discount</dt><dd className="font-medium">-₹0.00</dd></div>
                <div className="!items-baseline">
                  <dt className="font-semibold text-ink">Grand Total</dt>
                  <dd className="text-2xl font-bold tracking-tight">{rupees(grandTotal, 2)}</dd>
                </div>
              </dl>

              <button onClick={() => navigate("/checkout")} className="vd-btn vd-btn-lg vd-btn-accent mt-4 hidden w-full lg:inline-flex">
                Proceed to Checkout
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </button>

              <p className="mt-3 flex items-center justify-center gap-1 text-[0.8125rem] text-ink-2">
                <span className="material-symbols-outlined text-sm">lock</span>
                Secure Checkout guaranteed
              </p>

              <details className="mt-3 border-t border-line pt-1" open={!!coupon}>
                <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
                  Have a coupon code?
                  <span className="material-symbols-outlined text-lg text-ink-3">expand_more</span>
                </summary>
                <form onSubmit={applyCoupon} className="flex gap-2 pb-1">
                  <label htmlFor="coupon" className="sr-only">Coupon Code</label>
                  <input
                    id="coupon" name="coupon" type="text" autoComplete="off" spellCheck={false}
                    value={coupon}
                    onChange={(e) => { setCoupon(e.target.value); setCouponMessage(""); }}
                    placeholder="Enter code"
                    className="vd-input min-w-0"
                  />
                  <button type="submit" className="vd-btn vd-btn-quiet flex-shrink-0">Apply</button>
                </form>
                {couponMessage && <p className="vd-hint pb-1" role="status">{couponMessage}</p>}
              </details>
            </div>

            <ul className="mt-4 flex justify-between gap-3 px-1 text-[0.8125rem] text-ink-2">
              <li>Quality Check</li>
              <li>Easy Returns</li>
              <li>24/7 Support</li>
            </ul>
          </aside>
        </div>
      </div>

      <StickyBar>
        <div className="min-w-0">
          <p className="text-[0.75rem] leading-tight text-ink-2">Total incl. GST</p>
          <p className="vd-price truncate text-lg font-bold leading-tight">{rupees(grandTotal, 2)}</p>
        </div>
        <button onClick={() => navigate("/checkout")} className="vd-btn vd-btn-accent flex-shrink-0 !min-h-[48px] px-6">
          Checkout <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </StickyBar>
    </main>
  );
}
