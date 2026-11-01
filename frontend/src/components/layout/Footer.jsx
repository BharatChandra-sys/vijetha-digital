import { Link } from "react-router-dom";
import { BUSINESS, BRANCHES, CATEGORY_LINK, mapsLink, whatsappUrl } from "../../config/business";

const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/vijethadigital",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/vijethadigital",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "WhatsApp",
    href: whatsappUrl(),
    path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
  },
];

const PRODUCT_LINKS = ["Sign Boards", "Printing Services", "Banner Stands", "Demo Tents", "Promotional Items"];
const COMPANY_LINKS = [
  ["About Us", "/about"],
  ["For Business", "/register"],
  ["Contact", "/contact"],
  ["Track Order", "/orders"],
  ["Privacy Policy", "/privacy-policy"],
  ["Terms of Service", "/terms"],
];

const socialClass = "flex h-11 w-11 items-center justify-center rounded-lg border border-white/25 text-white transition-colors hover:bg-white hover:text-ink";
const footerLink = "inline-block py-2 lg:py-1 text-white/85 transition-colors hover:text-white hover:underline underline-offset-2";

export default function Footer() {
  return (
    <footer
      className="bg-night font-display text-white"
      style={{ paddingBottom: "var(--sticky-bar, 0px)" }}
    >
      <div className="vd-wrap grid grid-cols-2 gap-x-8 gap-y-12 py-14 lg:grid-cols-12 lg:py-20">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-4">
          <div className="flex items-center gap-3">
            <img src="/vd-logo.jpeg" alt="" width="44" height="44" className="h-11 w-11 rounded-md object-cover" loading="lazy" />
            <span className="text-xl font-bold tracking-tight">Vijetha Digital</span>
          </div>
          <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-white/85">
            Established in 2002, Vijetha Digital is Hyderabad's trusted print partner for sign boards, flex printing, banner stands &amp; promotional tents. Serving 500+ businesses across Telangana.
          </p>
          <div className="mt-6 flex gap-2">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className={socialClass}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.path} /></svg>
              </a>
            ))}
            <a href="https://www.indiamart.com/vijethadigital/" target="_blank" rel="noopener noreferrer" aria-label="IndiaMART" className={`${socialClass} text-[0.75rem] font-bold`}>IM</a>
          </div>
          <span className="vd-colorbar vd-colorbar-on-dark mt-8" aria-hidden="true"><i /><i /><i /><i /></span>
        </div>

        {/* Products */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-[0.9375rem] font-semibold">Products</h2>
          <ul className="space-y-1 text-[0.9375rem]">
            {PRODUCT_LINKS.map((label) => (
              <li key={label}><Link to={CATEGORY_LINK(label)} className={footerLink}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 text-[0.9375rem] font-semibold">Company</h2>
          <ul className="space-y-1 text-[0.9375rem]">
            {COMPANY_LINKS.map(([label, to]) => (
              <li key={label}><Link to={to} className={footerLink}>{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact: all three branches */}
        <div className="col-span-2 lg:col-span-4">
          <h2 className="mb-3 text-[0.9375rem] font-semibold">Contact Us</h2>
          <ul className="grid gap-4 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-1">
            {BRANCHES.map((b) => (
              <li key={b.id}>
                <a href={mapsLink(b)} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="block font-semibold group-hover:underline underline-offset-2">
                    {b.name}{b.tag === "Main branch" ? " (Main)" : ""}
                  </span>
                  <span className="block text-white/80">{b.address}</span>
                </a>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-1 text-[0.9375rem]">
            <div><dt className="sr-only">Phone</dt><dd><a href={BUSINESS.phoneHref} className="vd-price font-semibold hover:underline underline-offset-2">{BUSINESS.phone}</a></dd></div>
            <div><dt className="sr-only">Email</dt><dd><a href={`mailto:${BUSINESS.email}`} className="text-white/85 hover:underline underline-offset-2">{BUSINESS.email}</a></dd></div>
            <div><dt className="sr-only">Hours</dt><dd className="text-white/85">{BUSINESS.hours}</dd></div>
            <div><dt className="sr-only">GST</dt><dd className="text-white/85">GST: {BUSINESS.gstin}</dd></div>
          </dl>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div className="vd-wrap flex flex-col gap-3 py-6 text-[0.8125rem] text-white/75 md:flex-row md:items-center md:justify-between">
          <p>© 2002–2026 Vijetha Digital · Prop. {BUSINESS.proprietor} · All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
            <Link to="/workspace" className="hover:text-white">Staff &amp; Admin Workspace</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
