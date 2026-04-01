import React from "react";
import AdminHeader from "../../components/layout/AdminHeader";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Products",
    desc: "Manage and add products.",
    to: "/admin/products",
    icon: "inventory_2",
    color: "from-[#F8F7F4] to-[#F0EEEB]",
  },
  {
    title: "Orders",
    desc: "View and manage all orders.",
    to: "/admin/orders",
    icon: "receipt_long",
    color: "from-[#F8F7F4] to-[#F0EEEB]",
  },
  {
    title: "Staff",
    desc: "View and manage staff.",
    to: "/admin/staff",
    icon: "groups",
    color: "from-[#F8F7F4] to-[#F0EEEB]",
  },
  {
    title: "Staff Access",
    desc: "Manage staff permissions.",
    to: "/admin/staff-access",
    icon: "vpn_key",
    color: "from-[#F8F7F4] to-[#F0EEEB]",
  },
];

export default function AdminWorkspace() {
  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-warm-white px-4 sm:px-6 lg:px-10 py-6 font-display">
        <section className="mb-8">
          <h1 className="text-2xl font-bold text-plum-deep mb-1">Admin Workspace</h1>
          <p className="text-plum-deep/70 mb-4">All admin operations, business overview, and quick access to management tools.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Overview metrics (example, replace with real data) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-gradient-to-br from-[#F8F7F4] to-[#F0EEEB] border-2 border-stone-border rounded-xl p-6 shadow-soft-plum flex flex-wrap gap-6 justify-between items-center">
              <div>
                <div className="text-lg font-semibold text-plum-deep mb-1">Business Overview</div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col items-start"><span className="text-xs text-text-muted">Total Revenue</span><span className="font-bold text-xl text-plum-deep">₹0</span></div>
                  <div className="flex flex-col items-start"><span className="text-xs text-text-muted">Total Orders</span><span className="font-bold text-xl text-plum-deep">0</span></div>
                  <div className="flex flex-col items-start"><span className="text-xs text-text-muted">Total Products</span><span className="font-bold text-xl text-plum-deep">0</span></div>
                  <div className="flex flex-col items-start"><span className="text-xs text-text-muted">Pending Pipeline</span><span className="font-bold text-xl text-plum-deep">0</span></div>
                </div>
              </div>
              <div className="flex-1 text-right">
                <Link to="/admin/orders" className="inline-block px-4 py-2 bg-coral-accent text-white rounded shadow-card-hover font-medium hover:bg-coral-dark transition">View Orders</Link>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(card => (
              <Link
                key={card.title}
                to={card.to}
                className={`group bg-gradient-to-br ${card.color} border-2 border-stone-border rounded-xl p-6 shadow-soft-plum flex flex-col items-start hover:border-coral-accent hover:scale-[1.02] transition-transform`}
              >
                <span className="material-symbols-rounded text-3xl mb-2 text-plum-deep bg-stone-light rounded-full p-2 shadow-soft-plum">{card.icon}</span>
                <div className="font-bold text-plum-deep text-lg mb-1">{card.title}</div>
                <div className="text-text-muted mb-2">{card.desc}</div>
                <span className="mt-auto text-coral-accent font-medium group-hover:underline">Access Module →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
