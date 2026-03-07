import { Link } from "react-router-dom";

export default function Sitemap() {
  return (
    <div className="font-display min-h-screen bg-warm-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-plum-deep to-plum-light py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl font-extrabold text-white mb-2">Sitemap</h1>
          <p className="text-white/80">Navigate through all sections of our website</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Main Pages */}
            <div>
              <h2 className="text-2xl font-bold text-plum-deep mb-6 pb-3 border-b-2 border-coral-accent">Main Pages</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">home</span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">info</span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">mail</span>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Products & Services */}
            <div>
              <h2 className="text-2xl font-bold text-plum-deep mb-6 pb-3 border-b-2 border-coral-accent">Products & Services</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/products" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">shopping_bag</span>
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Sign+Boards" className="text-plum-deep/75 hover:text-coral-accent transition-colors ml-8">
                    → Sign Boards
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Printing+Services" className="text-plum-deep/75 hover:text-coral-accent transition-colors ml-8">
                    → Printing Services
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Banner+Stands" className="text-plum-deep/75 hover:text-coral-accent transition-colors ml-8">
                    → Banner Stands
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Demo+Tents" className="text-plum-deep/75 hover:text-coral-accent transition-colors ml-8">
                    → Demo Tents
                  </Link>
                </li>
                <li>
                  <Link to="/products?category=Promotional+Items" className="text-plum-deep/75 hover:text-coral-accent transition-colors ml-8">
                    → Promotional Items
                  </Link>
                </li>
              </ul>
            </div>

            {/* User Accounts */}
            <div>
              <h2 className="text-2xl font-bold text-plum-deep mb-6 pb-3 border-b-2 border-coral-accent">User Accounts</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/login" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">login</span>
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">account_circle</span>
                    My Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Business Section */}
            <div>
              <h2 className="text-2xl font-bold text-plum-deep mb-6 pb-3 border-b-2 border-coral-accent">For Business</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/register" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">business</span>
                    B2B Registration
                  </Link>
                </li>
                <li>
                  <a href="https://wa.me/919848012345" target="_blank" rel="noopener noreferrer" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">chat</span>
                    WhatsApp Support
                  </a>
                </li>
                <li>
                  <a href="tel:+917942643004" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">phone</span>
                    Call Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h2 className="text-2xl font-bold text-plum-deep mb-6 pb-3 border-b-2 border-coral-accent">Legal & Policy</h2>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy-policy" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">privacy_tip</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">description</span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-plum-deep hover:text-coral-accent transition-colors font-medium flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">travel_explore</span>
                    Sitemap
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-plum-deep mb-6 pb-3 border-b-2 border-coral-accent">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-coral-accent">location_on</span>
                  <div>
                    <p className="text-sm text-plum-deep/75">Lakdikapool Office</p>
                    <p className="text-plum-deep">H No. 11-5-456, Shop No. 5</p>
                    <p className="text-plum-deep">Lakdikapool, Hyderabad - 500004</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-coral-accent">phone</span>
                  <div>
                    <p className="text-plum-deep"><a href="tel:+917942643004" className="hover:text-coral-accent">+91 79426 43004</a></p>
                    <p className="text-plum-deep/75 text-sm">Mon-Sat, 9 AM - 7 PM</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-coral-accent">mail</span>
                  <div>
                    <p className="text-plum-deep"><a href="mailto:info@vijethadigital.com" className="hover:text-coral-accent">info@vijethadigital.com</a></p>
                    <p className="text-plum-deep/75 text-sm">Orders: orders@vijethadigital.com</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Additional Info */}
          <div className="mt-16 p-8 bg-plum-deep/5 rounded-lg border border-plum-deep/10">
            <h3 className="text-xl font-bold text-plum-deep mb-3">Additional Resources</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              This sitemap provides easy access to all major sections of Vijetha Digital. For specific product categories or custom print solutions, please use our search function or contact our team directly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-coral-accent mt-1">check_circle</span>
                <p className="text-sm text-gray-700"><strong>Established 2002</strong> - 20+ years in the print industry</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-coral-accent mt-1">check_circle</span>
                <p className="text-sm text-gray-700"><strong>GST Certified</strong> - 36AGBPC3175H1ZP</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-coral-accent mt-1">check_circle</span>
                <p className="text-sm text-gray-700"><strong>Free Quotes</strong> - Bulk orders welcome</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-coral-accent mt-1">check_circle</span>
                <p className="text-sm text-gray-700"><strong>Fast Turnaround</strong> - Quick delivery available</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
