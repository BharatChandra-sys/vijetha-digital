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
    await loginWithGoogle(accessToken, redirectTo);
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

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-text-dark mb-2">
            Create{" "}
            <span className="relative inline-block">
              Account
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
            </span>
          </h2>
          <p className="text-text-muted">Sign up to start ordering premium print products.</p>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
        )}
        {notice && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">{notice}</div>
        )}

        {GOOGLE_CONFIGURED ? (
          <div className="mb-5">
            <GoogleSignInButton
              label="Sign up with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              className="border-stone-border hover:bg-stone-light text-plum-deep"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setNotice("Google Sign-In is coming soon. Please fill in the form below to register."); setError(""); }}
            className="w-full flex items-center justify-center gap-3 bg-white border border-stone-border py-3.5 rounded-lg hover:bg-stone-light transition-colors shadow-sm mb-5"
          >
            {GOOGLE_LOGO}
            <span className="text-plum-deep font-medium">Sign up with Google</span>
          </button>
        )}

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-[1px] bg-stone-border"></div>
          <span className="text-[12px] font-medium text-text-muted whitespace-nowrap">or fill in details</span>
          <div className="flex-1 h-[1px] bg-stone-border"></div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Full Name</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none" />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Email Address</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none" />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none" />
          </div>

          {/* Terms and Privacy Policy Checkbox */}
          <div>
            <label className="flex items-start gap-2 cursor-pointer group text-sm">
              <input type="checkbox" required className="rounded border-gray-300 text-plum-deep focus:ring-plum-deep mt-0.5 flex-shrink-0" />
              <span className="text-plum-deep/70 group-hover:text-plum-deep transition-colors">
                I accept the{" "}
                <Link to="/terms" className="text-plum-deep font-semibold hover:text-coral-accent underline">Terms and Conditions</Link>
                {" "}and{" "}
                <Link to="/privacy-policy" className="text-plum-deep font-semibold hover:text-coral-accent underline">Privacy Policy</Link>
              </span>
            </label>
          </div>

          <button type="submit" className="w-full bg-plum-deep text-white py-4 rounded-lg font-bold shadow-soft-plum hover:bg-[#2D244C] transition-all">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <span onClick={() => navigate(redirectTo !== "/" ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login")} className="text-plum-deep font-semibold cursor-pointer hover:text-coral-accent">
            Sign In
          </span>
        </p>

      </div>
    </AuthLayout>
  );
}
