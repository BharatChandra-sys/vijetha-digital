import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrder, downloadInvoice } from "../api/orders";
import { createPayment, verifyPayment } from "../api/payments";
import useRazorpay from "../hooks/useRazorpay";
import usePageTitle from "../hooks/usePageTitle";
import Breadcrumbs from "../components/store/Breadcrumbs";
import { BUSINESS } from "../config/business";

const GST_RATE = 0.18;

/* ── helpers ── */
function fmt(n) {
  return Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
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
  usePageTitle("Track Your Order");
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
        theme: { color: "#1A2332" },
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
      <main id="main" className="vd-wrap py-16 font-display" aria-busy="true">
        <div className="h-40 vd-skeleton" />
      </main>
    );
  }

  /* ── order could not be loaded at all ── */
  if (!order) {
    return (
      <main id="main" className="vd-wrap min-h-[50vh] py-16 font-display">
        <h1 className="vd-h2">{error || "Order not found"}</h1>
        <Link to="/orders" className="vd-btn vd-btn-ink mt-6">View all orders</Link>
      </main>
    );
  }

  const subtotal = order.subtotal || 0;
  const gst = +(subtotal * GST_RATE).toFixed(2);
  const grandTotal = order.total_price || subtotal + gst;
  const orderNumber = `#VJ${String(order.id).padStart(8, "0")}`;
  const orderStatus = order.status || "placed";
  const isCancelled = orderStatus === "cancelled" || orderStatus === "refunded";
  const statusLabel = isCancelled
    ? (orderStatus === "cancelled" ? "Cancelled" : "Refunded")
    : orderStatus === "delivered" ? "Delivered" : "In Progress";
  const addressLines = [
    order.delivery_address,
    [order.delivery_city, order.delivery_state].filter(Boolean).join(", "),
    order.delivery_postal_code,
  ].filter(Boolean);

  return (
    <main id="main" className="font-display">
      <div className="vd-wrap pb-14 pt-5 lg:pb-20">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "My Orders", to: "/orders" }, { label: orderNumber }]} />
        <h1 className="vd-h1 mt-4">Track Your Order</h1>

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-4 lg:grid-cols-4">
          <div><dt className="text-[0.8125rem] text-ink-2">Order Number</dt><dd className="vd-price font-semibold">{orderNumber}</dd></div>
          <div><dt className="text-[0.8125rem] text-ink-2">Placed On</dt><dd className="font-semibold">{fmtDate(order.created_at)}</dd></div>
          <div><dt className="text-[0.8125rem] text-ink-2">Payment Method</dt><dd className="font-semibold">Razorpay</dd></div>
          <div><dt className="text-[0.8125rem] text-ink-2">Est. Delivery</dt><dd className="font-semibold">{estDelivery(order.created_at)}</dd></div>
        </dl>

        {error && (
          <div className="vd-alert vd-alert-error mt-5" role="alert">
            <span className="material-symbols-outlined text-lg">error</span>{error}
          </div>
        )}

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="min-w-0 space-y-10 lg:col-span-7">
            <section>
              <h2 className="vd-h3 mb-5">Order Status</h2>
              <ol>
                {TIMELINE_STEPS.map((step, idx) => (
                  <TimelineStep
                    key={step.key}
                    step={step}
                    state={isCancelled ? "pending" : getStepState(step.key, orderStatus)}
                    isLast={idx === TIMELINE_STEPS.length - 1}
                  />
                ))}
              </ol>
              {isCancelled && (
                <div className="vd-alert vd-alert-error mt-5">
                  <span className="material-symbols-outlined text-lg">cancel</span>
                  This order has been {orderStatus === "cancelled" ? "cancelled" : "refunded"}.
                </div>
              )}
            </section>

            <section className="grid gap-8 border-t border-line pt-8 md:grid-cols-2">
              <div>
                <h2 className="text-[0.9375rem] font-semibold">Delivery Address</h2>
                <p className="mt-2 font-medium">{user?.full_name || "Customer"}</p>
                {addressLines.length > 0
                  ? addressLines.map((line) => <p key={line} className="text-[0.9375rem] text-ink-2">{line}</p>)
                  : <p className="text-[0.9375rem] text-ink-2">Store pickup, or address confirmed by our team</p>}
              </div>
              <div>
                <h2 className="text-[0.9375rem] font-semibold">Courier Information</h2>
                {orderStatus === "shipped" || orderStatus === "delivered" ? (
                  <p className="mt-2 text-[0.9375rem] text-ink-2">
                    Handed over to our delivery partner. Call <a className="vd-link vd-price text-ink" href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> for courier and tracking details.
                  </p>
                ) : (
                  <p className="mt-2 text-[0.9375rem] text-ink-2">Courier details will appear once the order is shipped.</p>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-4 rounded-lg bg-shade p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">Need Help with your order?</p>
                <p className="text-sm text-ink-2">Our support team is available 24/7 to assist you.</p>
              </div>
              <Link to="/contact" className="vd-btn vd-btn-outline flex-shrink-0">Contact Support</Link>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)] lg:col-span-5" aria-label="Order summary">
            <div className="rounded-lg bg-surface p-5 shadow-[inset_0_0_0_1px_#DEDAD0] lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="vd-h3">Order Summary</h2>
                <span className={`vd-chip ${isCancelled ? "!bg-[#FBEDEB] !text-[#8E2A20]" : orderStatus === "delivered" ? "!bg-[#E8F3EC] !text-[#17603C]" : ""}`}>{statusLabel}</span>
              </div>

              <ul className="mt-4 space-y-3 border-b border-line pb-4">
                {(order.items || []).map((item, idx) => (
                  <li key={item.id ?? idx} className="flex gap-3">
                    <div className="vd-frame h-14 w-14 flex-shrink-0">
                      {item.product_image ? (
                        <img src={item.product_image} alt="" width="56" height="56" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-ink-3"><span className="material-symbols-outlined text-2xl">print</span></span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.product_name || item.material || "Custom Signage"}</p>
                      {item.product_category && <p className="truncate text-[0.8125rem] text-ink-2">{item.product_category}</p>}
                      <p className="vd-price text-[0.8125rem] text-ink-2">₹{fmt(item.unit_price)}{item.quantity > 1 ? ` × ${item.quantity}` : ""}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <dl className="vd-price mt-3 space-y-2 text-[0.9375rem]">
                <div className="flex justify-between gap-4"><dt className="text-ink-2">Subtotal</dt><dd className="font-medium">₹{fmt(subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-2">GST (18%)</dt><dd className="font-medium">₹{fmt(gst)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-2">Delivery</dt><dd className="font-semibold text-ok">Free</dd></div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                  <dt className="font-semibold">Grand Total</dt>
                  <dd className="text-2xl font-bold tracking-tight">₹{fmt(grandTotal)}</dd>
                </div>
              </dl>

              {canPay && (
                <div className="mt-4">
                  <p className="vd-alert vd-alert-info">
                    {order.payment_status === "failed"
                      ? "Payment failed. Please retry to confirm your order."
                      : "Complete payment to confirm your order."}
                  </p>
                  <button onClick={handlePayNow} disabled={paying} className="vd-btn vd-btn-lg vd-btn-accent vd-price mt-3 w-full">
                    {paying ? "Processing…" : `Pay ₹${fmt(grandTotal)} Now`}
                  </button>
                </div>
              )}

              <button onClick={handleDownloadInvoice} disabled={downloading} className="vd-btn vd-btn-quiet mt-3 w-full">
                <span className="material-symbols-outlined text-lg">download</span>
                {downloading ? "Generating…" : "Download Invoice"}
              </button>

              <ul className="mt-4 space-y-1 text-[0.8125rem] text-ink-2">
                <li>Secure Payment Processed</li>
                <li>Easy Returns within 7 days</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ── TimelineStep ── */
function TimelineStep({ step, state, isLast }) {
  const isDone = state === "done";
  const isActive = state === "active";
  const isPending = state === "pending";

  return (
    <li className={`relative flex gap-4 ${isLast ? "" : "pb-6"}`} aria-current={isActive ? "step" : undefined}>
      {!isLast && <span className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${isDone ? "bg-ok" : "bg-line"}`} aria-hidden="true" />}
      <span className={`relative flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${isDone ? "bg-ok text-white" : isActive ? "bg-night text-white" : "bg-shade text-ink-3"}`}>
        <span className="material-symbols-outlined text-lg">{isDone ? "check" : step.icon}</span>
      </span>
      <div className="min-w-0 pt-0.5">
        <p className={`flex flex-wrap items-center gap-2 font-semibold ${isPending ? "text-ink-3" : ""}`}>
          {step.label}
          {isActive && <span className="vd-chip">In Progress</span>}
        </p>
        <p className={`text-[0.9375rem] leading-snug ${isPending ? "text-ink-3" : "text-ink-2"}`}>{step.desc}</p>
      </div>
    </li>
  );
}
