import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSearchParams, Link } from "react-router-dom";
import GoogleSignInButton from "../components/GoogleSignInButton";
import AuthShell from "../components/store/AuthShell";
import usePageTitle from "../hooks/usePageTitle";

const GOOGLE_CONFIGURED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const GOOGLE_LOGO = (
  <svg className="h-5 w-5" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  usePageTitle("Sign In");
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const resetSuccess = searchParams.get("reset") === "success";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

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
    <AuthShell eyebrow="Welcome Back" title="Vijetha Digital" subtitle="Continue building powerful print experiences.">
      <h1 className="vd-h1">Sign In</h1>
      <p className="mt-2 text-ink-2">Access your dashboard and manage your orders.</p>

      {resetSuccess && (
        <div className="vd-alert vd-alert-ok mt-5" role="status">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          Password updated. Sign in with your new password.
        </div>
      )}
      {error && (
        <div className="vd-alert vd-alert-error mt-5" role="alert">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}
      {notice && (
        <div className="vd-alert vd-alert-info mt-5" role="status">
          <span className="material-symbols-outlined text-lg">info</span>
          {notice}
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="login-email" className="vd-label">Email Address</label>
          <input id="login-email" name="email" type="email" spellCheck={false} placeholder="name@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="vd-input" />
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between gap-3">
            <label htmlFor="login-password" className="vd-label !mb-0">Password</label>
            <Link to="/forgot-password" className="vd-link text-[0.8125rem]">Forgot password?</Link>
          </div>
          <div className="relative">
            <input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="vd-input !pr-12" />
            <button type="button" onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink-2 hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>
              <span className="material-symbols-outlined text-xl">{showPassword ? "visibility_off" : "visibility"}</span>
            </button>
          </div>
        </div>

        <label htmlFor="terms-accept" className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
          <input id="terms-accept" type="checkbox" className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer accent-[#1A2332]" />
          <span>
            I accept the <Link to="/terms" className="vd-link text-ink">Terms</Link> &amp; <Link to="/privacy-policy" className="vd-link text-ink">Privacy Policy</Link>
          </span>
        </label>

        <button type="submit" disabled={loading} className="vd-btn vd-btn-lg vd-btn-ink w-full">
          {loading ? "Signing in…" : <>Sign In <span className="material-symbols-outlined text-xl">arrow_forward</span></>}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3 text-[0.8125rem] text-ink-2">
        <span className="h-px flex-1 bg-line" />or continue with<span className="h-px flex-1 bg-line" />
      </div>

      {GOOGLE_CONFIGURED ? (
        <GoogleSignInButton label="Sign in with Google" onSuccess={handleGoogleSuccess} onError={handleGoogleError} className="border-line hover:border-ink text-ink" />
      ) : (
        <button
          type="button"
          onClick={() => { setNotice("Google Sign-In is coming soon. Please use email & password for now."); setError(""); }}
          className="vd-btn vd-btn-quiet w-full"
        >
          {GOOGLE_LOGO}
          Sign in with Google
        </button>
      )}

      <p className="mt-6 text-center text-[0.9375rem] text-ink-2">
        Don't have an account?{" "}
        <Link to={redirectTo !== "/" ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register"} className="vd-link text-ink">Sign up free</Link>
      </p>
    </AuthShell>
  );
}
