import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrder, downloadInvoice } from "../api/orders";
import { createPayment, verifyPayment } from "../api/payments";
import useRazorpay from "../hooks/useRazorpay";

const GST_RATE = 0.18;

/* ── helpers ── */
function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
function fmtDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}`;
}
function estDelivery(createdAt) {
  const base = createdAt ? new Date(createdAt) : new Date();
  const to = new Date(base);
  to.setDate(to.getDate() + 5);
  return to.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ── timeline config ── */
const TIMELINE_STEPS = [
  { key: "confirmed", label: "Order Confirmed",      desc: "We have received your order.",                          icon: "check_circle" },
  { key: "printing",  label: "Printing in Progress",  desc: "Your designs are being printed with high precision.",   icon: "print" },
  { key: "quality_check", label: "Quality Check",     desc: "Our team is verifying color accuracy and cut quality.", icon: "verified" },
  { key: "shipped",   label: "Shipped",               desc: "Handed over to our delivery partner.",                  icon: "local_shipping" },
  { key: "delivered", label: "Delivered",              desc: "Package delivered to your address.",                    icon: "home" },
];

const STATUS_ORDER = ["placed", "confirmed", "printing", "quality_check", "shipped", "delivered"];

function getStepState(stepKey, orderStatus) {
  const orderIdx = STATUS_ORDER.indexOf(orderStatus);
  const stepIdx = STATUS_ORDER.indexOf(stepKey);
  if (stepIdx < 0 || orderIdx < 0) return "pending";
  if (stepIdx < orderIdx) return "done";
  if (stepIdx === orderIdx) return "active";
  return "pending";
}

/* ══════════════════════════════════════════════════════════════════ */
export default function TrackOrder() {
  useRazorpay();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownloadInvoice = async () => {
    try {
      setDownloading(true);
      await downloadInvoice(orderId);
    } catch {
      setError("Could not download invoice. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const fetchOrder = useCallback(async () => {
    try {
      const data = await getOrder(orderId);
      setOrder(data);
    } catch {
      setError("Could not load order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`); return; }
    fetchOrder();
  }, [user, authLoading, navigate, location.pathname, fetchOrder]);

  const canPay = order &&
    (order.payment_status === "pending" || order.payment_status === "failed") &&
    order.status !== "cancelled";

  const handlePayNow = async () => {
    if (!window.Razorpay || !order) return;
    try {
      setPaying(true);
      const payment = await createPayment(order.id, { amount_percent: 100 });
      const rzp = new window.Razorpay({
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency || "INR",
        order_id: payment.razorpay_order_id,
        name: "Vijetha Digital",
        description: `Order #${order.id} Payment`,
        prefill: {
          name: user?.full_name || "",
          email: user?.email || "",
        },
        theme: { color: "#3B2F63" },
        handler: async (response) => {
          try {
            await verifyPayment(order.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate(`/order-confirmation/${order.id}`, {
              state: { deliveryMethod: "home" },
            });
          } catch {
            setError("Payment verification failed.");
            fetchOrder();
          }
        },
        modal: { ondismiss: () => { setPaying(false); fetchOrder(); } },
      });
      rzp.on("payment.failed", () => { setPaying(false); setError("Payment failed. Please try again."); fetchOrder(); });
      rzp.open();
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not initiate payment.");
      setPaying(false);
    }
  };

  /* ── loading ── */
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── error / not found ── */
  if (error || !order) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex flex-col items-center justify-center gap-4 px-6">
        <span className="material-symbols-outlined text-5xl text-red-400">error</span>
        <p className="text-lg text-plum-deep font-bold">{error || "Order not found"}</p>
        <Link to="/orders" className="text-sm text-coral-accent font-semibold hover:underline">View all orders</Link>
      </div>
    );
  }

  const subtotal = order.subtotal || 0;
  const gst = +(subtotal * GST_RATE).toFixed(2);
  const grandTotal = order.total_price || subtotal + gst;
  const firstItem = order.items?.[0];
  const itemLabel = firstItem?.product_name || firstItem?.material || "Custom Signage";
  const itemImage = firstItem?.product_image || null;
  const orderNumber = `#VJ${String(order.id).padStart(8, "0")}`;
  const orderStatus = order.status || "placed";
  const isCancelled = orderStatus === "cancelled" || orderStatus === "refunded";

  const statusBadge = (() => {
    if (isCancelled) return { label: orderStatus === "cancelled" ? "CANCELLED" : "REFUNDED", cls: "bg-red-50 text-red-700 border-red-200" };
    if (orderStatus === "delivered") return { label: "DELIVERED", cls: "bg-green-50 text-green-700 border-green-200" };
    return { label: "IN PROGRESS", cls: "bg-plum-deep/10 text-plum-deep border-plum-deep/20" };
  })();

  return (
    <div className="min-h-screen bg-warm-white font-display">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 lg:py-12">

        {/* page title */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-plum-deep tracking-tight mb-8">Track Your Order</h1>

        {/* meta strip */}
        <div className="bg-white rounded-[16px] border border-stone-border/60 shadow-product-card p-5 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-0 sm:divide-x sm:divide-stone-border/60">
            <MetaField label="Order Number" value={orderNumber} mono />
            <MetaField label="Placed On" value={fmtDate(order.created_at)} />
            <MetaField label="Payment Method" value="Razorpay" icon="credit_card" />
            <MetaField label="Est. Delivery" value={estDelivery(order.created_at)} highlight={!isCancelled && orderStatus !== "delivered"} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ─── LEFT ─── */}
          <div className="w-full lg:w-[65%] space-y-8">

            {/* ── Timeline card ── */}
            <div className="bg-white rounded-[20px] border border-stone-border/60 shadow-product-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-plum-deep mb-8">Order Status</h2>

              <div className="relative pl-8 space-y-0">
                {TIMELINE_STEPS.map((step, idx) => {
                  const state = isCancelled ? "pending" : getStepState(step.key, orderStatus);
                  const isLast = idx === TIMELINE_STEPS.length - 1;
                  return (
                    <TimelineStep
                      key={step.key}
                      step={step}
                      state={state}
                      isLast={isLast}
                      timestamp={state === "done" || state === "active" ? fmtDateTime(order.created_at) : ""}
                    />
                  );
                })}
              </div>

              {isCancelled && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500 text-xl">cancel</span>
                  <p className="text-sm text-red-700 font-medium">
                    This order has been {orderStatus === "cancelled" ? "cancelled" : "refunded"}.
                  </p>
                </div>
              )}
            </div>

            {/* ── Shipping details card ── */}
            <div className="bg-white rounded-[20px] border border-stone-border/60 shadow-product-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-plum-deep mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-plum-deep">local_shipping</span>
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* address */}
                <div>
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Delivery Address</h3>
                  <div className="bg-stone-light/40 rounded-xl p-5 border border-stone-border/60 text-plum-deep leading-relaxed">
                    <p className="font-extrabold text-base mb-1">{user?.full_name || "Customer"}</p>
                    <p className="text-sm text-text-muted">Hyderabad, Telangana</p>
                    {user?.email && (
                      <p className="text-sm text-text-muted mt-2 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm">phone</span>
                        —
                      </p>
                    )}
                  </div>
                </div>

                {/* courier info */}
                <div>
                  <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Courier Information</h3>
                  {orderStatus === "shipped" || orderStatus === "delivered" ? (
                    <div className="space-y-4">
                      <div className="bg-stone-light/40 rounded-xl p-5 border border-stone-border/60">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-plum-deep/10 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-plum-deep text-lg">local_shipping</span>
                          </div>
                          <div>
                            <p className="font-bold text-plum-deep text-sm">Delhivery Express</p>
                            <p className="text-xs text-text-muted mt-0.5">
                              Tracking ID: <span className="font-mono text-plum-deep font-semibold">—</span>
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-text-muted mt-3">
                          Courier Status: <span className="font-semibold text-plum-deep">Label Created</span>
                        </p>
                      </div>
                      <button className="w-full bg-white border border-stone-border hover:border-plum-deep/30 text-plum-deep font-semibold py-3 px-4 rounded-xl text-sm transition-all hover:bg-stone-50 flex items-center justify-center gap-2">
                        Track on Courier Website
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-stone-light/40 rounded-xl p-5 border border-stone-border/60 flex items-center gap-3 text-text-muted">
                      <span className="material-symbols-outlined text-xl">schedule</span>
                      <p className="text-sm">Courier details will appear once the order is shipped.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Support banner ── */}
            <div className="bg-plum-deep rounded-[16px] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-xl">support_agent</span>
                </div>
                <div className="text-white">
                  <p className="font-bold text-sm">Need Help with your order?</p>
                  <p className="text-xs text-white/70">Our support team is available 24/7 to assist you.</p>
                </div>
              </div>
              <Link
                to="/support"
                className="bg-white text-plum-deep font-bold text-sm py-2.5 px-6 rounded-xl hover:bg-stone-50 transition-all shrink-0"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* ─── RIGHT SIDEBAR ─── */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white rounded-[20px] p-6 shadow-product-card border border-stone-border/60 sticky top-24">
              {/* header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-border/50">
                <h2 className="text-lg font-bold text-plum-deep">Order Summary</h2>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusBadge.cls}`}>
                  {statusBadge.label}
                </span>
              </div>

              {/* product */}
              <div className="flex gap-4 mb-6 px-1">
                <div className="w-20 h-20 rounded-lg bg-stone-100 overflow-hidden border border-stone-border flex-shrink-0">
                  {itemImage ? (
                    <img src={itemImage} alt={itemLabel} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <span className="material-symbols-outlined text-3xl">print</span>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-plum-deep text-sm leading-tight mb-1">{itemLabel}</h3>
                  {firstItem?.product_category && (
                    <p className="text-xs text-text-muted mb-1">{firstItem.product_category}</p>
                  )}
                  <p className="text-sm font-bold text-plum-deep">
                    ₹{fmt(firstItem?.unit_price || 0)}
                    {firstItem && firstItem.quantity > 1 && (
                      <span className="text-xs text-text-muted font-normal"> x {firstItem.quantity}</span>
                    )}
                  </p>
                  {order.items.length > 1 && (
                    <p className="text-xs text-text-muted mt-1">+{order.items.length - 1} more</p>
                  )}
                </div>
              </div>

              {/* pricing */}
              <div className="space-y-3 pt-2 px-1 border-t border-stone-border/50">
                <div className="flex justify-between text-sm text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-plum-deep">₹{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-muted">
                  <span>GST (18%)</span>
                  <span className="font-medium text-plum-deep">₹{fmt(gst)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    Delivery
                  </span>
                  <span className="font-bold">FREE</span>
                </div>
              </div>

              {/* total */}
              <div className="mt-5 pt-4 border-t border-dashed border-stone-border flex justify-between items-center px-1">
                <span className="text-sm font-bold text-text-muted">Grand Total</span>
                <span className="text-2xl font-black text-plum-deep">₹{fmt(grandTotal)}</span>
              </div>

              {/* trust badges */}
              <div className="mt-6 pt-4 border-t border-stone-border/50 space-y-3">
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="material-symbols-outlined text-green-600 text-base">verified_user</span>
                  <span>Secure Payment Processed</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="material-symbols-outlined text-plum-deep/60 text-base">assignment_return</span>
                  <span>Easy Returns within 7 days</span>
                </div>
              </div>

              {/* Pay Now for unpaid orders */}
              {canPay && (
                <div className="mt-4 pt-4 border-t border-amber-200/60">
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-3">
                    <p className="text-xs text-amber-700 font-medium flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-sm">info</span>
                      {order.payment_status === "failed"
                        ? "Payment failed. Please retry to confirm your order."
                        : "Complete payment to confirm your order."}
                    </p>
                  </div>
                  <button
                    onClick={handlePayNow}
                    disabled={paying}
                    className="w-full bg-coral-accent hover:bg-coral-dark text-white font-bold py-3 px-6 rounded-xl transition-all text-sm uppercase tracking-wide shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">payment</span>
                        Pay ₹{fmt(grandTotal)} Now
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* download invoice */}
              <div className="mt-4 pt-4 border-t border-stone-border/30">
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloading}
                  className="w-full text-plum-deep text-xs font-bold hover:text-coral-accent transition-colors flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-plum-deep border-t-transparent rounded-full animate-spin" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">download</span>
                      Download Invoice
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


/* ── MetaField (top strip) ── */
function MetaField({ label, value, icon, mono, highlight }) {
  return (
    <div className="flex-1 sm:px-6 first:sm:pl-0 last:sm:pr-0">
      <p className="text-xs text-text-muted font-semibold uppercase tracking-wider mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <span className="material-symbols-outlined text-plum-deep text-lg">{icon}</span>}
        <p className={`text-sm font-bold ${highlight ? "text-green-600" : "text-plum-deep"} ${mono ? "font-mono tracking-wide" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}


/* ── TimelineStep ── */
function TimelineStep({ step, state, isLast, timestamp }) {
  const isDone = state === "done";
  const isActive = state === "active";
  const isPending = state === "pending";

  const dotCls = isDone
    ? "bg-green-500 text-white"
    : isActive
      ? "bg-amber-500 text-white"
      : "bg-stone-200 text-stone-400";

  const labelCls = isPending ? "text-text-muted/50" : "text-plum-deep";
  const descCls = isPending ? "text-text-muted/40" : "text-text-muted";

  return (
    <div className={`relative ${isLast ? "" : "pb-8"}`}>
      {/* vertical line */}
      {!isLast && (
        <div className={`absolute left-[-16px] top-10 bottom-0 w-0.5 ${isDone ? "bg-green-400" : "bg-stone-200"}`} />
      )}

      {/* dot */}
      <div className={`absolute left-[-24px] top-1 w-8 h-8 rounded-full flex items-center justify-center ${dotCls} shadow-sm z-10`}>
        <span className="material-symbols-outlined text-base">
          {isDone ? "check" : step.icon}
        </span>
      </div>

      {/* content */}
      <div className="ml-4">
        <p className={`font-bold text-sm ${labelCls}`}>{step.label}</p>
        <p className={`text-xs mt-0.5 ${descCls}`}>{step.desc}</p>
        {timestamp && !isPending && (
          <p className="text-xs text-text-muted/60 mt-1">{timestamp}</p>
        )}
        {isActive && (
          <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full">
            In Progress
          </span>
        )}
      </div>
    </div>
  );
}
