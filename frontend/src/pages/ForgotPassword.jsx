import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthShell from "../components/store/AuthShell";
import usePageTitle from "../hooks/usePageTitle";

export default function ForgotPassword() {
  usePageTitle("Reset Password");
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
      if (next.join("").length === 6) handleVerifyOtp(null, next.join(""));
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

  const handleVerifyOtp = async (e, code) => {
    if (e && e.preventDefault) e.preventDefault();
    const otpStr = code || otp.join("");
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
    <AuthShell eyebrow="Account Recovery" title="Reset Your Password" subtitle="We'll send a 6-digit OTP to your email. It's valid for 10 minutes.">
      {step === 1 ? (
        <Link to="/login" className="vd-link inline-flex min-h-[44px] items-center gap-1 text-sm">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Sign In
        </Link>
      ) : (
        <button onClick={() => { setStep((s) => s - 1); setError(""); }} className="vd-link inline-flex min-h-[44px] items-center gap-1 text-sm">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back
        </button>
      )}

      {/* Progress */}
      <ol className="mt-3 flex items-center gap-1.5 text-[0.8125rem]" aria-label="Progress">
        {STEPS.map((label, i) => {
          const s = i + 1;
          return (
            <li key={label} className="flex items-center gap-1.5" aria-current={s === step ? "step" : undefined}>
              <span className={`vd-price flex h-6 w-6 items-center justify-center rounded text-[0.75rem] font-semibold ${s < step ? "bg-ok text-white" : s === step ? "bg-night text-white" : "bg-shade text-ink-2"}`}>
                {s < step ? <span className="material-symbols-outlined text-sm">check</span> : s}
              </span>
              <span className={s === step ? "font-semibold" : "hidden text-ink-2 sm:inline"}>{label}</span>
              {i < STEPS.length - 1 && <span className="mx-0.5 h-px w-4 bg-line-strong" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>

      {error && (
        <div className="vd-alert vd-alert-error mt-5" role="alert">
          <span className="material-symbols-outlined text-lg">error</span>
          {error}
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="mt-6 space-y-5">
          <div>
            <h1 className="vd-h1">Reset Password</h1>
            <p className="mt-2 text-ink-2">Enter your registered email and we'll send a verification code to reset your password.</p>
          </div>
          <div>
            <label htmlFor="reset-email" className="vd-label">Email Address</label>
            <input id="reset-email" name="email" type="email" required autoFocus autoComplete="email" spellCheck={false}
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="vd-input" />
            <p className="vd-hint">We'll send a 6-digit code valid for 10 minutes</p>
          </div>
          <button type="submit" disabled={loading || !email.trim()} className="vd-btn vd-btn-lg vd-btn-ink w-full">
            {loading ? "Sending Code…" : <>Send Verification Code <span className="material-symbols-outlined text-xl">arrow_forward</span></>}
          </button>
          <p className="text-center text-[0.9375rem] text-ink-2">
            Remember your password? <Link to="/login" className="vd-link text-ink">Sign In</Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="mt-6 space-y-5">
          <div>
            <h1 className="vd-h1">Enter Verification Code</h1>
            <p className="mt-2 break-words text-ink-2">
              We sent a 6-digit code to <span className="font-semibold text-ink">{email}</span>. It expires in 10 minutes.
            </p>
          </div>

          <fieldset>
            <legend className="vd-label">Verification Code</legend>
            <div className="flex gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`Digit ${i + 1}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  disabled={loading}
                  className="vd-input vd-price !min-h-[52px] min-w-0 flex-1 !px-0 text-center !text-xl font-semibold disabled:opacity-50"
                />
              ))}
            </div>
            <p className="vd-hint">Paste your code directly or enter each digit</p>
          </fieldset>

          {otp.join("").length === 6 && !loading && (
            <button type="submit" className="vd-btn vd-btn-lg vd-btn-ink w-full">Verify Code</button>
          )}
          {loading && <p className="text-[0.9375rem] font-medium" role="status">Verifying…</p>}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-sm">
            <span className="text-ink-2">Didn't receive the code?</span>
            <button type="button" onClick={handleResend} disabled={resendCooldown > 0 || loading} className="vd-link vd-price min-h-[44px] disabled:cursor-not-allowed disabled:text-ink-2 disabled:no-underline">
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="mt-6 space-y-5">
          <div>
            <h1 className="vd-h1">Create New Password</h1>
            <p className="mt-2 text-ink-2">Choose a strong password to secure your account.</p>
          </div>

          <div>
            <label htmlFor="new-password" className="vd-label">New Password</label>
            <div className="relative">
              <input id="new-password" name="new-password" type={showNew ? "text" : "password"} required autoFocus autoComplete="new-password"
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" className="vd-input !pr-12" />
              <button type="button" onClick={() => setShowNew((v) => !v)} aria-label={showNew ? "Hide password" : "Show password"} aria-pressed={showNew}
                className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink-2 hover:text-ink">
                <span className="material-symbols-outlined text-xl">{showNew ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            {newPassword && (
              <div className="mt-2">
                <div className="h-1 w-full overflow-hidden rounded-sm bg-shade">
                  <div className={`h-full transition-[width] duration-300 ${newPassword.length < 6 ? "w-1/3 bg-accent" : newPassword.length < 10 ? "w-2/3 bg-[#B7791F]" : "w-full bg-ok"}`} />
                </div>
                <p className="vd-hint !mt-1" role="status">
                  {newPassword.length < 6 ? "Weak: use at least 6 characters" : newPassword.length < 10 ? "Good: consider adding more characters" : "Strong password"}
                </p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="vd-label">Confirm Password</label>
            <div className="relative">
              <input id="confirm-password" name="confirm-password" type={showConfirm ? "text" : "password"} required autoComplete="new-password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter your password" className="vd-input !pr-12" />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "Hide password" : "Show password"} aria-pressed={showConfirm}
                className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-ink-2 hover:text-ink">
                <span className="material-symbols-outlined text-xl">{showConfirm ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            {confirmPassword && (
              <p className={newPassword === confirmPassword ? "vd-hint !text-ok" : "vd-error"} role="status">
                {newPassword === confirmPassword ? "Passwords match" : "Passwords don't match"}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading || newPassword.length < 6 || newPassword !== confirmPassword} className="vd-btn vd-btn-lg vd-btn-ink w-full">
            {loading ? "Saving…" : "Set New Password"}
          </button>
          <p className="text-sm text-ink-2">After resetting, you'll be redirected to login with your new password.</p>
        </form>
      )}
    </AuthShell>
  );
}
