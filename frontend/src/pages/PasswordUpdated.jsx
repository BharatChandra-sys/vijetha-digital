import { Link } from "react-router-dom";
import AuthShell from "../components/store/AuthShell";
import usePageTitle from "../hooks/usePageTitle";

export default function PasswordUpdated() {
  usePageTitle("Password Updated");

  return (
    <AuthShell eyebrow="Welcome To" title="Vijetha Digital" subtitle="Where ideas turn into powerful print.">
      <span className="material-symbols-outlined text-4xl text-ok" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      <h1 className="vd-h1 mt-3">Password Updated</h1>
      <p className="mt-2 text-ink-2">Your password has been successfully reset. You can now log in securely with your new credentials.</p>
      <Link to="/login" className="vd-btn vd-btn-lg vd-btn-ink mt-6 w-full">Back to Sign In</Link>
    </AuthShell>
  );
}
