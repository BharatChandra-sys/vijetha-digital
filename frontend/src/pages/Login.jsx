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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // Auto-dismiss error/notice after 5 seconds
  useEffect(() => {
    if (error || notice) {
      const timer = setTimeout(() => {
        setError("");
        setNotice("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, notice]);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setNotice("");
    try {
      await login(email, password, redirectTo, "customer");
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password");
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
    <main className="flex h-screen overflow-hidden bg-[#F8F7F4] text-[#3B2F63] relative">

      {/* Toast Notification - Top Center */}
      {(error || notice) && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-lg shadow-2xl border ${
            error 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-blue-50 border-blue-200 text-blue-700'
          } min-w-[320px] max-w-md`}>
            <span className="material-symbols-outlined flex-shrink-0">
              {error ? 'error' : 'info'}
            </span>
            <p className="text-sm font-medium flex-1">{error || notice}</p>
            <button 
              onClick={() => { setError(""); setNotice(""); }}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>
      )}

      {/* LEFT PANEL */}
      <section className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[#E9E4D9] p-16 flex-col justify-between">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
          <span className="text-[25rem] font-bold watermark-text tracking-widest text-[#3B2F63]">VIJETHA</span>
        </div>
        <div className="relative z-10 max-w-md">
          <p className="uppercase tracking-[0.2em] text-[12px] font-semibold text-[#3B2F63]/60 mb-4">Welcome Back</p>
          <h1 className="text-5xl font-bold mb-6 text-[#3B2F63] relative">
            Vijetha Digital
            <span className="absolute bottom-[-12px] left-0 w-12 h-1 bg-[#FF6B5E]"></span>
          </h1>
          <p className="text-xl text-[#3B2F63]/70 leading-relaxed">Continue building powerful print experiences.</p>
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-12 w-12 rounded-xl object-cover shadow-lg flex-shrink-0" />
          <span className="uppercase tracking-[0.25em] text-[13px] font-bold text-[#3B2F63]">Vijetha Digital</span>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="w-full lg:w-2/5 flex items-center justify-center px-6 py-8 lg:px-16 bg-[#F8F7F4]">
        <div className="w-full max-w-md">

          {/* Go to Dashboard Link */}
          <div className="mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1 text-sm text-[#3B2F63]/60 hover:text-[#3B2F63] transition-colors"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Back to Home</span>
            </Link>
          </div>

          <header className="mb-6">
            <h2 className="text-3xl font-bold text-[#3B2F63] mb-2">
              Sign{" "}
              <span className="relative inline-block">
                In
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FF6B5E] rounded-full"></span>
              </span>
            </h2>
            <p className="text-[#3B2F63]/60">Access your dashboard and manage your orders.</p>
          </header>

          <form onSubmit={submit} className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#3B2F63]/60 uppercase tracking-wider">Email Address</label>
              <input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3B2F63] focus:border-transparent outline-none transition-all placeholder:text-gray-300" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#3B2F63]/60 uppercase tracking-wider">Password</label>
              <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3B2F63] focus:border-transparent outline-none transition-all placeholder:text-gray-300" />
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-start gap-2 cursor-pointer group text-sm">
                <input type="checkbox" required className="rounded border-gray-300 text-[#3B2F63] focus:ring-[#3B2F63] mt-0.5 flex-shrink-0" />
                <span className="text-[#3B2F63]/70 group-hover:text-[#3B2F63] transition-colors">
                  I accept the{" "}
                  <Link to="/terms" className="text-[#3B2F63] font-semibold hover:text-[#FF6B5E] underline">Terms and Conditions</Link>
                  {" "}and{" "}
                  <Link to="/privacy-policy" className="text-[#3B2F63] font-semibold hover:text-[#FF6B5E] underline">Privacy Policy</Link>
                </span>
              </label>
              <div className="text-right">
                <span onClick={() => navigate("/forgot-password")} className="text-[#3B2F63] text-sm font-semibold hover:text-[#FF6B5E] transition-colors cursor-pointer">
                  Forgot password?
                </span>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#3B2F63] text-white py-4 rounded-lg font-bold text-base shadow-[0_12px_24px_-8px_rgba(59,47,99,0.5)] hover:bg-[#2D244C] transition-all transform hover:-translate-y-0.5">
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-[12px] font-medium text-gray-400 whitespace-nowrap">or continue with</span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {GOOGLE_CONFIGURED ? (
            <GoogleSignInButton
              label="Sign in with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              className="border-gray-200 hover:bg-gray-50 text-[#3B2F63]"
            />
          ) : (
            <button
              type="button"
              onClick={() => { setNotice("Google Sign-In is coming soon. Please use email & password for now."); setError(""); }}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              {GOOGLE_LOGO}
              <span className="text-[#3B2F63] font-medium">Sign in with Google</span>
            </button>
          )}

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span onClick={() => navigate(redirectTo !== "/" ? `/register?redirect=${encodeURIComponent(redirectTo)}` : "/register")} className="text-[#3B2F63] font-bold hover:text-[#FF6B5E] transition-colors cursor-pointer">
              Sign up
            </span>
          </p>

        </div>
      </section>
    </main>
  );
}
