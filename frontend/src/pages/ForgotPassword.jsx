import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // simulate API success
    navigate("/reset-password"); // or navigate("/check-email")
  };

  return (
    <AuthLayout
      leftTag="ACCOUNT RECOVERY"
      leftTitle="Reset Access"
      leftSubtitle="Enter your email and we’ll send you a secure reset link."
    >
      <div className="w-full max-w-[360px]">

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 relative inline-block">
            Forgot Password
            <span className="absolute left-0 bottom-[-4px] w-10 h-[2px] bg-[#FF6B5E]" />
          </h2>
          <p className="text-sm text-[#6E6E73]">
            Enter your registered email address.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6E73] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-[#E6E3DD] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3B2F63]"
              placeholder="name@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3B2F63] hover:bg-[#2D244C] text-white font-bold py-3 rounded-md shadow-lg transition"
          >
            Send Reset Link
          </button>
        </form>

        <p className="text-xs text-center mt-6 text-[#6E6E73]">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#3B2F63] font-semibold cursor-pointer hover:text-[#FF6B5E]"
          >
            Sign In
          </span>
        </p>

      </div>
    </AuthLayout>
  );
}
