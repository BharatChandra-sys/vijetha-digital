import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/auth";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function Profile() {
  const { isAuthenticated, updateUserInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStaffContext = location.pathname.startsWith("/staff");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ full_name: "", phone: "" });

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login?redirect=%2Fprofile", { replace: true }); return; }
    setLoading(true);
    getProfile()
      .then(data => {
        setProfile(data);
        setForm({ full_name: data.full_name || "", phone: data.phone || "" });
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    setError(""); setSuccess("");
    if (!form.full_name.trim()) { setError("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const updated = await updateProfile({ full_name: form.full_name.trim(), phone: form.phone.trim() || null });
      setProfile(prev => ({ ...prev, ...updated }));
      updateUserInfo({ full_name: updated.full_name });
      setEditing(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ full_name: profile?.full_name || "", phone: profile?.phone || "" });
    setEditing(false);
    setError("");
  };

  const avatarLetter = profile
    ? (profile.full_name?.[0] || profile.email?.[0] || "?").toUpperCase()
    : "?";

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-plum-deep border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex items-center justify-center text-text-muted">
        Profile not available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white font-display">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        {isStaffContext ? (
          <button
            onClick={() => navigate("/staff/workspace")}
            className="inline-flex items-center gap-1 text-sm font-medium text-text-muted hover:text-plum-deep transition-colors mb-8"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Workspace
          </button>
        ) : (
          <nav className="flex items-center text-xs text-text-muted mb-8">
            <Link to="/" className="hover:text-plum-deep transition-colors font-medium">Home</Link>
            <span className="material-symbols-outlined text-xs mx-2">chevron_right</span>
            <span className="text-plum-deep font-bold">My Profile</span>
          </nav>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left sidebar ── */}
          <div className="space-y-4">
            {/* Avatar card */}
            <div className="bg-white rounded-[12px] border border-stone-border shadow-card-default overflow-hidden">
              <div className="h-20 bg-plum-deep" />
              <div className="px-5 pb-5 -mt-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-plum-deep text-white flex items-center justify-center text-2xl font-bold shadow-soft-plum border-4 border-white">
                  {avatarLetter}
                </div>
                <h2 className="text-base font-bold text-plum-deep mt-3">{profile.full_name}</h2>
                <p className="text-[0.75rem] text-text-muted mt-0.5 truncate max-w-full">{profile.email}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 bg-plum-deep/5 px-3 py-1 rounded-full border border-plum-deep/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[0.6875rem] font-semibold text-plum-deep uppercase tracking-wide">
                    {profile.iam_roles?.length > 0 ? profile.iam_roles[0] : profile.role}
                  </span>
                </div>
              </div>
              <div className="border-t border-stone-border px-5 py-4 space-y-3">
                <div className="flex items-center justify-between text-[0.8125rem]">
                  <span className="text-text-muted flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-plum-deep/50">calendar_today</span>
                    Member since
                  </span>
                  <span className="font-semibold text-plum-deep">{new Date(profile.created_at).getFullYear()}</span>
                </div>
                <div className="flex items-center justify-between text-[0.8125rem]">
                  <span className="text-text-muted flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-plum-deep/50">badge</span>
                    Account type
                  </span>
                  <span className="font-semibold text-plum-deep capitalize">{profile.role}</span>
                </div>
              </div>
            </div>

            {/* Quick links */}
            {[
              { label: "My Orders",       sub: "View order history",  icon: "receipt_long",  to: isStaffContext ? "/staff/orders" : "/orders" },
              { label: "Browse Products", sub: "Place a new order",   icon: "inventory_2",   to: isStaffContext ? "/staff/products" : "/products" },
              { label: "Contact Us",      sub: "Get support",         icon: "mail",          to: "/contact" },
            ].map(l => (
              <Link key={l.label} to={l.to}
                className="flex items-center justify-between bg-white rounded-[12px] border border-stone-border p-4 hover:border-plum-deep/30 hover:shadow-card-default transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[8px] bg-plum-deep/5 flex items-center justify-center group-hover:bg-plum-deep/10 transition-colors">
                    <span className="material-symbols-outlined text-plum-deep text-lg">{l.icon}</span>
                  </div>
                  <div>
                    <p className="text-[0.875rem] font-bold text-plum-deep">{l.label}</p>
                    <p className="text-[0.75rem] text-text-muted">{l.sub}</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-text-muted text-lg group-hover:text-plum-deep transition-colors">arrow_forward</span>
              </Link>
            ))}
          </div>

          {/* ── Right: form ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[12px] border border-stone-border shadow-card-default overflow-hidden">

              {/* Header */}
              <div className="px-6 py-5 border-b border-stone-border flex items-center justify-between">
                <div>
                  <h2 className="text-[1.125rem] font-bold text-plum-deep">Account Information</h2>
                  <p className="text-[0.8125rem] text-text-muted mt-0.5">Update your personal details</p>
                </div>
                {!editing && (
                  <button
                    onClick={() => { setEditing(true); setSuccess(""); setError(""); }}
                    className="inline-flex items-center gap-2 h-9 px-4 bg-plum-deep hover:bg-plum-light text-white rounded-[8px] text-sm font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                )}
              </div>

              {/* Alerts */}
              <div className="px-6 pt-5">
                {error && (
                  <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-[8px] text-sm text-red-700">
                    <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
                    {error}
                  </div>
                )}
                {success && (
                  <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-[8px] text-sm text-green-700">
                    <span className="material-symbols-outlined text-base flex-shrink-0">check_circle</span>
                    {success}
                  </div>
                )}
              </div>

              {/* Fields */}
              <div className="px-6 pb-6 grid md:grid-cols-2 gap-5">
                {/* Full name */}
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      value={form.full_name}
                      onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                      className="w-full h-11 px-4 border-2 border-plum-deep/20 rounded-[8px] text-[0.9375rem] font-medium text-plum-deep focus:outline-none focus:border-plum-deep transition-colors"
                      placeholder="Your full name"
                    />
                  ) : (
                    <div className="h-11 flex items-center px-4 bg-stone-light rounded-[8px] text-[0.9375rem] font-medium text-plum-deep border border-stone-border">
                      {profile.full_name}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="h-11 flex items-center px-4 bg-stone-light rounded-[8px] text-[0.9375rem] font-medium text-plum-deep border border-stone-border">
                    {profile.email}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full h-11 px-4 border-2 border-plum-deep/20 rounded-[8px] text-[0.9375rem] font-medium text-plum-deep focus:outline-none focus:border-plum-deep transition-colors"
                    />
                  ) : (
                    <div className="h-11 flex items-center px-4 bg-stone-light rounded-[8px] text-[0.9375rem] font-medium border border-stone-border">
                      {profile.phone || <span className="text-text-muted font-normal">Not provided</span>}
                    </div>
                  )}
                </div>

                {/* Member since */}
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Member Since</label>
                  <div className="h-11 flex items-center px-4 bg-stone-light rounded-[8px] text-[0.9375rem] font-medium text-plum-deep border border-stone-border">
                    {formatDate(profile.created_at)}
                  </div>
                </div>

                {/* Account type */}
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Account Type</label>
                  <div className="h-11 flex items-center px-4 bg-stone-light rounded-[8px] text-[0.9375rem] font-medium text-plum-deep capitalize border border-stone-border">
                    {profile.role}
                  </div>
                </div>

                {/* Last login */}
                <div>
                  <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Last Login</label>
                  <div className="h-11 flex items-center px-4 bg-stone-light rounded-[8px] text-[0.9375rem] font-medium text-plum-deep border border-stone-border">
                    {formatDate(profile.last_login_at)}
                  </div>
                </div>

                {/* IAM roles */}
                {profile.iam_roles?.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Roles</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.iam_roles.map(r => (
                        <span key={r} className="inline-flex items-center gap-1.5 text-[0.75rem] bg-plum-deep/5 text-plum-deep font-semibold px-3 py-1 rounded-full border border-plum-deep/10 capitalize">
                          <span className="w-1.5 h-1.5 rounded-full bg-plum-deep/50" />
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="border-t border-stone-border px-6 py-4 flex items-center justify-between gap-4 flex-wrap bg-stone-light/30">
                <Link to="/forgot-password" className="text-[0.8125rem] font-semibold text-plum-deep hover:text-coral-accent transition-colors">
                  Change Password
                </Link>
                {editing && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="h-9 px-4 text-sm font-semibold border border-stone-border text-text-muted rounded-[8px] hover:bg-stone-light disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="h-9 px-5 text-sm bg-plum-deep text-white font-bold rounded-[8px] hover:bg-plum-light disabled:opacity-50 transition-all inline-flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-base">save</span>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
