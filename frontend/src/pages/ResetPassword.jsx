import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    navigate("/password-updated");
  };

  return (
    <AuthLayout
      leftTag="SECURE RESET"
      leftTitle="Create a New Password"
      leftSubtitle="Choose a strong password to protect your account and ensure your designs stay private."
    >
      <div className="w-full max-w-md">

        <header className="mb-8">
          <h2 className="text-3xl font-bold text-text-dark mb-2">
            Set <span className="relative inline-block">
              New Password
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
            </span>
          </h2>
          <p className="text-text-muted">
            Please enter your new password below.
          </p>
        </header>

        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-plum-deep text-white py-4 rounded-lg font-bold shadow-soft-plum hover:bg-[#2D244C] transition-all"
          >
            Reset Password
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          <span
            onClick={() => navigate("/login")}
            className="text-plum-deep font-semibold cursor-pointer hover:text-coral-accent"
          >
            ← Back to Login
          </span>
        </p>
      </div>
    </AuthLayout>
  );
}
