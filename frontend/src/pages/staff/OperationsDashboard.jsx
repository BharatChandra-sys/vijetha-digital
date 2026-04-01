import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Container from "../../components/layout/Container";

const STAGE_OPTIONS = ["all", "printing", "quality_check", "finishing", "ready_dispatch"];

function hasPermission(user, resource, action) {
  if (!user || !user.iam_roles) return false;
  if (user.role === "admin") return true;
  const permissions = user.permissions || [];
  return permissions.some(p => p.resource === resource && p.action === action);
}

export default function OperationsDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stageFilter, setStageFilter] = useState("all");
  const [query, setQuery] = useState("");

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((job) => {
      const stageMatch = stageFilter === "all" || job.stage === stageFilter;
      const queryMatch = !q || job.id.toLowerCase().includes(q) || job.client.toLowerCase().includes(q) || job.owner.toLowerCase().includes(q);
      return stageMatch && queryMatch;
    });
  }, [jobs, stageFilter, query]);

  const canUpdateOrders = hasPermission(user, "orders", "update");

  const loadJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/dashboard/orders");
      const ordersData = res.data || [];
      
      const productionJobs = ordersData
        .filter(o => ["printing", "quality_check", "shipped", "delivered"].includes(o.status) || o.status === "confirmed")
        .map(o => ({
          id: `#${o.id}`,
          orderId: o.id,
          client: o.customerName || "Unknown",
          stage: o.status === "confirmed" ? "printing" : o.status === "shipped" ? "ready_dispatch" : o.status,
          eta: o.createdAt ? new Date(o.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "N/A",
          owner: user?.full_name || "Unassigned",
          totalAmount: o.totalAmount,
        }));
      
      setJobs(productionJobs);
    } catch (error) {
      console.error("Failed to load production jobs", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadJobs();
    const interval = setInterval(loadJobs, 30000);
    return () => clearInterval(interval);
  }, [loadJobs]);

  const metrics = useMemo(() => {
    const total = jobs.length;
    const inPrinting = jobs.filter((j) => j.stage === "printing").length;
    const qa = jobs.filter((j) => j.stage === "quality_check").length;
    const ready = jobs.filter((j) => j.stage === "ready_dispatch").length;
    return { total, inPrinting, qa, ready };
  }, [jobs]);

  const moveStage = async (orderId, nextStage) => {
    if (!canUpdateOrders) {
      alert("You don't have permission to update order stages.");
      return;
    }

    try {
      await api.put(`/api/v1/admin/dashboard/orders/${orderId}/status`, { status: nextStage });
      await loadJobs();
    } catch (error) {
      console.error("Failed to update order stage", error);
      alert(error?.response?.data?.detail || "Failed to update order stage");
    }
  };

  const sections = [
    {
      id: "printing",
      title: "Production - Printing",
      description: "Jobs currently in printing stage",
      icon: "print",
      count: metrics.inPrinting,
      color: "from-blue-500 to-cyan-600",
      accent: "#3B82F6",
    },
    {
      id: "quality_check",
      title: "Quality Assurance",
      description: "Jobs undergoing quality check",
      icon: "verified",
      count: metrics.qa,
      color: "from-amber-500 to-orange-600",
      accent: "#F59E0B",
    },
    {
      id: "ready_dispatch",
      title: "Ready for Dispatch",
      description: "Jobs ready to be shipped",
      icon: "local_shipping",
      count: metrics.ready,
      color: "from-green-500 to-emerald-600",
      accent: "#10B981",
    },
  ];

  return (
    <Container>
      <div className="py-12 space-y-8">
        {/* Back + Header */}
        <div>
          <button
            onClick={() => navigate("/staff/workspace")}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#6E6E73] hover:text-[#3B2F63] transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Workspace
          </button>
          <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#1C1C1C] mb-2">Operations Dashboard</h1>
            <p className="text-[#6E6E73]">
              Manage production jobs, track progress, and coordinate manufacturing workflows
            </p>
            <p className="text-sm text-[#6E6E73] mt-3">
              Logged in as: <span className="font-semibold text-[#3B2F63]">{user?.full_name || user?.email}</span>
            </p>
          </div>
          <button
            onClick={loadJobs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3B2F63] text-white font-semibold hover:bg-[#2D244C] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            <span>Refresh</span>
          </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-wide text-blue-600 mb-2">Total Active Jobs</p>
                <p className="text-4xl font-bold text-blue-900">{metrics.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-200 text-blue-700">
                <span className="material-symbols-outlined text-2xl">task_alt</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 border-2 border-cyan-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-wide text-cyan-600 mb-2">Printing</p>
                <p className="text-4xl font-bold text-cyan-900">{metrics.inPrinting}</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-200 text-cyan-700">
                <span className="material-symbols-outlined text-2xl">print</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-wide text-amber-600 mb-2">Quality Check</p>
                <p className="text-4xl font-bold text-amber-900">{metrics.qa}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-200 text-amber-700">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs uppercase font-bold tracking-wide text-green-600 mb-2">Ready Dispatch</p>
                <p className="text-4xl font-bold text-green-900">{metrics.ready}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-200 text-green-700">
                <span className="material-symbols-outlined text-2xl">local_shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setStageFilter(section.id)}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F8F7F4] to-[#F0EEEB] border-2 border-[#E6E3DD] hover:border-[#FF6B5E] p-6 text-left transition-all hover:shadow-xl hover:scale-[1.02]"
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${section.color}`} />

              {/* Icon Background Gradient */}
              <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${section.color} opacity-5 rounded-2xl`} />

              <div className="relative">
                {/* Icon */}
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 transition-all group-hover:scale-110 group-hover:shadow-lg"
                  style={{
                    backgroundColor: section.accent + "15",
                    border: `2.5px solid ${section.accent}`,
                  }}
                >
                  <span
                    className="material-symbols-outlined text-3xl"
                    style={{ color: section.accent }}
                  >
                    {section.icon}
                  </span>
                </div>

                {/* Content */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-[#1C1C1C] text-lg mb-1 group-hover:text-[#FF6B5E] transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-[#6E6E73] mb-4">
                      {section.description}
                    </p>
                  </div>
                  {section.count > 0 && (
                    <div
                      className="flex-shrink-0 px-3 py-1 rounded-full text-sm font-bold text-white"
                      style={{ backgroundColor: section.accent }}
                    >
                      {section.count}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all">
                  <span
                    className="group-hover:text-[#FF6B5E] transition-colors"
                    style={{ color: section.accent }}
                  >
                    View Jobs
                  </span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" style={{ color: section.accent }}>
                    arrow_forward
                  </span>
                </div>
              </div>

              {/* Hover gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
            </button>
          ))}
        </div>

        {/* Production Jobs Table */}
        <div className="rounded-2xl border-2 border-[#E6E3DD] bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1C1C1C]">Production Jobs</h2>
            <span className="text-sm text-[#6E6E73]">{filteredJobs.length} jobs</span>
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {STAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  onClick={() => setStageFilter(option)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    stageFilter === option
                      ? "bg-[#3B2F63] text-white shadow-md"
                      : "bg-[#F0EEEB] text-[#3B2F63] hover:bg-[#E6E3DD] border-2 border-[#E6E3DD]"
                  }`}
                >
                  {option.replace("_", " ")}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by order, client, or owner..."
              className="w-full lg:w-[300px] rounded-lg border-2 border-[#E6E3DD] px-4 py-2 text-sm focus:outline-none focus:border-[#3B2F63] transition-colors"
            />
          </div>

          {/* Jobs Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-[#6E6E73]">
                <span className="material-symbols-outlined text-4xl mb-2 block">hourglass_empty</span>
                <p>Loading production jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="p-12 text-center text-[#6E6E73]">
                <span className="material-symbols-outlined text-4xl mb-2 block">inbox</span>
                <p>No jobs match the current filter.</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-[#F0EEEB] text-[#3B2F63]">
                  <tr>
                    <th className="px-4 py-3 text-left font-bold">Order ID</th>
                    <th className="px-4 py-3 text-left font-bold">Client</th>
                    <th className="px-4 py-3 text-left font-bold">Owner</th>
                    <th className="px-4 py-3 text-left font-bold">Time</th>
                    <th className="px-4 py-3 text-left font-bold">Stage</th>
                    {canUpdateOrders && <th className="px-4 py-3 text-right font-bold">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="border-b border-[#E6E3DD] hover:bg-[#F8F7F4] transition-colors">
                      <td className="px-4 py-3 font-bold text-[#3B2F63]">{job.id}</td>
                      <td className="px-4 py-3 text-[#6E6E73]">{job.client}</td>
                      <td className="px-4 py-3 text-[#6E6E73]">{job.owner}</td>
                      <td className="px-4 py-3 text-[#6E6E73]">{job.eta}</td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#3B2F63]/10 text-[#3B2F63]">
                          {job.stage.replace("_", " ")}
                        </span>
                      </td>
                      {canUpdateOrders && (
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            {job.stage === "printing" && (
                              <button
                                onClick={() => moveStage(job.orderId, "quality_check")}
                                className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-700 font-semibold border-2 border-amber-500/30 hover:bg-amber-500/20 transition-colors text-xs"
                              >
                                → QA
                              </button>
                            )}
                            {job.stage === "quality_check" && (
                              <button
                                onClick={() => moveStage(job.orderId, "shipped")}
                                className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-700 font-semibold border-2 border-green-500/30 hover:bg-green-500/20 transition-colors text-xs"
                              >
                                → Ready
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/staff/delivery"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 border-2 border-emerald-600 p-6 text-white transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Delivery Dashboard</h3>
                <p className="text-sm text-white/80">Track shipments and delivery status</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                local_shipping
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
              <span>Access Delivery</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>

          <Link
            to="/admin/dashboard"
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#3B2F63] to-[#2D244C] border-2 border-[#3B2F63] p-6 text-white transition-all hover:shadow-xl hover:scale-[1.02]"
          >
            <div className="relative flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg mb-1">Admin Dashboard</h3>
                <p className="text-sm text-white/80">Full system control and management</p>
              </div>
              <span className="material-symbols-outlined text-4xl opacity-20 group-hover:opacity-30 transition-opacity">
                admin_panel_settings
              </span>
            </div>
            <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
              <span>Go to Admin</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>
        </div>

        {/* Operations Info */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-blue-600 flex-shrink-0 text-2xl">info</span>
            <div>
              <h3 className="font-bold text-[#1C1C1C] mb-1">Production Workflow</h3>
              <p className="text-sm text-[#6E6E73]">
                Monitor all production stages from printing to quality assurance and dispatch. Update job stages as they progress through the workflow. All changes are logged and tracked for complete visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
