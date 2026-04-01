import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const STATUS_FILTERS = ["all", "confirmed", "shipped", "delivered"];

function hasPermission(user, resource, action) {
  if (!user || !user.iam_roles) return false;
  // Admin bypass
  if (user.role === "admin") return true;
  
  // Check user permissions
  const permissions = user.permissions || [];
  return permissions.some(p => p.resource === resource && p.action === action);
}

export default function DeliveryDashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneQuery, setZoneQuery] = useState("");

  const filteredTrips = useMemo(() => {
    const q = zoneQuery.trim().toLowerCase();
    return trips.filter((trip) => {
      const statusMatch = statusFilter === "all" || trip.status === statusFilter;
      const queryMatch = !q || trip.customerName.toLowerCase().includes(q) || trip.customerPhone.toLowerCase().includes(q) || trip.id.toLowerCase().includes(q);
      return statusMatch && queryMatch;
    });
  }, [trips, statusFilter, zoneQuery]);

  const canUpdateOrders = hasPermission(user, "orders", "update");

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/dashboard/orders");
      const ordersData = res.data || [];
      
      // Transform orders to delivery trips (orders with shipping-related statuses)
      const deliveryTrips = ordersData
        .filter(o => ["confirmed", "shipped", "delivered"].includes(o.status))
        .map(o => ({
          id: `#${o.id}`,
          orderId: o.id,
          customerName: o.customerName || "Unknown",
          customerPhone: o.customerPhone || "N/A",
          status: o.status,
          trackingNumber: o.trackingNumber || "Pending",
          createdAt: o.createdAt ? new Date(o.createdAt).toLocaleDateString("en-IN") : "N/A",
          totalAmount: o.totalAmount,
        }));
      
      setTrips(deliveryTrips);
    } catch (error) {
      console.error("Failed to load delivery trips", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrips();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadTrips, 30000);
    return () => clearInterval(interval);
  }, [loadTrips]);

  const summary = useMemo(() => {
    return {
      confirmed: trips.filter((t) => t.status === "confirmed").length,
      shipped: trips.filter((t) => t.status === "shipped").length,
      delivered: trips.filter((t) => t.status === "delivered").length,
    };
  }, [trips]);

  const updateStatus = async (orderId, nextStatus) => {
    if (!canUpdateOrders) {
      alert("You don't have permission to update delivery status.");
      return;
    }

    try {
      await api.put(`/api/v1/admin/dashboard/orders/${orderId}/status`, { status: nextStatus });
      await loadTrips(); // Refresh after update
    } catch (error) {
      console.error("Failed to update delivery status", error);
      alert(error?.response?.data?.detail || "Failed to update delivery status");
    }
  };

  return (
    <section className="max-w-7xl mx-auto space-y-6 animate-[fadeIn_0.4s_ease-out]">
      <header className="rounded-2xl border border-stone-border bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted font-semibold">Staff Workspace</p>
            <h1 className="mt-2 text-3xl font-black text-plum-deep">Delivery Command Desk</h1>
            <p className="mt-2 text-sm text-text-muted">Dispatch routing, shipment status, and last-mile controls in one place.</p>
            <p className="mt-2 text-xs text-text-muted">Signed in as: {user?.full_name || user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={loadTrips} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-border text-plum-deep text-sm font-semibold hover:bg-stone-light">
              <span className="material-symbols-outlined text-base">refresh</span>
              Refresh
            </button>
            <Link to="/admin/dashboard" className="px-4 py-2 rounded-lg bg-plum-deep text-white text-sm font-semibold hover:bg-plum-light">Admin Dashboard</Link>
            <Link to="/staff/operations" className="px-4 py-2 rounded-lg border border-stone-border text-plum-deep text-sm font-semibold hover:bg-stone-light">Operations Board</Link>
          </div>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Ready to Ship" value={summary.confirmed} tone="bg-blue-50 border-blue-200" />
        <SummaryCard title="In Transit" value={summary.shipped} tone="bg-indigo-50 border-indigo-200" />
        <SummaryCard title="Delivered" value={summary.delivered} tone="bg-green-50 border-green-200" />
      </div>

      <div className="rounded-2xl border border-stone-border bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusFilter === status ? "bg-plum-deep text-white border-plum-deep" : "border-stone-border text-plum-deep hover:bg-stone-light"}`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
          <input
            value={zoneQuery}
            onChange={(e) => setZoneQuery(e.target.value)}
            placeholder="Search order, customer, or phone"
            className="w-full lg:w-[280px] rounded-lg border border-stone-border px-3 py-2 text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-text-muted">Loading delivery trips...</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-stone-light/60 text-plum-deep">
                <tr>
                  <th className="px-3 py-2 text-left font-bold">Order</th>
                  <th className="px-3 py-2 text-left font-bold">Customer</th>
                  <th className="px-3 py-2 text-left font-bold">Phone</th>
                  <th className="px-3 py-2 text-left font-bold">Tracking</th>
                  <th className="px-3 py-2 text-left font-bold">Status</th>
                  {canUpdateOrders && <th className="px-3 py-2 text-right font-bold">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTrips.length === 0 ? (
                  <tr>
                    <td colSpan={canUpdateOrders ? 6 : 5} className="px-3 py-8 text-center text-text-muted">No trips match the current filter.</td>
                  </tr>
                ) : (
                  filteredTrips.map((trip) => (
                    <tr key={trip.id} className="border-t border-stone-border/70">
                      <td className="px-3 py-2 font-semibold text-plum-deep">{trip.id}</td>
                      <td className="px-3 py-2 text-text-muted">{trip.customerName}</td>
                      <td className="px-3 py-2 text-text-muted">{trip.customerPhone}</td>
                      <td className="px-3 py-2 text-text-muted text-xs">{trip.trackingNumber}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-full bg-stone-light text-xs font-semibold text-plum-deep">{trip.status.replace("_", " ")}</span>
                      </td>
                      {canUpdateOrders && (
                        <td className="px-3 py-2">
                          <div className="flex justify-end gap-2">
                            {trip.status === "confirmed" && (
                              <button onClick={() => updateStatus(trip.orderId, "shipped")} className="px-2 py-1 rounded border border-stone-border text-xs font-semibold text-plum-deep hover:bg-stone-light">Ship</button>
                            )}
                            {trip.status === "shipped" && (
                              <button onClick={() => updateStatus(trip.orderId, "delivered")} className="px-2 py-1 rounded border border-green-200 text-xs font-semibold text-green-700 hover:bg-green-50">Deliver</button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ title, value, tone }) {
  return (
    <article className={`rounded-xl border ${tone} p-4 shadow-sm`}>
      <p className="text-xs uppercase font-bold tracking-wide text-text-muted">{title}</p>
      <p className="mt-1 text-3xl font-black text-plum-deep">{value}</p>
    </article>
  );
}
