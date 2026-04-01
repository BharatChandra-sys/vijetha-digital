import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PRODUCT_CATEGORIES = [
  "Sign Boards",
  "Printing Services",
  "Banner Stands",
  "Demo Tents",
  "Promotional Items",
];

const PRODUCT_TYPE_OPTIONS = [
  "Standard",
  "Premium",
                  { id: "staffAccess", label: "Staff Access", icon: "admin_panel_settings" },
                  { id: "staffAccess", label: "Staff Access", icon: "admin_panel_settings" },
  "Economy",
  "Indoor",
  "Outdoor",
  "Matte",
  "Glossy",
  "Backlit",
  "Reflective",
  "Waterproof",
];

const PRODUCT_SIZE_OPTIONS = ["A4", "A3", "2x3 ft", "3x6 ft", "4x8 ft", "6x3 ft", "Custom"];

const ORDER_STATUS_OPTIONS = [
  "placed",
  "confirmed",
  "printing",
  "quality_check",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const STATUS_LABELS = {
  placed: "Placed",
  confirmed: "Confirmed",
  printing: "Printing",
  quality_check: "Quality Check",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

function fmtCurrency(value) {
  const n = Number(value || 0);
  return "\u20b9" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

function fmtShortDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function stripAdminMeta(desc) {
  if (!desc) return "";
  return desc.replace(/\n?\[admin-meta\][\s\S]*?\[\/admin-meta\]\n?/g, "").trim();
}

function parseAdminMeta(desc) {
  if (!desc) return { types: [], sizes: [] };
  const match = desc.match(/\[admin-meta\]([\s\S]*?)\[\/admin-meta\]/);
  if (!match) return { types: [], sizes: [] };

  const block = match[1];
  const types = (block.match(/types=(.*)/i)?.[1] || "")
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);
  const sizes = (block.match(/sizes=(.*)/i)?.[1] || "")
    .split("|")
    .map((v) => v.trim())
    .filter(Boolean);

  return { types, sizes };
}

function buildDescriptionWithMeta(description, types, sizes) {
  const cleanDescription = stripAdminMeta(description);
  if (types.length === 0 && sizes.length === 0) return cleanDescription;

  const meta = [
    "[admin-meta]",
    `types=${types.join("|")}`,
    `sizes=${sizes.join("|")}`,
    "[/admin-meta]",
  ].join("\n");

  return cleanDescription ? `${cleanDescription}\n\n${meta}` : meta;
}

function statusBadgeClass(status) {
  if (status === "delivered") return "bg-green-100 text-green-800";
  if (status === "shipped") return "bg-teal-100 text-teal-800";
  if (status === "cancelled" || status === "refunded") return "bg-red-100 text-red-700";
  if (status === "printing" || status === "quality_check" || status === "confirmed") return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
}

function tabClass(active) {
  return active
    ? "bg-plum-deep text-white shadow-sm"
    : "text-plum-deep hover:bg-stone-light";
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalRevenue: 0,
    revenue30Days: 0,
    revenue90Days: 0,
    totalLosses: 0,
    cancelledOrders: 0,
    returnedOrders: 0,
    averageOrderValue: 0,
  });
  
  // Global search state
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], orders: [] });
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadStats = async () => {
      if (mounted) setLoading(true);
      try {
        const res = await api.get("/api/v1/admin/dashboard/stats");
        const data = res.data;
        if (mounted) setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStats();
    return () => {
      mounted = false;
    };
  }, [refreshTick]);

  // Global search function
  const performGlobalSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults({ products: [], orders: [] });
      return;
    }
    
    setSearchLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        api.get("/api/v1/admin/dashboard/products"),
        api.get("/api/v1/admin/dashboard/orders")
      ]);
      
      const searchLower = query.toLowerCase();
      
      const filteredProducts = productsRes.data.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower) ||
        (p.description && p.description.toLowerCase().includes(searchLower))
      ).slice(0, 5);
      
      const filteredOrders = ordersRes.data.filter(o =>
        o.id.toString().includes(searchLower) ||
        o.customerName.toLowerCase().includes(searchLower) ||
        o.customerEmail.toLowerCase().includes(searchLower)
      ).slice(0, 5);
      
      setSearchResults({ products: filteredProducts, orders: filteredOrders });
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (showGlobalSearch) {
        performGlobalSearch(globalSearchQuery);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [globalSearchQuery, showGlobalSearch]);

  return (
    <div className="min-h-screen bg-warm-white font-display">
      <div className="max-w-[1400px] mx-auto">
        <section className="bg-white border border-stone-border rounded-2xl shadow-card-enhanced overflow-hidden">
          <div className="px-6 lg:px-8 py-5 border-b border-stone-border bg-warm-white/80">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
                <div>
                  <h1 className="text-2xl font-extrabold text-plum-deep tracking-tight">Admin Dashboard</h1>
                  <p className="text-sm text-text-muted">Operations, products, orders, staff and business metrics</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRefreshTick((v) => v + 1)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-border text-plum-deep hover:bg-stone-light font-semibold text-sm"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  Refresh
                </button>
                <button
                  onClick={() => setShowGlobalSearch(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-plum-deep text-plum-deep hover:bg-plum-deep hover:text-white font-semibold text-sm transition-colors"
                >
                  <span className="material-symbols-outlined text-base">search</span>
                  Search
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-plum-deep text-white hover:bg-plum-light font-semibold text-sm"
                >
                  <span className="material-symbols-outlined text-base">home</span>
                  Back Home
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr]">
            <aside className="bg-white border-r border-stone-border p-4">
              <nav className="space-y-1">
                {[
                  { id: "overview", label: "Overview", icon: "insights" },
                  { id: "products", label: "Products", icon: "inventory_2" },
                  { id: "orders", label: "Orders", icon: "receipt_long" },
                  { id: "staff", label: "Staff", icon: "groups" },
                  { id: "staffAccess", label: "Staff Access", icon: "admin_panel_settings" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left rounded-lg px-3 py-2.5 font-semibold text-sm transition-colors inline-flex items-center gap-3 ${tabClass(activeTab === item.id)}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </aside>

            <main className="p-5 lg:p-8 bg-[#fbf9f4] min-h-[70vh]">
              {loading ? (
                <div className="h-[50vh] flex items-center justify-center">
                  <div className="inline-flex items-center gap-3 text-plum-deep font-semibold">
                    <span className="material-symbols-outlined animate-spin">autorenew</span>
                    Loading dashboard...
                  </div>
                </div>
              ) : null}

              {!loading && activeTab === "overview" ? <OverviewTab stats={stats} /> : null}
              {!loading && activeTab === "products" ? <ProductsTab onSaved={() => setRefreshTick((v) => v + 1)} /> : null}
              {!loading && activeTab === "orders" ? <OrdersTab onUpdated={() => setRefreshTick((v) => v + 1)} /> : null}
              {!loading && activeTab === "staff" ? <StaffTab /> : null}
              {!loading && activeTab === "staffAccess" ? <StaffAccessTab /> : null}
            </main>
          </div>
        </section>

        {/* Global Search Modal */}
        {showGlobalSearch && (
          <div className="fixed inset-0 flex items-start justify-center z-[9999] pt-20">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowGlobalSearch(false)}></div>
            
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
              {/* Search Input */}
              <div className="sticky top-0 bg-white border-b border-stone-border p-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-plum-deep text-2xl">search</span>
                  <input
                    type="text"
                    placeholder="Search products, orders, customers..."
                    value={globalSearchQuery}
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    autoFocus
                    className="flex-1 outline-none text-lg text-plum-deep placeholder:text-text-muted"
                  />
                  <button onClick={() => setShowGlobalSearch(false)} className="text-text-muted hover:text-plum-deep">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-4">
                {searchLoading ? (
                  <div className="text-center py-8 text-text-muted">
                    <span className="material-symbols-outlined animate-spin text-3xl">autorenew</span>
                  </div>
                ) : !globalSearchQuery.trim() ? (
                  <div className="text-center py-8 text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2">search</span>
                    <p>Start typing to search products and orders</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Products Results */}
                    {searchResults.products.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-3">Products ({searchResults.products.length})</h3>
                        <div className="space-y-2">
                          {searchResults.products.map(product => (
                            <button
                              key={product.id}
                              onClick={() => {
                                setActiveTab("products");
                                setShowGlobalSearch(false);
                                setGlobalSearchQuery("");
                              }}
                              className="w-full text-left p-3 rounded-lg border border-stone-border hover:bg-stone-light transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                ) : (
                                  <div className="w-12 h-12 bg-stone-light rounded flex items-center justify-center">
                                    <span className="material-symbols-outlined text-text-muted">inventory_2</span>
                                  </div>
                                )}
                                <div className="flex-1">
                                  <p className="font-semibold text-plum-deep">{product.name}</p>
                                  <p className="text-sm text-text-muted">{product.category} • {fmtCurrency(product.basePrice)}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                                  product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                }`}>
                                  {product.isActive ? "Active" : "Paused"}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Orders Results */}
                    {searchResults.orders.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-3">Orders ({searchResults.orders.length})</h3>
                        <div className="space-y-2">
                          {searchResults.orders.map(order => (
                            <button
                              key={order.id}
                              onClick={() => {
                                setActiveTab("orders");
                                setShowGlobalSearch(false);
                                setGlobalSearchQuery("");
                              }}
                              className="w-full text-left p-3 rounded-lg border border-stone-border hover:bg-stone-light transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-semibold text-plum-deep">Order #{order.id}</p>
                                  <p className="text-sm text-text-muted">{order.customerName} • {order.customerEmail}</p>
                                  <p className="text-xs text-text-muted mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-plum-deep">{fmtCurrency(order.totalAmount)}</p>
                                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">
                                    {STATUS_LABELS[order.status] || order.status}
                                  </span>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Results */}
                    {searchResults.products.length === 0 && searchResults.orders.length === 0 && (
                      <div className="text-center py-8 text-text-muted">
                        <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
                        <p>No results found for "{globalSearchQuery}"</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewTab({ stats }) {
  const [trendDays, setTrendDays] = useState(30);
  const [trendData, setTrendData] = useState([]);
  const [trendLoading, setTrendLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadRevenueTrend = async () => {
      if (mounted) setTrendLoading(true);
      try {
        const res = await api.get("/api/v1/admin/dashboard/revenue-trend", {
          params: { days: trendDays },
        });
        if (mounted) {
          setTrendData(Array.isArray(res.data?.points) ? res.data.points : []);
        }
      } catch (error) {
        console.error("Failed to load revenue trend", error);
        if (mounted) setTrendData([]);
      } finally {
        if (mounted) setTrendLoading(false);
      }
    };

    loadRevenueTrend();
    return () => {
      mounted = false;
    };
  }, [trendDays]);

  const kpis = [
    { label: "Total Revenue", value: fmtCurrency(stats.totalRevenue), icon: "payments" },
    { label: "Revenue (30 Days)", value: fmtCurrency(stats.revenue30Days), icon: "calendar_month" },
    { label: "Revenue (90 Days)", value: fmtCurrency(stats.revenue90Days), icon: "date_range" },
    { label: "Average Order Value", value: fmtCurrency(stats.averageOrderValue), icon: "price_check" },
    { label: "Total Orders", value: stats.totalOrders, icon: "receipt_long" },
    { label: "Pending Pipeline", value: stats.pendingOrders, icon: "hourglass_top" },
    { label: "Shipped", value: stats.shippedOrders, icon: "local_shipping" },
    { label: "Total Products", value: stats.totalProducts, icon: "inventory_2" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-extrabold text-plum-deep tracking-tight">Business Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-xl border border-stone-border shadow-sm p-4 hover:shadow-card-enhanced transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wide text-text-muted font-bold">{kpi.label}</p>
              <span className="material-symbols-outlined text-plum-deep/70">{kpi.icon}</span>
            </div>
            <p className="text-3xl font-extrabold text-plum-deep">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-border p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-plum-deep">Revenue Trend</h3>
            <p className="text-xs text-text-muted">Delivered-order revenue by day</p>
          </div>
          <select
            value={trendDays}
            onChange={(e) => setTrendDays(Number(e.target.value))}
            className="rounded-lg border border-stone-border px-3 py-2 text-sm font-semibold text-plum-deep outline-none focus:ring-2 focus:ring-plum-deep/30"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 180 days</option>
          </select>
        </div>

        {trendLoading ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-text-muted">Loading chart...</div>
        ) : (
          <RevenueChart points={trendData} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-stone-border p-5">
          <p className="text-sm font-bold text-red-600 mb-2">Losses</p>
          <p className="text-3xl font-extrabold text-red-700">{fmtCurrency(stats.totalLosses)}</p>
          <p className="text-sm text-text-muted mt-2">Cancelled: {stats.cancelledOrders} | Refunded: {stats.returnedOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-border p-5">
          <p className="text-sm font-bold text-plum-deep mb-2">Order Health</p>
          <p className="text-3xl font-extrabold text-plum-deep">{stats.pendingOrders}</p>
          <p className="text-sm text-text-muted mt-2">Orders currently in production pipeline</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-border p-5">
          <p className="text-sm font-bold text-plum-deep mb-2">Delivery Progress</p>
          <p className="text-3xl font-extrabold text-plum-deep">{stats.shippedOrders}</p>
          <p className="text-sm text-text-muted mt-2">Orders already moved to shipping</p>
        </div>
      </div>
    </div>
  );
}

function RevenueChart({ points }) {
  if (!points?.length) {
    return <div className="h-[220px] flex items-center justify-center text-sm text-text-muted">No revenue data yet</div>;
  }

  const width = 960;
  const height = 220;
  const padding = 26;
  const maxRevenue = Math.max(1, ...points.map((p) => Number(p.revenue || 0)));
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  const coords = points.map((point, idx) => {
    const x = padding + (idx * plotWidth) / Math.max(1, points.length - 1);
    const y = padding + plotHeight - (Number(point.revenue || 0) / maxRevenue) * plotHeight;
    return { x, y, point };
  });

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(" ");
  const areaPath = `M ${padding} ${height - padding} L ${polyline} L ${width - padding} ${height - padding} Z`;

  const first = points[0];
  const middle = points[Math.floor(points.length / 2)];
  const last = points[points.length - 1];

  return (
    <div className="space-y-3">
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[680px] h-[220px]">
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E6E3DD" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#E6E3DD" strokeWidth="1" />
          <path d={areaPath} fill="rgba(59,47,99,0.12)" />
          <polyline fill="none" stroke="#3B2F63" strokeWidth="3" points={polyline} />
          {coords.filter((_, idx) => idx % Math.ceil(points.length / 8) === 0 || idx === points.length - 1).map((c) => (
            <g key={c.point.date}>
              <circle cx={c.x} cy={c.y} r="3" fill="#3B2F63" />
            </g>
          ))}
        </svg>
      </div>
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{fmtShortDate(first?.date)}</span>
        <span>{fmtShortDate(middle?.date)}</span>
        <span>{fmtShortDate(last?.date)}</span>
      </div>
      <div className="text-xs text-text-muted">
        Peak day revenue: <span className="font-bold text-plum-deep">{fmtCurrency(maxRevenue)}</span>
      </div>
    </div>
  );
}

function ProductsTab({ onSaved }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: PRODUCT_CATEGORIES[0],
    description: "",
    basePrice: "",
    unit: "piece",
    isActive: true,
    types: [],
    sizes: [],
    image: null,
  });

  const filteredByCategory = useMemo(() => {
    return PRODUCT_CATEGORIES.map((category) => ({
      category,
      count: products.filter((p) => p.category === category).length,
    }));
  }, [products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/dashboard/products");
      const data = res.data;
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const finalDescription = buildDescriptionWithMeta(formData.description, formData.types, formData.sizes);

    const body = new FormData();
    body.append("name", formData.name);
    body.append("category", formData.category);
    body.append("description", finalDescription);
    body.append("base_price", formData.basePrice);
    body.append("unit", formData.unit);
    body.append("is_active", String(formData.isActive));
    if (formData.image) body.append("image", formData.image);

    const endpoint = editingId
      ? `/api/v1/admin/dashboard/products/${editingId}`
      : "/api/v1/admin/dashboard/products";
    const method = editingId ? "PUT" : "POST";

    try {
      if (method === "POST") {
        await api.post(endpoint, body);
      } else {
        await api.put(endpoint, body);
      }
      await loadProducts();
      onSaved();
      resetForm();
    } catch (error) {
      console.error("Failed to save product", error);
      alert(error?.response?.data?.detail || "Failed to save product");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/v1/admin/dashboard/products/${id}`);
      await loadProducts();
      onSaved();
    } catch (error) {
      console.error("Delete failed", error);
      alert(error?.response?.data?.detail || "Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: PRODUCT_CATEGORIES[0],
      description: "",
      basePrice: "",
      unit: "piece",
      isActive: true,
      types: [],
      sizes: [],
      image: null,
    });
    setEditingId(null);
    setShowModal(false);
  };

  const onEdit = (product) => {
    const meta = parseAdminMeta(product.description || "");
    setEditingId(product.id);
    setShowModal(true);
    setFormData({
      name: product.name || "",
      category: product.category || PRODUCT_CATEGORIES[0],
      description: stripAdminMeta(product.description || ""),
      basePrice: String(product.basePrice ?? ""),
      unit: product.unit || "piece",
      isActive: Boolean(product.isActive),
      types: meta.types,
      sizes: meta.sizes,
      image: null,
    });
  };

  const onCreate = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: PRODUCT_CATEGORIES[0],
      description: "",
      basePrice: "",
      unit: "piece",
      isActive: true,
      types: [],
      sizes: [],
      image: null,
    });
    setShowModal(true);
  };

  const toggleActive = async (product) => {
    try {
      const body = new FormData();
      body.append("name", product.name || "");
      body.append("category", product.category || PRODUCT_CATEGORIES[0]);
      body.append("description", product.description || "");
      body.append("base_price", String(product.basePrice ?? 0));
      body.append("unit", product.unit || "piece");
      body.append("is_active", String(!product.isActive));

      await api.put(`/api/v1/admin/dashboard/products/${product.id}`, body);
      await loadProducts();
      onSaved();
    } catch (error) {
      console.error("Failed to toggle deploy/pause", error);
      alert(error?.response?.data?.detail || "Failed to update product state");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-plum-deep tracking-tight">Product Management</h2>
          <p className="text-sm text-text-muted">Create, update, activate/deactivate and organize products by category</p>
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-plum-deep text-white hover:bg-plum-light font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        {filteredByCategory.map((row) => (
          <div key={row.category} className="bg-white rounded-lg border border-stone-border p-3">
            <p className="text-xs uppercase tracking-wide text-text-muted font-bold">{row.category}</p>
            <p className="text-2xl font-extrabold text-plum-deep mt-1">{row.count}</p>
          </div>
        ))}
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45">
          <div className="w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl border border-stone-border shadow-architectural-lg">
            <div className="sticky top-0 z-10 bg-white border-b border-stone-border px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-plum-deep">{editingId ? "Edit Product" : "Create Product"}</h3>
                <p className="text-sm text-text-muted">Save or discard changes before closing</p>
              </div>
              <button type="button" onClick={resetForm} className="px-3 py-1.5 rounded-md border border-stone-border text-sm font-semibold text-plum-deep hover:bg-stone-light">Discard</button>
            </div>

            <form onSubmit={submit} className="p-6 space-y-5">
              <div>
                <p className="text-sm font-bold text-plum-deep mb-2">Category</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-2">
                  {PRODUCT_CATEGORIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, category: c }))}
                      className={`text-left px-3 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                        formData.category === c
                          ? "border-plum-deep bg-plum-deep/10 text-plum-deep"
                          : "border-stone-border text-text-muted hover:text-plum-deep"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-plum-deep">Product Name</span>
                  <input required value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2 outline-none focus:ring-2 focus:ring-plum-deep/30" />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-plum-deep">Base Price</span>
                  <input required type="number" step="0.01" min="0" value={formData.basePrice} onChange={(e) => setFormData((prev) => ({ ...prev, basePrice: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2 outline-none focus:ring-2 focus:ring-plum-deep/30" />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-plum-deep">Unit</span>
                  <input placeholder="piece / sq ft / 1000 pcs" value={formData.unit} onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2 outline-none focus:ring-2 focus:ring-plum-deep/30" />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-plum-deep">Status</span>
                  <select value={String(formData.isActive)} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.value === "true" }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2 outline-none focus:ring-2 focus:ring-plum-deep/30">
                    <option value="true">Deployed / Active</option>
                    <option value="false">Paused / Inactive</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-plum-deep mb-2">Product Types</p>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_TYPE_OPTIONS.map((opt) => {
                      const checked = formData.types.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData((prev) => ({
                            ...prev,
                            types: checked ? prev.types.filter((v) => v !== opt) : [...prev.types, opt],
                          }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${checked ? "bg-plum-deep text-white border-plum-deep" : "border-stone-border text-plum-deep hover:bg-stone-light"}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-plum-deep mb-2">Available Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_SIZE_OPTIONS.map((opt) => {
                      const checked = formData.sizes.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData((prev) => ({
                            ...prev,
                            sizes: checked ? prev.sizes.filter((v) => v !== opt) : [...prev.sizes, opt],
                          }))}
                          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${checked ? "bg-coral-accent text-white border-coral-accent" : "border-stone-border text-plum-deep hover:bg-stone-light"}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-plum-deep">Description</span>
                <textarea rows={4} value={formData.description} onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2 outline-none focus:ring-2 focus:ring-plum-deep/30" />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-plum-deep">Image</span>
                <input type="file" accept="image/*" onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.files?.[0] || null }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2" />
              </label>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-border">
                <button type="button" onClick={resetForm} className="px-4 py-2 rounded-lg border border-stone-border font-semibold text-sm text-plum-deep hover:bg-stone-light">Discard</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-plum-deep text-white font-semibold text-sm hover:bg-plum-light">{editingId ? "Save Changes" : "Create Product"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <div className="bg-white rounded-xl border border-stone-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-border">
          <h3 className="text-lg font-bold text-plum-deep">Products ({products.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-text-muted">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-light/60 text-plum-deep">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Product</th>
                  <th className="px-4 py-3 text-left font-bold">Category</th>
                  <th className="px-4 py-3 text-left font-bold">Price</th>
                  <th className="px-4 py-3 text-left font-bold">Unit</th>
                  <th className="px-4 py-3 text-left font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-text-muted">No products found</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-t border-stone-border/70">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-lg bg-stone-light overflow-hidden flex-shrink-0">
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" /> : null}
                          </div>
                          <div>
                            <p className="font-semibold text-plum-deep">{p.name}</p>
                            <p className="text-xs text-text-muted line-clamp-1">{stripAdminMeta(p.description || "") || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{p.category}</td>
                      <td className="px-4 py-3 font-semibold text-plum-deep">{fmtCurrency(p.basePrice)}</td>
                      <td className="px-4 py-3 text-text-muted">{p.unit || "piece"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${p.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"}`}>
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => onEdit(p)} className="px-3 py-1.5 rounded-md border border-stone-border text-plum-deep hover:bg-stone-light font-semibold text-xs">
                            Edit
                          </button>
                          <button onClick={() => toggleActive(p)} className={`px-3 py-1.5 rounded-md border font-semibold text-xs ${p.isActive ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-green-200 text-green-700 hover:bg-green-50"}`}>
                            {p.isActive ? "Pause" : "Deploy"}
                          </button>
                          <button onClick={() => remove(p.id)} className="px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 font-semibold text-xs">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersTab({ onUpdated }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [inputStartDate, setInputStartDate] = useState("");
  const [inputEndDate, setInputEndDate] = useState("");
  const [queryStartDate, setQueryStartDate] = useState("");
  const [queryEndDate, setQueryEndDate] = useState("");
  
  // Full Details Modal state
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [fullOrderDetails, setFullOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Tracking form state
  const [trackingForm, setTrackingForm] = useState({ tracking_number: "", tracking_url: "" });
  const [updatingTracking, setUpdatingTracking] = useState(false);
  
  // Status update state
  const [pendingStatus, setPendingStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Custom notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // 'success' or 'error'

  // Show notification helper
  const showCustomNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const selectedOrder = useMemo(() => {
    if (!selectedOrderId) return null;
    return orders.find((o) => o.id === selectedOrderId) || null;
  }, [orders, selectedOrderId]);

  // Update pending status when selected order changes
  useEffect(() => {
    if (selectedOrder) {
      setPendingStatus(selectedOrder.status);
    }
  }, [selectedOrder]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (queryStartDate) params.start_date = queryStartDate;
      if (queryEndDate) params.end_date = queryEndDate;

      const res = await api.get("/api/v1/admin/dashboard/orders", { params });
      setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  }, [queryEndDate, queryStartDate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  const updateStatus = async (orderId, nextStatus) => {
    setUpdatingStatus(true);
    try {
      await api.put(`/api/v1/admin/dashboard/orders/${orderId}/status`, { status: nextStatus });

      // Update local state without refreshing parent
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, status: nextStatus } : order
        )
      );
      
      showCustomNotification("Order status updated successfully", "success");
    } catch (error) {
      console.error("Status update failed", error);
      showCustomNotification(error?.response?.data?.detail || "Status update failed", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const applyLastNDays = (days) => {
    if (days === "all") {
      setInputStartDate("");
      setInputEndDate("");
      setQueryStartDate("");
      setQueryEndDate("");
      return;
    }

    const now = new Date();
    const end = now.toISOString().slice(0, 10);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (Number(days) - 1));
    const start = startDate.toISOString().slice(0, 10);

    setInputStartDate(start);
    setInputEndDate(end);
    setQueryStartDate(start);
    setQueryEndDate(end);
  };

  const applyCustomDateFilter = () => {
    if (inputStartDate && inputEndDate && inputStartDate > inputEndDate) {
      showCustomNotification("Start date must be before end date", "error");
      return;
    }
    setQueryStartDate(inputStartDate);
    setQueryEndDate(inputEndDate);
  };

  const openFullDetails = async (orderId) => {
    setDetailsLoading(true);
    try {
      const res = await api.get(`/api/v1/admin/dashboard/orders/${orderId}/details`);
      setFullOrderDetails(res.data);
      setTrackingForm({
        tracking_number: res.data.trackingNumber || "",
        tracking_url: res.data.trackingUrl || ""
      });
      setShowFullDetails(true);
    } catch (error) {
      console.error("Failed to load order details", error);
      showCustomNotification("Failed to load order details", "error");
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateTracking = async () => {
    if (!fullOrderDetails) return;
    
    setUpdatingTracking(true);
    try {
      const res = await api.put(`/api/v1/admin/dashboard/orders/${fullOrderDetails.id}/tracking`, trackingForm);
      
      // Update the full details view
      setFullOrderDetails(prev => ({
        ...prev,
        trackingNumber: res.data.trackingNumber,
        trackingUrl: res.data.trackingUrl
      }));
      
      // Reload orders list
      await loadOrders();
      showCustomNotification("Tracking information updated successfully", "success");
    } catch (error) {
      console.error("Failed to update tracking", error);
      showCustomNotification(error?.response?.data?.detail || "Failed to update tracking", "error");
    } finally {
      setUpdatingTracking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-plum-deep tracking-tight">Order Management</h2>
        <p className="text-sm text-text-muted">Track every order from placed to delivered/refunded</p>
      </div>

      <div className="bg-white rounded-xl border border-stone-border p-4 flex flex-col lg:flex-row lg:items-end gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => applyLastNDays(7)} className="px-3 py-1.5 rounded-lg border border-stone-border text-xs font-bold text-plum-deep hover:bg-stone-light">Last 7 days</button>
          <button onClick={() => applyLastNDays(30)} className="px-3 py-1.5 rounded-lg border border-stone-border text-xs font-bold text-plum-deep hover:bg-stone-light">Last 30 days</button>
          <button onClick={() => applyLastNDays(90)} className="px-3 py-1.5 rounded-lg border border-stone-border text-xs font-bold text-plum-deep hover:bg-stone-light">Last 90 days</button>
          <button onClick={() => applyLastNDays("all")} className="px-3 py-1.5 rounded-lg border border-stone-border text-xs font-bold text-plum-deep hover:bg-stone-light">All time</button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="date"
            value={inputStartDate}
            onChange={(e) => setInputStartDate(e.target.value)}
            className="rounded-lg border border-stone-border px-3 py-2 text-sm text-plum-deep"
          />
          <span className="text-sm text-text-muted">to</span>
          <input
            type="date"
            value={inputEndDate}
            onChange={(e) => setInputEndDate(e.target.value)}
            className="rounded-lg border border-stone-border px-3 py-2 text-sm text-plum-deep"
          />
          <button onClick={applyCustomDateFilter} className="px-3 py-2 rounded-lg bg-plum-deep text-white text-xs font-bold hover:bg-plum-light">Apply</button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
            activeFilter === "all"
              ? "bg-plum-deep text-white border-plum-deep"
              : "text-plum-deep border-stone-border hover:bg-white"
          }`}
        >
          All ({orders.length})
        </button>
        {ORDER_STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
              activeFilter === status
                ? "bg-plum-deep text-white border-plum-deep"
                : "text-plum-deep border-stone-border hover:bg-white"
            }`}
          >
            {STATUS_LABELS[status]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        <div className="bg-white rounded-xl border border-stone-border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-sm text-text-muted">Loading orders...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-light/60 text-plum-deep">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Order</th>
                    <th className="px-4 py-3 text-left font-bold">Customer</th>
                    <th className="px-4 py-3 text-right font-bold">Amount</th>
                    <th className="px-4 py-3 text-left font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-text-muted">No orders in this status</td>
                    </tr>
                  ) : (
                    filtered.map((o) => (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedOrderId(o.id)}
                        className={`border-t border-stone-border/70 cursor-pointer hover:bg-stone-light/40 ${
                          selectedOrderId === o.id ? "bg-plum-deep/5" : ""
                        }`}
                      >
                        <td className="px-4 py-3 font-semibold text-plum-deep">#{o.id}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-text-dark">{o.customerName || "-"}</p>
                          <p className="text-xs text-text-muted">{o.customerEmail || "-"}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-plum-deep">{fmtCurrency(o.totalAmount)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusBadgeClass(o.status)}`}>
                            {STATUS_LABELS[o.status] || o.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-stone-border shadow-sm p-4 h-fit">
          {!selectedOrder ? (
            <div className="text-sm text-text-muted">Select an order to view details</div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Order</p>
                <p className="text-xl font-extrabold text-plum-deep">#{selectedOrder.id}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Customer</p>
                <p className="font-semibold text-plum-deep">{selectedOrder.customerName || "-"}</p>
                <p className="text-sm text-text-muted">{selectedOrder.customerEmail || "-"}</p>
                <p className="text-sm text-text-muted">{selectedOrder.customerPhone || "-"}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Amount</p>
                <p className="text-2xl font-extrabold text-plum-deep">{fmtCurrency(selectedOrder.totalAmount)}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted font-bold mb-1.5">Update Status</p>
                <select
                  value={pendingStatus}
                  onChange={(e) => setPendingStatus(e.target.value)}
                  className="w-full rounded-lg border border-stone-border px-3 py-2 outline-none focus:ring-2 focus:ring-plum-deep/30"
                >
                  {ORDER_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    updateStatus(selectedOrder.id, pendingStatus);
                  }}
                  disabled={updatingStatus || pendingStatus === selectedOrder.status}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updatingStatus ? "Updating..." : "Update Status"}
                </button>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-text-muted font-bold mb-2">Items</p>
                <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                  {selectedOrder.items?.length ? (
                    selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="rounded-lg border border-stone-border p-2.5">
                        <p className="font-semibold text-plum-deep text-sm">{item.productName}</p>
                        <p className="text-xs text-text-muted">
                          Qty {item.quantity} x {fmtCurrency(item.price)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-text-muted">No line items</p>
                  )}
                </div>
              </div>

              <button 
                onClick={() => openFullDetails(selectedOrder.id)}
                className="w-full mt-4 px-4 py-2.5 rounded-lg bg-plum-deep text-white font-semibold text-sm hover:bg-plum-light transition-colors"
              >
                📋 View Full Details
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Full Details Modal */}
      {showFullDetails && fullOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl max-h-[90vh] width-full overflow-hidden flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-gradient-to-r from-plum-deep to-plum-light p-6 border-b border-stone-border text-white">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold">Order #{fullOrderDetails.id}</h2>
                  <p className="text-plum-light/90 text-sm mt-1">Complete order details & management</p>
                </div>
                <button 
                  onClick={() => setShowFullDetails(false)}
                  className="text-white/80 hover:text-white text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6 space-y-6">
                
                {/* Customer Information */}
                <div className="bg-gradient-to-br from-stone-light/50 to-white rounded-xl p-5 border border-stone-border">
                  <h3 className="text-lg font-bold text-plum-deep mb-4 flex items-center gap-2">
                    <span>👤</span> Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Name</p>
                      <p className="text-base font-semibold text-plum-deep">{fullOrderDetails.customerName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Email</p>
                      <p className="text-base font-semibold text-plum-deep break-all">{fullOrderDetails.customerEmail || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Phone</p>
                      <p className="text-base font-semibold text-plum-deep">{fullOrderDetails.customerPhone || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="bg-gradient-to-br from-stone-light/50 to-white rounded-xl p-5 border border-stone-border">
                  <h3 className="text-lg font-bold text-plum-deep mb-4 flex items-center gap-2">
                    <span>📦</span> Order Details
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${statusBadgeClass(fullOrderDetails.status)}`}>
                        {STATUS_LABELS[fullOrderDetails.status] || fullOrderDetails.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Payment</p>
                      <p className="text-sm font-semibold text-plum-deep mt-1">{fullOrderDetails.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-text-muted font-bold">Created</p>
                      <p className="text-sm font-semibold text-plum-deep mt-1">{fmtShortDate(fullOrderDetails.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-gradient-to-br from-stone-light/50 to-white rounded-xl p-5 border border-stone-border">
                  <h3 className="text-lg font-bold text-plum-deep mb-4 flex items-center gap-2">
                    <span>🛒</span> Order Items
                  </h3>
                  <div className="space-y-3">
                    {fullOrderDetails.items?.length ? (
                      fullOrderDetails.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-stone-border/60 bg-white hover:bg-stone-light/30 transition-colors">
                          <div>
                            <p className="font-semibold text-plum-deep">{item.productName}</p>
                            <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-plum-deep">{fmtCurrency(item.subtotal)}</p>
                            <p className="text-xs text-text-muted">{fmtCurrency(item.price)} each</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-muted">No items in order</p>
                    )}
                  </div>
                </div>

                {/* Order Amount Breakdown */}
                <div className="bg-gradient-to-br from-plum-deep/5 to-coral-accent/5 rounded-xl p-5 border border-plum-deep/20">
                  <h3 className="text-lg font-bold text-plum-deep mb-4 flex items-center gap-2">
                    <span>💰</span> Amount Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-text-muted">Subtotal</span>
                      <span className="font-semibold text-plum-deep">{fmtCurrency(fullOrderDetails.subtotal)}</span>
                    </div>
                    {fullOrderDetails.tax > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Tax</span>
                        <span className="font-semibold text-plum-deep">{fmtCurrency(fullOrderDetails.tax)}</span>
                      </div>
                    )}
                    {fullOrderDetails.discount > 0 && (
                      <div className="flex justify-between items-center text-green-700">
                        <span>Discount</span>
                        <span className="font-semibold">-{fmtCurrency(fullOrderDetails.discount)}</span>
                      </div>
                    )}
                    {fullOrderDetails.shipping > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-text-muted">Shipping</span>
                        <span className="font-semibold text-plum-deep">{fmtCurrency(fullOrderDetails.shipping)}</span>
                      </div>
                    )}
                    <div className="border-t border-plum-deep/20 pt-2 flex justify-between items-center">
                      <span className="font-bold text-plum-deep">Total</span>
                      <span className="text-xl font-extrabold text-plum-deep">{fmtCurrency(fullOrderDetails.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                {/* Tracking Information */}
                <div className="bg-gradient-to-br from-sky-50 to-white rounded-xl p-5 border border-blue-200">
                  <h3 className="text-lg font-bold text-plum-deep mb-4 flex items-center gap-2">
                    <span>🚚</span> Tracking & Shipment
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs uppercase tracking-wide text-text-muted font-bold block mb-1.5">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={trackingForm.tracking_number}
                        onChange={(e) => setTrackingForm(prev => ({ ...prev, tracking_number: e.target.value }))}
                        placeholder="e.g., TRK123456789"
                        className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wide text-text-muted font-bold block mb-1.5">
                        Tracking URL
                      </label>
                      <input
                        type="url"
                        value={trackingForm.tracking_url}
                        onChange={(e) => setTrackingForm(prev => ({ ...prev, tracking_url: e.target.value }))}
                        placeholder="e.g., https://track.courier.com/..."
                        className="w-full rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>
                    <button
                      onClick={updateTracking}
                      disabled={updatingTracking}
                      className="w-full px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {updatingTracking ? "Updating..." : "💾 Update Tracking"}
                    </button>
                  </div>
                </div>

                {/* Invoice Management */}
                <div className="bg-white rounded-xl p-5 border border-amber-200">
                  <h3 className="text-lg font-bold text-plum-deep mb-4 flex items-center gap-2">
                    <span>📄</span> Invoice
                  </h3>
                  {fullOrderDetails.invoiceUrl ? (
                    <a
                      href={fullOrderDetails.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-4 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
                    >
                      📥 Download Invoice
                    </a>
                  ) : (
                    <p className="text-center text-sm text-text-muted py-4">No invoice uploaded yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-stone-light/60 border-t border-stone-border p-4 flex justify-end">
              <button
                onClick={() => setShowFullDetails(false)}
                className="px-6 py-2 rounded-lg bg-plum-deep text-white font-semibold text-sm hover:bg-plum-light transition-colors"
              >
                ✓ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Notification Popup */}
      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowNotification(false)}></div>
          
          {/* Notification Card */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-border p-8 max-w-md w-full mx-4 animate-[scale-in_0.2s_ease-out]">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              {notificationType === "success" ? (
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
                </div>
              )}
            </div>

            {/* Message */}
            <h3 className="text-center text-xl font-bold text-plum-deep mb-6">
              {notificationMessage}
            </h3>

            {/* OK Button */}
            <button
              onClick={() => setShowNotification(false)}
              className="w-full py-3 rounded-xl bg-plum-deep text-white font-semibold text-lg hover:bg-plum-light transition-colors shadow-sm"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StaffTab() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    phone: "",
    email: "",
    department: "",
    status: "active",
  });

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/dashboard/staff");
      const data = res.data;
      setStaff(data);
    } catch (error) {
      console.error("Failed to load staff", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const reset = () => {
    setForm({
      name: "",
      position: "",
      phone: "",
      email: "",
      department: "",
      status: "active",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const save = async (e) => {
    e.preventDefault();
    const endpoint = editingId
      ? `/api/v1/admin/dashboard/staff/${editingId}`
      : "/api/v1/admin/dashboard/staff";
    const method = editingId ? "PUT" : "POST";

    try {
      if (method === "POST") {
        await api.post(endpoint, form);
      } else {
        await api.put(endpoint, form);
      }

      await loadStaff();
      reset();
    } catch (error) {
      console.error("Failed to save staff member", error);
      alert(error?.response?.data?.detail || "Failed to save staff member");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await api.delete(`/api/v1/admin/dashboard/staff/${id}`);
      await loadStaff();
    } catch (error) {
      console.error("Failed to delete staff", error);
      alert(error?.response?.data?.detail || "Failed to delete staff");
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setShowForm(true);
    setForm({
      name: item.name || "",
      position: item.position || "",
      phone: item.phone || "",
      email: item.email || "",
      department: item.department || "",
      status: item.status || "active",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-plum-deep tracking-tight">Staff Management</h2>
          <p className="text-sm text-text-muted">Maintain contact details and team status</p>
        </div>
        <button
          onClick={() => (showForm ? reset() : setShowForm(true))}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-plum-deep text-white hover:bg-plum-light font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-base">person_add</span>
          {showForm ? "Cancel" : "Add Staff"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={save} className="bg-white rounded-xl border border-stone-border shadow-sm p-5 lg:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-semibold text-plum-deep">Name</span>
              <input required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-plum-deep">Position</span>
              <input required value={form.position} onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-plum-deep">Phone</span>
              <input required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-plum-deep">Email</span>
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-plum-deep">Department</span>
              <input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-plum-deep">Status</span>
              <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2">
                <option value="invited">Invited</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="offboarded">Offboarded</option>
              </select>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="px-4 py-2 rounded-lg bg-plum-deep text-white font-semibold text-sm hover:bg-plum-light">
              {editingId ? "Update Staff" : "Create Staff"}
            </button>
            <button type="button" onClick={reset} className="px-4 py-2 rounded-lg border border-stone-border font-semibold text-sm text-plum-deep hover:bg-stone-light">
              Reset
            </button>
          </div>
        </form>
      ) : null}

      <div className="bg-white rounded-xl border border-stone-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-border">
          <h3 className="text-lg font-bold text-plum-deep">Staff ({staff.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 text-sm text-text-muted">Loading staff...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-light/60 text-plum-deep">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Name</th>
                  <th className="px-4 py-3 text-left font-bold">Position</th>
                  <th className="px-4 py-3 text-left font-bold">Phone</th>
                  <th className="px-4 py-3 text-left font-bold">Department</th>
                  <th className="px-4 py-3 text-left font-bold">Status</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-text-muted">No staff records found</td>
                  </tr>
                ) : (
                  staff.map((s) => (
                    <tr key={s.id} className="border-t border-stone-border/70">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-plum-deep">{s.name}</p>
                        <p className="text-xs text-text-muted">{s.email || "-"}</p>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{s.position}</td>
                      <td className="px-4 py-3 text-text-muted">{s.phone}</td>
                      <td className="px-4 py-3 text-text-muted">{s.department || "-"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          s.status === "active"
                            ? "bg-green-100 text-green-700"
                            : s.status === "invited"
                            ? "bg-blue-100 text-blue-700"
                            : s.status === "suspended"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-200 text-gray-700"
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button onClick={() => edit(s)} className="px-3 py-1.5 rounded-md border border-stone-border text-plum-deep hover:bg-stone-light font-semibold text-xs">
                            Edit
                          </button>
                          <button onClick={() => remove(s.id)} className="px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 font-semibold text-xs">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StaffAccessTab() {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [iamReadiness, setIamReadiness] = useState(null);
  const [roleHistory, setRoleHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [linkUserInput, setLinkUserInput] = useState("");
  const [filterText, setFilterText] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userCandidates, setUserCandidates] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [showDangerousOnly, setShowDangerousOnly] = useState(false);
  const [notice, setNotice] = useState({ type: "info", text: "" });
  
  // Bulk assignment mode
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);
  const [bulkRoles, setBulkRoles] = useState([]);

  const selectedStaff = useMemo(() => staff.find((s) => s.id === selectedStaffId) || null, [staff, selectedStaffId]);

  const roleCatalog = useMemo(() => {
    return roles
      .map((role) => {
        const dangerousPermissionCount = (role.permissions || []).filter((p) => p.is_dangerous).length;
        return {
          ...role,
          dangerousPermissionCount,
          permissionCount: (role.permissions || []).length,
        };
      })
      .filter((role) => (showDangerousOnly ? role.dangerousPermissionCount > 0 : true));
  }, [roles, showDangerousOnly]);

  const filteredStaff = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((s) => {
      return (
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.position?.toLowerCase().includes(q) ||
        s.userEmail?.toLowerCase().includes(q) ||
        String(s.userId || "").includes(q)
      );
    });
  }, [staff, filterText]);

  const desiredRoleSet = useMemo(() => new Set(selectedRoles), [selectedRoles]);

  const roleDiff = useMemo(() => {
    const current = selectedStaff?.iamRoles || [];
    const toAssign = selectedRoles.filter((r) => !current.includes(r));
    const toRevoke = current.filter((r) => !selectedRoles.includes(r));
    return { toAssign, toRevoke };
  }, [selectedRoles, selectedStaff]);

  const changed = roleDiff.toAssign.length > 0 || roleDiff.toRevoke.length > 0;

  const pushNotice = (type, text) => {
    setNotice({ type, text });
  };

  const loadRoleHistory = useCallback(async (userId) => {
    if (!userId) {
      setRoleHistory([]);
      return;
    }

    setLoadingHistory(true);
    try {
      const res = await api.get(`/api/v1/admin/users/${userId}/role-history`, {
        params: { limit: 10 },
      });
      setRoleHistory(res.data || []);
    } catch (error) {
      console.error("Failed to load role history", error);
      setRoleHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [staffRes, rolesRes, readinessRes] = await Promise.all([
        api.get("/api/v1/admin/dashboard/staff"),
        api.get("/api/v1/admin/roles"),
        api.get("/api/v1/admin/dashboard/iam/readiness"),
      ]);

      const staffData = staffRes.data || [];
      setStaff(staffData);
      setRoles((rolesRes.data || []).filter((r) => r.is_active));
      setIamReadiness(readinessRes.data || null);

      setSelectedStaffId((prevId) => {
        if (prevId && staffData.some((s) => s.id === prevId)) {
          return prevId;
        }
        if (staffData.length === 0) {
          return null;
        }
        const firstLinked = staffData.find((s) => s.userId);
        const fallback = firstLinked || staffData[0];
        setSelectedRoles(fallback.iamRoles || []);
        setLinkUserInput(fallback.userId ? String(fallback.userId) : "");
        return fallback.id;
      });

      pushNotice("success", "Access data refreshed.");
    } catch (error) {
      console.error("Failed to load IAM access data", error);
      pushNotice("error", "Failed to load staff access data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (selectedStaff) {
      setSelectedRoles(selectedStaff.iamRoles || []);
      setLinkUserInput(selectedStaff.userId ? String(selectedStaff.userId) : "");
      loadRoleHistory(selectedStaff.userId);
    }
  }, [selectedStaff, loadRoleHistory]);

  useEffect(() => {
    const q = userSearch.trim();
    if (q.length < 2) {
      setUserCandidates([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const res = await api.get("/api/v1/admin/users", {
          params: { limit: 50 },
        });

        const query = q.toLowerCase();
        const candidates = (res.data || []).filter((u) => {
          return (
            u.email?.toLowerCase().includes(query) ||
            u.full_name?.toLowerCase().includes(query) ||
            String(u.id).includes(query)
          );
        });
        setUserCandidates(candidates.slice(0, 8));
      } catch (error) {
        console.error("Failed to search users", error);
        setUserCandidates([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [userSearch]);

  const toggleRole = (slug) => {
    setSelectedRoles((prev) => (prev.includes(slug) ? prev.filter((r) => r !== slug) : [...prev, slug]));
  };

  const applyPreset = (preset) => {
    if (preset === "delivery") {
      setSelectedRoles(["driver", "helper"]);
      return;
    }
    if (preset === "operations") {
      setSelectedRoles(["manager", "helper"]);
      return;
    }
    if (preset === "support") {
      setSelectedRoles(["helper"]);
    }
  };

  const saveRoleAssignments = async () => {
    if (!selectedStaff) return;
    if (!selectedStaff.userId) {
      pushNotice("error", "Link this staff member to a user account first.");
      return;
    }

    const { toAssign, toRevoke } = roleDiff;
    if (toAssign.length === 0 && toRevoke.length === 0) {
      pushNotice("info", "No role changes to save.");
      return;
    }

    setSaving(true);
    try {
      for (const roleSlug of toAssign) {
        await api.post(`/api/v1/admin/users/${selectedStaff.userId}/roles`, {
          role_slug: roleSlug,
          reason: "Assigned from Staff Access panel",
        });
      }

      for (const roleSlug of toRevoke) {
        await api.delete(`/api/v1/admin/users/${selectedStaff.userId}/roles/${roleSlug}`, {
          params: { reason: "Updated from Staff Access panel" },
        });
      }

      await loadData();
      await loadRoleHistory(selectedStaff.userId);
      pushNotice("success", "Role assignments updated successfully.");
    } catch (error) {
      console.error("Failed to save role assignments", error);
      pushNotice("error", error?.response?.data?.detail || "Failed to save role assignments.");
    } finally {
      setSaving(false);
    }
  };

  const saveBulkRoleAssignments = async () => {
    if (selectedStaffIds.length === 0) {
      pushNotice("error", "Select at least one staff member for bulk assignment.");
      return;
    }

    if (bulkRoles.length === 0) {
      pushNotice("error", "Select at least one role to assign.");
      return;
    }

    const linkedStaff = staff.filter(s => selectedStaffIds.includes(s.id) && s.userId);
    if (linkedStaff.length === 0) {
      pushNotice("error", "None of the selected staff members are linked to user accounts.");
      return;
    }

    setSaving(true);
    let successCount = 0;
    let failCount = 0;

    try {
      for (const staffMember of linkedStaff) {
        try {
          for (const roleSlug of bulkRoles) {
            // Skip if already has this role
            if (!staffMember.iamRoles.includes(roleSlug)) {
              await api.post(`/api/v1/admin/users/${staffMember.userId}/roles`, {
                role_slug: roleSlug,
                reason: "Bulk assigned from Staff Access panel",
              });
            }
          }
          successCount++;
        } catch (error) {
          console.error(`Failed to assign roles to ${staffMember.name}`, error);
          failCount++;
        }
      }

      await loadData();
      
      if (failCount === 0) {
        pushNotice("success", `Bulk role assignment successful for ${successCount} staff member(s).`);
      } else {
        pushNotice("error", `Completed with issues: ${successCount} succeeded, ${failCount} failed.`);
      }
      
      // Reset bulk mode
      setSelectedStaffIds([]);
      setBulkRoles([]);
    } catch (error) {
      console.error("Failed to complete bulk assignment", error);
      pushNotice("error", "Bulk assignment failed.");
    } finally {
      setSaving(false);
    }
  };

  const linkUserToStaff = async (userIdOverride) => {
    if (!selectedStaff) return;
    const numericUserId = userIdOverride || Number(linkUserInput);
    if (!Number.isInteger(numericUserId) || numericUserId <= 0) {
      pushNotice("error", "Enter a valid numeric User ID.");
      return;
    }

    setSaving(true);
    try {
      await api.put(`/api/v1/admin/dashboard/staff/${selectedStaff.id}`, {
        user_id: numericUserId,
      });
      await loadData();
      pushNotice("success", `Staff linked to user #${numericUserId}.`);
    } catch (error) {
      console.error("Failed to link staff account", error);
      pushNotice("error", error?.response?.data?.detail || "Failed to link staff account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-text-muted">Loading staff access controls...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-plum-deep tracking-tight">Staff Access Control Center</h2>
          <p className="text-sm text-text-muted">Role mapping, account linking, audit history, and secure IAM controls</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setBulkMode(!bulkMode);
              setSelectedStaffIds([]);
              setBulkRoles([]);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${
              bulkMode 
                ? "bg-amber-500 text-white hover:bg-amber-600" 
                : "border border-stone-border text-plum-deep hover:bg-stone-light"
            }`}
          >
            <span className="material-symbols-outlined text-base">checklist</span>
            {bulkMode ? "Exit Bulk Mode" : "Bulk Assign"}
          </button>
          <button
            onClick={() => navigate("/staff/operations")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-border text-plum-deep hover:bg-stone-light font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-base">factory</span>
            Operations View
          </button>
          <button
            onClick={() => navigate("/staff/delivery")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-border text-plum-deep hover:bg-stone-light font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-base">local_shipping</span>
            Delivery View
          </button>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-plum-deep text-white hover:bg-plum-light font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {notice.text ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm font-medium ${
            notice.type === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : notice.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-blue-200 bg-blue-50 text-blue-700"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      {bulkMode && (
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-plum-deep">Bulk Role Assignment Mode</h3>
              <p className="text-sm text-text-muted">Select staff members and assign roles to all at once</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const linkedStaffIds = staff.filter(s => s.userId).map(s => s.id);
                  setSelectedStaffIds(linkedStaffIds);
                }}
                className="px-3 py-1.5 rounded-lg border border-stone-border text-plum-deep hover:bg-white font-semibold text-xs"
              >
                Select All Linked
              </button>
              <button
                onClick={() => setSelectedStaffIds([])}
                className="px-3 py-1.5 rounded-lg border border-stone-border text-plum-deep hover:bg-white font-semibold text-xs"
              >
                Clear Selection
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-plum-deep mb-2">Selected Staff ({selectedStaffIds.length})</p>
              <div className="flex flex-wrap gap-2">
                {selectedStaffIds.length === 0 ? (
                  <span className="text-xs text-text-muted">No staff selected</span>
                ) : (
                  staff.filter(s => selectedStaffIds.includes(s.id)).map(s => (
                    <span key={s.id} className="px-2 py-1 rounded-full bg-plum-deep text-white text-xs font-semibold">
                      {s.name}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-plum-deep mb-2">Roles to Assign ({bulkRoles.length})</p>
              <div className="flex flex-wrap gap-2">
                {roles.map(role => (
                  <button
                    key={role.slug}
                    onClick={() => {
                      setBulkRoles(prev => 
                        prev.includes(role.slug) 
                          ? prev.filter(r => r !== role.slug) 
                          : [...prev, role.slug]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                      bulkRoles.includes(role.slug)
                        ? "bg-plum-deep text-white border-plum-deep"
                        : "border-stone-border text-plum-deep hover:bg-white"
                    }`}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            disabled={saving || selectedStaffIds.length === 0 || bulkRoles.length === 0}
            onClick={saveBulkRoleAssignments}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-amber-600 text-white hover:bg-amber-700 font-bold text-sm disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-base">group_add</span>
            {saving ? "Processing..." : `Assign ${bulkRoles.length} role(s) to ${selectedStaffIds.length} staff member(s)`}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-5">
        <div className="bg-white rounded-xl border border-stone-border shadow-sm p-4 space-y-4">
          <div className="rounded-lg border border-stone-border bg-warm-white p-3">
            <p className="text-xs uppercase tracking-wide font-bold text-text-muted">IAM Readiness</p>
            <p className={`mt-1 text-sm font-bold ${iamReadiness?.status === "healthy" ? "text-green-700" : "text-amber-700"}`}>
              {(iamReadiness?.status || "unknown").toUpperCase()}
            </p>
            <p className="text-xs text-text-muted mt-1">
              Roles: {iamReadiness?.metrics?.roles ?? "-"} | Permissions: {iamReadiness?.metrics?.permissions ?? "-"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-stone-border p-2.5">
              <p className="text-xs text-text-muted">Linked Staff</p>
              <p className="text-xl font-black text-plum-deep">{staff.filter((s) => s.userId).length}</p>
            </div>
            <div className="rounded-lg border border-stone-border p-2.5">
              <p className="text-xs text-text-muted">Unlinked</p>
              <p className="text-xl font-black text-amber-700">{staff.filter((s) => !s.userId).length}</p>
            </div>
          </div>

          <input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search by name, role, email, user id"
            className="w-full rounded-lg border border-stone-border px-3 py-2 text-sm"
          />

          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredStaff.map((member) => {
              const isSelected = selectedStaffId === member.id;
              const isBulkSelected = bulkMode && selectedStaffIds.includes(member.id);
              
              return (
                <div key={member.id} className="flex items-center gap-2">
                  {bulkMode && (
                    <input
                      type="checkbox"
                      checked={isBulkSelected}
                      onChange={() => {
                        setSelectedStaffIds(prev =>
                          prev.includes(member.id)
                            ? prev.filter(id => id !== member.id)
                            : [...prev, member.id]
                        );
                      }}
                      className="w-4 h-4 text-plum-deep border-stone-border rounded cursor-pointer"
                    />
                  )}
                  
                  <button
                    onClick={() => !bulkMode && setSelectedStaffId(member.id)}
                    className={`flex-1 text-left rounded-lg border px-3 py-2 transition-colors ${
                      isSelected && !bulkMode 
                        ? "border-plum-deep bg-plum-deep text-white" 
                        : isBulkSelected 
                        ? "border-amber-400 bg-amber-50" 
                        : "border-stone-border hover:bg-stone-light"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold text-sm ${isSelected && !bulkMode ? "text-white" : "text-plum-deep"}`}>{member.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isSelected && !bulkMode ? "bg-white/20 text-white" : "bg-stone-light text-text-muted"}`}>
                        {member.iamRoles?.length || 0} roles
                      </span>
                    </div>
                    <p className={`text-xs ${isSelected && !bulkMode ? "text-white/80" : "text-text-muted"}`}>{member.position}</p>
                    <p className={`text-[11px] mt-1 ${isSelected && !bulkMode ? "text-white/85" : member.userId ? "text-green-700" : "text-red-600"}`}>
                      {member.userId ? `Linked User #${member.userId}` : "No linked user"}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-border shadow-sm p-5 space-y-4">
            {!selectedStaff ? (
              <p className="text-sm text-text-muted">Select a staff member to manage access.</p>
            ) : (
              <>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-extrabold text-plum-deep">{selectedStaff.name}</h3>
                    <p className="text-sm text-text-muted">{selectedStaff.position} | {selectedStaff.userEmail || "No linked user email"}</p>
                  </div>
                  <button
                    disabled={saving || !changed}
                    onClick={saveRoleAssignments}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-plum-deep text-white hover:bg-plum-light font-semibold text-sm disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-base">verified_user</span>
                    {saving ? "Saving..." : "Save Access Changes"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_auto] gap-3 items-end">
                  <label className="block">
                    <span className="text-sm font-semibold text-plum-deep">Link User ID</span>
                    <input
                      value={linkUserInput}
                      onChange={(e) => setLinkUserInput(e.target.value)}
                      placeholder="e.g. 12"
                      className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2 text-sm"
                    />
                  </label>
                  <div>
                    <span className="text-xs text-text-muted">Search users by email/name (permission-based)</span>
                    <input
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Type at least 2 chars"
                      className="mt-1 w-full rounded-lg border border-stone-border px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => linkUserToStaff()}
                    disabled={saving}
                    className="h-[42px] px-4 rounded-lg border border-stone-border text-plum-deep hover:bg-stone-light font-semibold text-sm disabled:opacity-60"
                  >
                    Link Manual ID
                  </button>
                </div>

                {searchingUsers ? <p className="text-xs text-text-muted">Searching users...</p> : null}
                {userCandidates.length > 0 ? (
                  <div className="rounded-lg border border-stone-border p-2 max-h-[150px] overflow-y-auto">
                    {userCandidates.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setLinkUserInput(String(u.id));
                          linkUserToStaff(u.id);
                        }}
                        className="w-full text-left px-2.5 py-2 rounded hover:bg-stone-light"
                      >
                        <p className="text-sm font-semibold text-plum-deep">{u.full_name} <span className="text-xs text-text-muted">(#{u.id})</span></p>
                        <p className="text-xs text-text-muted">{u.email}</p>
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-lg border border-stone-border bg-warm-white p-3">
                  <p className="text-xs uppercase tracking-wide font-bold text-text-muted">Change Preview</p>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold text-green-700">Will Assign ({roleDiff.toAssign.length})</p>
                      <p className="text-xs text-text-muted mt-1">{roleDiff.toAssign.join(", ") || "None"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-700">Will Revoke ({roleDiff.toRevoke.length})</p>
                      <p className="text-xs text-text-muted mt-1">{roleDiff.toRevoke.join(", ") || "None"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedRoles(roleCatalog.map((r) => r.slug))} className="px-3 py-1.5 rounded-md border border-stone-border text-xs font-semibold text-plum-deep hover:bg-stone-light">Select visible roles</button>
                  <button onClick={() => setSelectedRoles([])} className="px-3 py-1.5 rounded-md border border-stone-border text-xs font-semibold text-plum-deep hover:bg-stone-light">Clear all</button>
                  <button onClick={() => setShowDangerousOnly((v) => !v)} className={`px-3 py-1.5 rounded-md border text-xs font-semibold ${showDangerousOnly ? "border-red-300 bg-red-50 text-red-700" : "border-stone-border text-plum-deep hover:bg-stone-light"}`}>Dangerous only</button>
                  <button onClick={() => applyPreset("delivery")} className="px-3 py-1.5 rounded-md border border-stone-border text-xs font-semibold text-plum-deep hover:bg-stone-light">Preset: Delivery</button>
                  <button onClick={() => applyPreset("operations")} className="px-3 py-1.5 rounded-md border border-stone-border text-xs font-semibold text-plum-deep hover:bg-stone-light">Preset: Operations</button>
                  <button onClick={() => applyPreset("support")} className="px-3 py-1.5 rounded-md border border-stone-border text-xs font-semibold text-plum-deep hover:bg-stone-light">Preset: Support</button>
                </div>

                <div>
                  <p className="text-sm font-semibold text-plum-deep mb-3">Role Matrix</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {roleCatalog.map((role) => {
                      const checked = desiredRoleSet.has(role.slug);
                      const hasDanger = role.dangerousPermissionCount > 0;
                      return (
                        <label
                          key={role.slug}
                          className={`flex items-start gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors ${checked ? "border-plum-deep bg-plum-50" : "border-stone-border hover:bg-stone-light"}`}
                        >
                          <input type="checkbox" checked={checked} onChange={() => toggleRole(role.slug)} className="mt-1" />
                          <span className="w-full">
                            <span className="flex items-center justify-between gap-2">
                              <span className="block font-semibold text-sm text-plum-deep">{role.name}</span>
                              {hasDanger ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">dangerous</span> : null}
                            </span>
                            <span className="block text-xs text-text-muted">{role.slug}</span>
                            <span className="block text-[11px] text-text-muted mt-1">{role.permissionCount} perms | {role.dangerousPermissionCount} critical</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl border border-stone-border shadow-sm p-5">
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-extrabold text-plum-deep uppercase tracking-wide">Recent Access Audit</h4>
              {selectedStaff?.userId ? <span className="text-xs text-text-muted">User #{selectedStaff.userId}</span> : null}
            </div>
            {loadingHistory ? (
              <p className="text-sm text-text-muted mt-3">Loading role history...</p>
            ) : roleHistory.length === 0 ? (
              <p className="text-sm text-text-muted mt-3">No role assignment activity found for this user.</p>
            ) : (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-light/60 text-plum-deep">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold">Action</th>
                      <th className="px-3 py-2 text-left font-bold">Role ID</th>
                      <th className="px-3 py-2 text-left font-bold">Reason</th>
                      <th className="px-3 py-2 text-left font-bold">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roleHistory.map((log) => (
                      <tr key={log.id} className="border-t border-stone-border/70">
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${log.action === "assigned" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-text-muted">{log.role_id}</td>
                        <td className="px-3 py-2 text-text-muted">{log.reason || "-"}</td>
                        <td className="px-3 py-2 text-text-muted">{fmtShortDate(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
