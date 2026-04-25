import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_GROUPS = [
  {
    label: "Operations",
    items: [
      { label: "Overview",      to: "/admin/dashboard",    icon: "insights" },
      { label: "Products",      to: "/admin/products",     icon: "inventory_2" },
      { label: "Orders",        to: "/admin/orders",       icon: "shopping_bag" },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Staff",         to: "/admin/staff",        icon: "group" },
      { label: "Staff Access",  to: "/admin/staff-access", icon: "lock_open" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Reports",       to: "/admin/reports",      icon: "bar_chart" },
      { label: "Security",      to: "/admin/security",     icon: "security" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Site Settings", to: "/admin/settings",     icon: "settings" },
    ],
  },
];

const ALL_NAV = NAV_GROUPS.flatMap(g => g.items);

function isActive(to, pathname) {
  if (to === "/admin/dashboard") return pathname === to;
  return pathname.startsWith(to);
}

function NavLink({ item, pathname, onClick }) {
  const active = isActive(item.to, pathname);
  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 text-[0.8125rem] font-semibold transition-all duration-150 ${
        active
          ? "text-white bg-white/8 border-l-[3px] border-[#C0392B] pl-[13px]"
          : "text-[#8286A9] hover:text-white hover:bg-white/5 border-l-[3px] border-transparent pl-[13px]"
      }`}
    >
      <span className={`material-symbols-outlined flex-shrink-0 ${active ? "text-white" : "text-[#8286A9]"}`}
        style={{ fontSize: 18 }}>
        {item.icon}
      </span>
      {item.label}
    </Link>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const avatarLetter = user
    ? (user.full_name?.[0] || user.email?.[0] || "A").toUpperCase()
    : "A";

  const currentPage = ALL_NAV.find(n => isActive(n.to, location.pathname));

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "Manrope, sans-serif", background: "#F2F1ED" }}>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen flex flex-col
          lg:static lg:translate-x-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ width: 224, background: "#1A2332", flexShrink: 0 }}
      >
        {/* Brand — never scrolls */}
        <div className="flex-shrink-0 px-5 pt-6 pb-5 border-b border-white/8">
          <div className="flex items-center gap-2.5 mb-1">
            <img src="/vd-logo.jpeg" alt="VD"
              className="rounded-lg object-cover flex-shrink-0"
              style={{ width: 28, height: 28 }} />
            <span className="text-white font-black tracking-tight" style={{ fontSize: 13 }}>
              VIJETHA DIGITAL
            </span>
          </div>
          <p className="text-[#8286A9] font-black uppercase tracking-widest" style={{ fontSize: 9, paddingLeft: 38 }}>
            Admin Panel
          </p>
        </div>

        {/* Nav — scrolls independently */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-5 min-h-0"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[#8286A9] font-black uppercase tracking-widest px-4 mb-1.5"
                style={{ fontSize: 9, opacity: 0.7 }}>
                {group.label}
              </p>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  item={item}
                  pathname={location.pathname}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom — never scrolls */}
        <div className="flex-shrink-0 border-t border-white/8 pt-2 pb-2">
          <Link to="/" target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 text-[0.8125rem] font-semibold text-[#8286A9] hover:text-white hover:bg-white/5 transition-all border-l-[3px] border-transparent pl-[13px]">
            <span className="material-symbols-outlined text-[#8286A9]" style={{ fontSize: 18 }}>open_in_new</span>
            View Live Site
          </Link>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-[0.8125rem] font-semibold text-[#C0392B] hover:bg-white/5 transition-all border-l-[3px] border-transparent pl-[13px]">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
            Sign Out
          </button>
        </div>

        {/* User card — never scrolls */}
        <div className="flex-shrink-0 border-t border-white/8 p-3">
          <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full bg-[#C0392B] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
              {avatarLetter}
            </div>
            <div className="min-w-0">
              <p className="text-white font-bold truncate" style={{ fontSize: 12, lineHeight: 1.2 }}>
                {user?.full_name || "Admin"}
              </p>
              <p className="text-[#8286A9] truncate" style={{ fontSize: 10 }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center gap-3 px-5 bg-white border-b border-[#E8E6E2]"
          style={{ height: 52, position: "sticky", top: 0, zIndex: 20 }}>

          {/* Hamburger — always visible, toggles sidebar */}
          <button
            type="button"
            onClick={() => setSidebarOpen(v => !v)}
            className="flex items-center justify-center text-[#1A2332] hover:text-[#C0392B] transition-colors flex-shrink-0"
            style={{ width: 36, height: 36, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            aria-label="Toggle sidebar"
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect y="0"   width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="6"   width="18" height="2" rx="1" fill="currentColor"/>
              <rect y="12"  width="18" height="2" rx="1" fill="currentColor"/>
            </svg>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[#B0ADA8] font-medium" style={{ fontSize: 12 }}>Admin</span>
            {currentPage && (
              <>
                <span className="material-symbols-outlined text-[#B0ADA8]" style={{ fontSize: 14 }}>chevron_right</span>
                <span className="font-bold text-[#1A2332] truncate" style={{ fontSize: 13 }}>{currentPage.label}</span>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative flex-shrink-0" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(v => !v)}
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
            >
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1A2332]" style={{ fontSize: 12, lineHeight: 1.2 }}>
                  {user?.full_name?.split(" ")[0] || "Admin"}
                </p>
                <p className="text-[#9A9AA5]" style={{ fontSize: 10 }}>Administrator</p>
              </div>
              <div className="w-8 h-8 rounded-xl bg-[#1A2332] text-white font-black flex items-center justify-center flex-shrink-0"
                style={{ fontSize: 13 }}>
                {avatarLetter}
              </div>
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-[#E8E6E2] overflow-hidden dropdown-enter"
                style={{ width: 200, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50 }}
              >
                <div className="px-4 py-3 border-b border-[#E8E6E2] bg-[#F2F1ED]">
                  <p className="font-bold text-[#1A2332]" style={{ fontSize: 13 }}>{user?.full_name || "Admin"}</p>
                  <p className="text-[#9A9AA5] mt-0.5" style={{ fontSize: 11 }}>{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link to="/profile" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[#1A2332] hover:bg-[#F2F1ED] transition-colors"
                    style={{ fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                    <span className="material-symbols-outlined text-[#9A9AA5]" style={{ fontSize: 16 }}>person</span>
                    My Profile
                  </Link>
                  <Link to="/" target="_blank" onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-[#1A2332] hover:bg-[#F2F1ED] transition-colors"
                    style={{ fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
                    <span className="material-symbols-outlined text-[#9A9AA5]" style={{ fontSize: 16 }}>open_in_new</span>
                    View Site
                  </Link>
                </div>
                <div className="border-t border-[#E8E6E2]">
                  <button
                    onClick={() => { setProfileOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[#C0392B] hover:bg-red-50 transition-colors"
                    style={{ fontSize: 13, fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
