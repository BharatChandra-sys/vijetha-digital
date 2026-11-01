import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../api/orders";
import { createPayment, verifyPayment } from "../api/payments";
import useRazorpay from "../hooks/useRazorpay";
import usePageTitle from "../hooks/usePageTitle";
import Breadcrumbs from "../components/store/Breadcrumbs";
import StickyBar from "../components/store/StickyBar";
import { BRANCHES, BUSINESS } from "../config/business";

const GST_RATE = 0.18;

function formatMoney(amount) {
  return Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/* One-line description of what the customer configured */
function describeItem(item) {
  const cfg = item.config || {};
  const parts = [];
  if (cfg.width && cfg.height) parts.push(`${cfg.width} × ${cfg.height} ft`);
  if (cfg.size) parts.push(cfg.size);
  if (cfg.finish) parts.push(cfg.finish);
  if (!(cfg.width && cfg.height)) parts.push(`Qty ${Number(item.quantity).toLocaleString("en-IN")}`);
  return parts.join(" · ");
}

export default function Checkout() {
  useRazorpay();
  usePageTitle("Checkout");

  const { items, cartLoaded, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [pickupBranch, setPickupBranch] = useState(BRANCHES[0].id);
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
    pincode: "",
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
      <main id="main" className="vd-wrap py-16 font-display" aria-busy="true">
        <div className="h-40 vd-skeleton" />
      </main>
    );
  }

  const subtotal = total;
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;
  const advancePercent = deliveryMethod === "pickup" ? 50 : 100;
  const payableNow = (grandTotal * advancePercent) / 100;
  const remainingAtStore = Math.max(0, grandTotal - payableNow);

  const clearFieldError = (field) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
  };

  const onContactChange = (field, value) => {
    clearFieldError(field);
    setContact((prev) => ({ ...prev, [field]: value }));
  };

  const onAddressChange = (field, value) => {
    clearFieldError(field);
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const onBusinessChange = (field, value) => {
    clearFieldError(field);
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const validateCheckout = () => {
    const errors = {};
    if (!contact.fullName.trim()) errors.fullName = "Please enter your full name.";
    if (!contact.email.trim()) errors.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) errors.email = "Please enter a valid email, like name@example.com.";
    if (!contact.phone.trim()) errors.phone = "Please enter your phone number.";
    else if (contact.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a 10-digit phone number.";

    if (deliveryMethod === "home") {
      if (!address.street.trim()) errors.street = "Please enter your street address for home delivery.";
      if (!address.city.trim()) errors.city = "Please enter your city for home delivery.";
      if (!address.state.trim()) errors.state = "Please select your state for home delivery.";
      if (!address.pincode.trim()) errors.pincode = "Please enter your pincode for home delivery.";
      else if (!/^\d{6}$/.test(address.pincode.trim())) errors.pincode = "Pincode must be 6 digits.";
    }

    if (showBusinessFields && businessInfo.gstin.trim() && businessInfo.gstin.trim().length !== 15) {
      errors.gstin = "GSTIN must be 15 characters.";
    }

    return errors;
  };

  /* Everything the shop needs that has no dedicated order field */
  const buildOrderNotes = () => {
    const branch = BRANCHES.find((b) => b.id === pickupBranch);
    const lines = [
      deliveryMethod === "pickup" ? `Store pickup: ${branch?.name}` : "Home delivery",
      `Customer: ${contact.fullName.trim()}, ${contact.phone.trim()}, ${contact.email.trim()}`,
    ];
    if (showBusinessFields && (businessInfo.companyName.trim() || businessInfo.gstin.trim())) {
      lines.push(`Business: ${businessInfo.companyName.trim()} GSTIN ${businessInfo.gstin.trim().toUpperCase()}`);
    }
    items.forEach((item) => {
      const designFile = item.config?.design_file;
      lines.push(`${item.name}: ${describeItem(item)}${designFile ? `, design file ${designFile} (collect from customer)` : ""}`);
    });
    return lines.join("\n");
  };

  const handlePayment = async () => {
    setError("");
    const errors = validateCheckout();
    setFieldErrors(errors);
    const firstInvalid = Object.keys(errors).find((key) => errors[key]);
    if (firstInvalid) {
      const input = document.getElementById(firstInvalid);
      input?.focus();
      input?.scrollIntoView({ block: "center" });
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay SDK is not loaded yet. Please wait a moment and try again.");
      return;
    }

    try {
      setPaying(true);

      const orderPayload = {
        delivery_notes: buildOrderNotes(),
        ...(deliveryMethod === "home"
          ? {
              delivery_address: address.street.trim(),
              delivery_city: address.city.trim(),
              delivery_state: address.state,
              delivery_postal_code: address.pincode.trim(),
            }
          : {}),
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
          ...(deliveryMethod === "pickup" ? { pickup_branch: pickupBranch } : {}),
        },
        theme: { color: "#1A2332" },
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
              state: { deliveryMethod, paymentMethod, contact, address, pickupBranch },
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
    <main id="main" className="font-display pb-[var(--sticky-bar,0px)]">
      <div className="vd-wrap pb-14 pt-5 lg:pb-20">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Shopping Cart", to: "/cart" }, { label: "Checkout" }]} />
        <h1 className="vd-h1 mt-4">Checkout Details</h1>

        <div className="mt-6 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <form className="min-w-0 space-y-10 lg:col-span-7" onSubmit={(e) => { e.preventDefault(); handlePayment(); }} noValidate>

            {error && (
              <div className="vd-alert vd-alert-error" role="alert">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <CheckoutSection step={1} title="Contact Information">
              <div className="grid gap-4 md:grid-cols-2">
                <Field id="fullName" label="Full Name" error={fieldErrors.fullName}>
                  <input id="fullName" name="name" type="text" autoComplete="name" className="vd-input"
                    aria-invalid={!!fieldErrors.fullName} placeholder="Your full name"
                    value={contact.fullName} onChange={(e) => onContactChange("fullName", e.target.value)} />
                </Field>
                <Field id="email" label="Email Address" error={fieldErrors.email}>
                  <input id="email" name="email" type="email" autoComplete="email" spellCheck={false} className="vd-input"
                    aria-invalid={!!fieldErrors.email} placeholder="you@example.com"
                    value={contact.email} onChange={(e) => onContactChange("email", e.target.value)} />
                </Field>
                <Field id="phone" label="Phone Number" error={fieldErrors.phone} className="md:col-span-2" hint="We call or WhatsApp this number about your artwork and delivery.">
                  <input id="phone" name="tel" type="tel" inputMode="tel" autoComplete="tel" className="vd-input"
                    aria-invalid={!!fieldErrors.phone} placeholder="+91 98765 43210"
                    value={contact.phone} onChange={(e) => onContactChange("phone", e.target.value)} />
                </Field>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[0.9375rem] md:col-span-2">
                  <input type="checkbox" className="h-5 w-5 accent-[#1A2332]" checked={saveDetails} onChange={(e) => setSaveDetails(e.target.checked)} />
                  Save details for next time
                </label>
              </div>
            </CheckoutSection>

            <CheckoutSection step={2} title="Delivery Method">
              <div className="grid gap-3 md:grid-cols-2">
                <RadioCard name="delivery_method" value="home" checked={deliveryMethod === "home"} onChange={() => setDeliveryMethod("home")}
                  icon="local_shipping" title="Home Delivery" desc="Delivery to your address within 3-5 business days." />
                <RadioCard name="delivery_method" value="pickup" checked={deliveryMethod === "pickup"} onChange={() => setDeliveryMethod("pickup")}
                  icon="storefront" title="Store Pickup" badge="50% advance" desc="Pay 50% now and collect from our Hyderabad store in 24 hours." />
              </div>

              {deliveryMethod === "home" ? (
                <div className="mt-6">
                  <h3 className="mb-3 text-[0.9375rem] font-semibold">Shipping Address</h3>
                  <div className="space-y-4">
                    <Field id="street" label="Street Address" error={fieldErrors.street}>
                      <input id="street" name="street-address" type="text" autoComplete="street-address" className="vd-input"
                        aria-invalid={!!fieldErrors.street} placeholder="Shop or house number, building, street"
                        value={address.street} onChange={(e) => onAddressChange("street", e.target.value)} />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field id="city" label="City" error={fieldErrors.city}>
                        <input id="city" name="city" type="text" autoComplete="address-level2" className="vd-input"
                          aria-invalid={!!fieldErrors.city} placeholder="Hyderabad"
                          value={address.city} onChange={(e) => onAddressChange("city", e.target.value)} />
                      </Field>
                      <Field id="state" label="State" error={fieldErrors.state}>
                        <select id="state" name="state" autoComplete="address-level1" className="vd-input"
                          value={address.state} onChange={(e) => onAddressChange("state", e.target.value)}>
                          <option>Telangana</option>
                          <option>Andhra Pradesh</option>
                          <option>Karnataka</option>
                          <option>Maharashtra</option>
                        </select>
                      </Field>
                      <Field id="pincode" label="Pincode" error={fieldErrors.pincode} hint={fieldErrors.pincode ? null : "Delivery available across Telangana"}>
                        <input id="pincode" name="postal-code" type="text" inputMode="numeric" maxLength={6} autoComplete="postal-code" className="vd-input vd-price"
                          aria-invalid={!!fieldErrors.pincode} placeholder="6 digits"
                          value={address.pincode} onChange={(e) => onAddressChange("pincode", e.target.value.replace(/\D/g, ""))} />
                      </Field>
                    </div>
                  </div>
                </div>
              ) : (
                <fieldset className="mt-6">
                  <legend className="mb-3 text-[0.9375rem] font-semibold">Pickup Location</legend>
                  <div className="space-y-2">
                    {BRANCHES.map((b) => (
                      <label key={b.id} className="relative block cursor-pointer">
                        <input type="radio" name="pickup_branch" className="sr-only" checked={pickupBranch === b.id} onChange={() => setPickupBranch(b.id)} />
                        <span className="vd-option !p-4">
                          <span className="material-symbols-outlined vd-option-tick !right-3 !top-3 text-xl" aria-hidden="true">check_circle</span>
                          <span className="block pr-8 text-[0.9375rem] font-semibold">{b.name}</span>
                          <span className="mt-0.5 block pr-8 text-sm leading-snug text-ink-2">{b.address}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="vd-hint">Pickup Hours: {BUSINESS.hours}</p>
                  <p className="vd-alert vd-alert-ok mt-3">Pay 50% now. Remaining 50% is due at store pickup.</p>
                </fieldset>
              )}
            </CheckoutSection>

            <CheckoutSection step={3} title="Payment Method">
              <div className="grid gap-3 md:grid-cols-2">
                <RadioCard name="payment_method" value="online" checked={paymentMethod === "online"} onChange={() => setPaymentMethod("online")}
                  title="Online Payment" badge="Recommended"
                  desc={deliveryMethod === "pickup" ? "UPI, Cards, Netbanking for 50% pickup advance" : "UPI, Cards, Netbanking via Razorpay"} />
                {deliveryMethod === "pickup" ? (
                  <RadioCard name="payment_method" value="pay_at_store" checked={paymentMethod === "pay_at_store"} onChange={() => setPaymentMethod("pay_at_store")}
                    title="Pay at Store" desc="Pay 50% now to confirm. Pay remaining 50% during pickup." />
                ) : (
                  <div className="rounded-lg bg-shade p-4 opacity-80" aria-disabled="true">
                    <p className="flex items-center justify-between gap-2 text-[0.9375rem] font-semibold">
                      Cash on Delivery
                      <span className="text-[0.8125rem] font-medium text-ink-2">Unavailable</span>
                    </p>
                    <p className="mt-1 text-sm leading-snug text-ink-2">Currently unavailable. Please use online payment.</p>
                  </div>
                )}
              </div>
            </CheckoutSection>

            {/* Optional: business billing */}
            <div className="border-y border-line">
              <button
                type="button"
                onClick={() => setShowBusinessFields((prev) => !prev)}
                aria-expanded={showBusinessFields}
                className="flex min-h-[56px] w-full items-center justify-between gap-3 text-left"
              >
                <span className="text-[0.9375rem] font-semibold">Ordering for a Business? <span className="font-normal text-ink-2">Add your GSTIN</span></span>
                <span className={`material-symbols-outlined text-xl text-ink-3 transition-transform ${showBusinessFields ? "rotate-180" : ""}`}>expand_more</span>
              </button>
              {showBusinessFields && (
                <div className="grid gap-4 pb-5 md:grid-cols-2">
                  <Field id="company" label="Company Name">
                    <input id="company" name="organization" type="text" autoComplete="organization" className="vd-input"
                      placeholder="Your company name"
                      value={businessInfo.companyName} onChange={(e) => onBusinessChange("companyName", e.target.value)} />
                  </Field>
                  <Field id="gstin" label="GSTIN" error={fieldErrors.gstin}>
                    <input id="gstin" name="gstin" type="text" maxLength={15} autoComplete="off" spellCheck={false} className="vd-input uppercase"
                      aria-invalid={!!fieldErrors.gstin} placeholder="36AAAAA0000A1Z5"
                      value={businessInfo.gstin} onChange={(e) => onBusinessChange("gstin", e.target.value)} />
                  </Field>
                </div>
              )}
            </div>
          </form>

          {/* Summary */}
          <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.25rem)] lg:col-span-5" aria-label="Order summary">
            <div className="rounded-lg bg-surface p-5 shadow-[inset_0_0_0_1px_#DEDAD0] lg:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="vd-h3">Order Summary</h2>
                <Link to="/cart" className="vd-link text-sm">Edit cart</Link>
              </div>

              <ul className="mt-4 space-y-3 border-b border-line pb-4">
                {items.map((item, idx) => (
                  <li key={`${item.product_id}-${idx}`} className="flex gap-3">
                    <div className="vd-frame h-14 w-14 flex-shrink-0">
                      {item.image_url ? (
                        <img alt="" src={item.image_url} width="56" height="56" />
                      ) : (
                        <span className="flex h-full items-center justify-center text-ink-3">
                          <span className="material-symbols-outlined text-2xl">inventory_2</span>
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{item.name}</p>
                      <p className="truncate text-[0.8125rem] text-ink-2">{describeItem(item)}</p>
                    </div>
                    <p className="vd-price whitespace-nowrap text-sm font-semibold">₹{formatMoney(Number(item.unit_price) * Number(item.quantity))}</p>
                  </li>
                ))}
              </ul>

              <dl className="vd-price mt-3 space-y-2 text-[0.9375rem]">
                <div className="flex justify-between gap-4"><dt className="text-ink-2">Subtotal</dt><dd className="font-medium">₹{formatMoney(subtotal)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-2">GST (18%)</dt><dd className="font-medium">₹{formatMoney(gst)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-ink-2">{deliveryMethod === "pickup" ? "Pickup" : "Delivery"}</dt><dd className="font-semibold text-ok">Free</dd></div>
                <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                  <dt className="font-semibold">Grand Total</dt>
                  <dd className="text-2xl font-bold tracking-tight">₹{formatMoney(grandTotal)}</dd>
                </div>
                {deliveryMethod === "pickup" && (
                  <>
                    <div className="flex justify-between gap-4 pt-1"><dt className="font-semibold">Advance Payable Now (50%)</dt><dd className="font-semibold">₹{formatMoney(payableNow)}</dd></div>
                    <div className="flex justify-between gap-4"><dt className="text-ink-2">Remaining at Store</dt><dd className="font-medium">₹{formatMoney(remainingAtStore)}</dd></div>
                  </>
                )}
              </dl>

              <button onClick={handlePayment} disabled={paying} className="vd-btn vd-btn-lg vd-btn-accent vd-price mt-5 hidden w-full lg:inline-flex">
                {paying ? "Processing…" : <><span className="material-symbols-outlined text-xl">lock</span>Pay ₹{formatMoney(payableNow)}</>}
              </button>

              <p className="mt-3 text-center text-[0.8125rem] text-ink-2">100% Secure Checkout · Razorpay secured</p>
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
          <p className="text-[0.75rem] leading-tight text-ink-2">{deliveryMethod === "pickup" ? "Pay now (50%)" : "Total incl. GST"}</p>
          <p className="vd-price truncate text-lg font-bold leading-tight">₹{formatMoney(payableNow)}</p>
        </div>
        <button onClick={handlePayment} disabled={paying} className="vd-btn vd-btn-accent flex-shrink-0 !min-h-[48px] px-6">
          {paying ? "Processing…" : <><span className="material-symbols-outlined text-xl">lock</span>Pay Now</>}
        </button>
      </StickyBar>
    </main>
  );
}

function CheckoutSection({ step, title, children }) {
  return (
    <section>
      <h2 className="vd-h3 mb-4 flex items-baseline gap-2.5 border-b border-line pb-3">
        <span className="vd-price text-ink-3">{step}</span>{title}
      </h2>
      {children}
    </section>
  );
}

function Field({ id, label, error, hint, className = "", children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="vd-label">{label}</label>
      {children}
      {error && <p className="vd-error" role="alert">{error}</p>}
      {!error && hint && <p className="vd-hint">{hint}</p>}
    </div>
  );
}

function RadioCard({ name, value, checked, onChange, icon, title, desc, badge }) {
  return (
    <label className="relative block cursor-pointer">
      <input type="radio" name={name} value={value} className="sr-only" checked={checked} onChange={onChange} />
      <span className="vd-option !justify-start !p-4">
        <span className="material-symbols-outlined vd-option-tick !right-3 !top-3 text-xl" aria-hidden="true">check_circle</span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 pr-7 text-[0.9375rem] font-semibold">
          {icon && <span className="material-symbols-outlined text-xl text-ink-2" aria-hidden="true">{icon}</span>}
          {title}
          {badge && <span className="vd-chip">{badge}</span>}
        </span>
        <span className="mt-1 block text-sm leading-snug text-ink-2">{desc}</span>
      </span>
    </label>
  );
}
