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

  // Fill demo credentials
  const fillDemoCredentials = () => {
    setEmail("admin@vijethadigital.com");
    setPassword("admin123");
  };

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, "/admin/dashboard", "admin");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTag="ADMIN ACCESS"
      leftTitle="Vijetha Digital"
      leftSubtitle="Secure administrative portal. Full platform control and operations management."
    >
      <div className="w-full max-w-[360px]">
        <div className="mb-5">
          <Link to="/workspace" className="inline-flex items-center gap-1 text-[0.8125rem] text-text-muted hover:text-plum-deep transition-colors">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to Workspace
          </Link>
        </div>

        {/* Admin badge */}
        <div className="flex items-center gap-2 mb-5 p-2.5 bg-plum-deep/5 border border-plum-deep/10 rounded-lg">
          <span className="material-symbols-outlined text-plum-deep text-base">admin_panel_settings</span>
          <span className="text-[0.75rem] font-bold text-plum-deep uppercase tracking-wider">Administrator Portal</span>
        </div>

        <header className="mb-5">
          <h2 className="text-[1.625rem] font-bold text-plum-deep mb-1">
            Admin{" "}
            <span className="relative inline-block">
              Login
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-coral-accent rounded-full" />
            </span>
          </h2>
          <p className="text-[0.8125rem] text-text-muted">Restricted access. Authorised personnel only.</p>
        </header>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-600">
            <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted mb-1.5">Admin Email</label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@vijethadigital.com"
              className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted mb-1.5">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
            />
          </div>

          {/* Demo credentials button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs text-plum-deep font-semibold hover:text-coral-accent transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              Use demo credentials
            </button>
            <span className="text-xs text-text-muted">admin@vijethadigital.com</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-plum-deep text-white rounded-lg font-bold text-sm hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In…" : "Sign In to Admin"}
          </button>
        </form>

        {/* Security note — no forgot password for admin */}
        <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-amber-600 text-base flex-shrink-0 mt-0.5">lock</span>
            <p className="text-[0.75rem] text-amber-800 leading-snug">
              Admin password reset is disabled for security. Contact the system owner to reset credentials.
            </p>
          </div>
        </div>

        <p className="mt-5 text-center text-[0.8125rem] text-text-muted">
          Staff member?{" "}
          <Link to="/staff/login" className="text-plum-deep font-bold hover:text-coral-accent transition-colors">
            Staff Login →
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
