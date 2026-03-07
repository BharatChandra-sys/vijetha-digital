import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/auth";
import { User, Mail, Phone, Calendar, Edit2, Save, X, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { 
    year: "numeric", 
    month: "long", 
    day: "numeric" 
  });
}

export default function Profile() {
  const { user, isAuthenticated, updateUserInfo } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ 
    full_name: "", 
    phone: "" 
  });

  useEffect(() => {
    if (!isAuthenticated) { 
      navigate("/login?redirect=%2Fprofile", { replace: true }); 
      return; 
    }
    setLoadingProfile(true);
    getProfile()
      .then(data => { 
        setProfile(data); 
        setForm({ 
          full_name: data.full_name || "", 
          phone: data.phone || "" 
        }); 
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoadingProfile(false));
  }, [isAuthenticated, navigate]);

  const handleSave = async () => {
    setError(""); 
    setSuccess("");
    if (!form.full_name.trim()) { 
      setError("Name cannot be empty"); 
      return; 
    }
    setSaving(true);
    try {
      const updated = await updateProfile({ 
        full_name: form.full_name.trim(), 
        phone: form.phone.trim() || null 
      });
      setProfile(prev => ({ ...prev, ...updated }));
      updateUserInfo({ full_name: updated.full_name });
      setEditing(false);
      setSuccess("Profile updated successfully ✓");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ 
      full_name: profile.full_name || "", 
      phone: profile.phone || "" 
    });
    setEditing(false); 
    setError("");
  };

  const avatarLetter = profile
    ? (profile.full_name?.[0] || profile.email?.[0] || "?").toUpperCase()
    : "?";

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-warm-white font-display flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-plum-deep border-t-transparent rounded-full animate-spin" />
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
    <div className="min-h-screen bg-gradient-to-br from-warm-white via-white to-plum-50 font-display relative overflow-hidden">
      {/* Background gradient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-plum-deep/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12 relative z-10">
        
        {/* Header Section */}
        <div className="mb-12">
          <nav className="flex items-center text-xs text-text-muted mb-4">
            <Link to="/" className="hover:text-plum-deep transition-colors font-medium">Home</Link>
            <span className="material-symbols-outlined text-xs mx-2">chevron_right</span>
            <span className="text-plum-deep font-bold">My Profile</span>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-plum-deep tracking-tight mb-2">My Profile</h1>
              <p className="text-text-muted text-lg">Manage and update your account information</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border-2 border-plum-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Header gradient */}
              <div className="h-24 bg-gradient-to-br from-plum-deep via-plum-600 to-plum-700" />
              
              {/* Avatar and info */}
              <div className="px-6 pb-6 relative -mt-12">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-plum-deep to-plum-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg border-4 border-white">
                    {avatarLetter}
                  </div>
                  <h2 className="text-xl font-bold text-plum-deep mt-4 text-center">{profile.full_name}</h2>
                  <p className="text-sm text-text-muted text-center mt-1 truncate max-w-xs">{profile.email}</p>
                  <div className="mt-3 inline-flex items-center gap-2 bg-plum-50 px-3 py-1 rounded-full border border-plum-100">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-xs font-semibold text-plum-700 uppercase">{profile.role}</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="border-t border-plum-100 px-6 py-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-plum-600" />
                    Member Since
                  </span>
                  <span className="font-semibold text-plum-700">{formatDate(profile.created_at).split(" ")[2]}</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-plum-100">
                  <span className="text-text-muted flex items-center gap-2">
                    <User className="w-4 h-4 text-plum-600" />
                    Account Type
                  </span>
                  <span className="font-semibold text-plum-700 capitalize">{profile.role}</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <Link 
                to="/orders" 
                className="block bg-white rounded-xl border-2 border-plum-100 p-4 hover:border-plum-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-plum-100 flex items-center justify-center group-hover:bg-plum-200 transition-colors">
                      <span className="material-symbols-outlined text-plum-700">receipt_long</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-plum-900">My Orders</p>
                      <p className="text-xs text-text-muted">View your orders</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-plum-400 group-hover:text-plum-600">arrow_forward</span>
                </div>
              </Link>
              
              <Link 
                to="/products" 
                className="block bg-white rounded-xl border-2 border-coral-100 p-4 hover:border-coral-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-coral-100 flex items-center justify-center group-hover:bg-coral-200 transition-colors">
                      <span className="material-symbols-outlined text-coral-600">shopping_bag</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-plum-900">Browse Products</p>
                      <p className="text-xs text-text-muted">New order</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-coral-400 group-hover:text-coral-600">arrow_forward</span>
                </div>
              </Link>

              <Link 
                to="/contact" 
                className="block bg-white rounded-xl border-2 border-purple-100 p-4 hover:border-purple-300 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <span className="material-symbols-outlined text-purple-600">mail</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-plum-900">Contact Us</p>
                      <p className="text-xs text-text-muted">Need help?</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-purple-400 group-hover:text-purple-600">arrow_forward</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Right Content - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border-2 border-plum-100 shadow-lg overflow-hidden">
              
              {/* Header */}
              <div className="bg-gradient-to-r from-plum-50 to-plum-100 border-b-2 border-plum-100 px-8 py-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-plum-deep">Account Information</h2>
                  <p className="text-sm text-text-muted mt-1">Update your personal details</p>
                </div>
                {!editing && (
                  <button
                    onClick={() => { setEditing(true); setSuccess(""); setError(""); }}
                    className="flex items-center gap-2 bg-plum-deep hover:bg-plum-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                
                {/* Alerts */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl px-5 py-4 flex items-start gap-3 animate-in fade-in duration-300">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900">Error</p>
                      <p className="text-sm text-red-700 mt-0.5">{error}</p>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl px-5 py-4 flex items-start gap-3 animate-in fade-in duration-300">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Success</p>
                      <p className="text-sm text-green-700 mt-0.5">{success}</p>
                    </div>
                  </div>
                )}

                {/* Form Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-plum-900 mb-2 uppercase tracking-wide">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        value={form.full_name}
                        onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                        className="w-full border-2 border-plum-200 rounded-xl px-4 py-3 text-plum-900 font-semibold focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-transparent transition-all bg-white placeholder-text-muted"
                        placeholder="Your full name"
                      />
                    ) : (
                      <div className="bg-plum-50 border-2 border-plum-100 rounded-xl px-4 py-3 text-plum-900 font-semibold">
                        {profile.full_name}
                      </div>
                    )}
                  </div>

                  {/* Email (Read-only) */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-plum-900 mb-2 uppercase tracking-wide">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </label>
                    <div className="bg-plum-50 border-2 border-plum-100 rounded-xl px-4 py-3 text-plum-900 font-semibold">
                      {profile.email}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-plum-900 mb-2 uppercase tracking-wide">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Phone Number
                    </label>
                    {editing ? (
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 98765 43210"
                        className="w-full border-2 border-plum-200 rounded-xl px-4 py-3 text-plum-900 font-semibold focus:outline-none focus:ring-2 focus:ring-plum-500 focus:border-transparent transition-all bg-white placeholder-text-muted"
                      />
                    ) : (
                      <div className="bg-plum-50 border-2 border-plum-100 rounded-xl px-4 py-3 text-plum-900 font-semibold">
                        {profile.phone || <span className="text-text-muted font-normal">Not provided</span>}
                      </div>
                    )}
                  </div>

                  {/* Member Since */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-plum-900 mb-2 uppercase tracking-wide">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Member Since
                    </label>
                    <div className="bg-plum-50 border-2 border-plum-100 rounded-xl px-4 py-3 text-plum-900 font-semibold">
                      {formatDate(profile.created_at)}
                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-plum-900 mb-2 uppercase tracking-wide">
                      Account Type
                    </label>
                    <div className="bg-plum-50 border-2 border-plum-100 rounded-xl px-4 py-3 text-plum-900 font-semibold capitalize">
                      {profile.role}
                    </div>
                  </div>

                  {/* Last Login */}
                  <div className="md:col-span-1">
                    <label className="block text-sm font-bold text-plum-900 mb-2 uppercase tracking-wide">
                      Last Login
                    </label>
                    <div className="bg-plum-50 border-2 border-plum-100 rounded-xl px-4 py-3 text-plum-900 font-semibold">
                      {formatDate(profile.last_login_at)}
                    </div>
                  </div>
                </div>

                {/* Roles */}
                {profile.iam_roles?.length > 0 && (
                  <div className="pt-4 border-t-2 border-plum-100">
                    <label className="block text-sm font-bold text-plum-900 mb-3 uppercase tracking-wide">
                      Permissions & Roles
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profile.iam_roles.map(r => (
                        <span 
                          key={r} 
                          className="inline-flex items-center gap-2 text-xs bg-plum-100 text-plum-800 font-bold px-3 py-1.5 rounded-full border-2 border-plum-200 capitalize"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-plum-600" />
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="border-t-2 border-plum-100 bg-gradient-to-r from-plum-50 to-plum-100 px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-plum-700 hover:text-plum-900 transition-colors underline underline-offset-2"
                >
                  Change Password
                </Link>

                {editing && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold border-2 border-plum-300 text-plum-700 rounded-lg hover:bg-plum-50 disabled:opacity-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm bg-gradient-to-r from-plum-deep to-plum-600 text-white font-bold rounded-lg hover:shadow-lg disabled:opacity-50 transition-all"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Info Box */}
            <div className="mt-6 bg-blue-50 border-2 border-blue-100 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-blue-600">info</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-900 mb-1">Account Security</h3>
                  <p className="text-sm text-blue-800">Keep your account secure by updating your information regularly and using a strong password.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
