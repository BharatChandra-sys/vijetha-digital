import { useEffect, useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrder } from "../api/orders";
import usePageTitle from "../hooks/usePageTitle";
import { BRANCHES, BUSINESS, mapsLink, whatsappUrl } from "../config/business";

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
  usePageTitle("Order Confirmed");
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
  const pickupBranch = BRANCHES.find((b) => b.id === checkoutState.pickupBranch) || BRANCHES[0];

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
      <main id="main" className="vd-wrap py-16 font-display" aria-busy="true">
        <div className="h-40 vd-skeleton" />
      </main>
    );
  }

  if (error || !order) {
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
  const isPaid = order.payment_status === "paid";
  const orderNumber = `#VJ${String(order.id).padStart(8, "0")}`;

  return (
    <main id="main" className="font-display">
      <div className="vd-wrap pb-14 pt-8 lg:pb-20 lg:pt-14">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">

          <div className="min-w-0 space-y-10 lg:col-span-7">
            <section>
              <p className="flex items-center gap-2 text-[0.9375rem] font-semibold text-ok">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                {isPaid ? "Payment Successful" : "Order Received"}
              </p>
              <h1 className="vd-display mt-3">Order Confirmed!</h1>
              <p className="vd-lede mt-3">Thank you for your order. We've received it and will begin processing it right away.</p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-y border-line py-4 sm:grid-cols-3">
                <div><dt className="text-[0.8125rem] text-ink-2">Order Number</dt><dd className="vd-price font-semibold">{orderNumber}</dd></div>
                <div><dt className="text-[0.8125rem] text-ink-2">Date</dt><dd className="font-semibold">{fmtDate(order.created_at || new Date().toISOString())}</dd></div>
                <div><dt className="text-[0.8125rem] text-ink-2">Payment</dt><dd className="font-semibold">Razorpay</dd></div>
              </dl>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to={`/orders/${orderId}`} className="vd-btn vd-btn-lg vd-btn-ink">
                  <span className="material-symbols-outlined text-xl">local_shipping</span>
                  Track Order
                </Link>
                <Link to="/products" className="vd-btn vd-btn-lg vd-btn-quiet">Continue Shopping</Link>
              </div>
            </section>

            {/* Artwork follow-up: uploads are not sent to the server yet */}
            <section className="rounded-lg bg-shade p-5">
              <h2 className="font-semibold">Next: send us your design</h2>
              <p className="mt-1 text-[0.9375rem] text-ink-2">
                Share your artwork with order number <span className="vd-price font-semibold text-ink">{orderNumber}</span>. Our team will also contact you to confirm the details.
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <a href={whatsappUrl(`Hello Vijetha Digital, here is the design for order ${orderNumber}.`)} target="_blank" rel="noopener noreferrer" className="vd-btn vd-btn-quiet">Send on WhatsApp</a>
                <a href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Design for order ${orderNumber}`)}`} className="vd-btn vd-btn-quiet">Send by Email</a>
              </div>
            </section>

            {isPickup ? <PickupCard branch={pickupBranch} /> : <ShippingCard contact={contact} address={address} />}
          </div>

          <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)] lg:col-span-5" aria-label="Order summary">
            <div className="rounded-lg bg-surface p-5 shadow-[inset_0_0_0_1px_#DEDAD0] lg:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="vd-h3">Order Summary</h2>
                {isPaid && <span className="vd-chip !bg-[#E8F3EC] !text-[#17603C]">Paid</span>}
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
                <div className="flex justify-between gap-4"><dt className="text-ink-2">{isPickup ? "Store Pickup" : "Delivery"}</dt><dd className="font-semibold text-ok">Free</dd></div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                  <dt className="font-semibold">Grand Total</dt>
                  <dd className="text-2xl font-bold tracking-tight">₹{fmt(grandTotal)}</dd>
                </div>
              </dl>

              <ul className="mt-4 space-y-1 text-[0.8125rem] text-ink-2">
                <li>Secure Payment Processed</li>
                <li>Easy Returns within 7 days</li>
              </ul>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 px-1">
              <div>
                <p className="text-sm font-semibold">Need Help?</p>
                <p className="text-[0.8125rem] text-ink-2">Have questions about your {isPickup ? "pickup" : "delivery"}?</p>
              </div>
              <Link to="/contact" className="vd-link whitespace-nowrap text-sm">Contact Support</Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}


/* ── Store Pickup card ── */
function PickupCard({ branch }) {
  return (
    <section className="border-t border-line pt-8">
      <h2 className="vd-h3">Pickup Information</h2>
      <dl className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <dt className="text-[0.8125rem] text-ink-2">Pickup Location</dt>
          <dd className="mt-0.5">
            <span className="block font-semibold">Vijetha Digital, {branch.name}</span>
            <span className="block text-[0.9375rem] text-ink-2">{branch.address}</span>
            <a href={mapsLink(branch)} target="_blank" rel="noopener noreferrer" className="vd-link mt-1 inline-block text-sm">View on Maps</a>
          </dd>
        </div>
        <div>
          <dt className="text-[0.8125rem] text-ink-2">Store Hours</dt>
          <dd className="mt-0.5 font-semibold">{BUSINESS.hours}</dd>
        </div>
      </dl>
      <p className="vd-alert vd-alert-info mt-5">
        We will notify you via SMS and Email once your order is ready for pickup. Please carry a valid ID proof.
      </p>
    </section>
  );
}


/* ── Home Delivery card ── */
function ShippingCard({ contact, address }) {
  const name = contact?.fullName || "";
  const phone = contact?.phone || "";
  const email = contact?.email || "";
  const street = address?.street || "";
  const city = address?.city || "";
  const state = address?.state || "";
  const pincode = address?.pincode || "";
  const hasAddress = street || city || pincode;

  return (
    <section className="border-t border-line pt-8">
      <h2 className="vd-h3">Shipping Details</h2>
      <dl className="mt-4 grid gap-6 md:grid-cols-2">
        {hasAddress && (
          <div>
            <dt className="text-[0.8125rem] text-ink-2">Shipping Address</dt>
            <dd className="mt-0.5 text-[0.9375rem]">
              {name && <span className="block font-semibold">{name}</span>}
              {street && <span className="block">{street}</span>}
              <span className="block">{[city, state].filter(Boolean).join(", ")}{pincode ? ` – ${pincode}` : ""}</span>
              {phone && <span className="vd-price mt-1 block text-ink-2">{phone}</span>}
            </dd>
          </div>
        )}
        <div>
          <dt className="text-[0.8125rem] text-ink-2">Delivery Method</dt>
          <dd className="mt-0.5 text-[0.9375rem]">
            <span className="block font-semibold">Standard Delivery</span>
            <span className="block text-ink-2">Estimated Arrival: {estDelivery()}</span>
            {email && <span className="mt-2 block text-ink-2">Order updates sent to {email}</span>}
          </dd>
        </div>
      </dl>
    </section>
  );
}
