import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfile, updateProfile } from "../api/auth";

export default function Profile() {
  const { user, isAuthenticated, updateUserInfo } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ full_name: "", phone: "" });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    fetchProfile();
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const data = await getProfile();
      setProfile(data);
      setForm({ full_name: data.full_name || "", phone: data.phone || "" });
    } catch {
      setError("Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

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
        phone: form.phone.trim() || null,
      });

      setProfile((prev) => ({ ...prev, ...updated }));
      // Sync the name shown in the header
      updateUserInfo({ full_name: updated.full_name });

      setEditing(false);
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({ full_name: profile.full_name || "", phone: profile.phone || "" });
    setEditing(false);
    setError("");
  };

  const avatarLetter = profile
    ? (profile.full_name?.[0] || profile.email?.[0] || "?").toUpperCase()
    : "?";

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Profile not available
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information
        </p>
      </div>

      {/* Card */}
      <div className="bg-white border rounded-lg overflow-hidden">

        {/* Avatar + name bar */}
        <div className="bg-gray-50 border-b px-6 py-6 flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-800 text-white flex items-center justify-center text-2xl font-bold shrink-0">
            {avatarLetter}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">
              {profile.full_name}
            </p>
            <p className="text-sm text-gray-500">{profile.email}</p>
            <span className="inline-block mt-1 text-xs bg-gray-800 text-white px-2.5 py-0.5 rounded-full capitalize">
              {profile.role}
            </span>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-6 space-y-5">

          {/* Feedback */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
              {success}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Full Name
            </label>
            {editing ? (
              <input
                type="text"
                value={form.full_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, full_name: e.target.value }))
                }
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">{profile.full_name}</p>
            )}
          </div>

          {/* Email — always read-only */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Email
            </label>
            <p className="text-sm text-gray-900 py-2">{profile.email}</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                placeholder="+91 98765 43210"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
              />
            ) : (
              <p className="text-sm text-gray-900 py-2">
                {profile.phone || <span className="text-gray-400">Not set</span>}
              </p>
            )}
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Member Since
            </label>
            <p className="text-sm text-gray-900 py-2">
              {formatDate(profile.created_at)}
            </p>
          </div>

          {/* Last Login */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Last Login
            </label>
            <p className="text-sm text-gray-900 py-2">
              {formatDate(profile.last_login_at)}
            </p>
          </div>

          {/* IAM Roles (if any) */}
          {profile.iam_roles && profile.iam_roles.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Roles
              </label>
              <div className="flex flex-wrap gap-1.5 py-2">
                {profile.iam_roles.map((r) => (
                  <span
                    key={r}
                    className="text-xs bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full capitalize"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t px-6 py-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
          >
            Change Password
          </button>

          <div className="flex items-center space-x-3">
            {editing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving && (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  )}
                  <span>{saving ? "Saving…" : "Save Changes"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => { setEditing(true); setSuccess(""); setError(""); }}
                className="px-4 py-2 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
