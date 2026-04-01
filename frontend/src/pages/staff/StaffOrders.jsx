import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/layout/Container";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { getAdminOrders } from "../../api/admin";
import { formatPrice } from "../../utils/format";

export default function StaffOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let active = true;

    const fetchOrders = async () => {
      try {
        const data = await getAdminOrders();
        if (active) setOrders(data);
      } catch {
        // Staff may not have access — show empty
        if (active) setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const statusLabel = (status) => {
    switch (status) {
      case "payment_initiated": return "AWAITING PAYMENT";
      case "paid": return "PAID";
      case "completed": return "COMPLETED";
      case "cancelled": return "CANCELLED";
      default: return status?.toUpperCase() || "UNKNOWN";
    }
  };

  const statusVariant = (status) => {
    if (status === "paid" || status === "completed") return "success";
    if (status === "payment_initiated") return "warning";
    if (status === "cancelled") return "danger";
    return "default";
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    payment_initiated: orders.filter((o) => o.status === "payment_initiated").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  if (loading) {
    return (
      <Container>
        <div className="py-12 flex items-center justify-center gap-3 text-[#6E6E73]">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Loading orders…
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-12 space-y-8">
        <div>
          <button
            onClick={() => navigate("/staff/workspace")}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#6E6E73] hover:text-[#3B2F63] transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Workspace
          </button>
          <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">Order Tracking</h1>
          <p className="text-[#6E6E73]">
            View all customer orders, track status updates, and monitor fulfillment progress
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All" },
            { key: "paid", label: "Paid" },
            { key: "payment_initiated", label: "Awaiting Payment" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab.key
                  ? "bg-[#3B2F63] text-white"
                  : "bg-[#F8F7F4] text-[#6E6E73] border border-[#E6E3DD] hover:bg-[#F0EEEB]"
              }`}
            >
              {tab.label} ({counts[tab.key] || 0})
            </button>
          ))}
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#6E6E73]">
            <span className="material-symbols-outlined text-5xl mb-3 block">inbox</span>
            <p className="font-medium">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((o) => (
              <Card key={o.id}>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-[#1C1C1C]">Order #{o.id}</p>
                    <p className="text-sm text-[#6E6E73]">{o.user_email}</p>
                    <p className="text-sm font-semibold text-[#1C1C1C]">₹ {formatPrice(o.total_price)}</p>
                    <Badge variant={statusVariant(o.status)}>
                      {statusLabel(o.status)}
                    </Badge>
                  </div>
                  <div className="text-sm text-[#6E6E73] text-right space-y-1">
                    {o.created_at && (
                      <p>
                        {new Date(o.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                    {o.items?.length > 0 && (
                      <p>{o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
