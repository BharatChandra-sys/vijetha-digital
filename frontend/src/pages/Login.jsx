import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <main className="flex h-screen overflow-hidden bg-[#F8F7F4] text-[#3B2F63]">

      {/* LEFT PANEL */}
      <section className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[#E9E4D9] p-16 flex-col justify-between">

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05]">
          <span className="text-[25rem] font-bold watermark-text tracking-widest text-[#3B2F63]">
            VIJETHA
          </span>
        </div>

        {/* Welcome Content */}
        <div className="relative z-10 max-w-md">
          <p className="uppercase tracking-[0.2em] text-[12px] font-semibold text-[#3B2F63]/60 mb-4">
            Welcome Back
          </p>

          <h1 className="text-5xl font-bold mb-6 text-[#3B2F63] relative">
            Vijetha Digital
            <span className="absolute bottom-[-12px] left-0 w-12 h-1 bg-[#FF6B5E]"></span>
          </h1>

          <p className="text-xl text-[#3B2F63]/70 leading-relaxed">
            Continue building powerful print experiences.
          </p>
        </div>

        {/* Footer Branding */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 bg-[#3B2F63] rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="uppercase tracking-[0.25em] text-[13px] font-bold text-[#3B2F63]">
            Vijetha Digital
          </span>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="w-full lg:w-2/5 flex items-center justify-center px-6 py-8 lg:px-16 bg-[#F8F7F4]">
        <div className="w-full max-w-md">

          {/* Header */}
          <header className="mb-6">
            <h2 className="text-3xl font-bold text-[#3B2F63] mb-2">
              Sign{" "}
              <span className="relative inline-block">
                In
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FF6B5E] rounded-full"></span>
              </span>
            </h2>

            <p className="text-[#3B2F63]/60">
              Access your dashboard and manage your orders.
            </p>
          </header>

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#3B2F63]/60 uppercase tracking-wider">
                Email Address
              </label>

              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3B2F63] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold text-[#3B2F63]/60 uppercase tracking-wider">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#3B2F63] focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-[#3B2F63] focus:ring-[#3B2F63]"
                />
                <span className="text-[#3B2F63]/70 group-hover:text-[#3B2F63] transition-colors">
                  Remember me
                </span>
              </label>

              <span
                onClick={() => navigate("/forgot-password")}
                className="text-[#3B2F63] font-semibold hover:text-[#FF6B5E] transition-colors cursor-pointer"
              >
                Forgot password?
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-[#3B2F63] text-white py-4 rounded-lg font-bold text-base shadow-[0_12px_24px_-8px_rgba(59,47,99,0.5)] hover:bg-[#2D244C] transition-all transform hover:-translate-y-0.5"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-gray-200"></div>
            <span className="text-[12px] font-medium text-gray-400 whitespace-nowrap">
              or continue with
            </span>
            <div className="flex-1 h-[1px] bg-gray-200"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span className="text-[#3B2F63] font-medium">
              Sign in with Google
            </span>
          </button>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-[#3B2F63] font-bold hover:text-[#FF6B5E] transition-colors cursor-pointer"
            >
              Sign up
            </span>
          </p>

        </div>
      </section>
    </main>
  );
}
