import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getMyOrders } from "../api/orders";
import { createPayment, verifyPayment } from "../api/payments";
import { useAuth } from "../context/AuthContext";
import useRazorpay from "../hooks/useRazorpay";

const PAYMENT_STATUS_MAP = {
  paid:     { label: "Paid",             bg: "bg-green-50",  text: "text-green-700",  border: "border-green-200", icon: "check_circle"   },
  pending:  { label: "Payment Pending",  bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200", icon: "schedule"       },
  failed:   { label: "Payment Failed",   bg: "bg-red-50",    text: "text-red-700",    border: "border-red-200",   icon: "error"          },
  refunded: { label: "Refunded",         bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",  icon: "currency_exchange" },
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
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${s.bg} ${s.text} ${s.border}`}>
      <span className="material-symbols-outlined text-xs">{s.icon}</span>
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
    <div className="min-h-screen bg-warm-white font-display">
      <div className="max-w-[860px] mx-auto px-6 lg:px-10 py-10">

        {/* Toast */}
        {toast && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl px-4 py-3 animate-in">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span className="flex-1">{toast}</span>
            <button onClick={() => setToast("")} className="text-red-400 hover:text-red-600">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        {/* Heading */}
        <div className="mb-8">
          <nav className="flex items-center text-xs text-text-muted mb-3">
            <Link to="/" className="hover:text-plum-deep transition-colors">Home</Link>
            <span className="material-symbols-outlined text-xs mx-1">chevron_right</span>
            <span className="text-plum-deep font-semibold">My Orders</span>
          </nav>
          <h1 className="text-3xl font-extrabold text-plum-deep tracking-tight">My Orders</h1>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border border-stone-border/60 rounded-[16px] p-6 animate-pulse">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-stone-light rounded" />
                    <div className="h-3 w-24 bg-stone-light rounded" />
                  </div>
                  <div className="h-7 w-24 bg-stone-light rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && safeOrders.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 rounded-full bg-stone-light flex items-center justify-center mb-6 mx-auto">
              <span className="material-symbols-outlined text-4xl text-plum-deep/30">receipt_long</span>
            </div>
            <h2 className="text-xl font-bold text-plum-deep mb-2">No orders yet</h2>
            <p className="text-text-muted text-sm mb-8">Place your first order to see it here.</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-plum-deep hover:bg-plum-hover text-white font-bold py-3 px-8 rounded-full transition-all text-sm uppercase tracking-wide shadow-soft-plum"
            >
              <span className="material-symbols-outlined text-lg">print</span>
              Start Your Order
            </Link>
          </div>
        )}

        {/* Orders list */}
        {!loading && safeOrders.length > 0 && (
          <div className="space-y-4">
            {safeOrders.map((order) => (
              <div key={order.id} className={`bg-white border rounded-[16px] p-5 shadow-product-card hover:shadow-card-hover transition-shadow ${canPay(order) ? "border-amber-200" : "border-stone-border/60"}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-plum-deep">Order #{order.id}</span>
                      {ORDER_STATUS_MAP[order.status] && (
                        <span className="text-[10px] font-semibold text-text-muted bg-stone-light px-2 py-0.5 rounded-full">
                          {ORDER_STATUS_MAP[order.status].label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">
                      {formatDate(order.created_at)}
                    </p>
                    {order.items?.length > 0 && (
                      <p className="text-xs text-text-muted/70 mt-1">
                        {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        {order.items[0]?.product_name && ` · ${order.items[0].product_name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ""}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-2">
                    <PaymentBadge paymentStatus={order.payment_status} />
                    <p className="text-lg font-extrabold text-plum-deep">
                      ₹{Number(order.total_price || 0).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Pay Now button for unpaid orders */}
                {canPay(order) && (
                  <div className="mt-4 pt-4 border-t border-amber-200/60">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-xs text-amber-700">
                        <span className="material-symbols-outlined text-sm align-middle mr-1">info</span>
                        {order.payment_status === "failed"
                          ? "Your payment failed. Please retry to complete your order."
                          : "Complete your payment to confirm this order."}
                      </p>
                      <button
                        onClick={() => handlePayNow(order)}
                        disabled={payingOrderId === order.id}
                        className="inline-flex items-center gap-2 bg-coral-accent hover:bg-coral-dark text-white font-bold py-2.5 px-6 rounded-full transition-all text-xs uppercase tracking-wide shadow-lg hover:shadow-xl disabled:opacity-60 shrink-0"
                      >
                        {payingOrderId === order.id ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing…
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">payment</span>
                            Pay Now
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions strip */}
                <div className={`mt-4 pt-3 border-t border-stone-border/40 flex items-center ${canPay(order) ? "justify-end" : "justify-between"}`}>
                  {order.payment_status === "paid" && (
                    <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Paid {order.paid_at ? `on ${formatDate(order.paid_at)}` : ""}
                    </span>
                  )}
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-plum-deep hover:text-coral-accent transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">local_shipping</span>
                    {order.payment_status === "paid" ? "Track Order" : "View Order"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
