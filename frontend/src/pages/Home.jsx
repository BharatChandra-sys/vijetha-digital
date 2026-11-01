import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import ProductCarousel from "../components/product/ProductCarousel";
import usePageTitle from "../hooks/usePageTitle";
import {
  BUSINESS, BRANCHES, CATEGORIES, CATEGORY_LINK, CATEGORY_PHOTO, isTallCategory, mapsLink, rupees, unitLabel,
} from "../config/business";

const SERVICES = [
  { icon: "badge",     title: "Business Cards",     to: CATEGORY_LINK("Promotional Items"), desc: "Premium cardstocks, matte, gloss, and spot UV finishes for professional networking." },
  { icon: "ad_units",  title: "Flex Printing",      to: CATEGORY_LINK("Printing Services"), desc: "High-resolution large format banners and hoardings for maximum visibility." },
  { icon: "lightbulb", title: "LED Boards",         to: CATEGORY_LINK("Sign Boards"),       desc: "Illuminated signage solutions that make your business shine day and night." },
  { icon: "menu_book", title: "Marketing Material", to: CATEGORY_LINK("Promotional Items"), desc: "Brochures, flyers, and pamphlets designed to convert customers." },
];

const FEATURES = ["High Quality Offset", "Large Format Experts", "Fast Turnaround", "GST Billing Available"];

const TRUST = [
  { stat: "500+",   label: "Happy Businesses",   sub: "Across Hyderabad"   },
  { stat: "24–48h", label: "Turnaround Time",    sub: "Print to delivery"  },
  { stat: "GST",    label: "Tax Invoice",        sub: "On every order"     },
  { stat: "100%",   label: "Quality Guaranteed", sub: "Or we reprint free" },
];

const STEPS = [
  { title: "Choose Product", desc: "Browse our catalog and select the product that fits your need." },
  { title: "Customise",      desc: "Pick size, material, quantity and upload your artwork or design." },
  { title: "Pay Securely",   desc: "Pay online via UPI, card or net banking. GST invoice auto-generated." },
  { title: "Fast Delivery",  desc: "We print and deliver to your doorstep within 24–48 hours." },
];

const BULK_POINTS = [
  { title: "Volume Discounts",         desc: "Save up to 30% on bulk printing orders." },
  { title: "Dedicated Design Support", desc: "Access to our professional design team for adjustments." },
  { title: "GST Invoicing",            desc: "Compliant billing for easy input credit claims." },
];

const QUOTES = [
  { name: "Sunitha Devi", role: "Retail Shop Owner", text: "Got a glow sign board and ACP panel done for my jewellery shop. The LED lighting is bright and the finish looks premium." },
  { name: "Harish Babu",  role: "Corporate Buyer",   text: "We've been ordering flex banners, canvas prints and standees in bulk for 3 years. The pricing is very competitive and GST invoicing makes our accounting smooth." },
  { name: "Priya Reddy",  role: "Marketing Manager", text: "We ordered 500 business cards and letterheads for our new office. Print quality is top-notch and they even helped with minor design adjustments at no extra cost." },
];

export default function Home() {
  usePageTitle("Printing & Signage in Hyderabad");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, []);

  /* One product from each category first, so the row shows the full range */
  const popular = useMemo(() => {
    const picks = CATEGORIES.map((c) => products.find((p) => p.category === c)).filter(Boolean);
    const rest = products.filter((p) => !picks.includes(p));
    return [...picks, ...rest].slice(0, 4);
  }, [products]);

  const lowestPrice = useMemo(() => {
    const lowest = {};
    products.forEach((p) => {
      const price = Number(p.base_price);
      if (!lowest[p.category] || price < lowest[p.category].price) {
        lowest[p.category] = { price, unit: p.unit };
      }
    });
    return lowest;
  }, [products]);

  return (
    <main id="main" className="font-display">

      {/* ── HERO ── */}
      <section className="vd-wrap grid items-center gap-10 pb-12 pt-8 lg:grid-cols-12 lg:gap-12 lg:pb-16 lg:pt-14">
        <div className="vd-reveal lg:col-span-6">
          <p className="flex items-center gap-3 text-sm font-medium text-ink-2">
            <span className="vd-colorbar" aria-hidden="true"><i /><i /><i /><i /></span>
            Printed in Hyderabad since {BUSINESS.established}
          </p>
          <h1 className="vd-display mt-4">
            Premium Printing for <span className="text-accent">Businesses</span> &amp; Brands
          </h1>
          <p className="vd-lede mt-5 max-w-[34rem]">
            From business cards to large-format signage. Premium-quality prints that elevate your brand across Hyderabad.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link to="/products" className="vd-btn vd-btn-lg vd-btn-accent">Explore Products</Link>
            <a href={BUSINESS.phoneHref} className="vd-btn vd-btn-lg vd-btn-outline">
              <span className="material-symbols-outlined text-xl">call</span>
              Get Custom Quote
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2">
            <li>500+ businesses trust us</li>
            <li>GST Invoice included</li>
          </ul>
        </div>

        {/* Real work, not stock photography */}
        <div className="lg:col-span-6">
          <div className="vd-crop grid grid-cols-5 grid-rows-2 gap-2 sm:gap-3 aspect-[3/2] lg:aspect-[5/4]">
            <Link to={CATEGORY_LINK("Printing Services")} className="col-span-3 row-span-2 block" aria-label="Printing services">
              <div className="vd-frame h-full">
                <img src="/products/offset-printing.jpg" alt="Offset press running a printed sheet" width="600" height="800" fetchPriority="high" />
              </div>
            </Link>
            <Link to={CATEGORY_LINK("Sign Boards")} className="col-span-2 block" aria-label="Sign boards">
              <div className="vd-frame h-full">
                <img src="/products/glow-sign-board.jpg" alt="Lit glow sign board on a shopfront" width="400" height="300" />
              </div>
            </Link>
            <Link to={CATEGORY_LINK("Sign Boards")} className="col-span-2 block" aria-label="Sign boards">
              <div className="vd-frame h-full">
                <img src="/products/aluminium-sign-board.jpg" alt="Aluminium letter sign on an office wall" width="400" height="300" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ── */}
      <section aria-labelledby="shop-by" className="vd-wrap pb-14 lg:pb-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="shop-by" className="vd-h3">Shop by category</h2>
          <Link to="/products" className="vd-link text-sm">All products</Link>
        </div>
        <ul className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-4">
          {CATEGORIES.map((c) => (
            <li key={c} className="w-[44vw] flex-shrink-0 snap-start sm:w-auto">
              <Link to={CATEGORY_LINK(c)} className="block group">
                <div className={`vd-frame aspect-square ${isTallCategory(c) ? "vd-frame-contain" : ""}`}>
                  <img src={CATEGORY_PHOTO[c]} alt="" width="280" height="280" loading="lazy" />
                </div>
                <p className="mt-2 text-[0.9375rem] font-semibold leading-snug group-hover:underline underline-offset-2">{c}</p>
                <p className="vd-price min-h-[1.25rem] text-[0.8125rem] text-ink-2">
                  {lowestPrice[c] && `From ${rupees(lowestPrice[c].price)} / ${unitLabel(lowestPrice[c].unit)}`}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── TRUST BAND ── */}
      <section aria-label="Why Vijetha Digital" className="bg-night text-white">
        <div className="vd-wrap py-10 lg:py-14">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {TRUST.map((t) => (
              <div key={t.label} className="border-l border-white/25 pl-4">
                <dt className="sr-only">{t.label}</dt>
                <dd>
                  <span className="vd-price block text-[2rem] font-bold leading-none tracking-tight lg:text-[2.75rem]" style={{ fontStretch: "110%" }}>{t.stat}</span>
                  <span className="mt-2 block text-[0.9375rem] font-semibold">{t.label}</span>
                  <span className="block text-sm text-white/70">{t.sub}</span>
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1 border-t border-white/15 pt-5 text-sm text-white/80">
            {FEATURES.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section id="services" className="vd-wrap vd-section grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <h2 className="vd-h2">Our Core Services</h2>
            <p className="vd-lede mt-3">Specialized printing solutions for every need.</p>
            <Link to="/products" className="vd-link mt-4 inline-block text-[0.9375rem]">View All</Link>
          </div>
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {SERVICES.map((s) => (
            <li key={s.title} className="border-b border-line">
              <Link to={s.to} className="group flex items-start gap-4 py-5 sm:items-center sm:gap-6 lg:py-7" aria-label={`View ${s.title}`}>
                <span className="material-symbols-outlined text-3xl text-ink-2 transition-colors group-hover:text-accent">{s.icon}</span>
                <span className="min-w-0 flex-1 sm:grid sm:grid-cols-5 sm:items-baseline sm:gap-6">
                  <span className="vd-h3 block sm:col-span-2">{s.title}</span>
                  <span className="mt-1 block text-[0.9375rem] leading-snug text-ink-2 sm:col-span-3 sm:mt-0">{s.desc}</span>
                </span>
                <span className="material-symbols-outlined text-xl text-ink-3 transition-transform group-hover:translate-x-1">arrow_forward</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── POPULAR PRODUCTS ── */}
      <section className="bg-surface">
        <div className="vd-wrap vd-section">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="vd-h2">Popular Products</h2>
              <p className="mt-2 text-ink-2">Our most-ordered items by Hyderabad businesses.</p>
            </div>
            <Link to="/products" className="vd-link hidden whitespace-nowrap text-[0.9375rem] sm:inline-block">View All</Link>
          </div>
          <ProductCarousel products={popular} loading={loading} count={4} />
          <div className="mt-10 text-center">
            <Link to="/products" className="vd-btn vd-btn-outline vd-btn-lg w-full sm:w-auto">Explore All Products</Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="vd-wrap vd-section">
        <h2 className="vd-h2">How It Works</h2>
        <p className="vd-lede mt-3 max-w-xl">Order your prints in 4 simple steps, from design to delivery.</p>
        <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-ink pt-4">
              <span className="vd-price text-sm font-semibold text-accent">0{i + 1}</span>
              <h3 className="vd-h3 mt-2">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-snug text-ink-2">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── BULK / CORPORATE ── */}
      <section className="bg-shade">
        <div className="vd-wrap vd-section grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="vd-kicker mb-3">For Business</p>
            <h2 className="vd-h2">Bulk Orders &amp; Corporate Accounts</h2>
            <p className="vd-lede mt-4">
              Streamline your procurement with a dedicated business account. Get exclusive pricing, priority support, and easy reordering.
            </p>
            <ul className="vd-rows mt-6 border-y border-line-strong/60">
              {BULK_POINTS.map((item) => (
                <li key={item.title} className="!block sm:!flex">
                  <strong className="block font-semibold">{item.title}</strong>
                  <span className="text-[0.9375rem] text-ink-2 sm:text-right">{item.desc}</span>
                </li>
              ))}
            </ul>
            <Link to="/register" className="vd-btn vd-btn-ink vd-btn-lg mt-7 w-full sm:w-auto">Open Business Account</Link>
          </div>
          <figure>
            <div className="grid grid-cols-2 gap-3">
              <div className="vd-frame col-span-2 aspect-[2/1]">
                <img src="/products/flex-printing.png" alt="Large format flex print" width="600" height="300" loading="lazy" />
                <figcaption className="vd-chip absolute bottom-2 right-2 !bg-surface">Event banner, 6ft × 3ft</figcaption>
              </div>
              <div className="vd-frame aspect-[4/3]">
                <img src="/products/letterhead-printing.jpg" alt="Printed letterheads" width="300" height="225" loading="lazy" />
                <span className="vd-chip absolute bottom-2 right-2 !bg-surface">Letterhead</span>
              </div>
              <div className="vd-frame aspect-[4/3]">
                <img src="/products/catalogue-printing.jpg" alt="Printed catalogues" width="300" height="225" loading="lazy" />
                <span className="vd-chip absolute bottom-2 right-2 !bg-surface">Catalogues</span>
              </div>
            </div>
            <p className="mt-4 text-[0.9375rem] text-ink-2">
              <strong className="font-semibold text-ink">Trusted by 40+ Corporates</strong> for brand consistency.
            </p>
          </figure>
        </div>
      </section>

      {/* ── WHAT CUSTOMERS SAY ── */}
      <section className="vd-wrap vd-section">
        <div className="flex items-end justify-between gap-4">
          <h2 className="vd-h2">Rated 4.6★ on JustDial</h2>
          <Link to="/about" className="vd-link hidden whitespace-nowrap text-[0.9375rem] sm:inline-block">More reviews</Link>
        </div>
        <ul className="mt-8 grid gap-8 md:grid-cols-3">
          {QUOTES.map((q) => (
            <li key={q.name} className="border-t border-line-strong pt-5">
              <blockquote className="text-[1.0625rem] leading-relaxed">“{q.text}”</blockquote>
              <p className="mt-4 text-sm"><span className="font-semibold">{q.name}</span> <span className="text-ink-2">· {q.role}</span></p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── BRANCHES ── */}
      <section aria-labelledby="branches-home" className="bg-surface">
        <div className="vd-wrap py-12 lg:py-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="branches-home" className="vd-h3">Visit a branch</h2>
            <p className="text-sm text-ink-2">{BUSINESS.hours}</p>
          </div>
          <ul className="mt-5 grid gap-6 md:grid-cols-3">
            {BRANCHES.map((b) => (
              <li key={b.id} className="border-t border-line pt-4">
                <p className="font-semibold">{b.name}{b.tag ? <span className="font-normal text-ink-2"> · {b.tag}</span> : null}</p>
                <p className="mt-1 text-[0.9375rem] leading-snug text-ink-2">{b.address}</p>
                <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" className="vd-link mt-2 inline-block text-sm">Get directions</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-accent text-white">
        <div className="vd-wrap flex flex-col gap-7 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="max-w-2xl">
            <h2 className="vd-h2">Ready to Print at Scale?</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-white/90">
              Join 500+ businesses who trust Vijetha Digital for their printing needs. Quality guaranteed, every order.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
            <Link to="/products" className="vd-btn vd-btn-lg bg-white text-ink hover:bg-paper">Start Your Order</Link>
            <a href={BUSINESS.phoneHref} className="vd-btn vd-btn-lg vd-btn-on-dark vd-price">
              <span className="material-symbols-outlined text-xl">call</span>
              {BUSINESS.phone}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
