import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import AuthLayout from "../../layouts/AuthLayout";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTag="ADMIN ACCESS"
      leftTitle="Vijetha Digital"
      leftSubtitle="Recover your admin account securely and return to dashboard operations."
    >
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1 text-sm text-plum-deep/60 hover:text-plum-deep transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Admin Login</span>
          </Link>
        </div>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-text-dark mb-2">
            Forgot{" "}
            <span className="relative inline-block">
              Password
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
            </span>
          </h2>
          <p className="text-text-muted">Enter your admin email to receive a secure password reset link.</p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}

        {success ? (
          <div className="space-y-5">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
              If the email exists, reset instructions were sent successfully.
            </div>
            <p className="text-sm text-text-muted">
              Sent to: <span className="font-semibold text-text-dark">{email}</span>
            </p>
            <Link
              to="/admin/login"
              className="w-full inline-flex items-center justify-center bg-plum-deep text-white py-4 rounded-lg font-bold text-base shadow-[0_12px_24px_-8px_rgba(59,47,99,0.5)] hover:bg-[#2D244C] transition-all"
            >
              Return to Admin Login
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Admin Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vijetha.com"
                className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-plum-deep text-white py-4 rounded-lg font-bold text-base shadow-[0_12px_24px_-8px_rgba(59,47,99,0.5)] hover:bg-[#2D244C] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}
