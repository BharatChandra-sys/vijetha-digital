import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/store/AuthShell";
import usePageTitle from "../hooks/usePageTitle";
import GoogleSignInButton from "../components/GoogleSignInButton";

const GOOGLE_CONFIGURED = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

const GOOGLE_LOGO = (
  <svg className="h-5 w-5" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  usePageTitle("Create Account");
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { register, loginWithGoogle } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setNotice("");
    try {
      await register(form.name, form.email, form.password);
      navigate(redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed. Please try again.");
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
    <AuthShell eyebrow="Welcome To" title="Vijetha Digital" subtitle="Join our premium printing network and bring your ideas to life.">
      <h1 className="vd-h1">Create Account</h1>
      <p className="mt-2 text-ink-2">Sign up to start ordering premium print products.</p>

      {error && (
        <div className="vd-alert vd-alert-error mt-5" role="alert">
          <span className="material-symbols-outlined text-lg">error</span>{error}
        </div>
      )}
      {notice && (
        <div className="vd-alert vd-alert-info mt-5" role="status">
          <span className="material-symbols-outlined text-lg">info</span>{notice}
        </div>
      )}

      <div className="mt-6">
        {GOOGLE_CONFIGURED ? (
          <GoogleSignInButton label="Sign up with Google" onSuccess={handleGoogleSuccess} onError={handleGoogleError} className="border-line hover:border-ink text-ink" />
        ) : (
          <button
            type="button"
            onClick={() => { setNotice("Google Sign-In is coming soon. Please fill in the form below to register."); setError(""); }}
            className="vd-btn vd-btn-quiet w-full"
          >
            {GOOGLE_LOGO}
            Sign up with Google
          </button>
        )}
      </div>

      <div className="my-5 flex items-center gap-3 text-[0.8125rem] text-ink-2">
        <span className="h-px flex-1 bg-line" />or fill in details<span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label htmlFor="reg-name" className="vd-label">Full Name</label>
          <input id="reg-name" name="name" type="text" autoComplete="name" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" className="vd-input" />
        </div>
        <div>
          <label htmlFor="reg-email" className="vd-label">Email Address</label>
          <input id="reg-email" name="email" type="email" autoComplete="email" spellCheck={false} required value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" className="vd-input" />
        </div>
        <div>
          <label htmlFor="reg-password" className="vd-label">Password</label>
          <input id="reg-password" name="password" type="password" autoComplete="new-password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 characters" className="vd-input" />
        </div>

        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-2">
          <input type="checkbox" required className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer accent-[#1A2332]" />
          <span>
            I accept the <Link to="/terms" className="vd-link text-ink">Terms</Link> &amp; <Link to="/privacy-policy" className="vd-link text-ink">Privacy</Link>
          </span>
        </label>

        <button type="submit" className="vd-btn vd-btn-lg vd-btn-ink w-full">
          Create Account <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </form>

      <p className="mt-6 text-center text-[0.9375rem] text-ink-2">
        Already have an account?{" "}
        <Link to={redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"} className="vd-link text-ink">Sign In</Link>
      </p>
    </AuthShell>
  );
}
