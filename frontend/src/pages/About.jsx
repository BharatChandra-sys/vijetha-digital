import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

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
    icon: "storefront",
    items: ["Vinyl Sign Board", "Glow Sign Board", "Aluminium Sign Board", "ACP Board", "LED Board", "Acrylic Letter Cutting", "Star Backlit", "Sandwich Board"],
    img: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Printing Services",
    icon: "print",
    items: ["Flex Print", "Star Flex Print", "Vinyl Print", "Cloth Print", "Radium Print", "Canvas Print", "Offset Printing", "Letterhead Printing", "Gift Voucher Printing", "Catalogue Printing"],
    img: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Banner Stands",
    icon: "flag",
    items: ["Roller Banner Stand", "Roll-up Banner Stand", "Promotional Banner Stand", "Heavy-Duty Banner Stand"],
    img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&auto=format&fit=crop",
  },
  {
    title: "Demo Tents & Promos",
    icon: "holiday_village",
    items: ["Demo Tent 4×4×7", "Demo Tent 6×6×7", "Outdoor Demo Tent", "Promo Table", "Umbrella Print", "Cutout Sprint", "Blackout Flex", "Flute Board"],
    img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80&auto=format&fit=crop",
  },
];

/* ── Customer reviews (sourced from JustDial & IndiaMART) ─────── */
const REVIEWS = [
  { name: "Ravi Kumar",   role: "Business Owner",     rating: 5, text: "Excellent quality sign boards delivered on time. The vinyl board we ordered for our shop is still bright after 2 years. Highly recommended for anyone in Hyderabad." },
  { name: "Priya Reddy",  role: "Marketing Manager",  rating: 5, text: "We ordered 500 business cards and letterheads for our new office. Print quality is top-notch and they even helped with minor design adjustments at no extra cost." },
  { name: "Mohammed Arif", role: "Event Coordinator", rating: 4, text: "Ordered roll-up standees and demo tents for our trade expo. The tents were sturdy and prints were vibrant. Good value — will use again for the next event." },
  { name: "Sunitha Devi",  role: "Retail Shop Owner", rating: 5, text: "Got a glow sign board and ACP panel done for my jewellery shop. The LED lighting is bright and the finish looks premium. Krishnam Raju personally ensured the quality." },
  { name: "Harish Babu",   role: "Corporate Buyer",   rating: 5, text: "We've been ordering flex banners, canvas prints and standees in bulk for 3 years. The pricing is very competitive and GST invoicing makes our accounting smooth." },
  { name: "Lakshmi Naidu",  role: "School Administrator", rating: 4, text: "Ordered event banners and flute boards for our annual day. Delivery was prompt and the colours were exactly as shown in the proof. Very professional team." },
];

/* ── Stats ─────────────────────────────────────────────────────── */
const STATS = [
  { value: "23+",      label: "Years in Business" },
  { value: "500+",     label: "Happy Clients" },
  { value: "11-25",    label: "Team Members" },
  { value: "4.6★",     label: "JustDial Rating" },
  { value: "50+",      label: "Product Types" },
];

/* ── Vertical interactive timeline with glowing scroll ball ──── */
function MilestoneTimeline() {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const ballRef = useRef(null);
  const [visible, setVisible] = useState(new Set());

  /* Observe each card for fade-in */
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll("[data-idx]");
    if (!cards?.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        setVisible((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            if (e.isIntersecting) next.add(e.target.dataset.idx);
          });
          return next;
        });
      },
      { threshold: 0.3 }
    );
    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  /* Move ball + glow fill along the line based on scroll */
  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      const line = lineRef.current;
      const ball = ballRef.current;
      if (!section || !line || !ball) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionH = rect.height;
      const viewH = window.innerHeight;

      // progress: 0 when section top hits viewport bottom, 1 when section bottom hits viewport top
      const raw = (viewH - sectionTop) / (sectionH + viewH);
      const progress = Math.min(1, Math.max(0, raw));

      const lineH = line.offsetHeight;
      const ballY = progress * lineH;

      ball.style.top = `${ballY}px`;
      line.style.setProperty("--fill", `${progress * 100}%`);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-white border-y border-stone-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">Our Journey</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-plum-deep">Key Milestones</h2>
        </div>

        <div className="relative">
          {/* The vertical line (track + glow fill) */}
          <div ref={lineRef} className="timeline-track absolute left-6 lg:left-1/2 lg:-translate-x-1/2 top-0 bottom-0 w-[3px]">
            {/* Background track */}
            <div className="absolute inset-0 rounded-full bg-stone-border/40" />
            {/* Glowing filled portion */}
            <div className="timeline-fill absolute top-0 left-0 right-0 rounded-full" />
          </div>

          {/* The glowing ball */}
          <div ref={ballRef} className="timeline-ball absolute left-6 lg:left-1/2 lg:-translate-x-1/2 -translate-x-1/2 z-20" style={{ top: 0 }}>
            <div className="w-5 h-5 rounded-full bg-coral-accent shadow-[0_0_16px_4px_rgba(255,107,107,0.6)] border-[3px] border-white" />
          </div>

          {/* Milestone cards — alternating left/right on desktop */}
          <div className="space-y-16 lg:space-y-20 relative z-10">
            {MILESTONES.map((m, i) => {
              const isLeft = i % 2 === 0;
              const isVis = visible.has(String(i));
              return (
                <div
                  key={m.year}
                  data-idx={String(i)}
                  className={`relative flex items-start lg:items-center ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  {/* Card */}
                  <div className={`ml-16 lg:ml-0 lg:w-[calc(50%-3rem)] transition-all duration-700 ${isVis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${isLeft ? "lg:text-right lg:pr-0" : "lg:text-left lg:pl-0"}`}>
                    <div className="bg-warm-white p-6 rounded-2xl border border-stone-border/50 shadow-sm hover:shadow-card-enhanced hover:-translate-y-1 transition-all">
                      <span className="text-coral-accent font-extrabold text-2xl">{m.year}</span>
                      <h3 className="text-lg font-bold text-plum-deep mt-1">{m.title}</h3>
                      <p className="text-sm text-text-muted mt-2 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>

                  {/* Center dot (static, on the line) */}
                  <div className="absolute left-6 lg:left-1/2 -translate-x-1/2 top-6 lg:top-1/2 lg:-translate-y-1/2 z-10">
                    <div className={`w-4 h-4 rounded-full border-[3px] border-white transition-all duration-500 ${isVis ? "bg-plum-deep shadow-[0_0_10px_2px_rgba(59,47,99,0.4)]" : "bg-stone-border"}`} />
                  </div>

                  {/* Spacer for the other side */}
                  <div className="hidden lg:block lg:w-[calc(50%-3rem)]" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="font-display overflow-x-hidden">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative bg-plum-deep overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 cta-glow-bg pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-coral-accent" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/80">Since 2002</span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            About <span className="text-coral-accent">Vijetha Digital</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10">
            One of Hyderabad's most trusted printing &amp; signage companies. We combine 23+ years of craftsmanship with modern technology to deliver premium-quality products for businesses of every size.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products" className="bg-coral-accent hover:bg-coral-dark text-white font-bold py-3.5 px-8 rounded-lg shadow-glow-coral transition-all transform hover:-translate-y-1">
              Explore Products
            </Link>
            <a href="tel:+919248100009" className="border border-white/30 text-white hover:bg-white/10 font-bold py-3.5 px-8 rounded-lg transition-all">
              Call Us: +91 92481 00009
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <section className="bg-white border-b border-stone-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
            {STATS.map(s => (
              <div key={s.label}>
                <p className="text-2xl lg:text-3xl font-extrabold text-plum-deep">{s.value}</p>
                <p className="text-xs text-text-muted font-semibold mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR STORY ───────────────────────────────────────────── */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">Our Story</span>
              <h2 className="text-3xl lg:text-4xl font-bold text-plum-deep mb-6">
                From a Small Print Shop to Hyderabad's Trusted Print Partner
              </h2>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Incorporated in <strong className="text-plum-deep">2002</strong>, Vijetha Digital was founded by <strong className="text-plum-deep">Krishnam Raju</strong> with a vision to make premium printing accessible to businesses across Hyderabad. What started as a small digital printing shop in Lakdikapool has grown into one of the region's leading manufacturers and wholesalers of signage, printing, and promotional products.
                </p>
                <p>
                  Operating as a <strong className="text-plum-deep">sole proprietorship</strong>, we take pride in personal attention to every order. Our founder still oversees quality checks on large-format prints and sign board installations — ensuring the same standard that built our reputation 23 years ago.
                </p>
                <p>
                  We offer an extensive range — from vinyl and glow sign boards to flex &amp; offset printing, roller banner stands, and branded demo tents. Our 11–25 member team handles everything in-house: design consultation, printing, fabrication, and installation.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-architectural border border-stone-border/50">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-plum-deep flex items-center justify-center text-white font-bold text-xl flex-shrink-0">KR</div>
                  <div>
                    <h4 className="font-bold text-plum-deep text-lg">Krishnam Raju</h4>
                    <p className="text-sm text-text-muted">Founder &amp; Proprietor</p>
                  </div>
                </div>
                <p className="text-sm text-text-muted leading-relaxed italic">
                  "Every print we deliver carries our reputation. We don't cut corners — whether it's a 100-piece visiting card order or a 50-foot flex banner, the quality standard is the same."
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-stone-border/50 shadow-sm">
                  <span className="material-symbols-outlined text-coral-accent text-2xl mb-2">verified</span>
                  <p className="text-sm font-bold text-plum-deep">GST Verified</p>
                  <p className="text-xs text-text-muted font-mono mt-1">36AGBPC3175H1ZP</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-stone-border/50 shadow-sm">
                  <span className="material-symbols-outlined text-coral-accent text-2xl mb-2">workspace_premium</span>
                  <p className="text-sm font-bold text-plum-deep">Wholesaler &amp; Manufacturer</p>
                  <p className="text-xs text-text-muted mt-1">Direct factory pricing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MILESTONES (horizontal scroll) ─────────────────────── */}
      <MilestoneTimeline />

      {/* ── PRODUCTS & SERVICES ─────────────────────────────────── */}
      <section className="py-20 bg-[#fbf9f4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">What We Offer</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-plum-deep">Products &amp; Services</h2>
            <p className="text-text-muted mt-3 max-w-2xl mx-auto">Complete signage, printing, and promotional solutions — all manufactured in-house for guaranteed quality and competitive pricing.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {PRODUCT_CATEGORIES.map(cat => (
              <div key={cat.title} className="bg-white rounded-2xl overflow-hidden border border-stone-border/50 shadow-product-card hover:shadow-card-hover transition-all group">
                <div className="h-48 overflow-hidden relative">
                  <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-plum-deep/60 to-transparent" />
                  <div className="absolute bottom-4 left-5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-white text-2xl">{cat.icon}</span>
                    <h3 className="text-xl font-bold text-white">{cat.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {cat.items.map(item => (
                      <span key={item} className="text-xs font-medium bg-warm-white text-plum-deep px-3 py-1.5 rounded-full border border-stone-border/50">
                        {item}
                      </span>
                    ))}
                  </div>
                  <Link to="/products" className="inline-flex items-center gap-1 text-sm font-bold text-coral-accent mt-5 hover:gap-2 transition-all">
                    Browse {cat.title} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOMER REVIEWS ────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-stone-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">Testimonials</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-plum-deep">What Our Clients Say</h2>
            <p className="text-text-muted mt-3">Rated <strong className="text-plum-deep">4.6★</strong> across 17+ reviews on JustDial</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-warm-white p-6 rounded-2xl border border-stone-border/50 shadow-sm hover:shadow-card-enhanced transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, s) => (
                    <span key={s} className={`material-symbols-outlined text-lg ${s < r.rating ? "text-yellow-500" : "text-stone-border"}`} style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-stone-border/40">
                  <div className="w-9 h-9 rounded-full bg-plum-deep/10 flex items-center justify-center text-plum-deep font-bold text-sm">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-plum-deep">{r.name}</p>
                    <p className="text-xs text-text-muted">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALLERY ─────────────────────────────────────────────── */}
      <section className="py-20 bg-beige-warm border-t border-stone-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">Our Work</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-plum-deep">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { src: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=500&q=80&auto=format&fit=crop", label: "LED Sign Board" },
              { src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=500&q=80&auto=format&fit=crop", label: "Business Cards" },
              { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80&auto=format&fit=crop", label: "Brochures" },
              { src: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=500&q=80&auto=format&fit=crop", label: "Demo Tent Setup" },
              { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80&auto=format&fit=crop", label: "Flex Printing" },
              { src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80&auto=format&fit=crop", label: "Letterheads" },
              { src: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=500&q=80&auto=format&fit=crop", label: "Canvas Print" },
              { src: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=500&q=80&auto=format&fit=crop", label: "ACP Signage" },
            ].map((img, i) => (
              <div key={i} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm">
                <img src={img.src} alt={img.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-plum-deep/0 group-hover:bg-plum-deep/40 transition-colors flex items-end">
                  <span className="text-white font-bold text-sm p-3 opacity-0 group-hover:opacity-100 transition-opacity">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS ───────────────────────────────────────────── */}
      <section className="py-20 bg-white border-t border-stone-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">Visit Us</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-plum-deep">Our Locations</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Branch 1 */}
            <div className="bg-warm-white p-8 rounded-2xl border border-stone-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-coral-accent text-2xl">store</span>
                <h3 className="text-lg font-bold text-plum-deep">Lakdikapool Branch (Head Office)</h3>
              </div>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-plum-deep/60 text-lg mt-0.5 flex-shrink-0">location_on</span>
                  <span>H No. 11-5-456 &amp; 1, Shop No. 5, Sana Pride Complex,<br />Red Hills, Lakdikapool, Hyderabad - 500004</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-plum-deep/60 text-lg flex-shrink-0">phone</span>
                  <a href="tel:+919248100009" className="hover:text-coral-accent transition-colors font-medium">+91 92481 00009</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-plum-deep/60 text-lg flex-shrink-0">phone</span>
                  <a href="tel:+919459565555" className="hover:text-coral-accent transition-colors font-medium">+91 94595 65555</a>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-plum-deep/60 text-lg flex-shrink-0">mail</span>
                  <a href="mailto:vijethadigital@gmail.com" className="hover:text-coral-accent transition-colors font-medium">vijethadigital@gmail.com</a>
                </li>
              </ul>
            </div>
            {/* Branch 2 */}
            <div className="bg-warm-white p-8 rounded-2xl border border-stone-border/50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-coral-accent text-2xl">store</span>
                <h3 className="text-lg font-bold text-plum-deep">Nacharam Branch</h3>
              </div>
              <ul className="space-y-3 text-sm text-text-muted">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-plum-deep/60 text-lg mt-0.5 flex-shrink-0">location_on</span>
                  <span>42/B, Number 16, IDA,<br />Nacharam, Hyderabad - 500076</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-plum-deep/60 text-lg flex-shrink-0">schedule</span>
                  <span>Mon–Sat, 10:00 AM – 8:00 PM</span>
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-stone-border/40">
                <p className="text-xs text-text-muted opacity-70">Listed on JustDial &amp; IndiaMART with verified ratings.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONNECT ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#fbf9f4] border-t border-stone-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-coral-accent font-bold tracking-widest uppercase text-sm mb-2 block">Connect With Us</span>
            <h2 className="text-3xl font-bold text-plum-deep">Find Us Online</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Facebook",        icon: "group",       url: "https://www.facebook.com/vijethadigital/", color: "bg-blue-600" },
              { name: "IndiaMART",       icon: "storefront",  url: "https://www.indiamart.com/vijethadigital/", color: "bg-blue-800" },
              { name: "JustDial",        icon: "star",        url: "https://www.justdial.com/Hyderabad/Vijetha-Digital-Nacharam/040PXX40-XX40-240305200430-F9N2_BZDET", color: "bg-yellow-600" },
              { name: "Website",         icon: "language",    url: "https://www.vijethadigital.com", color: "bg-plum-deep" },
            ].map(s => (
              <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl border border-stone-border/50 shadow-sm hover:shadow-card-enhanced hover:-translate-y-1 transition-all">
                <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-white`}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <span className="text-sm font-bold text-plum-deep">{s.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-plum-deep text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 cta-glow-bg pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-wide">Ready to Work With Us?</h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Whether you need a single sign board or 10,000 business cards — we've got you covered with 23 years of expertise.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/products"
              className="relative inline-flex items-center gap-2 bg-coral-accent hover:bg-coral-dark text-white text-lg font-bold py-5 px-12 rounded-full shadow-glow-coral transition-all transform hover:-translate-y-1">
              Start Your Order
            </Link>
            <a href="tel:+919248100009"
              className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 font-bold py-5 px-12 rounded-full transition-all text-lg">
              <span className="material-symbols-outlined">phone</span>
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
