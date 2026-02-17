// src/pages/ResetPassword.jsx

import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import api from "../api/axios";

export default function ResetPassword() {
  const { token } = useParams(); // because route uses :token
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Invalid reset link.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        token: token,
        new_password: password,
      });

      navigate("/password-updated");

    } catch (err) {
      alert(
        err?.response?.data?.detail ||
        "Invalid or expired reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      leftTag="SECURE RESET"
      leftTitle="Create a New Password"
      leftSubtitle="Choose a strong password to protect your account."
    >
      <div className="w-full max-w-md">

        <header className="mb-6">
          <h2 className="text-3xl font-bold text-[#1C1C1C] mb-2">
            Set{" "}
            <span className="relative inline-block">
              New Password
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-[#FF6B5E]"></span>
            </span>
          </h2>

          <p className="text-[#6E6E73] text-sm">
            Please enter your new password below.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6E73] mb-1">
              New Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E6E3DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B2F63]"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6E73] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-[#E6E3DD] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B2F63]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B2F63] text-white py-3 rounded-md font-semibold shadow-md hover:bg-[#2D244C] transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

        </form>

      </div>
    </AuthLayout>
  );
}
