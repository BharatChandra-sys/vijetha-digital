// src/pages/ForgotPassword.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });

      // ✅ redirect to confirmation page
      navigate("/reset-link-sent");

    } catch (err) {
      alert(
        err?.response?.data?.detail ||
        "Failed to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTag="ACCOUNT RECOVERY"
      leftTitle="Reset Access"
      leftSubtitle="Enter your email and we’ll send you a secure reset link."
    >
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">
          Forgot{" "}
          <span className="relative inline-block">
            Password
            <span className="absolute left-0 bottom-[-2px] w-full h-[2px] bg-[#FF6B5E]" />
          </span>
        </h2>

        <p className="text-sm text-[#6E6E73] mb-6">
          Enter your registered email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-[#E6E3DD] rounded-md focus:ring-2 focus:ring-[#3B2F63]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B2F63] text-white py-3 rounded-md font-semibold shadow-md hover:bg-[#2D244C]"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}
