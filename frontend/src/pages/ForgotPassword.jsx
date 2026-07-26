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
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    } else if (value && index === 5) {
      // Auto-verify when last digit is entered
      const completeOtp = [...next];
      setTimeout(() => {
        if (completeOtp.join("").length === 6) {
          handleVerifyOtp(new Event('submit'));
        }
      }, 100);
    }
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
    if (e && e.preventDefault) e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) { setError("Enter all 6 digits"); return; }
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp: otpStr });
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid or expired OTP");
      // Clear OTP on error for retry
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
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
            <form onSubmit={handleSendOtp} className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] font-bold text-plum-deep mb-2">Reset Password</h2>
                <p className="text-[0.8125rem] sm:text-[0.875rem] text-text-muted leading-relaxed">
                  Enter your registered email and we'll send a verification code to reset your password.
                </p>
              </div>
              
              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted text-lg">
                    mail
                  </span>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-11 pl-11 pr-4 text-sm rounded-xl border-2 border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                  />
                </div>
                <p className="mt-2 text-[0.75rem] text-text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span>
                  We'll send a 6-digit code valid for 10 minutes
                </p>
              </div>
              
              <button 
                type="submit" 
                disabled={loading || !email.trim()}
                className="w-full h-11 bg-plum-deep text-white rounded-xl font-bold text-sm hover:bg-plum-light transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending Code...
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2">
                    Send Verification Code
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </span>
                )}
              </button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-border"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-warm-white text-text-muted">or</span>
                </div>
              </div>
              
              <p className="text-center text-[0.8125rem] text-text-muted">
                Remember your password?{" "}
                <Link to="/login" className="text-plum-deep font-semibold hover:text-coral-accent transition-colors inline-flex items-center gap-0.5">
                  Sign In
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
              </p>
            </form>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] font-bold text-plum-deep mb-2">Enter Verification Code</h2>
                <p className="text-[0.8125rem] sm:text-[0.875rem] text-text-muted leading-relaxed">
                  We sent a 6-digit code to<br />
                  <span className="font-semibold text-plum-deep">{email}</span>
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
                  <span className="material-symbols-outlined text-amber-600 text-sm">schedule</span>
                  <span className="text-[0.75rem] text-amber-700 font-medium">Expires in 10 minutes</span>
                </div>
              </div>

              {/* OTP boxes - Enhanced */}
              <div className="space-y-3">
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider">
                  Verification Code
                </label>
                <div className="flex gap-2 sm:gap-3" onPaste={handleOtpPaste}>
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
                      autoComplete="off"
                      disabled={loading}
                      className={`flex-1 aspect-square max-w-[52px] sm:max-w-[56px] text-center text-xl sm:text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200 ${
                        loading 
                          ? "opacity-50 cursor-not-allowed"
                          : digit
                          ? "border-plum-deep bg-plum-deep/10 text-plum-deep shadow-sm scale-105"
                          : "border-stone-border bg-white text-plum-deep hover:border-plum-deep/40 focus:border-plum-deep focus:bg-plum-deep/5 focus:shadow-md focus:scale-105"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[0.75rem] text-text-muted flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">info</span>
                  Paste your code directly or enter each digit
                </p>
              </div>

              {/* Submit button - only shown when manual submission is needed */}
              {otp.join("").length === 6 && !loading && (
                <button 
                  type="submit"
                  className="w-full h-11 bg-plum-deep text-white rounded-xl font-bold text-sm hover:bg-plum-light transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] animate-fade-in-up"
                >
                  Verify Code
                </button>
              )}

              {/* Loading state */}
              {loading && (
                <div className="flex items-center justify-center gap-2 py-3 animate-fade-in-up">
                  <div className="w-5 h-5 border-2 border-plum-deep border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-plum-deep font-medium">Verifying...</span>
                </div>
              )}

              {/* Resend section - Enhanced */}
              <div className="pt-4 border-t border-stone-border">
                <div className="flex items-center justify-between text-[0.8125rem]">
                  <span className="text-text-muted">Didn't receive the code?</span>
                  <button 
                    type="button" 
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    className="font-semibold text-plum-deep hover:text-coral-accent transition-all disabled:text-text-muted disabled:cursor-not-allowed inline-flex items-center gap-1 group"
                  >
                    {resendCooldown > 0 ? (
                      <>
                        <span className="material-symbols-outlined text-base">schedule</span>
                        Resend in {resendCooldown}s
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base group-hover:rotate-12 transition-transform">refresh</span>
                        Resend Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5 animate-fade-in-up">
              <div>
                <h2 className="text-[1.5rem] sm:text-[1.75rem] font-bold text-plum-deep mb-2">Create New Password</h2>
                <p className="text-[0.8125rem] sm:text-[0.875rem] text-text-muted leading-relaxed">
                  Choose a strong password to secure your account.
                </p>
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    required
                    autoFocus
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full h-11 pl-4 pr-11 text-sm rounded-xl border-2 border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowNew(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-plum-deep transition-colors p-1"
                    aria-label={showNew ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-lg">{showNew ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {/* Password strength indicator */}
                {newPassword && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-stone-border rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          newPassword.length < 6 ? "w-1/3 bg-red-500" :
                          newPassword.length < 10 ? "w-2/3 bg-amber-500" :
                          "w-full bg-green-500"
                        }`}
                      />
                    </div>
                    <p className={`text-[0.75rem] font-medium ${
                      newPassword.length < 6 ? "text-red-600" :
                      newPassword.length < 10 ? "text-amber-600" :
                      "text-green-600"
                    }`}>
                      {newPassword.length < 6 ? "Weak - Use at least 6 characters" :
                       newPassword.length < 10 ? "Good - Consider adding more characters" :
                       "Strong password"}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[0.6875rem] font-bold text-text-muted uppercase tracking-wider mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full h-11 pl-4 pr-11 text-sm rounded-xl border-2 border-stone-border bg-white focus:ring-2 focus:ring-plum-deep/20 focus:border-plum-deep outline-none transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-plum-deep transition-colors p-1"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-lg">{showConfirm ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
                {/* Password match indicator */}
                {confirmPassword && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`material-symbols-outlined text-sm ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                      {newPassword === confirmPassword ? "check_circle" : "cancel"}
                    </span>
                    <p className={`text-[0.75rem] font-medium ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                      {newPassword === confirmPassword ? "Passwords match" : "Passwords don't match"}
                    </p>
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword}
                className="w-full h-11 bg-plum-deep text-white rounded-xl font-bold text-sm hover:bg-plum-light transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Set New Password"
                )}
              </button>

              {/* Success hint */}
              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-[0.75rem] text-blue-700">
                <span className="material-symbols-outlined text-base flex-shrink-0">info</span>
                <span>After resetting, you'll be redirected to login with your new password.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
