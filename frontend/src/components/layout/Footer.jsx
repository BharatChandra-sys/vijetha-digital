import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-plum-deep text-white pt-20 pb-12 border-t border-white/10 relative font-display">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-14 mb-16">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-12 w-12 rounded-xl object-cover flex-shrink-0" />
            <span className="text-xl font-bold tracking-tight text-white">VIJETHA DIGITAL</span>
          </div>
          <p className="text-sm leading-relaxed mb-6 text-white/75">
            Established in 2002, Vijetha Digital is Hyderabad's trusted print partner for sign boards, flex printing, banner stands &amp; promotional tents.
          </p>
          <div className="flex gap-3">
            <a 
              href="https://www.facebook.com/vijethadigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-[#1877F2] transition-colors"
              title="Follow us on Facebook"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/vijethadigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#E1306C] hover:to-[#F77737] transition-colors"
              title="Follow us on Instagram"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/vijethadigital" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-[#0A66C2] transition-colors"
              title="Connect on LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-white font-bold text-base mb-6 tracking-wide">Products</h4>
          <ul className="space-y-3 text-sm">
            {[
              ["Sign Boards",             "/products?category=Sign+Boards"],
              ["Printing Services",       "/products?category=Printing+Services"],
              ["Banner Stands",           "/products?category=Banner+Stands"],
              ["Demo Tents",              "/products?category=Demo+Tents"],
              ["Promotional Items",       "/products?category=Promotional+Items"],
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
              ["About Us",   "/about"],
              ["Portfolio",  "#"],
              ["For Business", "/register"],
              ["Contact",    "/contact"],
            ].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-white/80 hover:text-coral-accent transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-base mb-6 tracking-wide">Contact Us</h4>
          <ul className="space-y-5 text-sm">
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl mt-0.5">location_on</span>
              <span className="text-white/80">H No. 11-5-456, Shop No. 5, Sanapride Complex,<br />Lakdikapool, Hyderabad - 500004</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl mt-0.5">location_on</span>
              <span className="text-white/80">Opp NTR Stadium, Indira Park,<br />Hyderabad, Telangana</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="material-symbols-outlined text-coral-accent text-xl">phone</span>
              <a href="tel:+917942643004" className="text-white/80 hover:text-coral-accent transition-colors">+91 79426 43004</a>
            </li>
            <li className="flex items-center gap-3 text-white/75">
              <span className="material-symbols-outlined text-coral-accent text-xl">receipt_long</span>
              <span className="text-xs font-mono">GST: 36AGBPC3175H1ZP</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
        <p>© 2002–2025 Vijetha Digital · Prop. Krishnam Raju · All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
