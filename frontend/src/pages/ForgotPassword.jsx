import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpRefs = useRef([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email: email.trim().toLowerCase() });
      setStep(2);
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp: otpStr });
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password-otp", {
        email,
        otp: otp.join(""),
        new_password: newPassword,
      });
      navigate("/login?reset=success");
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/send-otp", { email });
      setOtp(["", "", "", "", "", ""]);
      setResendCooldown(60);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError("Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ["Email", "Verify OTP", "New Password"];

  return (
    <main className="min-h-screen flex font-display">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[52%] xl:w-[55%] relative bg-plum-deep overflow-hidden flex-col p-14 xl:p-16">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-coral-accent/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm">
          <p className="text-[0.6875rem] uppercase tracking-[0.2em] font-bold text-white/50 mb-4">Account Recovery</p>
          <div className="mb-5">
            <h1 className="text-[2rem] xl:text-[2.25rem] font-bold text-white leading-tight">Reset Your Password</h1>
            <div className="w-10 h-[3px] bg-coral-accent mt-3 rounded-full" />
          </div>
          <p className="text-white/60 text-base leading-relaxed mb-10">
            We'll send a 6-digit OTP to your email. It's valid for 10 minutes.
          </p>

          {/* Step progress on left panel */}
          <div className="space-y-4">
            {STEPS.map((label, i) => {
              const s = i + 1;
              const done = s < step;
              const active = s === step;
              return (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                    done ? "bg-green-400 text-white" :
                    active ? "bg-coral-accent text-white" :
                    "bg-white/10 text-white/40"
                  }`}>
                    {done
                      ? <span className="material-symbols-outlined text-base">check</span>
                      : s}
                  </div>
                  <span className={`text-[0.875rem] font-medium transition-all ${
                    active ? "text-white" : done ? "text-white/60" : "text-white/30"
                  }`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-9 w-9 rounded-xl object-cover flex-shrink-0" />
          <span className="text-[0.75rem] tracking-[0.2em] uppercase font-bold text-white/70">Vijetha Digital</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8 bg-warm-white">
        <div className="w-full max-w-[360px]">

          {/* Back link */}
          <div className="mb-6">
            {step === 1 ? (
              <Link to="/login" className="inline-flex items-center gap-1 text-[0.8125rem] text-text-muted hover:text-plum-deep transition-colors">
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to Sign In
              </Link>
            ) : (
              <button
                onClick={() => { setStep(s => s - 1); setError(""); }}
                className="inline-flex items-center gap-1 text-[0.8125rem] text-text-muted hover:text-plum-deep transition-colors"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back
              </button>
            )}
          </div>

          {/* Mobile step indicator */}
          <div className="flex items-center gap-1.5 mb-6 lg:hidden">
            {STEPS.map((label, i) => {
              const s = i + 1;
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.625rem] font-bold ${
                    s < step ? "bg-green-500 text-white" :
                    s === step ? "bg-plum-deep text-white" :
                    "bg-stone-border text-text-muted"
                  }`}>
                    {s < step ? <span className="material-symbols-outlined text-xs">check</span> : s}
                  </div>
                  {i < 2 && <div className={`w-6 h-px ${s < step ? "bg-green-500" : "bg-stone-border"}`} />}
                </div>
              );
            })}
            <span className="ml-1 text-[0.75rem] text-text-muted">{STEPS[step - 1]}</span>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg text-[0.8125rem] text-red-600 animate-fade-in-up">
              <span className="material-symbols-outlined text-base flex-shrink-0">error</span>
              {error}
            </div>
          )}

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4 animate-fade-in-up">
              <div>
                <h2 className="text-[1.5rem] font-bold text-plum-deep mb-1">Reset Password</h2>
                <p className="text-[0.8125rem] text-text-muted mb-5">
                  Enter your registered email and we'll send a 6-digit OTP.
                </p>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-10 px-3.5 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                />
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-10 bg-plum-deep text-white rounded-lg font-bold text-sm hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Sending OTP…" : "Send OTP"}
              </button>
              <p className="text-center text-[0.8125rem] text-text-muted">
                Remember your password?{" "}
                <Link to="/login" className="text-plum-deep font-semibold hover:text-coral-accent transition-colors">Sign In</Link>
              </p>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-[1.5rem] font-bold text-plum-deep mb-1">Enter OTP</h2>
                <p className="text-[0.8125rem] text-text-muted mb-5">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-plum-deep">{email}</span>.
                  <br />Valid for 10 minutes.
                </p>

                {/* OTP boxes */}
                <div className="flex gap-2" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => otpRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className={`flex-1 h-12 text-center text-xl font-bold rounded-lg border-2 outline-none transition-all ${
                        digit
                          ? "border-plum-deep bg-plum-deep/5 text-plum-deep"
                          : "border-stone-border bg-white text-plum-deep focus:border-plum-deep focus:bg-plum-deep/5"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading || otp.join("").length < 6}
                className="w-full h-10 bg-plum-deep text-white rounded-lg font-bold text-sm hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Verifying…" : "Verify OTP"}
              </button>

              <div className="flex items-center justify-between text-[0.8125rem]">
                <span className="text-text-muted">Didn't receive it?</span>
                <button type="button" onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="font-semibold text-plum-deep hover:text-coral-accent transition-colors disabled:text-text-muted disabled:cursor-not-allowed">
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in-up">
              <div>
                <h2 className="text-[1.5rem] font-bold text-plum-deep mb-1">New Password</h2>
                <p className="text-[0.8125rem] text-text-muted mb-5">Choose a strong password for your account.</p>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full h-10 pl-3.5 pr-10 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-plum-deep transition-colors">
                    <span className="material-symbols-outlined text-base">{showNew ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full h-10 pl-3.5 pr-10 text-sm rounded-lg border border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-plum-deep transition-colors">
                    <span className="material-symbols-outlined text-base">{showConfirm ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword && (
                  <p className={`mt-1 text-[0.75rem] font-medium ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords don't match"}
                  </p>
                )}
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-10 bg-plum-deep text-white rounded-lg font-bold text-sm hover:bg-plum-light transition-all hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Saving…" : "Set New Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
