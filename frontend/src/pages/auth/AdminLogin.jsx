import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../layouts/AuthLayout";

export default function AdminLogin() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      await login(email, password, "/admin/dashboard", "admin");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTag="ADMIN ACCESS"
      leftTitle="Vijetha Digital"
      leftSubtitle="Secure sign-in for administrative control and full platform operations."
    >
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-plum-deep/60 hover:text-plum-deep transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </Link>
        </div>

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-text-dark mb-2">
            Admin{" "}
            <span className="relative inline-block">
              Login
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
            </span>
          </h2>
          <p className="text-text-muted">Sign in to manage dashboards, staff access, and system settings.</p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}

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

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
            />
          </div>

          <div className="text-right">
            <Link
              to="/admin/forgot-password"
              className="text-plum-deep text-sm font-semibold hover:text-coral-accent transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-plum-deep text-white py-4 rounded-lg font-bold text-base shadow-[0_12px_24px_-8px_rgba(59,47,99,0.5)] hover:bg-[#2D244C] transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Staff member?{" "}
          <Link to="/staff/login" className="text-plum-deep font-bold hover:text-coral-accent transition-colors">
            Staff Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
