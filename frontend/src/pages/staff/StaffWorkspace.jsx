import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Container from "../../components/layout/Container";

export default function StaffWorkspace() {
  const navigate = useNavigate();

  const modules = useMemo(() => [
      {
        id: "operations",
        title: "Operations Dashboard",
        description: "Manage production jobs, track printing progress, quality checks, and dispatch readiness",
        icon: "precision_manufacturing",
        path: "/staff/operations",
        color: "from-blue-500 to-cyan-600",
        accent: "#3B82F6",
      },
      {
        id: "delivery",
        title: "Delivery Dashboard",
        description: "Track delivery trips, manage shipments, and update real-time delivery status",
        icon: "local_shipping",
        path: "/staff/delivery",
        color: "from-green-500 to-emerald-600",
        accent: "#10B981",
      },
      {
        id: "orders",
        title: "Order Tracking",
        description: "View all customer orders, track status updates, and monitor fulfillment progress",
        icon: "receipt_long",
        path: "/staff/orders",
        color: "from-orange-500 to-red-600",
        accent: "#F97316",
      },
      {
        id: "products",
        title: "Products Catalog",
        description: "Browse product inventory, view specifications, categories, and current pricing",
        icon: "inventory_2",
        path: "/staff/products",
        color: "from-purple-500 to-pink-600",
        accent: "#A855F7",
      },
      {
        id: "settings",
        title: "Account Settings",
        description: "View and update your profile details, password, and notification preferences",
        icon: "settings",
        path: "/staff/profile",
        color: "from-slate-600 to-slate-800",
        accent: "#475569",
      },
    ], []);

  return (
    <Container>
      <div className="py-12 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">Staff Workspace</h1>
          <p className="text-[#6E6E73]">
            Manage production operations, delivery tracking, and order fulfillment
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => navigate(module.path)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F8F7F4] to-[#F0EEEB] border-2 border-[#E6E3DD] hover:border-[#FF6B5E] p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${module.color}`} />

              {/* Icon Background Gradient */}
              <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${module.color} opacity-5 rounded-2xl`} />

              <div className="relative">
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    backgroundColor: module.accent + "15",
                    border: `2.5px solid ${module.accent}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: module.accent }}
                  >
                    {module.icon}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-bold text-[#1C1C1C] text-lg mb-2 group-hover:text-[#FF6B5E] transition-colors">
                  {module.title}
                </h3>
                <p className="text-sm text-[#6E6E73] mb-4 line-clamp-2">
                  {module.description}
                </p>

                {/* CTA */}
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all">
                  <span
                    className="group-hover:text-[#FF6B5E] transition-colors"
                    style={{ color: module.accent }}
                  >
                    Access Module
                  </span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" style={{ color: module.accent }}>
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 pt-8 border-t-2 border-[#E6E3DD]">
          <h2 className="text-lg font-bold text-[#1C1C1C] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/staff/operations")}
              className="p-4 rounded-lg bg-[#3B2F63] text-white font-semibold hover:bg-[#2D244C] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">precision_manufacturing</span>
              <span>Production Board</span>
            </button>
            <button
              onClick={() => navigate("/staff/delivery")}
              className="p-4 rounded-lg bg-[#FF6B5E]/10 text-[#FF6B5E] font-semibold hover:bg-[#FF6B5E]/20 transition-colors flex items-center gap-2 border-2 border-[#FF6B5E]/30"
            >
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Delivery Board</span>
            </button>
            <button
              onClick={() => navigate("/staff/orders")}
              className="p-4 rounded-lg bg-[#10B981]/10 text-[#10B981] font-semibold hover:bg-[#10B981]/20 transition-colors flex items-center gap-2 border-2 border-[#10B981]/30"
            >
              <span className="material-symbols-outlined">receipt_long</span>
              <span>View Orders</span>
            </button>
            <button
              onClick={() => navigate("/staff/profile")}
              className="p-4 rounded-lg bg-[#6B7280]/10 text-[#6B7280] font-semibold hover:bg-[#6B7280]/20 transition-colors flex items-center gap-2 border-2 border-[#6B7280]/30"
            >
              <span className="material-symbols-outlined">settings</span>
              <span>Account Settings</span>
            </button>
          </div>
        </div>

        {/* Staff Info */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-[#3B2F63]/5 to-[#FF6B5E]/5 border-2 border-[#E6E3DD]">
          <div className="flex gap-3">
            <span className="material-symbols-outlined text-[#3B2F63] flex-shrink-0 text-2xl">badge</span>
            <div>
              <h3 className="font-bold text-[#1C1C1C] mb-1">Staff Control Center</h3>
              <p className="text-sm text-[#6E6E73]">
                Welcome to your workspace hub. Access production operations, delivery management, and order tracking from here. Your assigned roles determine which modules are available. Contact your administrator for additional workspace access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
