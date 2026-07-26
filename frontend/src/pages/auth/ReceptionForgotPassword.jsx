import { useState } from "react";
import { Link } from "react-router-dom";

export default function ReceptionForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // TODO: Implement forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] p-8" style={{ fontFamily: "Manrope, sans-serif" }}>
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 text-3xl">mail</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2332] mb-4">Check Your Email</h2>
          <p className="text-[#64748B] mb-8">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          <Link
            to="/reception/login"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Reception Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4] p-8" style={{ fontFamily: "Manrope, sans-serif" }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-green-600 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">front_desk</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1A2332] mb-2">Reset Password</h2>
          <p className="text-[#64748B]">Enter your reception email address</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#1A2332] mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-[#E4E1DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              placeholder="Enter your reception email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link
            to="/reception/login"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Reception Login
          </Link>
        </div>
      </div>
    </div>
  );
}