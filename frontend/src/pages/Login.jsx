import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";

const GOOGLE_CONFIGURED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const GOOGLE_LOGO = (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const resetSuccess = searchParams.get("reset") === "success";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (error || notice) {
      const timer = setTimeout(() => { setError(""); setNotice(""); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, notice]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setNotice("");
    setLoading(true);
    try {
      await login(email, password, redirectTo, "customer");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (accessToken) => {
    setError(""); setNotice("");
    await loginWithGoogle(accessToken, redirectTo, "customer");
  };

  const handleGoogleError = (err) => {
    setError(err?.response?.data?.detail || "Google sign-in failed. Please try again.");
  };

  return (
    <main className="flex h-screen overflow-hidden bg-warm-white text-[#1A1F3C] relative">

      {/* Toast */}
      {(error || notice) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border ${
            error
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-blue-50 border-blue-200 text-blue-700"
          } min-w-[300px] max-w-md`}>
            <span className="material-symbols-outlined flex-shrink-0 text-lg">
              {error ? "error" : "info"}
            </span>
            <p className="text-sm font-medium flex-1">{error || notice}</p>
            <button onClick={() => { setError(""); setNotice(""); }} className="flex-shrink-0 hover:opacity-70 transition-opacity">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>
      )}

      {/* LEFT PANEL */}
      <section className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative overflow-hidden bg-plum-deep p-14 xl:p-16 flex-col justify-between">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-coral-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm">
          <p className="text-[0.6875rem] uppercase tracking-[0.2em] font-bold text-white/50 mb-4">Welcome Back</p>
          <div className="mb-5">
            <h1 className="text-[2rem] xl:text-[2.25rem] font-bold text-white leading-tight">Vijetha Digital</h1>
            <div className="w-10 h-[3px] bg-coral-accent mt-3 rounded-full" />
          </div>
          <p className="text-white/60 text-base leading-relaxed">Continue building powerful print experiences.</p>
          <div className="mt-10 space-y-3">
            {[
              { icon: "verified_user", text: "500+ businesses trust us" },
              { icon: "receipt_long",  text: "GST invoice on every order" },
              { icon: "bolt",          text: "24–48h turnaround time" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-coral-accent text-base">{b.icon}</span>
                </div>
                <span className="text-[0.8125rem] text-white/70 font-medium">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-9 w-9 rounded-xl object-cover flex-shrink-0" />
          <span className="text-[0.75rem] tracking-[0.2em] uppercase font-bold text-white/70">Vijetha Digital</span>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="w-full lg:w-[48%] xl:w-[45%] flex items-center justify-center px-5 py-8 bg-warm-white overflow-y-auto">
        <div className="w-full max-w-[360px]">

          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-1 text-[0.8125rem] text-plum-deep/50 hover:text-plum-deep transition-colors">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Back to Home
            </Link>
          </div>

          <header className="mb-6">
            <h2 className="text-[1.625rem] font-bold text-plum-deep mb-1.5">
              Sign{" "}
              <span className="relative inline-block">
                In
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-coral-accent rounded-full" />
              </span>
            </h2>
            <p className="text-[0.8125rem] text-text-muted">Access your dashboard and manage your orders.</p>
          </header>

          {resetSuccess && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-[0.8125rem] text-green-700">
              <span className="material-symbols-outlined text-base flex-shrink-0">check_circle</span>
              Password updated. Sign in with your new password.
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-11 px-3.5 text-sm rounded-xl border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all placeholder:text-text-muted/40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider">
                  Password
                </label>
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-[0.75rem] font-semibold text-plum-deep/60 hover:text-coral-accent transition-colors cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full h-11 px-3.5 pr-10 text-sm rounded-xl border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all placeholder:text-text-muted/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-plum-deep transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms-accept"
                className="mt-0.5 rounded border-stone-border text-plum-deep focus:ring-plum-deep/20 flex-shrink-0 cursor-pointer"
              />
              <label htmlFor="terms-accept" className="text-[0.8125rem] text-text-muted cursor-pointer leading-snug">
                I accept the{" "}
                <Link to="/terms" className="text-plum-deep font-semibold hover:text-coral-accent underline underline-offset-2">Terms</Link>
                {" "}&amp;{" "}
                <Link to="/privacy-policy" className="text-plum-deep font-semibold hover:text-coral-accent underline underline-offset-2">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-plum-deep text-white rounded-xl font-bold text-sm hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-border" />
            <span className="text-[0.6875rem] font-medium text-text-muted whitespace-nowrap">or continue with</span>
            <div className="flex-1 h-px bg-stone-border" />
          </div>

          {GOOGLE_CONFIGURED ? (
            <GoogleSignInButton
              label="Sign in with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              className="border-stone-border hover:bg-stone-light text-plum-deep"
            />
          ) : (
            <button
              type="button"
              onClick={() => { setNotice("Google Sign-In is coming soon. Please use email & password for now."); setError(""); }}
              className="w-full h-11 flex items-center justify-center gap-2.5 bg-white border border-stone-border rounded-xl hover:bg-stone-light transition-colors text-sm font-medium text-plum-deep"
            >
              {GOOGLE_LOGO}
              Sign in with Google
            </button>
          )}

          <p className="mt-5 text-center text-[0.8125rem] text-text-muted">
            Don't have an account?{" "}
            <span
              onClick={() => navigate(redirectTo !== "/" ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register")}
              className="text-plum-deep font-bold hover:text-coral-accent transition-colors cursor-pointer"
            >
              Sign up free
            </span>
          </p>

        </div>
      </section>
    </main>
  );
}
