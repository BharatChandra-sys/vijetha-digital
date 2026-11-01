import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import { BRANCHES, BUSINESS, CATEGORY_LINK, mapsLink } from "../config/business";

/* ── Company milestones ───────────────────────────────────────── */
const MILESTONES = [
  { year: "2002", title: "Founded", desc: "Vijetha Digital established by Krishnam Raju as a sole proprietorship in Hyderabad." },
  { year: "2010", title: "Expanded Offerings", desc: "Added large-format flex printing, LED boards and ACP signage to our product line." },
  { year: "2017", title: "GST Registered", desc: "Formally registered under GST (36AGBPC3175H1ZP), enabling seamless B2B billing." },
  { year: "2020", title: "500+ Clients", desc: "Crossed 500 active business clients across Hyderabad and Telangana." },
  { year: "2024", title: "Digital Ordering", desc: "Launched online ordering platform for faster turnaround and transparent pricing." },
];

/* ── Full product & service catalogue ─────────────────────────── */
const PRODUCT_CATEGORIES = [
  {
    title: "Sign Boards",
    to: CATEGORY_LINK("Sign Boards"),
    items: ["Vinyl Sign Board", "Glow Sign Board", "Aluminium Sign Board", "ACP Board", "LED Board", "Acrylic Letter Cutting", "Star Backlit", "Sandwich Board"],
    img: "/products/3d-sign-board.jpg",
  },
  {
    title: "Printing Services",
    to: CATEGORY_LINK("Printing Services"),
    items: ["Flex Print", "Star Flex Print", "Vinyl Print", "Cloth Print", "Radium Print", "Canvas Print", "Offset Printing", "Letterhead Printing", "Gift Voucher Printing", "Catalogue Printing"],
    img: "/products/flex-printing.png",
  },
  {
    title: "Banner Stands",
    to: CATEGORY_LINK("Banner Stands"),
    items: ["Roller Banner Stand", "Roll-up Banner Stand", "Promotional Banner Stand", "Heavy-Duty Banner Stand"],
    img: "/products/roller-banner-stand.jpg",
    contain: true,
  },
  {
    title: "Demo Tents & Promos",
    to: CATEGORY_LINK("Demo Tents"),
    items: ["Demo Tent 4×4×7", "Demo Tent 6×6×7", "Outdoor Demo Tent", "Promo Table", "Umbrella Print", "Cutout Sprint", "Blackout Flex", "Flute Board"],
    img: "/products/demo-tent-6x6x7-ft.jpg",
    contain: true,
  },
];

/* ── Customer reviews (sourced from JustDial & IndiaMART) ─────── */
const REVIEWS = [
  { name: "Ravi Kumar",    role: "Business Owner",       rating: 5, text: "Excellent quality sign boards delivered on time. The vinyl board we ordered for our shop is still bright after 2 years. Highly recommended for anyone in Hyderabad." },
  { name: "Priya Reddy",   role: "Marketing Manager",    rating: 5, text: "We ordered 500 business cards and letterheads for our new office. Print quality is top-notch and they even helped with minor design adjustments at no extra cost." },
  { name: "Mohammed Arif", role: "Event Coordinator",    rating: 4, text: "Ordered roll-up standees and demo tents for our trade expo. The tents were sturdy and prints were vibrant. Good value, will use again for the next event." },
  { name: "Sunitha Devi",  role: "Retail Shop Owner",    rating: 5, text: "Got a glow sign board and ACP panel done for my jewellery shop. The LED lighting is bright and the finish looks premium. Krishnam Raju personally ensured the quality." },
  { name: "Harish Babu",   role: "Corporate Buyer",      rating: 5, text: "We've been ordering flex banners, canvas prints and standees in bulk for 3 years. The pricing is very competitive and GST invoicing makes our accounting smooth." },
  { name: "Lakshmi Naidu", role: "School Administrator", rating: 4, text: "Ordered event banners and flute boards for our annual day. Delivery was prompt and the colours were exactly as shown in the proof. Very professional team." },
];

const STATS = [
  { value: "23+",   label: "Years in Business" },
  { value: "500+",  label: "Happy Clients" },
  { value: "11-25", label: "Team Members" },
  { value: "4.6★",  label: "JustDial Rating" },
  { value: "50+",   label: "Product Types" },
];

/* Real work from the shop floor */
const GALLERY = [
  { src: "/products/open-led-sign-board.jpg", label: "LED Sign Board", span: "lg:col-span-2 lg:row-span-2" },
  { src: "/products/offset-printing.jpg", label: "Offset Printing" },
  { src: "/products/flex-printing.png", label: "Flex Printing" },
  { src: "/products/letterhead-printing.jpg", label: "Letterheads" },
  { src: "/products/catalogue-printing.jpg", label: "Catalogues" },
  { src: "/products/canvas-printing.png", label: "Canvas Print" },
  { src: "/products/aluminium-sign-board.jpg", label: "Aluminium Signage" },
  { src: "/products/vinyl-sign-board.jpg", label: "Vinyl Sign Board" },
  { src: "/products/glow-sign-board.jpg", label: "Glow Sign Board" },
  { src: "/products/3d-sign-board.jpg", label: "3D Sign Board" },
  { src: "/products/gift-voucher-printing.png", label: "Gift Vouchers" },
  { src: "/products/advertising-roll-up-banner-stand.jpg", label: "Roll-up Banner Stand" },
];

const LINKS = [
  ["Facebook", "https://www.facebook.com/vijethadigital/"],
  ["IndiaMART", "https://www.indiamart.com/vijethadigital/"],
  ["JustDial", "https://www.justdial.com/Hyderabad/Vijetha-Digital-Nacharam/040PXX40-XX40-240305200430-F9N2_BZDET"],
  ["Website", "https://www.vijethadigital.com"],
];

/* Extra contact lines kept from the original branch listing */
const BRANCH_EXTRAS = {
  lakdikapool: (
    <>
      <a href="tel:+919248100009" className="vd-price block hover:underline underline-offset-2">+91 92481 00009</a>
      <a href="tel:+919459565555" className="vd-price block hover:underline underline-offset-2">+91 94595 65555</a>
      <a href="mailto:vijethadigital@gmail.com" className="block break-words hover:underline underline-offset-2">vijethadigital@gmail.com</a>
    </>
  ),
};

function Stars({ rating }) {
  return (
    <span className="inline-flex" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} aria-hidden="true" className={`material-symbols-outlined text-base ${s <= rating ? "text-[#B7791F]" : "text-line-strong"}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
    </span>
  );
}

export default function About() {
  usePageTitle("About Us");
  return (
    <main id="main" className="font-display">

      {/* ── HERO ── */}
      <section className="vd-wrap grid gap-8 pb-10 pt-8 lg:grid-cols-12 lg:items-end lg:pb-14 lg:pt-14">
        <div className="lg:col-span-8">
          <p className="flex items-center gap-3 text-sm font-medium text-ink-2">
            <span className="vd-colorbar" aria-hidden="true"><i /><i /><i /><i /></span>
            Since 2002
          </p>
          <h1 className="vd-display mt-4">About Vijetha Digital</h1>
          <p className="vd-lede mt-4 max-w-2xl">
            One of Hyderabad's most trusted printing &amp; signage companies. We combine 23+ years of craftsmanship with modern technology to deliver premium-quality products for businesses of every size.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
          <Link to="/products" className="vd-btn vd-btn-lg vd-btn-accent">Explore Products</Link>
          <a href={BUSINESS.phoneHref} className="vd-btn vd-btn-lg vd-btn-outline vd-price">Call Us: {BUSINESS.phone}</a>
        </div>
      </section>

      {/* ── STATS ── */}
      <section aria-label="Company facts" className="bg-night text-white">
        <dl className="vd-wrap grid grid-cols-2 gap-x-6 gap-y-7 py-10 sm:grid-cols-3 lg:grid-cols-5 lg:py-12">
          {STATS.map((s) => (
            <div key={s.label} className="border-l border-white/25 pl-4">
              <dd className="vd-price text-[1.75rem] font-bold leading-none tracking-tight lg:text-[2.25rem]" style={{ fontStretch: "108%" }}>{s.value}</dd>
              <dt className="mt-2 text-sm text-white/80">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* ── OUR STORY ── */}
      <section className="vd-wrap vd-section grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <p className="vd-kicker mb-2">Our Story</p>
          <h2 className="vd-h2">From a Small Print Shop to Hyderabad's Trusted Print Partner</h2>
          <div className="mt-5 space-y-4 text-[1.0625rem] leading-relaxed text-ink-2">
            <p>
              Incorporated in <strong className="font-semibold text-ink">2002</strong>, Vijetha Digital was founded by <strong className="font-semibold text-ink">Krishnam Raju</strong> with a vision to make premium printing accessible to businesses across Hyderabad. What started as a small digital printing shop in Lakdikapool has grown into one of the region's leading manufacturers and wholesalers of signage, printing, and promotional products.
            </p>
            <p>
              Operating as a <strong className="font-semibold text-ink">sole proprietorship</strong>, we take pride in personal attention to every order. Our founder still oversees quality checks on large-format prints and sign board installations, ensuring the same standard that built our reputation 23 years ago.
            </p>
            <p>
              We offer an extensive range, from vinyl and glow sign boards to flex &amp; offset printing, roller banner stands, and branded demo tents. Our 11–25 member team handles everything in-house: design consultation, printing, fabrication, and installation.
            </p>
          </div>
        </div>
        <aside className="lg:col-span-5">
          <figure className="border-l-2 border-accent pl-5">
            <blockquote className="text-[1.25rem] font-medium leading-snug tracking-tight">
              “Every print we deliver carries our reputation. We don't cut corners. Whether it's a 100-piece visiting card order or a 50-foot flex banner, the quality standard is the same.”
            </blockquote>
            <figcaption className="mt-4 text-[0.9375rem]">
              <span className="font-semibold">Krishnam Raju</span> <span className="text-ink-2">· Founder &amp; Proprietor</span>
            </figcaption>
          </figure>
          <dl className="vd-rows mt-8 border-y border-line text-[0.9375rem]">
            <div><dt className="font-semibold">GST Verified</dt><dd className="text-ink-2">{BUSINESS.gstin}</dd></div>
            <div><dt className="font-semibold">Wholesaler &amp; Manufacturer</dt><dd className="text-right text-ink-2">Direct factory pricing</dd></div>
          </dl>
        </aside>
      </section>

      {/* ── MILESTONES ── */}
      <section className="bg-surface">
        <div className="vd-wrap vd-section">
          <p className="vd-kicker mb-2">Our Journey</p>
          <h2 className="vd-h2">Key Milestones</h2>
          <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {MILESTONES.map((m) => (
              <li key={m.year} className="border-t-2 border-ink pt-3">
                <p className="vd-price text-[1.75rem] font-bold tracking-tight">{m.year}</p>
                <h3 className="mt-1 font-semibold">{m.title}</h3>
                <p className="mt-1 text-[0.9375rem] leading-snug text-ink-2">{m.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── PRODUCTS & SERVICES ── */}
      <section className="vd-wrap vd-section">
        <p className="vd-kicker mb-2">What We Offer</p>
        <h2 className="vd-h2">Products &amp; Services</h2>
        <p className="vd-lede mt-3 max-w-2xl">Complete signage, printing, and promotional solutions, all manufactured in-house for guaranteed quality and competitive pricing.</p>
        <div className="mt-8 grid gap-x-8 gap-y-10 md:grid-cols-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <div key={cat.title} className="grid grid-cols-[112px_minmax(0,1fr)] gap-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-5">
              <Link to={cat.to} tabIndex={-1} aria-hidden="true" className="block">
                <div className={`vd-frame aspect-square ${cat.contain ? "vd-frame-contain" : ""}`}>
                  <img src={cat.img} alt="" width="160" height="160" loading="lazy" />
                </div>
              </Link>
              <div className="min-w-0">
                <h3 className="vd-h3">{cat.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-snug text-ink-2">{cat.items.join(", ")}.</p>
                <Link to={cat.to} className="vd-link mt-2 inline-block text-sm">Browse {cat.title}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="bg-shade">
        <div className="vd-wrap vd-section">
          <p className="vd-kicker mb-2">Our Work</p>
          <h2 className="vd-h2">Gallery</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
            {GALLERY.map((img) => (
              <li key={img.label} className={`${img.span || ""} group`}>
                <figure className="h-full">
                  <div className={`vd-frame ${img.span ? "aspect-square lg:aspect-auto lg:h-[calc(100%-1.75rem)]" : "aspect-square"}`}>
                    <img src={img.src} alt={img.label} width="300" height="300" loading="lazy" />
                  </div>
                  <figcaption className="mt-1.5 text-[0.8125rem] font-medium text-ink-2">{img.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ── */}
      <section className="vd-wrap vd-section">
        <p className="vd-kicker mb-2">Testimonials</p>
        <h2 className="vd-h2">What Our Clients Say</h2>
        <p className="mt-2 text-ink-2">Rated <strong className="font-semibold text-ink">4.6★</strong> across 17+ reviews on JustDial</p>
        <ul className="mt-8 grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <li key={r.name} className="border-t border-line-strong pt-4">
              <Stars rating={r.rating} />
              <blockquote className="mt-2 leading-relaxed">“{r.text}”</blockquote>
              <p className="mt-3 text-sm"><span className="font-semibold">{r.name}</span> <span className="text-ink-2">· {r.role}</span></p>
            </li>
          ))}
        </ul>
      </section>

      {/* ── LOCATIONS ── */}
      <section className="bg-surface">
        <div className="vd-wrap vd-section">
          <p className="vd-kicker mb-2">Visit Us</p>
          <h2 className="vd-h2">Our Locations</h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-3">
            {BRANCHES.map((b) => (
              <li key={b.id} className="border-t-2 border-ink pt-3">
                <h3 className="vd-h3">{b.name}{b.tag ? <span className="block text-sm font-normal text-ink-2">{b.tag}</span> : null}</h3>
                <p className="mt-2 text-[0.9375rem] leading-snug text-ink-2">{b.address}</p>
                <p className="mt-2 text-[0.9375rem] text-ink-2">{BUSINESS.hours}</p>
                {BRANCH_EXTRAS[b.id] && <div className="mt-2 text-[0.9375rem]">{BRANCH_EXTRAS[b.id]}</div>}
                <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" className="vd-link mt-3 inline-block text-sm">Get directions</a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-2">Listed on JustDial &amp; IndiaMART with verified ratings.</p>
        </div>
      </section>

      {/* ── CONNECT ── */}
      <section className="vd-wrap py-10 lg:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="vd-kicker mb-1">Connect With Us</p>
            <h2 className="vd-h3">Find Us Online</h2>
          </div>
          <ul className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {LINKS.map(([name, url]) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="vd-btn vd-btn-quiet w-full">
                  {name}<span className="material-symbols-outlined text-base">open_in_new</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-accent text-white">
        <div className="vd-wrap flex flex-col gap-7 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="max-w-2xl">
            <h2 className="vd-h2">Ready to Work With Us?</h2>
            <p className="mt-3 text-[1.0625rem] leading-relaxed text-white/90">
              Whether you need a single sign board or 10,000 business cards, we've got you covered with 23 years of expertise.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
            <Link to="/products" className="vd-btn vd-btn-lg bg-white text-ink hover:bg-paper">Start Your Order</Link>
            <a href={BUSINESS.phoneHref} className="vd-btn vd-btn-lg vd-btn-on-dark">
              <span className="material-symbols-outlined text-xl">call</span>Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
