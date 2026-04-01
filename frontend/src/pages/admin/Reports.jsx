import { useEffect, useState } from "react";
import api from "../../api/axios";

function fmtCurrency(v) {
  return "₹" + Number(v || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function downloadCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("revenue");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          api.get("/api/v1/admin/dashboard/stats"),
          api.get("/api/v1/admin/dashboard/orders"),
          api.get("/api/v1/admin/dashboard/products"),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data || []);
        setProducts(productsRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-plum-deep border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const deliveredOrders = orders.filter(o => o.status === "delivered");
  const cancelledOrders = orders.filter(o => o.status === "cancelled");
  const pendingOrders = orders.filter(o => !["delivered","cancelled","refunded"].includes(o.status));

  // Category breakdown
  const categoryRevenue = {};
  deliveredOrders.forEach(o => {
    o.items?.forEach(item => {
      const cat = item.productName || "Custom";
      categoryRevenue[cat] = (categoryRevenue[cat] || 0) + Number(item.price || 0) * Number(item.quantity || 1);
    });
  });

  const TABS = [
    { id: "revenue",   label: "Revenue",   icon: "payments" },
    { id: "orders",    label: "Orders",    icon: "receipt_long" },
    { id: "products",  label: "Products",  icon: "inventory_2" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.375rem] font-bold text-plum-deep">Reports</h1>
          <p className="text-[0.8125rem] text-text-muted">Business analytics and export</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => downloadCSV(orders.map(o => ({
              id: o.id, customer: o.customerName, email: o.customerEmail,
              amount: o.totalAmount, status: o.status, date: o.createdAt
            })), "orders_report.csv")}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg border border-stone-border text-[0.8125rem] font-semibold text-plum-deep hover:bg-stone-light transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Orders CSV
          </button>
          <button
            onClick={() => downloadCSV(products.map(p => ({
              id: p.id, name: p.name, category: p.category,
              price: p.basePrice, active: p.isActive
            })), "products_report.csv")}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-plum-deep text-white text-[0.8125rem] font-semibold hover:bg-plum-light transition-colors"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export Products CSV
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",    value: fmtCurrency(stats?.totalRevenue),    icon: "payments",       color: "text-green-600" },
          { label: "30-Day Revenue",   value: fmtCurrency(stats?.revenue30Days),   icon: "calendar_month", color: "text-blue-600" },
          { label: "Total Orders",     value: stats?.totalOrders || 0,             icon: "receipt_long",   color: "text-plum-deep" },
          { label: "Avg Order Value",  value: fmtCurrency(stats?.averageOrderValue), icon: "price_check",  color: "text-coral-accent" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-[12px] border border-stone-border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[0.6875rem] font-bold text-text-muted uppercase tracking-wide">{k.label}</span>
              <span className={`material-symbols-outlined text-xl ${k.color}`}>{k.icon}</span>
            </div>
            <p className="text-[1.5rem] font-black text-plum-deep leading-none">{k.value}</p>
          </div>
        ))}
      </div>

      {/* Order status breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Delivered",  count: deliveredOrders.length,  color: "bg-green-100 text-green-700",  icon: "check_circle" },
          { label: "Pending",    count: pendingOrders.length,    color: "bg-amber-100 text-amber-700",  icon: "hourglass_top" },
          { label: "Cancelled",  count: cancelledOrders.length,  color: "bg-red-100 text-red-700",      icon: "cancel" },
        ].map(s => (
          <div key={s.label} className={`rounded-[12px] border border-stone-border p-4 ${s.color.split(" ")[0].replace("bg-", "bg-").replace("100", "50")}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`material-symbols-outlined text-lg ${s.color.split(" ")[1]}`}>{s.icon}</span>
              <span className={`text-[0.75rem] font-bold uppercase tracking-wide ${s.color.split(" ")[1]}`}>{s.label}</span>
            </div>
            <p className={`text-[1.75rem] font-black ${s.color.split(" ")[1]}`}>{s.count}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-[12px] border border-stone-border overflow-hidden">
        <div className="flex border-b border-stone-border">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-[0.8125rem] font-semibold border-b-2 transition-all ${
                tab === t.id ? "border-plum-deep text-plum-deep" : "border-transparent text-text-muted hover:text-plum-deep"
              }`}>
              <span className="material-symbols-outlined text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {tab === "revenue" && (
            <div className="space-y-3">
              <h3 className="text-[0.875rem] font-bold text-plum-deep">Revenue by Product</h3>
              {Object.entries(categoryRevenue).length === 0 ? (
                <p className="text-[0.8125rem] text-text-muted py-4 text-center">No delivered orders yet</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(categoryRevenue)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, rev]) => {
                      const max = Math.max(...Object.values(categoryRevenue));
                      const pct = Math.round((rev / max) * 100);
                      return (
                        <div key={name} className="flex items-center gap-3">
                          <span className="text-[0.8125rem] text-text-dark w-40 truncate flex-shrink-0">{name}</span>
                          <div className="flex-1 bg-stone-light rounded-full h-2">
                            <div className="bg-plum-deep h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[0.8125rem] font-bold text-plum-deep w-24 text-right">{fmtCurrency(rev)}</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {tab === "orders" && (
            <div className="overflow-x-auto">
              <table className="w-full text-[0.8125rem]">
                <thead>
                  <tr className="border-b border-stone-border">
                    {["Order ID","Customer","Amount","Status","Date"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-[0.6875rem] font-bold text-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-border/60">
                  {orders.slice(0, 50).map(o => (
                    <tr key={o.id} className="hover:bg-stone-light/30">
                      <td className="px-3 py-2 font-mono text-plum-deep">#{o.id}</td>
                      <td className="px-3 py-2 text-text-dark">{o.customerName}</td>
                      <td className="px-3 py-2 font-bold text-plum-deep">{fmtCurrency(o.totalAmount)}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[0.6875rem] font-bold ${
                          o.status === "delivered" ? "bg-green-100 text-green-700" :
                          o.status === "cancelled" ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        }`}>{o.status}</span>
                      </td>
                      <td className="px-3 py-2 text-text-muted">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "products" && (
            <div className="overflow-x-auto">
              <table className="w-full text-[0.8125rem]">
                <thead>
                  <tr className="border-b border-stone-border">
                    {["Product","Category","Price","Status"].map(h => (
                      <th key={h} className="text-left px-3 py-2 text-[0.6875rem] font-bold text-text-muted uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-border/60">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-stone-light/30">
                      <td className="px-3 py-2 font-semibold text-plum-deep">{p.name}</td>
                      <td className="px-3 py-2 text-text-muted">{p.category}</td>
                      <td className="px-3 py-2 font-bold text-plum-deep">{fmtCurrency(p.basePrice)}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-[0.6875rem] font-bold ${
                          p.isActive ? "bg-green-100 text-green-700" : "bg-stone-light text-text-muted"
                        }`}>{p.isActive ? "Active" : "Paused"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
