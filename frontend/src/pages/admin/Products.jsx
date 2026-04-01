import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";

const CATEGORIES = ["Sign Boards","Printing Services","Banner Stands","Demo Tents","Promotional Items"];

const BADGE_MAP = {
  "Sign Boards":       { color: "bg-purple-100 text-purple-700" },
  "Printing Services": { color: "bg-blue-100 text-blue-700" },
  "Banner Stands":     { color: "bg-teal-100 text-teal-700" },
  "Demo Tents":        { color: "bg-orange-100 text-orange-700" },
  "Promotional Items": { color: "bg-pink-100 text-pink-700" },
};

function fmtPrice(v) {
  return "₹" + Number(v || 0).toLocaleString("en-IN");
}

const EMPTY_FORM = {
  name: "", category: CATEGORIES[0], description: "",
  base_price: "", unit: "sq ft", is_active: true, image: null,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/v1/admin/dashboard/products");
      setProducts(res.data || []);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = products.filter(p => {
    const matchCat = catFilter === "all" || p.category === catFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openCreate = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name || "", category: p.category || CATEGORIES[0],
      description: p.description || "", base_price: String(p.basePrice || ""),
      unit: p.unit || "sq ft", is_active: p.isActive !== false, image: null,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "image") { if (v) body.append("image", v); }
        else body.append(k, String(v));
      });
      if (editId) await api.put(`/api/v1/admin/dashboard/products/${editId}`, body);
      else await api.post("/api/v1/admin/dashboard/products", body);
      setShowModal(false);
      await load();
      showToast(editId ? "Product updated" : "Product created");
    } catch (err) {
      showToast(err?.response?.data?.detail || "Failed to save", "error");
    } finally { setSaving(false); }
  };

  const toggleActive = async (p) => {
    try {
      const body = new FormData();
      body.append("name", p.name); body.append("category", p.category);
      body.append("description", p.description || "");
      body.append("base_price", String(p.basePrice));
      body.append("unit", p.unit || "sq ft");
      body.append("is_active", String(!p.isActive));
      await api.put(`/api/v1/admin/dashboard/products/${p.id}`, body);
      await load();
      showToast(p.isActive ? "Product paused" : "Product deployed");
    } catch (err) {
      showToast(err?.response?.data?.detail || "Failed", "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/api/v1/admin/dashboard/products/${deleteId}`);
      setDeleteId(null);
      await load();
      showToast("Product deleted");
    } catch (err) {
      showToast(err?.response?.data?.detail || "Delete failed", "error");
    }
  };

  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive).length,
    paused: products.filter(p => !p.isActive).length,
  };

  return (
    <div className="font-display space-y-5">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[9999] flex items-center gap-2 px-4 py-3 rounded-xl shadow-card-enhanced text-[0.875rem] font-semibold dropdown-enter ${
          toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
        }`}>
          <span className="material-symbols-outlined text-base">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[1.375rem] font-bold text-plum-deep">Products</h1>
          <p className="text-[0.8125rem] text-text-muted">{stats.total} total · {stats.active} live · {stats.paused} paused</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 h-9 px-5 rounded-lg bg-plum-deep text-white text-[0.875rem] font-bold hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.97]">
          <span className="material-symbols-outlined text-base">add</span>
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Products", value: stats.total,  icon: "inventory_2",  color: "text-plum-deep" },
          { label: "Live",           value: stats.active, icon: "check_circle", color: "text-green-600" },
          { label: "Paused",         value: stats.paused, icon: "pause_circle", color: "text-amber-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-[12px] border border-stone-border p-4 flex items-center gap-3">
            <span className={`material-symbols-outlined text-2xl ${s.color}`}>{s.icon}</span>
            <div>
              <p className="text-[1.25rem] font-black text-plum-deep leading-none">{s.value}</p>
              <p className="text-[0.75rem] text-text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-base">search</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-9 pr-3 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              className={`h-9 px-3 rounded-lg text-[0.8125rem] font-semibold transition-all ${
                catFilter === c ? "bg-plum-deep text-white" : "bg-white border border-stone-border text-text-muted hover:text-plum-deep"
              }`}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-[12px] border border-stone-border overflow-hidden">
              <div className="aspect-[4/3] skeleton" />
              <div className="p-4 space-y-2">
                <div className="h-4 skeleton rounded w-3/4" />
                <div className="h-3 skeleton rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="material-symbols-outlined text-5xl text-text-muted/30 mb-3">inventory_2</span>
          <p className="text-[0.9375rem] font-semibold text-plum-deep">No products found</p>
          <p className="text-[0.8125rem] text-text-muted mb-4">Try a different filter or add a new product</p>
          <button onClick={openCreate} className="h-9 px-5 rounded-lg bg-plum-deep text-white text-sm font-bold hover:bg-plum-light transition-all">
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => {
            const catStyle = BADGE_MAP[p.category] || { color: "bg-stone-light text-text-muted" };
            return (
              <div key={p.id} className={`bg-white rounded-[12px] border overflow-hidden transition-all hover:shadow-card-hover hover:-translate-y-0.5 ${
                p.isActive ? "border-stone-border" : "border-stone-border/60 opacity-70"
              }`}>
                {/* Image */}
                <div className="aspect-[4/3] bg-stone-light relative overflow-hidden">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-text-muted/30">image</span>
                    </div>
                  )}
                  {/* Status badge */}
                  <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[0.625rem] font-bold ${
                    p.isActive ? "bg-green-500 text-white" : "bg-stone-500 text-white"
                  }`}>
                    {p.isActive ? "LIVE" : "PAUSED"}
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <span className={`inline-block text-[0.625rem] font-bold px-2 py-0.5 rounded-full mb-1.5 ${catStyle.color}`}>
                    {p.category}
                  </span>
                  <h3 className="text-[0.875rem] font-bold text-plum-deep leading-snug line-clamp-2 mb-1">{p.name}</h3>
                  <p className="text-[0.875rem] font-black text-plum-deep">
                    {fmtPrice(p.basePrice)}
                    <span className="text-[0.6875rem] font-normal text-text-muted ml-1">/ {p.unit || "unit"}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="px-3 pb-3 flex gap-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="flex-1 h-8 rounded-lg text-[0.75rem] font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={{ background: "#F5F4F1", color: "#1A1F3C", border: "1px solid #E8E6E2" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#ECEAE6"}
                    onMouseLeave={e => e.currentTarget.style.background = "#F5F4F1"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(p)}
                    className="flex-1 h-8 rounded-lg text-[0.75rem] font-semibold transition-all flex items-center justify-center gap-1.5"
                    style={{
                      background: p.isActive ? "#FFF7ED" : "#F0FDF4",
                      color: p.isActive ? "#C2410C" : "#15803D",
                      border: p.isActive ? "1px solid #FED7AA" : "1px solid #BBF7D0",
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      {p.isActive ? "pause" : "play_arrow"}
                    </span>
                    {p.isActive ? "Pause" : "Deploy"}
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "#F5F4F1", color: "#9A9AA5", border: "1px solid #E8E6E2" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; e.currentTarget.style.color = "#DC2626"; e.currentTarget.style.borderColor = "#FECACA"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#F5F4F1"; e.currentTarget.style.color = "#9A9AA5"; e.currentTarget.style.borderColor = "#E8E6E2"; }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto dropdown-enter">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-border">
              <h2 className="text-[1rem] font-bold text-plum-deep">{editId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-plum-deep transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Product Name *</label>
                <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                  placeholder="e.g. Vinyl Sign Board"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Unit</label>
                  <select value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 outline-none bg-white">
                    {["sq ft","piece","set","roll","meter","sheet"].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Base Price (₹) *</label>
                <input required type="number" min="0" step="0.01" value={form.base_price}
                  onChange={e => setForm(f => ({...f, base_price: e.target.value}))}
                  placeholder="450"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none" />
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                  rows={3} placeholder="Product details, materials, specifications…"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none resize-none" />
              </div>
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Product Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-stone-border rounded-lg p-4 text-center cursor-pointer hover:border-plum-deep/40 transition-colors">
                  {form.image ? (
                    <p className="text-[0.8125rem] text-plum-deep font-medium">{form.image.name}</p>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-3xl text-text-muted/40 block mb-1">upload</span>
                      <p className="text-[0.8125rem] text-text-muted">Click to upload image</p>
                      <p className="text-[0.75rem] text-text-muted/60">JPG, PNG up to 10MB</p>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden"
                  onChange={e => setForm(f => ({...f, image: e.target.files[0] || null}))} />
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm(f => ({...f, is_active: !f.is_active}))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-stone-300"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : ""}`} />
                </button>
                <span className="text-[0.875rem] font-medium text-plum-deep">
                  {form.is_active ? "Deploy immediately (visible to customers)" : "Save as draft (hidden)"}
                </span>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 h-10 rounded-lg border border-stone-border text-sm font-semibold text-text-muted hover:bg-stone-light transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 h-10 rounded-lg bg-plum-deep text-white text-sm font-bold hover:bg-plum-light transition-all disabled:opacity-60">
                  {saving ? "Saving…" : editId ? "Save Changes" : "Create Product"}
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
              <span className="material-symbols-outlined text-red-600 text-2xl">delete_forever</span>
            </div>
            <h3 className="text-[1rem] font-bold text-plum-deep mb-2">Delete Product?</h3>
            <p className="text-[0.8125rem] text-text-muted mb-5">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 h-10 rounded-lg border border-stone-border text-sm font-semibold text-text-muted hover:bg-stone-light transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete}
                className="flex-1 h-10 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
