import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";

const ACTION_COLORS = {
  login_success:          "bg-green-100 text-green-700",
  login_failed:           "bg-red-100 text-red-700",
  otp_sent:               "bg-blue-100 text-blue-700",
  otp_verified:           "bg-green-100 text-green-700",
  otp_verify_failed:      "bg-red-100 text-red-700",
  password_reset_success: "bg-green-100 text-green-700",
  password_reset_failed:  "bg-red-100 text-red-700",
};

const DEVICE_ICONS = {
  mobile:  "smartphone",
  tablet:  "tablet",
  desktop: "computer",
};

function Badge({ action }) {
  const cls = ACTION_COLORS[action] || "bg-stone-100 text-stone-600";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.6875rem] font-semibold ${cls}`}>
      {action.replace(/_/g, " ")}
    </span>
  );
}

export default function SecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, failed: 0, suspicious: 0 });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "all") params.action = filter;
      const res = await api.get("/admin/access-logs", { params: { ...params, limit: 200 } });
      const data = res.data || [];
      setLogs(data);
      setStats({
        total: data.length,
        failed: data.filter(l => !l.success).length,
        suspicious: data.filter(l => l.action === "suspicious_request").length,
      });
    } catch (err) {
      console.error("Failed to load security logs", err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const filtered = logs.filter(l => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.email?.toLowerCase().includes(q) ||
      l.ip_address?.includes(q) ||
      l.action?.includes(q) ||
      l.browser?.toLowerCase().includes(q) ||
      l.os?.toLowerCase().includes(q)
    );
  });

  const FILTERS = [
    { value: "all",                   label: "All Events" },
    { value: "login_success",         label: "Logins" },
    { value: "login_failed",          label: "Failed Logins" },
    { value: "otp_sent",              label: "OTP Sent" },
    { value: "password_reset_success",label: "Password Resets" },
  ];

  return (
    <div className="min-h-screen bg-warm-white font-display">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[1.5rem] font-bold text-plum-deep">Security Logs</h1>
          <p className="text-[0.8125rem] text-text-muted mt-1">
            Real-time access tracking — IP addresses, devices, login attempts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Events",    value: stats.total,      icon: "history",       color: "text-plum-deep" },
            { label: "Failed Attempts", value: stats.failed,     icon: "block",         color: "text-red-600" },
            { label: "Suspicious",      value: stats.suspicious, icon: "warning",       color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[12px] border border-stone-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-[8px] bg-stone-light flex items-center justify-center flex-shrink-0">
                <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
              </div>
              <div>
                <p className="text-[1.25rem] font-black text-plum-deep leading-none">{s.value}</p>
                <p className="text-[0.75rem] text-text-muted mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="bg-white rounded-[12px] border border-stone-border p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base">search</span>
              <input
                type="text"
                placeholder="Search by email, IP, browser…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-stone-border bg-warm-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none"
              />
            </div>
            {/* Filter tabs */}
            <div className="flex gap-1 flex-wrap">
              {FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`h-9 px-3 rounded-lg text-[0.8125rem] font-semibold transition-all ${
                    filter === f.value
                      ? "bg-plum-deep text-white"
                      : "bg-stone-light text-text-muted hover:text-plum-deep"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              onClick={fetchLogs}
              className="h-9 px-4 rounded-lg border border-stone-border text-[0.8125rem] font-semibold text-plum-deep hover:bg-stone-light transition-colors flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[12px] border border-stone-border overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-plum-deep border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-[0.8125rem] text-text-muted">Loading logs…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center">
              <span className="material-symbols-outlined text-4xl text-text-muted/30 block mb-2">security</span>
              <p className="text-[0.875rem] font-semibold text-plum-deep">No logs found</p>
              <p className="text-[0.8125rem] text-text-muted">Try a different filter or search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[0.8125rem]">
                <thead>
                  <tr className="border-b border-stone-border bg-stone-light/50">
                    <th className="text-left px-4 py-3 font-semibold text-text-muted uppercase tracking-wide text-[0.6875rem]">Event</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted uppercase tracking-wide text-[0.6875rem]">User</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted uppercase tracking-wide text-[0.6875rem]">IP Address</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted uppercase tracking-wide text-[0.6875rem]">Device</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted uppercase tracking-wide text-[0.6875rem]">Detail</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-muted uppercase tracking-wide text-[0.6875rem]">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-border/60">
                  {filtered.map(log => (
                    <tr key={log.id} className={`hover:bg-stone-light/30 transition-colors ${!log.success ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-3">
                        <Badge action={log.action} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-plum-deep truncate max-w-[160px]">{log.email || "—"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-[0.75rem] text-text-dark bg-stone-light px-2 py-0.5 rounded">
                          {log.ip_address || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-text-muted">
                            {DEVICE_ICONS[log.device] || "devices"}
                          </span>
                          <span className="text-text-dark">{log.browser}</span>
                          <span className="text-text-muted">·</span>
                          <span className="text-text-muted">{log.os}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-text-muted truncate max-w-[200px] block">{log.detail || "—"}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-text-muted">
                        {log.created_at
                          ? new Date(log.created_at).toLocaleString("en-IN", {
                              day: "2-digit", month: "short",
                              hour: "2-digit", minute: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 py-3 border-t border-stone-border/60 text-[0.75rem] text-text-muted">
                Showing {filtered.length} of {logs.length} events
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
