import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function StaffHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const avatarLetter = user
    ? (user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()
    : "?";

  const staffNav = [
    { label: "Workspace", path: "/staff/workspace", icon: "dashboard" },
    { label: "Operations", path: "/staff/operations", icon: "precision_manufacturing" },
    { label: "Delivery", path: "/staff/delivery", icon: "local_shipping" },
    { label: "Orders", path: "/staff/orders", icon: "receipt_long" },
    { label: "Products", path: "/staff/products", icon: "inventory_2" },
    { label: "Schedule", path: "/staff/schedule", icon: "calendar_month" },
    { label: "Alerts", path: "/staff/notifications", icon: "notifications" },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMobileOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-border bg-warm-white/95 font-display backdrop-blur-md supports-[backdrop-filter]:bg-warm-white/80">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Left — Logo + Brand */}
          <Link to="/staff/workspace" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/vd-logo.jpeg"
              alt="Vijetha Digital"
              className="h-10 w-10 rounded-xl object-cover shadow-sm"
            />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-plum-deep">VIJETHA DIGITAL</span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-text-muted font-medium">Staff Portal</span>
            </div>
          </Link>

          {/* Center — Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {staffNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive(item.path)
                    ? "bg-plum-deep/10 text-plum-deep"
                    : "text-text-muted hover:text-plum-deep hover:bg-plum-deep/5"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right — User */}
          <div className="flex items-center gap-3">
            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-plum-deep/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-coral-accent flex items-center justify-center text-sm font-bold text-white">
                  {avatarLetter}
                </div>
                <span className="hidden lg:block text-sm font-medium text-plum-deep max-w-[120px] truncate">
                  {user?.full_name || user?.email}
                </span>
                <span className="material-symbols-outlined text-text-muted text-lg">
                  {dropdownOpen ? "expand_less" : "expand_more"}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#E6E3DD] py-2 text-[#1C1C1C] z-50">
                  <div className="px-4 py-3 border-b border-[#E6E3DD]">
                    <p className="font-semibold text-sm truncate">{user?.full_name || user?.email}</p>
                    <p className="text-xs text-[#6E6E73] truncate">{user?.email}</p>
                    <p className="text-xs text-[#3B2F63] font-medium mt-1 capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/staff/workspace"); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8F7F4] flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#6E6E73]">dashboard</span>
                    Workspace Home
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/staff/operations"); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8F7F4] flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#6E6E73]">precision_manufacturing</span>
                    Operations
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/staff/delivery"); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8F7F4] flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#6E6E73]">local_shipping</span>
                    Delivery
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/staff/profile"); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8F7F4] flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#6E6E73]">person</span>
                    My Profile
                  </button>
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/staff/notifications"); }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F8F7F4] flex items-center gap-2 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg text-[#6E6E73]">notifications</span>
                    Notifications
                  </button>
                  <div className="border-t border-[#E6E3DD] my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg text-plum-deep hover:bg-plum-deep/5 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">
                {mobileOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-warm-white border-t border-stone-border">
          <div className="px-4 py-3 space-y-1">
            {staffNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  isActive(item.path)
                    ? "bg-plum-deep/10 text-plum-deep"
                    : "text-text-muted hover:text-plum-deep hover:bg-plum-deep/5"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-stone-border my-2" />
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
