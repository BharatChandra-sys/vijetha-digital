import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ReceptionLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fill demo credentials
  const fillDemoCredentials = () => {
    setFormData({ email: "reception@vijethadigital.com", password: "reception123" });
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user?.role === "reception" || user?.role === "admin") {
      navigate("/reception/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await login(formData.email, formData.password);
      if (userData?.role === "reception" || userData?.role === "admin") {
        navigate("/reception/dashboard");
      } else {
        setError("Access denied. Reception credentials required.");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "Manrope, sans-serif" }}>
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 to-green-800 items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">front_desk</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Reception Portal</h1>
          <p className="text-green-100 leading-relaxed mb-8">
            Manage walk-in customers, process orders, handle payments, and coordinate with production teams.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-green-300">check_circle</span>
              <span>Walk-in Order Management</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-green-300">check_circle</span>
              <span>Payment Processing</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="material-symbols-outlined text-green-300">check_circle</span>
              <span>Customer Support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#F8F7F4]">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">front_desk</span>
            </div>
            <h2 className="text-2xl font-bold text-[#1A2332] mb-2">Reception Login</h2>
            <p className="text-[#64748B]">Access your front desk workspace</p>
          </div>

          {/* Login form */}
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
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-[#E4E1DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A2332] mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-[#E4E1DA] rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Demo credentials button */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-xs text-green-600 font-semibold hover:text-green-700 transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                Use demo credentials
              </button>
              <Link
                to="/reception/forgot-password"
                className="text-green-600 hover:text-green-700 text-xs font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In to Reception"}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-3">
            <div className="pt-4 border-t border-[#E4E1DA]">
              <Link
                to="/workspace"
                className="inline-flex items-center gap-2 text-[#64748B] hover:text-[#1A2332] text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Workspace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}