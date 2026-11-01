import { Link } from "react-router-dom";
import AuthShell from "../components/store/AuthShell";
import usePageTitle from "../hooks/usePageTitle";

export default function ResetLinkSent() {
  usePageTitle("Reset Link Sent");

  return (
    <AuthShell eyebrow="Account Recovery" title="Check Your Email" subtitle="We've sent a secure password reset link to your registered email address.">
      <span className="material-symbols-outlined text-4xl text-ink-2">mail</span>
      <h1 className="vd-h1 mt-3">Reset Link Sent</h1>
      <p className="mt-2 text-ink-2">
        Please check your inbox and follow the instructions to reset your password. If you don't see the email, check your spam folder.
      </p>
      <Link to="/login" className="vd-btn vd-btn-lg vd-btn-ink mt-6 w-full">Back to Sign In</Link>
    </AuthShell>
  );
}
