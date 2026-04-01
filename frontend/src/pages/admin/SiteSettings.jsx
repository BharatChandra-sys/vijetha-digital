import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function SiteSettings() {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("We're performing scheduled maintenance. We'll be back shortly.");
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.get("/admin/maintenance")
      .then(r => {
        setActive(r.data.active);
        if (r.data.message) setMessage(r.data.message);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggle = async () => {
    setToggling(true);
    try {
      const res = await api.post("/admin/maintenance", {
        active: !active,
        message,
      });
      setActive(res.data.active);
      showToast(
        res.data.active
          ? "Maintenance mode enabled — public site is now restricted"
          : "Maintenance mode disabled — site is live",
        res.data.active ? "warn" : "success"
      );
    } catch (err) {
      showToast(err?.response?.data?.detail || "Failed to update", "error");
    } finally {
      setToggling(false);
    }
  };

  const saveMessage = async () => {
    if (!active) return;
    setToggling(true);
    try {
      await api.post("/admin/maintenance", { active: true, message });
      showToast("Message updated");
    } catch {
      showToast("Failed to save message", "error");
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-5 max-w-xl" style={{ fontFamily: "Manrope, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-[0.875rem] font-semibold dropdown-enter ${
          toast.type === "error" ? "bg-red-600 text-white" :
          toast.type === "warn"  ? "bg-amber-500 text-white" :
          "bg-green-600 text-white"
        }`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === "error" ? "error" : toast.type === "warn" ? "warning" : "check_circle"}
          </span>
          {toast.msg}
        </div>
      )}

      <div>
        <h1 className="text-[1.375rem] font-bold text-[#1A1F3C]">Site Settings</h1>
        <p className="text-[0.8125rem] text-[#9A9AA5] mt-0.5">Control site-wide settings and maintenance mode</p>
      </div>

      {/* Maintenance Mode Card */}
      <div className="bg-white rounded-xl border border-[#E8E6E2] overflow-hidden">

        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E6E2]">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${active ? "bg-amber-100" : "bg-[#F5F4F1]"}`}>
              <span className="material-symbols-outlined text-xl" style={{ color: active ? "#D97706" : "#9A9AA5" }}>
                construction
              </span>
            </div>
            <div>
              <p className="text-[0.9375rem] font-bold text-[#1A1F3C]">Maintenance Mode</p>
              <p className="text-[0.75rem] text-[#9A9AA5]">
                Restricts public access · Admin &amp; Staff portals stay live
              </p>
            </div>
          </div>

          {/* Toggle switch */}
          {loading ? (
            <div className="w-12 h-6 rounded-full bg-[#E8E6E2] animate-pulse" />
          ) : (
            <button
              type="button"
              onClick={toggle}
              disabled={toggling}
              aria-label="Toggle maintenance mode"
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 ${
                active ? "bg-amber-500 focus:ring-amber-400" : "bg-[#D1D0CC] focus:ring-[#1A1F3C]"
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                active ? "translate-x-6" : "translate-x-0"
              }`} />
            </button>
          )}
        </div>

        {/* Status banner */}
        <div className={`mx-5 mt-4 px-4 py-3 rounded-lg flex items-center gap-2.5 ${
          active ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"
        }`}>
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? "bg-amber-500 animate-pulse" : "bg-green-500"}`} />
          <p className={`text-[0.8125rem] font-semibold ${active ? "text-amber-800" : "text-green-800"}`}>
            {active
              ? "Maintenance mode is ON — public site is restricted"
              : "Site is live and accessible to everyone"}
          </p>
        </div>

        {/* Message editor */}
        <div className="px-5 py-4">
          <label className="block text-[0.6875rem] font-black text-[#9A9AA5] uppercase tracking-wider mb-2">
            Message shown to visitors
          </label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="We're performing scheduled maintenance. We'll be back shortly."
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#E8E6E2] bg-[#F5F4F1] focus:outline-none focus:ring-2 focus:ring-[#1A1F3C]/20 focus:border-[#1A1F3C] resize-none text-[#1A1F3C]"
          />
          {active && (
            <button
              onClick={saveMessage}
              disabled={toggling}
              className="mt-2 h-8 px-4 rounded-lg bg-[#1A1F3C] text-white text-[0.8125rem] font-semibold hover:bg-[#252B4A] transition-colors disabled:opacity-60"
            >
              Save Message
            </button>
          )}
        </div>

        {/* What's affected */}
        <div className="px-5 pb-5">
          <p className="text-[0.6875rem] font-black text-[#9A9AA5] uppercase tracking-wider mb-2">
            When maintenance is ON
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Public website",    blocked: true,  icon: "public" },
              { label: "Customer orders",   blocked: true,  icon: "shopping_cart" },
              { label: "Admin panel",       blocked: false, icon: "admin_panel_settings" },
              { label: "Staff portal",      blocked: false, icon: "groups" },
              { label: "API health check",  blocked: false, icon: "monitor_heart" },
              { label: "Auth endpoints",    blocked: false, icon: "lock" },
            ].map(item => (
              <div key={item.label} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[0.75rem] font-medium ${
                item.blocked ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
              }`}>
                <span className="material-symbols-outlined text-sm">{item.blocked ? "block" : "check_circle"}</span>
                <span className="material-symbols-outlined text-sm">{item.icon}</span>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#1A1F3C]/5 border border-[#1A1F3C]/10 rounded-xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-[#1A1F3C] text-xl flex-shrink-0 mt-0.5">info</span>
        <p className="text-[0.8125rem] text-[#5A5A65] leading-relaxed">
          Maintenance mode is stored in memory. It resets if the server restarts.
          To make it persistent across restarts, set <code className="bg-[#1A1F3C]/10 px-1 rounded text-[0.75rem]">MAINTENANCE_MODE=true</code> in your <code className="bg-[#1A1F3C]/10 px-1 rounded text-[0.75rem]">.env</code> file.
        </p>
      </div>
    </div>
  );
}
