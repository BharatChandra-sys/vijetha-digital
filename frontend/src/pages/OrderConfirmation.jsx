import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrder } from "../api/orders";

const GST_RATE = 0.18;

function fmt(amount) {
  return Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function estDelivery() {
  const from = new Date();
  from.setDate(from.getDate() + 3);
  const to = new Date();
  to.setDate(to.getDate() + 5);
  const opts = { month: "short", day: "numeric" };
  return `${from.toLocaleDateString("en-IN", opts)} – ${to.toLocaleDateString("en-IN", opts)}`;
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Checkout passes state with delivery info
  const checkoutState = location.state || {};
  const deliveryMethod = checkoutState.deliveryMethod || "home";
  const contact = checkoutState.contact || {};
  const address = checkoutState.address || {};

  const isPickup = deliveryMethod === "pickup";

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`); return; }

    let cancelled = false;
    (async () => {
      try {
        const data = await getOrder(orderId);
        if (!cancelled) setOrder(data);
      } catch {
        if (!cancelled) setError("Could not load order details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [orderId, user, authLoading, navigate, location.pathname]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
  const isPaid = order.payment_status === "paid";
  const orderNumber = `#VJ${String(order.id).padStart(8, "0")}`;

  return (
    <div className="min-h-screen bg-beige-warm font-display relative overflow-hidden">
      {/* dot pattern bg */}
      <div className="absolute inset-0 z-0 bg-dot-pattern opacity-[0.03]" style={{ backgroundSize: "24px 24px" }} />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-10 lg:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ─── LEFT COLUMN ─── */}
          <div className="w-full lg:w-[70%] space-y-8">

            {/* ── Success hero ── */}
            <div className="bg-white rounded-[24px] p-8 lg:p-12 shadow-card-soft border border-stone-border/60">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.25)] relative">
                    <div className="absolute inset-0 rounded-full bg-green-500/10 animate-pulse" />
                    <span className="material-symbols-outlined text-green-600 text-[3.5rem] relative z-10">check_circle</span>
                  </div>
                </div>
                <div className="flex-grow space-y-4 w-full">
                  <div>
                    <p className="text-coral-accent font-bold uppercase tracking-wide text-xs mb-2">Payment Successful</p>
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-plum-deep tracking-tight mb-2">Order Confirmed!</h1>
                    <p className="text-text-muted text-base lg:text-lg">
                      Thank you for your order. We've received it and will begin processing it right away.
                    </p>
                  </div>

                  {/* meta strip */}
                  <div className="bg-stone-light/40 rounded-xl px-5 py-6 border border-stone-border/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mt-4">
                    <div>
                      <p className="text-xs text-text-muted font-medium mb-1">Order Number</p>
                      <p className="text-lg font-black text-plum-deep font-mono tracking-wide">{orderNumber}</p>
                    </div>
                    <div className="h-10 w-px bg-stone-border/60 hidden sm:block" />
                    <div className="border-t sm:border-t-0 border-stone-border/30 pt-3 sm:pt-0">
                      <p className="text-xs text-text-muted font-medium mb-1">Date</p>
                      <p className="text-sm font-bold text-plum-deep">{fmtDate(order.created_at || new Date().toISOString())}</p>
                    </div>
                    <div className="h-10 w-px bg-stone-border/60 hidden sm:block" />
                    <div className="border-t sm:border-t-0 border-stone-border/30 pt-3 sm:pt-0">
                      <p className="text-xs text-text-muted font-medium mb-1">Payment</p>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-plum-deep text-lg">credit_card</span>
                        <p className="text-sm font-bold text-plum-deep">Razorpay</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Link
                      to={`/orders/${orderId}`}
                      className="bg-plum-deep hover:bg-plum-darker text-white font-bold py-3.5 px-8 rounded-xl shadow-lg hover:shadow-[0_15px_30px_-5px_rgba(59,47,99,0.35)] transition-all duration-300 transform hover:-translate-y-[2px] flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-lg">local_shipping</span>
                      Track Order
                    </Link>
                    <Link
                      to="/products"
                      className="bg-white border-2 border-stone-border hover:border-plum-deep/30 text-plum-deep font-bold py-3.5 px-8 rounded-xl transition-all hover:bg-stone-50 flex items-center justify-center gap-2"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Pickup or Shipping details ── */}
            {isPickup ? (
              <PickupCard />
            ) : (
              <ShippingCard contact={contact} address={address} />
            )}
          </div>

          {/* ─── RIGHT COLUMN ─── */}
          <div className="w-full lg:w-[30%] space-y-6">
            {/* order summary */}
            <div className="bg-white rounded-[20px] p-6 shadow-card-soft border border-stone-border/60 sticky top-24">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-border/50">
                <h2 className="text-lg font-bold text-plum-deep">Order Summary</h2>
                {isPaid && (
                  <span className="bg-green-50 text-green-600 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200/40">PAID</span>
                )}
              </div>

              {/* item */}
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
                    <p className="text-xs text-text-muted mt-1">+{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}</p>
                  )}
                </div>
              </div>

              {/* price breakdown */}
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
                    <span className="material-symbols-outlined text-sm">{isPickup ? "store" : "local_shipping"}</span>
                    {isPickup ? "Store Pickup" : "Delivery"}
                  </span>
                  <span className="font-bold">FREE</span>
                </div>
              </div>

              {/* grand total */}
              <div className="mt-5 pt-4 border-t border-dashed border-stone-border flex justify-between items-center px-1">
                <span className="text-sm font-bold text-text-muted">Grand Total</span>
                <span className="text-2xl font-black text-plum-deep">₹{fmt(grandTotal)}</span>
              </div>

              {/* payment badge + trust */}
              <div className="mt-6 pt-4 border-t border-stone-border/50 space-y-3">
                {isPaid && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-green-600 text-lg">verified</span>
                    <span className="text-green-700 font-semibold text-sm tracking-wide">PAYMENT SUCCESSFUL</span>
                  </div>
                )}
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="material-symbols-outlined text-plum-deep/60 text-base">verified_user</span>
                  <span>Secure Payment Processed</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-text-muted">
                  <span className="material-symbols-outlined text-plum-deep/60 text-base">assignment_return</span>
                  <span>Easy Returns within 7 days</span>
                </div>
              </div>
            </div>

            {/* support card */}
            <div className="bg-plum-deep/5 rounded-[16px] p-5 border border-plum-deep/10 flex items-start gap-4">
              <div className="p-2 bg-white rounded-full shadow-sm text-plum-deep shrink-0">
                <span className="material-symbols-outlined text-xl">support_agent</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-plum-deep">Need Help?</h4>
                <p className="text-xs text-text-muted mt-1 mb-2">Have questions about your {isPickup ? "pickup" : "delivery"}?</p>
                <Link to="/support" className="text-xs font-semibold text-coral-accent hover:text-coral-dark flex items-center gap-1">
                  Contact Support
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


/* ── Store Pickup card ── */
function PickupCard() {
  return (
    <div className="bg-white rounded-[20px] shadow-card-soft border border-stone-border/60 overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-stone-border/50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-plum-deep flex items-center gap-2">
          <span className="material-symbols-outlined text-plum-deep">storefront</span>
          Pickup Information
        </h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100">
          Store Pickup
        </span>
      </div>
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* address & hours */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Pickup Location</h3>
            <p className="text-lg font-bold text-plum-deep mb-1">Vijetha Digital Store</p>
            <p className="text-sm text-text-muted leading-relaxed">
              123 Print Avenue, Tech Park, Madhapur,<br />
              Hyderabad, Telangana 500081
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Store Hours</h3>
            <div className="flex items-start gap-3 text-sm text-text-muted">
              <span className="material-symbols-outlined text-text-muted text-lg mt-0.5">schedule</span>
              <div>
                <p><span className="font-medium text-plum-deep">Mon – Sat:</span> 10:00 AM – 7:00 PM</p>
              </div>
            </div>
          </div>
          <div className="bg-plum-deep/5 border border-plum-deep/10 rounded-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-plum-deep text-lg mt-0.5">info</span>
            <p className="text-xs text-text-muted leading-relaxed">
              We will notify you via SMS and Email once your order is ready for pickup. Please carry a valid ID proof.
            </p>
          </div>
        </div>

        {/* map placeholder */}
        <div className="relative min-h-[220px] rounded-xl overflow-hidden bg-stone-light border border-stone-border group">
          <div className="absolute inset-0 bg-gradient-to-br from-plum-deep/5 to-plum-deep/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <a
              href="https://maps.google.com/?q=Vijetha+Digital+Madhapur+Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-plum-deep font-semibold py-2.5 px-5 rounded-lg shadow-lg hover:bg-plum-deep hover:text-white transition-all duration-300 transform group-hover:-translate-y-1 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">near_me</span>
              View on Maps
            </a>
          </div>
          <div className="w-full h-full flex items-center justify-center text-text-muted/30">
            <span className="material-symbols-outlined text-[100px]">map</span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ── Home Delivery card ── */
function ShippingCard({ contact, address }) {
  const name = contact?.fullName || "—";
  const phone = contact?.phone || "";
  const email = contact?.email || "";
  const street = address?.street || "";
  const city = address?.city || "Hyderabad";
  const state = address?.state || "Telangana";
  const pincode = address?.pincode || "500081";

  return (
    <div className="bg-white rounded-[20px] p-6 sm:p-8 shadow-card-soft border border-stone-border/60">
      <h2 className="text-xl font-bold text-plum-deep mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-coral-accent">location_on</span>
        Shipping Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* address */}
        <div>
          <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Shipping Address</h3>
          <div className="text-plum-deep font-medium leading-relaxed">
            <p className="font-extrabold text-lg mb-1 text-plum-darker">{name}</p>
            {street && <p>{street}</p>}
            <p>{city}{state ? `, ${state}` : ""}</p>
            {pincode && <p>{state} – {pincode}</p>}
            {phone && <p className="mt-2 text-text-muted text-sm">{phone}</p>}
          </div>
        </div>

        {/* delivery + updates */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-text-muted mb-3 uppercase tracking-wider">Delivery Method</h3>
            <div className="bg-stone-light/40 rounded-lg p-4 border border-stone-border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-plum-deep shrink-0">
                  <span className="material-symbols-outlined text-sm">local_shipping</span>
                </div>
                <div>
                  <p className="font-bold text-plum-deep text-sm">Standard Delivery</p>
                  <p className="text-xs text-text-muted mt-0.5">
                    Estimated Arrival: <span className="text-plum-deep font-semibold">{estDelivery()}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-text-muted mb-2 uppercase tracking-wider">Order Updates</h3>
            {email && (
              <p className="text-sm text-plum-deep flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600 text-lg">check_circle</span>
                Sent to <span className="font-medium">{email}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
