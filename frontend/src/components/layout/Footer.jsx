import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-plum-deep text-white pt-20 pb-12 border-t border-white/10 relative font-display">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14 mb-16">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-11 w-11 min-w-[44px] rounded-xl object-cover flex-shrink-0 shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-white">VIJETHA DIGITAL</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 text-white/75">
            Established in 2002, Vijetha Digital is Hyderabad's trusted print partner for sign boards, flex printing, banner stands &amp; promotional tents. Serving 500+ businesses across Telangana.
          </p>
          <div className="flex gap-3">
            <a
              href="https://www.facebook.com/vijethadigital"
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 min-w-[36px] rounded-full bg-white/15 flex items-center justify-center hover:bg-[#1877F2] transition-colors"
              title="Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/vijethadigital"
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 min-w-[36px] rounded-full bg-white/15 flex items-center justify-center hover:bg-[#E1306C] transition-colors"
              title="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a
              href="https://wa.me/917942643004"
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 min-w-[36px] rounded-full bg-white/15 flex items-center justify-center hover:bg-[#25D366] transition-colors"
              title="WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <a
              href="https://www.indiamart.com/vijethadigital/"
              target="_blank" rel="noopener noreferrer"
              className="w-9 h-9 min-w-[36px] rounded-full bg-white/15 flex items-center justify-center hover:bg-[#0066CC] transition-colors text-[0.625rem] font-black tracking-tight"
              title="IndiaMart"
            >
              IM
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-bold text-base mb-6 tracking-wide">Products</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["Sign Boards",        "/products?category=Sign+Boards"],
              ["Printing Services",  "/products?category=Printing+Services"],
              ["Banner Stands",      "/products?category=Banner+Stands"],
              ["Demo Tents",         "/products?category=Demo+Tents"],
              ["Promotional Items",  "/products?category=Promotional+Items"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-white/80 hover:text-coral-accent transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold text-base mb-6 tracking-wide">Company</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["About Us",     "/about"],
              ["For Business", "/register"],
              ["Contact",      "/contact"],
              ["Privacy Policy","/privacy-policy"],
              ["Terms of Service","/terms"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-white/80 hover:text-coral-accent transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact — all 3 branches */}
        <div>
          <h4 className="text-white font-bold text-base mb-6 tracking-wide">Contact Us</h4>
          <ul className="space-y-4 text-sm">

            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl mt-0.5 flex-shrink-0">location_on</span>
              <div>
                <p className="text-white/90 font-semibold text-xs mb-0.5">Indira Park (Main)</p>
                <span className="text-white/70">Shop No. 1-2-607/75, 76, Opp NTR Stadium,<br />LIC Colony Rd, Hyderabad – 500029</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl mt-0.5 flex-shrink-0">location_on</span>
              <div>
                <p className="text-white/90 font-semibold text-xs mb-0.5">Lakdikapool</p>
                <span className="text-white/70">H No. 11-5-456, Shop No. 5,<br />Sanapride Complex, Hyderabad – 500004</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl mt-0.5 flex-shrink-0">location_on</span>
              <div>
                <p className="text-white/90 font-semibold text-xs mb-0.5">Nacharam</p>
                <span className="text-white/70">42/B, No. 16, IDA,<br />Nacharam, Hyderabad – 500076</span>
              </div>
            </li>

            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl flex-shrink-0">phone</span>
              <a href="tel:+917942643004" className="text-white/80 hover:text-coral-accent transition-colors">+91 79426 43004</a>
            </li>

            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl flex-shrink-0">schedule</span>
              <span className="text-white/70">Mon – Sat, 9:00 AM – 8:00 PM</span>
            </li>

            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl flex-shrink-0">receipt_long</span>
              <span className="text-xs font-mono text-white/60">GST: 36AGBPC3175H1ZP</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
        <p>© 2002–2025 Vijetha Digital · Prop. Krishnam Raju · All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>

      {/* Staff portal — subtle, bottom of footer */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <Link
          to="/staff/login"
          className="text-[0.6875rem] text-white/20 hover:text-white/50 transition-colors"
        >
          Staff Portal
        </Link>
      </div>
    </footer>
  );
}
