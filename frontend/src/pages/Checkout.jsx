import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/orders";
import { createPayment, verifyPayment } from "../api/payments";
import useRazorpay from "../hooks/useRazorpay";

const GST_RATE = 0.18;

function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function Checkout() {
  useRazorpay();

  const { items, cartLoaded, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const orderPlacedRef = useRef(false);

  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [saveDetails, setSaveDetails] = useState(false);
  const [showBusinessFields, setShowBusinessFields] = useState(false);

  const [contact, setContact] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [address, setAddress] = useState({
    street: "",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500081",
  });
  const [businessInfo, setBusinessInfo] = useState({
    companyName: "",
    gstin: "",
  });

  useEffect(() => {
    if (!user) return;
    setContact((prev) => ({
      fullName: prev.fullName || user.full_name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    if (deliveryMethod === "home" && paymentMethod === "pay_at_store") {
      setPaymentMethod("online");
    }
  }, [deliveryMethod, paymentMethod]);

  useEffect(() => {
    if (authLoading || !cartLoaded) return;
    if (!user) navigate(`/login?redirect=${encodeURIComponent("/checkout")}`);
    else if (!items.length && !orderPlacedRef.current) navigate("/cart");
  }, [authLoading, cartLoaded, user, items, navigate]);

  if (authLoading || !cartLoaded) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const subtotal = total;
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;
  const advancePercent = deliveryMethod === "pickup" ? 50 : 100;
  const payableNow = (grandTotal * advancePercent) / 100;
  const remainingAtStore = Math.max(0, grandTotal - payableNow);
  const summaryItem = items[0];

  const onContactChange = (field, value) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const onAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const onBusinessChange = (field, value) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateCheckout = () => {
    if (!contact.fullName.trim()) return "Please enter your full name.";
    if (!contact.email.trim()) return "Please enter your email address.";
    if (!contact.phone.trim()) return "Please enter your phone number.";

    if (deliveryMethod === "home") {
      if (!address.street.trim()) return "Please enter your street address for home delivery.";
      if (!address.city.trim()) return "Please enter your city for home delivery.";
      if (!address.state.trim()) return "Please select your state for home delivery.";
      if (!address.pincode.trim()) return "Please enter your pincode for home delivery.";
    }

    return "";
  };

  const handlePayment = async () => {
    setError("");
    const validationError = validateCheckout();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay SDK is not loaded yet. Please wait a moment and try again.");
      return;
    }

    try {
      setPaying(true);

      const orderPayload = {
        items: items.map((i) => {
          if (i.product_id) {
            return { product_id: i.product_id, quantity: i.quantity };
          }
          return {
            width_ft: (i.config?.width || 0) / 12,
            height_ft: (i.config?.height || 0) / 12,
            material: i.config?.material || "",
            quantity: i.quantity,
            lamination: !!i.config?.lamination,
            frame: !!i.config?.frame,
          };
        }),
      };

      const order = await placeOrder(orderPayload);
      const payment = await createPayment(order.id, {
        amount_percent: advancePercent,
      });

      const paymentDescription =
        deliveryMethod === "pickup"
          ? `Store Pickup Advance (${advancePercent}%)`
          : "Printing and Signage Order";

      const rzp = new window.Razorpay({
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency || "INR",
        order_id: payment.razorpay_order_id,
        name: "Vijetha Digital",
        description: paymentDescription,
        prefill: {
          name: contact.fullName || user?.full_name || "",
          email: contact.email || user?.email || "",
          contact: contact.phone || "",
        },
        notes: {
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          save_details: saveDetails ? "yes" : "no",
          business_order: showBusinessFields ? "yes" : "no",
          business_name: businessInfo.companyName || "",
        },
        theme: { color: "#3B2F63" },
        handler: async (response) => {
          try {
            await verifyPayment(order.id, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            orderPlacedRef.current = true;
            clearCart();
            navigate(`/order-confirmation/${order.id}`, {
              state: { deliveryMethod, paymentMethod, contact, address },
              replace: true,
            });
          } catch {
            clearCart();
            navigate("/orders", {
              state: { paymentError: "Payment could not be verified. Please check your order status." },
            });
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
          },
        },
      });

      rzp.on("payment.failed", () => {
        setPaying(false);
        navigate("/orders", {
          state: { paymentError: "Payment failed. You can retry from your orders." },
        });
      });

      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Payment failed. Please try again.");
      setPaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white font-display py-6 lg:py-8">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <nav className="flex items-center text-xs lg:text-[0.8rem] text-text-muted mb-4 overflow-x-auto whitespace-nowrap custom-scrollbar">
          <Link to="/" className="hover:text-plum-deep transition-colors duration-200">Home</Link>
          <span className="material-symbols-outlined text-sm mx-2 text-stone-400">chevron_right</span>
          <Link to="/cart" className="hover:text-plum-deep transition-colors duration-200">Shopping Cart</Link>
          <span className="material-symbols-outlined text-sm mx-2 text-stone-400">chevron_right</span>
          <span className="text-plum-deep font-semibold">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* H1: 28px mobile → 32px desktop */}
            <h1 className="text-[1.75rem] lg:text-[2rem] font-extrabold text-plum-deep tracking-tight leading-[1.25]">Checkout Details</h1>

            {error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                {error}
              </div>
            )}

            {/* Card Standard: p-6, rounded-xl, shadow-sm */}
            <section className="bg-white rounded-xl border border-stone-border shadow-sm p-6 lg:p-7">
              {/* H2: 22px mobile → 25.6px desktop */}
              <h2 className="text-[1.375rem] lg:text-[1.6rem] font-bold text-plum-deep mb-5 flex items-center gap-2 leading-[1.25]">
                <span className="material-symbols-outlined">person</span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  {/* Body Small: 13px mobile → 14px desktop */}
                  <label className="block text-[0.8125rem] lg:text-[0.875rem] font-bold text-text-muted mb-2">Full Name</label>
                  {/* Input md: h-11, rounded-xl, border-2 */}
                  <input
                    value={contact.fullName}
                    onChange={(e) => onContactChange("fullName", e.target.value)}
                    className="w-full bg-stone-50 border-2 border-stone-border rounded-xl px-4 py-3 h-11 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all duration-200"
                    placeholder="John Doe"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-[0.8125rem] lg:text-[0.875rem] font-bold text-text-muted mb-2">Email Address</label>
                  <input
                    value={contact.email}
                    onChange={(e) => onContactChange("email", e.target.value)}
                    className="w-full bg-stone-50 border-2 border-stone-border rounded-xl px-4 py-3 h-11 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all duration-200"
                    placeholder="john@example.com"
                    type="email"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[0.8125rem] lg:text-[0.875rem] font-bold text-text-muted mb-2">Phone Number</label>
                  <input
                    value={contact.phone}
                    onChange={(e) => onContactChange("phone", e.target.value)}
                    className="w-full bg-stone-50 border-2 border-stone-border rounded-xl px-4 py-3 h-11 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all duration-200"
                    placeholder="+91 98765 43210"
                    type="tel"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      checked={saveDetails}
                      onChange={(e) => setSaveDetails(e.target.checked)}
                      className="w-4 h-4 text-plum-deep border-stone-border rounded focus:ring-plum-deep"
                      type="checkbox"
                    />
                    <span className="text-sm text-text-muted font-medium">Save details for next time</span>
                  </label>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-stone-border shadow-sm p-6 lg:p-7">
              <h2 className="text-[1.375rem] lg:text-[1.6rem] font-bold text-plum-deep mb-5 flex items-center gap-2 leading-[1.25]">
                <span className="material-symbols-outlined">local_shipping</span>
                Delivery Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="relative cursor-pointer">
                  <input
                    className="peer sr-only"
                    name="delivery_method"
                    type="radio"
                    value="home"
                    checked={deliveryMethod === "home"}
                    onChange={() => setDeliveryMethod("home")}
                  />
                  {/* Card Standard: p-6, rounded-xl, hover:shadow-md */}
                  <div className="p-5 lg:p-6 rounded-xl border-2 border-stone-border bg-stone-50 hover:border-plum-deep hover:shadow-md peer-checked:border-plum-deep peer-checked:bg-plum-deep/5 peer-checked:ring-2 peer-checked:ring-plum-deep/20 transition-all duration-200 h-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-plum-deep">local_shipping</span>
                        {/* H4: 16px mobile → 18px desktop */}
                        <span className="font-bold text-plum-deep text-base lg:text-[1.125rem]">Home Delivery</span>
                      </div>
                      <span className="material-symbols-outlined text-plum-deep opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                    </div>
                    {/* Caption: 12px */}
                    <p className="text-xs text-text-muted leading-[1.5]">Delivery to your address within 3-5 business days.</p>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input
                    className="peer sr-only"
                    name="delivery_method"
                    type="radio"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                  />
                  <div className="p-5 lg:p-6 rounded-xl border-2 border-stone-border bg-stone-50 hover:border-plum-deep hover:shadow-md peer-checked:border-plum-deep peer-checked:bg-plum-deep/5 peer-checked:ring-2 peer-checked:ring-plum-deep/20 transition-all duration-200 h-full relative">
                    {/* Tiny: 11px */}
                    <div className="absolute -top-3 right-4 bg-green-600 text-white text-[0.6875rem] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">50% advance</div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-plum-deep">storefront</span>
                        <span className="font-bold text-plum-deep text-base lg:text-[1.125rem]">Store Pickup</span>
                      </div>
                      <span className="material-symbols-outlined text-plum-deep opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                    </div>
                    <p className="text-xs text-text-muted leading-[1.5]">Pay 50% now and collect from our Hyderabad store in 24 hours.</p>
                  </div>
                </label>
              </div>
            </section>

            {deliveryMethod === "home" ? (
              <section className="bg-white rounded-xl border border-stone-border shadow-sm p-6 lg:p-7">
                <h2 className="text-[1.375rem] lg:text-[1.6rem] font-bold text-plum-deep mb-5 flex items-center gap-2 leading-[1.25]">
                  <span className="material-symbols-outlined">map</span>
                  Shipping Address
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-[0.8125rem] lg:text-[0.875rem] font-bold text-text-muted mb-2">Street Address</label>
                    <input
                      value={address.street}
                      onChange={(e) => onAddressChange("street", e.target.value)}
                      className="w-full bg-stone-50 border-2 border-stone-border rounded-xl px-4 py-3 h-11 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all duration-200"
                      placeholder="123 Print Avenue, Tech Park"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-text-muted mb-2">City</label>
                      <input
                        value={address.city}
                        onChange={(e) => onAddressChange("city", e.target.value)}
                        className="w-full bg-stone-50 border border-stone-border rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                        placeholder="Hyderabad"
                        type="text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-muted mb-2">State</label>
                      <select
                        value={address.state}
                        onChange={(e) => onAddressChange("state", e.target.value)}
                        className="w-full bg-stone-50 border border-stone-border rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all text-text-dark h-[46px]"
                      >
                        <option>Telangana</option>
                        <option>Andhra Pradesh</option>
                        <option>Karnataka</option>
                        <option>Maharashtra</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-text-muted mb-2">Pincode</label>
                      <input
                        value={address.pincode}
                        onChange={(e) => onAddressChange("pincode", e.target.value)}
                        className="w-full bg-stone-50 border border-stone-border rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                        placeholder="500081"
                        type="text"
                      />
                      <p className="text-xs text-green-600 mt-1.5 font-medium">Delivery available across Telangana</p>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="bg-white rounded-[16px] border border-stone-border shadow-product-card p-5 sm:p-7">
                <h2 className="text-xl font-bold text-plum-deep mb-5 flex items-center gap-2">
                  <span className="material-symbols-outlined">map</span>
                  Pickup Location
                </h2>
                <div className="bg-stone-50 border border-stone-border rounded-[12px] p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-plum-deep/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-plum-deep text-2xl">store</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-plum-deep text-lg mb-1">Vijetha Digital Store</h3>
                      <p className="text-sm text-text-muted leading-relaxed mb-3">
                        123 Print Avenue, Tech Park, Madhapur,<br />
                        Hyderabad, Telangana 500081
                      </p>
                      <div className="inline-flex items-center gap-2 text-xs font-medium text-plum-deep bg-white border border-stone-border rounded-lg px-3 py-2">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        <span>Pickup Hours: Mon-Sat: 10 AM - 7 PM</span>
                      </div>
                      <div className="mt-4 inline-flex text-xs font-semibold text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                        Pay 50% now. Remaining 50% is due at store pickup.
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="bg-white rounded-[16px] border border-stone-border shadow-product-card overflow-hidden">
              <button
                type="button"
                onClick={() => setShowBusinessFields((prev) => !prev)}
                className="w-full flex justify-between items-center p-5 sm:p-7 bg-stone-50/50 hover:bg-stone-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-200/60 flex items-center justify-center text-plum-deep/80">
                    <span className="material-symbols-outlined text-[18px]">domain</span>
                  </div>
                  <span className="text-lg font-bold text-plum-deep">Ordering for a Business?</span>
                </div>
                <span className={`material-symbols-outlined text-plum-deep transition-transform ${showBusinessFields ? "rotate-180" : ""}`}>expand_more</span>
              </button>
              {showBusinessFields && (
                <div className="p-5 sm:p-7 border-t border-stone-border/50 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-text-muted mb-2">Company Name</label>
                    <input
                      value={businessInfo.companyName}
                      onChange={(e) => onBusinessChange("companyName", e.target.value)}
                      className="w-full bg-stone-50 border border-stone-border rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                      placeholder="Vijetha Digital Pvt Ltd"
                      type="text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-muted mb-2">GSTIN</label>
                    <input
                      value={businessInfo.gstin}
                      onChange={(e) => onBusinessChange("gstin", e.target.value)}
                      className="w-full bg-stone-50 border border-stone-border rounded-[12px] px-4 py-3 text-sm focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                      placeholder="36AAAAA0000A1Z5"
                      type="text"
                    />
                  </div>
                </div>
              )}
            </section>

            <section className="bg-white rounded-[16px] border border-stone-border shadow-product-card p-5 sm:p-7">
              <h2 className="text-xl font-bold text-plum-deep mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined">payments</span>
                Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <label className="relative cursor-pointer">
                  <input
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="peer sr-only"
                    name="payment_method"
                    type="radio"
                    value="online"
                  />
                  <div className="p-5 rounded-[12px] border border-stone-border bg-stone-50 hover:border-plum-deep peer-checked:border-plum-deep peer-checked:bg-plum-deep/5 peer-checked:ring-1 peer-checked:ring-plum-deep transition-all h-full relative">
                    <div className="absolute -top-3 right-4 bg-plum-deep text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Recommended</div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-plum-deep">Online Payment</span>
                      <span className="material-symbols-outlined text-plum-deep opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                    </div>
                    <p className="text-xs text-text-muted">
                      {deliveryMethod === "pickup"
                        ? "UPI, Cards, Netbanking for 50% pickup advance"
                        : "UPI, Cards, Netbanking via Razorpay"}
                    </p>
                  </div>
                </label>

                {deliveryMethod === "pickup" ? (
                  <label className="relative cursor-pointer">
                    <input
                      checked={paymentMethod === "pay_at_store"}
                      onChange={() => setPaymentMethod("pay_at_store")}
                      className="peer sr-only"
                      name="payment_method"
                      type="radio"
                      value="pay_at_store"
                    />
                    <div className="p-5 rounded-[12px] border border-stone-border bg-stone-50 hover:border-plum-deep peer-checked:border-plum-deep peer-checked:bg-plum-deep/5 peer-checked:ring-1 peer-checked:ring-plum-deep transition-all h-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-plum-deep">Pay at Store</span>
                        <span className="material-symbols-outlined text-plum-deep opacity-0 peer-checked:opacity-100 transition-opacity">check_circle</span>
                      </div>
                      <p className="text-xs text-text-muted">Pay 50% now to confirm. Pay remaining 50% during pickup.</p>
                    </div>
                  </label>
                ) : (
                  <div className="p-5 rounded-[12px] border border-stone-border bg-stone-50/50 opacity-60 cursor-not-allowed h-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-plum-deep">Cash on Delivery</span>
                      <span className="text-[10px] font-semibold text-orange-600">Unavailable</span>
                    </div>
                    <p className="text-xs text-text-muted">Currently unavailable. Please use online payment.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4 relative h-full">
            <div className="sticky top-24 space-y-6">
              <section className="bg-white rounded-[16px] shadow-architectural border border-stone-border p-5 sm:p-7">
                <h2 className="text-xl font-bold text-plum-deep mb-6">Order Summary</h2>

                {summaryItem && (
                  <div className="flex gap-4 mb-6 pb-6 border-b border-stone-border">
                    <div className="w-20 h-20 bg-stone-light rounded-lg overflow-hidden border border-stone-border/50 shrink-0">
                      {summaryItem.image_url ? (
                        <img alt={summaryItem.name} className="w-full h-full object-cover" src={summaryItem.image_url} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-plum-deep/40 text-3xl">inventory_2</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-plum-deep text-sm leading-tight mb-1 truncate">{summaryItem.name}</h4>
                      <p className="text-xs text-text-muted">{items.length > 1 ? `${items.length} items in order` : "Single item order"}</p>
                      <p className="text-sm font-semibold text-plum-deep mt-2">₹{formatMoney(subtotal)}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6 border-b border-stone-border pb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-semibold text-text-dark">₹{formatMoney(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">GST (18%)</span>
                    <span className="font-semibold text-text-dark">₹{formatMoney(gst)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-muted">{deliveryMethod === "pickup" ? "Pickup" : "Delivery"}</span>
                    <span className="font-bold text-green-600">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-plum-deep">Grand Total</span>
                  <span className="text-3xl font-extrabold text-plum-deep">₹{formatMoney(grandTotal)}</span>
                </div>

                {deliveryMethod === "pickup" && (
                  <div className="mb-6 rounded-xl border border-plum-deep/15 bg-plum-deep/[0.03] p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Advance Payable Now (50%)</span>
                      <span className="font-bold text-plum-deep">₹{formatMoney(payableNow)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-text-muted">Remaining at Store</span>
                      <span className="font-semibold text-text-dark">₹{formatMoney(remainingAtStore)}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={paying}
                  className="w-full bg-plum-deep text-white font-bold py-4 rounded-[12px] hover:bg-plum-darker shadow-soft-plum hover:shadow-card-hover transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {paying ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">lock</span>
                      Pay ₹{formatMoney(payableNow)}
                    </>
                  )}
                </button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-text-muted flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-green-600">verified_user</span>
                    100% Secure Checkout
                  </p>
                  <p className="text-[10px] text-text-muted mt-1 opacity-75">Razorpay secured</p>
                </div>
              </section>

              <div className="grid grid-cols-3 gap-0 bg-white border border-stone-border rounded-[16px]">
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <span className="material-symbols-outlined text-slate-400 text-3xl mb-2">workspace_premium</span>
                  <p className="text-[11px] font-bold text-slate-500 leading-tight">Quality Check</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4 border-x border-stone-border/60">
                  <span className="material-symbols-outlined text-slate-400 text-3xl mb-2">assignment_return</span>
                  <p className="text-[11px] font-bold text-slate-500 leading-tight">Easy Returns</p>
                </div>
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <span className="material-symbols-outlined text-slate-400 text-3xl mb-2">support_agent</span>
                  <p className="text-[11px] font-bold text-slate-500 leading-tight">24/7 Support</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
