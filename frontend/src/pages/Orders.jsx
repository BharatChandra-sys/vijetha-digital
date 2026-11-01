import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/orders";
import { createPayment, verifyPayment } from "../api/payments";
import { useAuth } from "../context/AuthContext";
import useRazorpay from "../hooks/useRazorpay";
import usePageTitle from "../hooks/usePageTitle";
import Breadcrumbs from "../components/store/Breadcrumbs";

const PAYMENT_STATUS_MAP = {
  paid:     { label: "Paid",            text: "text-ok",        icon: "check_circle" },
  pending:  { label: "Payment Pending", text: "text-ink-2",     icon: "schedule" },
  failed:   { label: "Payment Failed",  text: "text-accent-dark", icon: "error" },
  refunded: { label: "Refunded",        text: "text-ink-2",     icon: "currency_exchange" },
};

const ORDER_STATUS_MAP = {
  placed:        { label: "Placed",        icon: "receipt_long" },
  confirmed:     { label: "Confirmed",     icon: "check_circle" },
  printing:      { label: "Printing",      icon: "print" },
  quality_check: { label: "Quality Check", icon: "verified" },
  shipped:       { label: "Shipped",       icon: "local_shipping" },
  delivered:     { label: "Delivered",      icon: "inventory_2" },
  cancelled:     { label: "Cancelled",     icon: "cancel" },
  refunded:      { label: "Refunded",      icon: "currency_exchange" },
};

function PaymentBadge({ paymentStatus }) {
  const s = PAYMENT_STATUS_MAP[paymentStatus] || PAYMENT_STATUS_MAP.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-[0.8125rem] font-medium ${s.text}`}>
      <span className="material-symbols-outlined text-sm">{s.icon}</span>
      {s.label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Orders() {
  useRazorpay();
  usePageTitle("My Orders");
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [orders, setOrders] = useState(null);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [toast, setToast] = useState(location.state?.paymentError || "");

  // Clear location state so toast doesn't re-appear on back navigation
  useEffect(() => {
    if (location.state?.paymentError) {
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 8000);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchOrders = () => {
    getMyOrders().then(setOrders).catch(() => setOrders([]));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handlePayNow = async (order) => {
    if (!window.Razorpay) {
      setToast("Payment gateway is loading. Please wait a moment.");
      return;
    }

    try {
      setPayingOrderId(order.id);
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
            setToast("Payment verification failed. Please contact support.");
            fetchOrders();
          }
        },
        modal: {
          ondismiss: () => {
            setPayingOrderId(null);
            fetchOrders();
          },
        },
      });

      rzp.on("payment.failed", () => {
        setToast("Payment failed. Please try again.");
        setPayingOrderId(null);
        fetchOrders();
      });

      rzp.open();
    } catch (err) {
      setToast(err?.response?.data?.detail || "Could not initiate payment. Try again.");
      setPayingOrderId(null);
    }
  };

  const canPay = (order) =>
    (order.payment_status === "pending" || order.payment_status === "failed") &&
    order.status !== "cancelled";

  const loading = orders === null;
  const safeOrders = orders || [];

  return (
    <main id="main" className="font-display">
      <div className="mx-auto w-full max-w-[920px] pb-14 pt-5 lg:pb-20" style={{ paddingInline: "clamp(1rem, 4vw, 2rem)" }}>
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "My Orders" }]} />
        <h1 className="vd-h1 mt-4">My Orders</h1>

        {toast && (
          <div className="vd-alert vd-alert-error mt-5 items-center" role="alert">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span className="flex-1">{toast}</span>
            <button onClick={() => setToast("")} className="-my-2 -mr-2 flex h-11 w-11 items-center justify-center" aria-label="Dismiss message">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        {loading && (
          <div className="mt-6 space-y-3" aria-busy="true">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 vd-skeleton" />)}
          </div>
        )}

        {!loading && safeOrders.length === 0 && (
          <div className="mt-6 border-t border-line pt-10">
            <h2 className="vd-h3">No orders yet</h2>
            <p className="mt-1 text-ink-2">Place your first order to see it here.</p>
            <Link to="/products" className="vd-btn vd-btn-lg vd-btn-accent mt-6">Start Your Order</Link>
          </div>
        )}

        {!loading && safeOrders.length > 0 && (
          <ul className="mt-6 border-t border-line">
            {safeOrders.map((order) => (
              <li key={order.id} className="border-b border-line py-5">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="vd-price font-semibold">Order #{order.id}</span>
                      {ORDER_STATUS_MAP[order.status] && <span className="vd-chip">{ORDER_STATUS_MAP[order.status].label}</span>}
                    </p>
                    <p className="mt-1 text-sm text-ink-2">{formatDate(order.created_at)}</p>
                    {order.items?.length > 0 && (
                      <p className="mt-0.5 text-sm text-ink-2">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        {order.items[0]?.product_name && ` · ${order.items[0].product_name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="vd-price text-[1.0625rem] font-bold">₹{Number(order.total_price || 0).toLocaleString("en-IN")}</p>
                    <PaymentBadge paymentStatus={order.payment_status} />
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  {canPay(order) ? (
                    <p className="min-w-0 flex-1 text-sm text-ink-2">
                      {order.payment_status === "failed"
                        ? "Your payment failed. Please retry to complete your order."
                        : "Complete your payment to confirm this order."}
                    </p>
                  ) : (
                    order.payment_status === "paid" && order.paid_at && (
                      <p className="text-sm text-ink-2">Paid on {formatDate(order.paid_at)}</p>
                    )
                  )}
                  <div className="ml-auto flex items-center gap-2">
                    <Link to={`/orders/${order.id}`} className="vd-btn vd-btn-quiet">
                      {order.payment_status === "paid" ? "Track Order" : "View Order"}
                    </Link>
                    {canPay(order) && (
                      <button onClick={() => handlePayNow(order)} disabled={payingOrderId === order.id} className="vd-btn vd-btn-accent">
                        {payingOrderId === order.id ? "Processing…" : "Pay Now"}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
