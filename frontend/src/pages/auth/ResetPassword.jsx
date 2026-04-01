import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError("Invalid or missing reset token");
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        new_password: password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to reset password. Link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTag="ACCOUNT SECURITY"
      leftTitle="Vijetha Digital"
      leftSubtitle="Reset your password securely and return to your portal access."
    >
      <div className="w-full max-w-md">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-text-dark mb-2">
            Reset{" "}
            <span className="relative inline-block">
              Password
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
            </span>
          </h2>
          <p className="text-text-muted">Use a strong new password (minimum 8 characters).</p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}

        {!tokenValid ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              This reset link is invalid or expired. Request a new link from your portal.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/forgot-password"
                className="inline-flex items-center justify-center bg-plum-deep text-white py-3 rounded-lg font-semibold hover:bg-[#2D244C] transition-all"
              >
                Admin Reset
              </Link>
              <Link
                to="/staff/forgot-password"
                className="inline-flex items-center justify-center border border-stone-border text-plum-deep py-3 rounded-lg font-semibold hover:bg-stone-light transition-all"
              >
                Staff Reset
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="space-y-5">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
              Password updated successfully. You can now sign in.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/login"
                className="inline-flex items-center justify-center bg-plum-deep text-white py-3 rounded-lg font-semibold hover:bg-[#2D244C] transition-all"
              >
                Admin Login
              </Link>
              <Link
                to="/staff/login"
                className="inline-flex items-center justify-center border border-stone-border text-plum-deep py-3 rounded-lg font-semibold hover:bg-stone-light transition-all"
              >
                Staff Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-text-muted">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded border-gray-300 text-plum-deep focus:ring-plum-deep"
              />
              Show password
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-plum-deep text-white py-4 rounded-lg font-bold text-base shadow-[0_12px_24px_-8px_rgba(59,47,99,0.5)] hover:bg-[#2D244C] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
