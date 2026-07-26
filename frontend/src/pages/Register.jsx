import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
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

export default function Register() {
  const navigate = useNavigate();
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
    <AuthLayout
      leftTag="WELCOME TO"
      leftTitle="Vijetha Digital"
      leftSubtitle="Join our premium printing network and bring your ideas to life."
    >
      <div className="w-full max-w-md">

        {/* Go to Home Link */}
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1 text-sm text-plum-deep/60 hover:text-plum-deep transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to Home</span>
          </Link>
        </div>

        <header className="mb-5">
          <h2 className="text-[1.625rem] font-bold text-plum-deep mb-1">
            Create{" "}
            <span className="relative inline-block">
              Account
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-coral-accent rounded-full" />
            </span>
          </h2>
          <p className="text-[0.8125rem] text-text-muted">Sign up to start ordering premium print products.</p>
        </header>

        {error && (
          <div className="mb-3 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-600">
            <span className="material-symbols-outlined text-base flex-shrink-0">error</span>{error}
          </div>
        )}
        {notice && (
          <div className="mb-3 flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-[0.8125rem] text-blue-700">
            <span className="material-symbols-outlined text-base flex-shrink-0">info</span>{notice}
          </div>
        )}

        {GOOGLE_CONFIGURED ? (
          <div className="mb-4">
            <GoogleSignInButton
              label="Sign up with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              className="border-stone-border hover:bg-stone-light hover:shadow-md hover:-translate-y-0.5 text-plum-deep transition-all duration-200"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setNotice("Google Sign-In is coming soon. Please fill in the form below to register."); setError(""); }}
            className="w-full h-11 flex items-center justify-center gap-2.5 bg-white border-2 border-stone-border rounded-xl hover:bg-stone-light hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 text-sm font-medium text-plum-deep mb-4"
          >
            {GOOGLE_LOGO}
            Sign up with Google
          </button>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-stone-border" />
          <span className="text-[0.6875rem] font-medium text-text-muted whitespace-nowrap">or fill in details</span>
          <div className="flex-1 h-px bg-stone-border" />
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted mb-2">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              className="w-full h-11 px-4 text-sm rounded-xl border-2 border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all placeholder:text-text-muted/40" />
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted mb-2">Email Address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full h-11 px-4 text-sm rounded-xl border-2 border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all placeholder:text-text-muted/40" />
          </div>

          <div>
            <label className="block text-[0.6875rem] font-bold uppercase tracking-wider text-text-muted mb-2">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full h-11 px-4 text-sm rounded-xl border-2 border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all placeholder:text-text-muted/40" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-[0.8125rem] text-text-muted">
            <input type="checkbox" required className="rounded border-stone-border text-plum-deep focus:ring-plum-deep/20 flex-shrink-0" />
            <span>
              I accept the{" "}
              <Link to="/terms" className="text-plum-deep font-semibold hover:text-coral-accent underline underline-offset-2">Terms</Link>
              {" "}&amp;{" "}
              <Link to="/privacy-policy" className="text-plum-deep font-semibold hover:text-coral-accent underline underline-offset-2">Privacy</Link>
            </span>
          </label>

          <button type="submit"
            className="w-full h-11 bg-plum-deep text-white rounded-xl font-bold text-sm hover:bg-plum-light hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
            Create Account
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </form>

        <p className="mt-4 text-center text-[0.8125rem] text-text-muted">
          Already have an account?{" "}
          <span onClick={() => navigate(redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login")}
            className="text-plum-deep font-semibold cursor-pointer hover:text-coral-accent transition-colors">
            Sign In
          </span>
        </p>

      </div>
    </AuthLayout>
  );
}
