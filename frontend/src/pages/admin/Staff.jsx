import { useEffect, useState } from "react";
import api from "../../api/axios";

const POSITIONS = ["Manager","Designer","Operator","Driver","Helper","Sales","Admin","Other"];
const DEPARTMENTS = ["Production","Design","Sales","Admin","Delivery","Support"];
const STATUSES = ["active","invited","suspended","offboarded"];

const STATUS_STYLE = {
  active:      "bg-green-100 text-green-700",
  invited:     "bg-blue-100 text-blue-700",
  suspended:   "bg-amber-100 text-amber-700",
  offboarded:  "bg-stone-100 text-stone-500",
};

const EMPTY = { name:"", position: POSITIONS[0], phone:"", email:"", department: DEPARTMENTS[0], status:"active", user_id: "" };

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/dashboard/staff");
      setStaff(res.data || []);
    } catch { setStaff([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = staff.filter(s =>
    !search ||
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.position?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.department?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditId(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (s) => {
    setEditId(s.id);
    setForm({ name: s.name||"", position: s.position||POSITIONS[0], phone: s.phone||"",
      email: s.email||"", department: s.department||DEPARTMENTS[0], status: s.status||"active",
      user_id: s.userId ? String(s.userId) : "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, user_id: form.user_id ? Number(form.user_id) : null };
      if (editId) await api.put("/api/v1/admin/dashboard/staff/" + editId, payload);
      else await api.post("/api/v1/admin/dashboard/staff", payload);
      setShowModal(false);
      await load();
      showToast(editId ? "Staff updated" : "Staff member added");
    } catch (err) {
      showToast((err?.response?.data?.detail) || "Failed to save", "error");
    } finally { setSaving(false); }
  };

  const confirmDelete = async () => {
    try {
      await api.delete("/api/v1/admin/dashboard/staff/" + deleteId);
      setDeleteId(null);
      await load();
      showToast("Staff member removed");
    } catch {
      showToast("Delete failed", "error");
    }
  };

  const stats = {
    total: staff.length,
    active: staff.filter(s => s.status === "active").length,
    invited: staff.filter(s => s.status === "invited").length,
  };

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
          <h1 className="text-[1.375rem] font-bold text-plum-deep">Staff</h1>
          <p className="text-[0.8125rem] text-text-muted">{stats.total} members · {stats.active} active · {stats.invited} invited</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-plum-deep text-white text-[0.875rem] font-bold hover:bg-plum-light transition-all hover:-translate-y-0.5">
          <span className="material-symbols-outlined text-base">person_add</span>
          Add Staff
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Staff",  value: stats.total,   icon: "groups",       color: "text-plum-deep" },
          { label: "Active",       value: stats.active,  icon: "check_circle", color: "text-green-600" },
          { label: "Invited",      value: stats.invited, icon: "mail",         color: "text-blue-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-[12px] border border-stone-border p-4 flex items-center gap-3">
            <span className={"material-symbols-outlined text-2xl " + s.color}>{s.icon}</span>
            <div>
              <p className="text-[1.25rem] font-black text-plum-deep leading-none">{s.value}</p>
              <p className="text-[0.75rem] text-text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base">search</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, position, department…"
          className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-[12px] border border-stone-border p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-text-muted/30 mb-3">groups</span>
          <p className="text-[0.9375rem] font-semibold text-plum-deep">No staff members found</p>
          <p className="text-[0.8125rem] text-text-muted mb-4">Add your first staff member to get started</p>
          <button onClick={openCreate} className="h-9 px-5 rounded-lg bg-plum-deep text-white text-sm font-bold hover:bg-plum-light transition-all">
            Add Staff Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(s => (
            <div key={s.id} className="bg-white rounded-[12px] border border-stone-border p-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-plum-deep flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {(s.name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.9375rem] font-bold text-plum-deep truncate">{s.name}</p>
                  <p className="text-[0.75rem] text-text-muted">{s.position}</p>
                </div>
                <span className={"text-[0.625rem] font-bold px-2 py-0.5 rounded-full " + (STATUS_STYLE[s.status] || "bg-stone-100 text-stone-500")}>
                  {s.status}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                {s.department && (
                  <div className="flex items-center gap-2 text-[0.75rem] text-text-muted">
                    <span className="material-symbols-outlined text-sm">business</span>
                    {s.department}
                  </div>
                )}
                {s.phone && (
                  <div className="flex items-center gap-2 text-[0.75rem] text-text-muted">
                    <span className="material-symbols-outlined text-sm">phone</span>
                    {s.phone}
                  </div>
                )}
                {s.email && (
                  <div className="flex items-center gap-2 text-[0.75rem] text-text-muted">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span className="truncate">{s.email}</span>
                  </div>
                )}
                {s.userEmail && (
                  <div className="flex items-center gap-2 text-[0.75rem] text-blue-600">
                    <span className="material-symbols-outlined text-sm">link</span>
                    <span className="truncate">Linked: {s.userEmail}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(s)}
                  className="flex-1 h-8 rounded-lg border border-stone-border text-[0.75rem] font-semibold text-plum-deep hover:bg-stone-light transition-colors flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
                <button onClick={() => setDeleteId(s.id)}
                  className="w-8 h-8 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto dropdown-enter">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-border">
              <h2 className="text-[1rem] font-bold text-plum-deep">{editId ? "Edit Staff Member" : "Add Staff Member"}</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-plum-deep">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Full Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Ravi Kumar"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Position *</label>
                  <select value={form.position} onChange={e => setForm(f => ({...f, position: e.target.value}))}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 outline-none bg-white">
                    {POSITIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Department</label>
                  <select value={form.department} onChange={e => setForm(f => ({...f, department: e.target.value}))}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 outline-none bg-white">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Phone *</label>
                <input required value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  placeholder="+91 98765 43210"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  placeholder="staff@vijetha.com"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Status</label>
                <select value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}
                  className="w-full h-10 px-3 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 outline-none bg-white">
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Link to User Account (optional)
                </label>
                <input type="number" value={form.user_id} onChange={e => setForm(f => ({...f, user_id: e.target.value}))}
                  placeholder="User ID (leave blank if not linked)"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
                <p className="text-[0.6875rem] text-text-muted mt-1">Links this staff profile to a login account</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 h-10 rounded-lg border border-stone-border text-sm font-semibold text-text-muted hover:bg-stone-light transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 h-10 rounded-lg bg-plum-deep text-white text-sm font-bold hover:bg-plum-light transition-all disabled:opacity-60">
                  {saving ? "Saving…" : editId ? "Save Changes" : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 dropdown-enter text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 text-2xl">person_remove</span>
            </div>
            <h3 className="text-[1rem] font-bold text-plum-deep mb-2">Remove Staff Member?</h3>
            <p className="text-[0.8125rem] text-text-muted mb-5">This will remove the staff profile. Their user account (if linked) will not be deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 h-10 rounded-lg border border-stone-border text-sm font-semibold text-text-muted hover:bg-stone-light transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
