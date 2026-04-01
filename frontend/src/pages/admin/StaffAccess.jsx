import { useEffect, useState } from "react";
import api from "../../api/axios";

const ROLE_COLORS = {
  super_admin: "bg-red-100 text-red-700 border-red-200",
  admin:       "bg-purple-100 text-purple-700 border-purple-200",
  manager:     "bg-blue-100 text-blue-700 border-blue-200",
  driver:      "bg-teal-100 text-teal-700 border-teal-200",
  helper:      "bg-amber-100 text-amber-700 border-amber-200",
  customer:    "bg-stone-100 text-stone-600 border-stone-200",
};

const STATUS_COLORS = {
  active:     "bg-green-100 text-green-700",
  invited:    "bg-blue-100 text-blue-700",
  suspended:  "bg-amber-100 text-amber-700",
  offboarded: "bg-stone-100 text-stone-500",
};

export default function StaffAccess() {
  const [staff, setStaff] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [working, setWorking] = useState(null); // staff id being modified

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const [staffRes, rolesRes] = await Promise.all([
        api.get("/api/v1/admin/dashboard/staff"),
        api.get("/admin/roles?limit=50"),
      ]);
      setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
      setRoles(Array.isArray(rolesRes.data) ? rolesRes.data : []);
    } catch (e) {
      console.error("StaffAccess load error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const assignRole = async (staffMember, roleSlug) => {
    if (!staffMember.userId) {
      showToast("This staff member has no linked user account. Link one in Staff management first.", "error");
      return;
    }
    setWorking(staffMember.id);
    try {
      await api.post(`/admin/users/${staffMember.userId}/roles`, {
        role_slug: roleSlug,
        reason: "Assigned via Staff Access panel",
      });
      await load();
      showToast(`Role "${roleSlug}" assigned to ${staffMember.name}`);
    } catch (err) {
      showToast(err?.response?.data?.detail || "Failed to assign role", "error");
    } finally { setWorking(null); }
  };

  const revokeRole = async (staffMember, roleSlug) => {
    if (!staffMember.userId) return;
    setWorking(staffMember.id);
    try {
      await api.delete(`/admin/users/${staffMember.userId}/roles/${roleSlug}`);
      await load();
      showToast(`Role "${roleSlug}" revoked from ${staffMember.name}`);
    } catch (err) {
      showToast(err?.response?.data?.detail || "Failed to revoke role", "error");
    } finally { setWorking(null); }
  };

  const suspendStaff = async (staffMember) => {
    if (!staffMember.userId) {
      showToast("No linked account to suspend", "error");
      return;
    }
    if (!window.confirm(`Suspend ${staffMember.name}'s account?`)) return;
    setWorking(staffMember.id);
    try {
      await api.post(`/admin/users/${staffMember.userId}/suspend`);
      await load();
      showToast(`${staffMember.name} suspended`);
    } catch (err) {
      showToast(err?.response?.data?.detail || "Failed", "error");
    } finally { setWorking(null); }
  };

  const filtered = staff.filter(s => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      s.name?.toLowerCase().includes(q) ||
      s.position?.toLowerCase().includes(q) ||
      s.department?.toLowerCase().includes(q) ||
      s.userEmail?.toLowerCase().includes(q)
    );
  });

  // Only show roles that make sense for staff (not customer/guest)
  const staffRoles = roles.filter(r => !["customer", "guest"].includes(r.slug));

  const linkedCount = staff.filter(s => s.userId).length;
  const withRolesCount = staff.filter(s => s.iamRoles && s.iamRoles.length > 0).length;

  return (
    <div className="space-y-5" style={{ fontFamily: "Manrope, sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-[0.875rem] font-semibold dropdown-enter ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
        }`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-[1.375rem] font-bold text-[#1A1F3C]">Staff Access</h1>
        <p className="text-[0.8125rem] text-[#9A9AA5] mt-0.5">
          Manage portal access and roles for your staff members
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Staff",    value: staff.length,    icon: "groups",         color: "text-[#1A1F3C]" },
          { label: "Linked Accounts",value: linkedCount,     icon: "link",           color: "text-blue-600" },
          { label: "With Roles",     value: withRolesCount,  icon: "admin_panel_settings", color: "text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8E6E2] p-4 flex items-center gap-3">
            <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
            <div>
              <p className="text-[1.25rem] font-black text-[#1A1F3C] leading-none">{s.value}</p>
              <p className="text-[0.75rem] text-[#9A9AA5]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Available roles reference */}
      {staffRoles.length > 0 && (
        <div className="bg-white rounded-xl border border-[#E8E6E2] p-4">
          <p className="text-[0.6875rem] font-black text-[#9A9AA5] uppercase tracking-wider mb-3">
            Available Roles
          </p>
          <div className="flex flex-wrap gap-2">
            {staffRoles.map(r => (
              <span key={r.slug}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.75rem] font-semibold border ${ROLE_COLORS[r.slug] || "bg-stone-100 text-stone-600 border-stone-200"}`}>
                {r.name}
                <span className="opacity-50 text-[0.5625rem]">{r.permissions?.length || 0}p</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9AA5] text-base">search</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search staff by name, position, department…"
          className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-[#E8E6E2] bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1F3C]/20 focus:border-[#1A1F3C]"
        />
      </div>

      {/* Staff table */}
      <div className="bg-white rounded-xl border border-[#E8E6E2] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <div className="w-8 h-8 border-2 border-[#1A1F3C] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <span className="material-symbols-outlined text-5xl text-[#9A9AA5]/30 block mb-3">manage_accounts</span>
            <p className="text-[0.9375rem] font-semibold text-[#1A1F3C]">No staff members found</p>
            <p className="text-[0.8125rem] text-[#9A9AA5] mt-1">
              Add staff members in the Staff section first
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[0.8125rem]">
              <thead>
                <tr className="border-b border-[#E8E6E2] bg-[#F5F4F1]">
                  {["Staff Member", "Position", "Status", "Linked Account", "IAM Roles", "Assign Role", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[0.6875rem] font-black text-[#9A9AA5] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E2]/60">
                {filtered.map(s => {
                  const isWorking = working === s.id;
                  const currentRoles = s.iamRoles || [];
                  const availableToAssign = staffRoles.filter(r => !currentRoles.includes(r.slug));

                  return (
                    <tr key={s.id} className="hover:bg-[#F5F4F1]/50 transition-colors">
                      {/* Staff member */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#1A1F3C] text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                            {(s.name || "?")[0].toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#1A1F3C] truncate max-w-[120px]">{s.name}</p>
                            {s.email && (
                              <p className="text-[#9A9AA5] text-[0.6875rem] truncate max-w-[120px]">{s.email}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="px-4 py-3">
                        <p className="text-[#1A1F3C] font-medium">{s.position || "—"}</p>
                        {s.department && (
                          <p className="text-[#9A9AA5] text-[0.6875rem]">{s.department}</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[0.6875rem] font-bold ${STATUS_COLORS[s.status] || "bg-stone-100 text-stone-600"}`}>
                          {s.status || "active"}
                        </span>
                      </td>

                      {/* Linked account */}
                      <td className="px-4 py-3">
                        {s.userId ? (
                          <div>
                            <p className="text-[0.75rem] font-semibold text-[#1A1F3C] truncate max-w-[140px]">
                              {s.userFullName || s.userEmail}
                            </p>
                            <p className="text-[0.6875rem] text-[#9A9AA5] truncate max-w-[140px]">
                              {s.userEmail}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[0.75rem] text-[#9A9AA5] italic">No account linked</span>
                        )}
                      </td>

                      {/* Current IAM roles */}
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {currentRoles.length === 0 ? (
                            <span className="text-[0.75rem] text-[#9A9AA5]">None</span>
                          ) : (
                            currentRoles.map(slug => (
                              <button
                                key={slug}
                                onClick={() => revokeRole(s, slug)}
                                disabled={isWorking || !s.userId}
                                title={`Click to revoke ${slug}`}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.625rem] font-bold border cursor-pointer hover:opacity-70 transition-opacity disabled:cursor-not-allowed ${ROLE_COLORS[slug] || "bg-stone-100 text-stone-600 border-stone-200"}`}
                              >
                                {slug}
                                <span className="material-symbols-outlined" style={{ fontSize: 10 }}>close</span>
                              </button>
                            ))
                          )}
                        </div>
                      </td>

                      {/* Assign role */}
                      <td className="px-4 py-3">
                        {s.userId ? (
                          <select
                            disabled={isWorking}
                            value=""
                            onChange={e => { if (e.target.value) assignRole(s, e.target.value); }}
                            className="h-8 px-2 text-[0.75rem] rounded-lg border border-[#E8E6E2] bg-white focus:outline-none focus:ring-2 focus:ring-[#1A1F3C]/20 disabled:opacity-50 cursor-pointer"
                          >
                            <option value="" disabled>+ Add role</option>
                            {availableToAssign.map(r => (
                              <option key={r.slug} value={r.slug}>{r.name}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-[0.75rem] text-[#9A9AA5]">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        {s.userId && s.userStatus !== "suspended" && (
                          <button
                            onClick={() => suspendStaff(s)}
                            disabled={isWorking}
                            className="h-7 px-2.5 rounded-lg border border-amber-200 text-amber-700 text-[0.75rem] font-semibold hover:bg-amber-50 transition-colors disabled:opacity-50"
                          >
                            Suspend
                          </button>
                        )}
                        {s.userStatus === "suspended" && (
                          <span className="text-[0.75rem] text-amber-600 font-semibold">Suspended</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Help note */}
      <div className="bg-[#1A1F3C]/5 border border-[#1A1F3C]/10 rounded-xl p-4 flex items-start gap-3">
        <span className="material-symbols-outlined text-[#1A1F3C] text-xl flex-shrink-0 mt-0.5">info</span>
        <div>
          <p className="text-[0.875rem] font-bold text-[#1A1F3C] mb-1">How Staff Access works</p>
          <p className="text-[0.8125rem] text-[#5A5A65] leading-relaxed">
            Staff members need a linked user account to have portal access. Go to <strong>Staff</strong> to add staff members and link their accounts.
            Once linked, assign roles here to control what they can access in the staff portal.
            Click any role badge to revoke it.
          </p>
        </div>
      </div>
    </div>
  );
}
