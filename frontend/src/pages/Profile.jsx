import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/auth";
import usePageTitle from "../hooks/usePageTitle";
import Breadcrumbs from "../components/store/Breadcrumbs";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function Profile() {
  usePageTitle("My Profile");
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
      <main id="main" className="vd-wrap py-16 font-display" aria-busy="true">
        <div className="h-40 vd-skeleton" />
      </main>
    );
  }

  if (!profile) {
    return (
      <main id="main" className="vd-wrap min-h-[50vh] py-16 font-display">
        <h1 className="vd-h2">Profile not available</h1>
        {error && <p className="mt-2 text-ink-2">{error}</p>}
      </main>
    );
  }

  const roleLabel = profile.iam_roles?.length > 0 ? profile.iam_roles[0] : profile.role;

  return (
    <main id="main" className="font-display">
      <div className="vd-wrap pb-14 pt-5 lg:pb-20">
        {isStaffContext ? (
          <button onClick={() => navigate("/staff/workspace")} className="vd-link inline-flex items-center gap-1 text-sm">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Workspace
          </button>
        ) : (
          <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "My Profile" }]} />
        )}

        <div className="mt-5 flex items-center gap-4">
          <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-lg bg-night text-xl font-bold text-white">{avatarLetter}</span>
          <div className="min-w-0">
            <h1 className="vd-h1 truncate !text-[1.75rem] lg:!text-[2.25rem]">{profile.full_name}</h1>
            <p className="flex flex-wrap items-center gap-x-2 text-[0.9375rem] text-ink-2">
              <span className="truncate">{profile.email}</span>
              <span className="vd-chip capitalize">{roleLabel}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Account information */}
          <section className="min-w-0 lg:col-span-8" aria-labelledby="account-info">
            <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
              <div>
                <h2 id="account-info" className="vd-h3">Account Information</h2>
                <p className="text-sm text-ink-2">Update your personal details</p>
              </div>
              {!editing && (
                <button onClick={() => { setEditing(true); setSuccess(""); setError(""); }} className="vd-btn vd-btn-quiet">
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit
                </button>
              )}
            </div>

            {error && (
              <div className="vd-alert vd-alert-error mt-4" role="alert">
                <span className="material-symbols-outlined text-lg">error</span>{error}
              </div>
            )}
            {success && (
              <div className="vd-alert vd-alert-ok mt-4" role="status">
                <span className="material-symbols-outlined text-lg">check_circle</span>{success}
              </div>
            )}

            <div className="mt-5 grid gap-x-8 gap-y-5 md:grid-cols-2">
              <ProfileField id="profile-name" label="Full Name" editing={editing} value={profile.full_name}>
                <input id="profile-name" name="name" type="text" autoComplete="name" value={form.full_name}
                  onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))} className="vd-input" placeholder="Your full name" />
              </ProfileField>
              <ProfileField label="Email Address" value={profile.email} />
              <ProfileField id="profile-phone" label="Phone Number" editing={editing} value={profile.phone || <span className="text-ink-2">Not provided</span>}>
                <input id="profile-phone" name="tel" type="tel" inputMode="tel" autoComplete="tel" value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" className="vd-input" />
              </ProfileField>
              <ProfileField label="Member Since" value={formatDate(profile.created_at)} />
              <ProfileField label="Account Type" value={<span className="capitalize">{profile.role}</span>} />
              <ProfileField label="Last Login" value={formatDate(profile.last_login_at)} />
              {profile.iam_roles?.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-[0.8125rem] text-ink-2">Roles</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {profile.iam_roles.map((r) => <span key={r} className="vd-chip capitalize">{r}</span>)}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
              <Link to="/forgot-password" className="vd-link text-sm">Change Password</Link>
              {editing && (
                <div className="flex items-center gap-3">
                  <button onClick={handleCancel} disabled={saving} className="vd-btn vd-btn-quiet">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="vd-btn vd-btn-ink">
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* Quick links */}
          <nav className="lg:col-span-4" aria-label="Account shortcuts">
            <ul className="border-t border-line">
              {[
                { label: "My Orders", sub: "View order history", icon: "receipt_long", to: isStaffContext ? "/staff/orders" : "/orders" },
                { label: "Browse Products", sub: "Place a new order", icon: "inventory_2", to: isStaffContext ? "/staff/products" : "/products" },
                { label: "Contact Us", sub: "Get support", icon: "mail", to: "/contact" },
              ].map((l) => (
                <li key={l.label} className="border-b border-line">
                  <Link to={l.to} className="group flex items-center gap-3 py-3.5">
                    <span className="material-symbols-outlined text-2xl text-ink-2">{l.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-semibold group-hover:underline underline-offset-2">{l.label}</span>
                      <span className="block text-[0.8125rem] text-ink-2">{l.sub}</span>
                    </span>
                    <span className="material-symbols-outlined text-xl text-ink-3 transition-transform group-hover:translate-x-0.5">arrow_forward</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </main>
  );
}

function ProfileField({ id, label, value, editing, children }) {
  if (editing && children) {
    return (
      <div>
        <label htmlFor={id} className="vd-label">{label}</label>
        {children}
      </div>
    );
  }
  return (
    <div>
      <p className="text-[0.8125rem] text-ink-2">{label}</p>
      <p className="mt-0.5 break-words font-medium">{value}</p>
    </div>
  );
}
