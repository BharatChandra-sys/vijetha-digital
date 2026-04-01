import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";

const PIPELINE = [
  { status: "placed",        label: "Placed",       icon: "shopping_cart",  color: "bg-stone-100 text-stone-600",   dot: "bg-stone-400" },
  { status: "confirmed",     label: "Confirmed",    icon: "check_circle",   color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  { status: "printing",      label: "Printing",     icon: "print",          color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  { status: "quality_check", label: "QC",           icon: "fact_check",     color: "bg-amber-100 text-amber-700",   dot: "bg-amber-500" },
  { status: "shipped",       label: "Shipped",      icon: "local_shipping", color: "bg-teal-100 text-teal-700",     dot: "bg-teal-500" },
  { status: "delivered",     label: "Delivered",    icon: "done_all",       color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  { status: "cancelled",     label: "Cancelled",    icon: "cancel",         color: "bg-red-100 text-red-700",       dot: "bg-red-500" },
  { status: "refunded",      label: "Refunded",     icon: "currency_rupee", color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
];

const NEXT_STATUS = {
  placed:        ["confirmed", "cancelled"],
  confirmed:     ["printing",  "cancelled"],
  printing:      ["quality_check", "cancelled"],
  quality_check: ["shipped",   "cancelled"],
  shipped:       ["delivered"],
  delivered:     ["refunded"],
};

function getPipeline(status) {
  return PIPELINE.find(p => p.status === status) || PIPELINE[0];
}

function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState(null);
  const [tracking, setTracking] = useState({ number: "", url: "" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/admin/dashboard/orders");
      setOrders(res.data || []);
    } catch { setOrders([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, [load]);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !search ||
      String(o.id).includes(q) ||
      (o.customerName || "").toLowerCase().includes(q) ||
      (o.customerEmail || "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const updateStatus = async (orderId, newStatus) => {
    setUpdating(true);
    try {
      await api.put(`/api/v1/admin/dashboard/orders/${orderId}/status`, { status: newStatus });
      await load();
      if (selected && selected.id === orderId) {
        setSelected(prev => ({ ...prev, status: newStatus }));
      }
      showToast("Status updated to " + newStatus);
    } catch (err) {
      showToast((err && err.response && err.response.data && err.response.data.detail) || "Update failed", "error");
    } finally { setUpdating(false); }
  };

  const saveTracking = async () => {
    if (!selected) return;
    setUpdating(true);
    try {
      await api.put("/api/v1/admin/dashboard/orders/" + selected.id + "/tracking", {
        tracking_number: tracking.number,
        tracking_url: tracking.url,
      });
      await load();
      showToast("Tracking info saved");
    } catch (err) {
      showToast("Failed", "error");
    } finally { setUpdating(false); }
  };

  const openOrder = (o) => {
    setSelected(o);
    setTracking({ number: o.trackingNumber || "", url: o.trackingUrl || "" });
  };

  const statusCounts = {};
  PIPELINE.forEach(p => {
    statusCounts[p.status] = orders.filter(o => o.status === p.status).length;
  });

  return (
    <div className="font-display space-y-5">

      {toast && (
        <div className={"fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-card-enhanced text-[0.875rem] font-semibold dropdown-enter " + (toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white")}>
          <span className="material-symbols-outlined text-base">{toast.type === "error" ? "error" : "check_circle"}</span>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.375rem] font-bold text-plum-deep">Orders</h1>
          <p className="text-[0.8125rem] text-text-muted">{orders.length} total · auto-refreshes every 15s</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-stone-border text-[0.8125rem] font-semibold text-plum-deep hover:bg-stone-light transition-colors">
          <span className="material-symbols-outlined text-base">refresh</span>
          Refresh
        </button>
      </div>

      {/* Pipeline filter bar */}
      <div className="bg-white rounded-[12px] border border-stone-border p-3 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button onClick={() => setStatusFilter("all")}
            className={"h-8 px-3 rounded-lg text-[0.8125rem] font-semibold transition-all " + (statusFilter === "all" ? "bg-plum-deep text-white" : "bg-stone-light text-text-muted hover:text-plum-deep")}>
            All ({orders.length})
          </button>
          {PIPELINE.map(p => (
            <button key={p.status} onClick={() => setStatusFilter(statusFilter === p.status ? "all" : p.status)}
              className={"flex items-center gap-1.5 h-8 px-3 rounded-lg text-[0.8125rem] font-semibold transition-all " + (statusFilter === p.status ? p.color + " ring-2 ring-offset-1 ring-current" : "bg-stone-light text-text-muted hover:text-plum-deep")}>
              <span className="material-symbols-outlined text-sm">{p.icon}</span>
              {p.label}
              <span className="text-[0.625rem] font-black">{statusCounts[p.status] || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by order ID, customer name or email…"
          className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
      </div>

      <div className="bg-white rounded-[12px] border border-stone-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-plum-deep border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <span className="material-symbols-outlined text-4xl text-text-muted/30 block mb-2">receipt_long</span>
            <p className="text-[0.875rem] font-semibold text-plum-deep">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[0.8125rem]">
              <thead>
                <tr className="border-b border-stone-border bg-stone-light/50">
                  {["Order","Customer","Amount","Status","Date","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[0.6875rem] font-bold text-text-muted uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-border/60">
                {filtered.map(o => {
                  const pipe = getPipeline(o.status);
                  const nextStatuses = NEXT_STATUS[o.status] || [];
                  return (
                    <tr key={o.id} className="hover:bg-stone-light/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-plum-deep">#{o.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-plum-deep truncate max-w-[140px]">{o.customerName}</p>
                        <p className="text-text-muted text-[0.75rem] truncate max-w-[140px]">{o.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-plum-deep">
                        {"₹" + Number(o.totalAmount).toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <span className={"inline-flex items-center gap-1 px-2 py-1 rounded-full text-[0.6875rem] font-bold " + pipe.color}>
                          <span className={"w-1.5 h-1.5 rounded-full " + pipe.dot} />
                          {pipe.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">{fmtDate(o.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openOrder(o)}
                            className="h-7 px-2.5 rounded-lg border border-stone-border text-[0.75rem] font-semibold text-plum-deep hover:bg-stone-light transition-colors">
                            View
                          </button>
                          {nextStatuses.slice(0, 1).map(ns => {
                            const np = getPipeline(ns);
                            return (
                              <button key={ns} onClick={() => updateStatus(o.id, ns)} disabled={updating}
                                className={"h-7 px-2.5 rounded-lg text-[0.75rem] font-semibold transition-colors disabled:opacity-50 " + (ns === "cancelled" ? "border border-red-200 text-red-600 hover:bg-red-50" : "bg-plum-deep text-white hover:bg-plum-light")}>
                                {np.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail side panel */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-white h-full w-full max-w-md shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-border sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-[1rem] font-bold text-plum-deep">Order #{selected.id}</h2>
                <p className="text-[0.75rem] text-text-muted">{fmtDate(selected.createdAt)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-text-muted hover:text-plum-deep transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Pipeline progress */}
              <div>
                <p className="text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-3">Print Pipeline</p>
                <div className="space-y-1.5">
                  {PIPELINE.slice(0, 6).map(p => {
                    const stages = ["placed","confirmed","printing","quality_check","shipped","delivered"];
                    const curIdx = stages.indexOf(selected.status);
                    const thisIdx = stages.indexOf(p.status);
                    const isDone = thisIdx < curIdx;
                    const isCurrent = p.status === selected.status;
                    return (
                      <div key={p.status} className={"flex items-center gap-3 p-2.5 rounded-lg " + (isCurrent ? p.color : isDone ? "bg-green-50" : "bg-stone-light/40")}>
                        <span className={"material-symbols-outlined text-lg " + (isCurrent ? "" : isDone ? "text-green-600" : "text-text-muted/30")}>
                          {isDone ? "check_circle" : p.icon}
                        </span>
                        <span className={"text-[0.8125rem] font-semibold " + (isCurrent ? "" : isDone ? "text-green-700" : "text-text-muted/40")}>
                          {p.label}
                        </span>
                        {isCurrent && <span className="ml-auto text-[0.625rem] font-black bg-white/60 px-2 py-0.5 rounded-full">NOW</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              {(NEXT_STATUS[selected.status] || []).length > 0 && (
                <div>
                  <p className="text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-2">Move to Next Stage</p>
                  <div className="flex gap-2 flex-wrap">
                    {(NEXT_STATUS[selected.status] || []).map(ns => {
                      const np = getPipeline(ns);
                      return (
                        <button key={ns} onClick={() => updateStatus(selected.id, ns)} disabled={updating}
                          className={"h-9 px-4 rounded-lg text-[0.8125rem] font-bold transition-all disabled:opacity-50 " + (ns === "cancelled" ? "bg-red-600 text-white hover:bg-red-700" : "bg-plum-deep text-white hover:bg-plum-light")}>
                          {updating ? "…" : "→ " + np.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Customer */}
              <div className="bg-stone-light/50 rounded-[10px] p-4">
                <p className="text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-2">Customer</p>
                <p className="text-[0.875rem] font-bold text-plum-deep">{selected.customerName}</p>
                <p className="text-[0.8125rem] text-text-muted">{selected.customerEmail}</p>
                {selected.customerPhone && <p className="text-[0.8125rem] text-text-muted">{selected.customerPhone}</p>}
              </div>

              {/* Items */}
              <div>
                <p className="text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-2">Items</p>
                <div className="space-y-2">
                  {(selected.items || []).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-stone-light/50 rounded-[8px]">
                      <div>
                        <p className="text-[0.875rem] font-semibold text-plum-deep">{item.productName || "Custom Item"}</p>
                        <p className="text-[0.75rem] text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-[0.875rem] font-bold text-plum-deep">{"₹" + Number(item.price || 0).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-border">
                  <span className="text-[0.875rem] font-bold text-plum-deep">Total</span>
                  <span className="text-[1rem] font-black text-plum-deep">{"₹" + Number(selected.totalAmount).toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Tracking */}
              <div>
                <p className="text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-2">Tracking Info</p>
                <div className="space-y-2">
                  <input value={tracking.number} onChange={e => setTracking(t => ({...t, number: e.target.value}))}
                    placeholder="Tracking number"
                    className="w-full h-9 px-3 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 outline-none" />
                  <input value={tracking.url} onChange={e => setTracking(t => ({...t, url: e.target.value}))}
                    placeholder="Tracking URL (optional)"
                    className="w-full h-9 px-3 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 outline-none" />
                  <button onClick={saveTracking} disabled={updating}
                    className="w-full h-9 rounded-lg bg-plum-deep text-white text-sm font-bold hover:bg-plum-light transition-all disabled:opacity-60">
                    {updating ? "Saving…" : "Save Tracking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
