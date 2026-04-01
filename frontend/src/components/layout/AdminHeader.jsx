import React from "react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Overview", to: "/admin/workspace" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Staff", to: "/admin/staff" },
  { label: "Staff Access", to: "/admin/staff-access" },
];

export default function AdminHeader() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-30 bg-warm-white/95 backdrop-blur-md border-b border-stone-border">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Link to="/admin/workspace" className="font-bold text-plum-deep text-lg tracking-wide">VIJETHA DIGITAL <span className="block text-xs font-normal text-plum-deep/70">Admin Portal</span></Link>
        </div>
        <nav className="hidden md:flex gap-2">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded font-medium transition-colors ${location.pathname === link.to ? "bg-plum-deep/10 text-plum-deep" : "text-plum-deep/80 hover:bg-plum-deep/5"}`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/" className="ml-4 px-3 py-1.5 rounded font-medium bg-coral-accent text-white hover:bg-coral-dark transition-colors">Go to Home</Link>
        </nav>
      </div>
    </header>
  );
}
