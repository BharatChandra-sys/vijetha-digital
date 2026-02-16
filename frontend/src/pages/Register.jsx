import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <AuthLayout
      leftTag="WELCOME TO"
      leftTitle="Vijetha Digital"
      leftSubtitle="Join our premium printing network and bring your ideas to life."
    >
      <div className="w-full max-w-md">

        {/* Header */}
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-text-dark mb-2">
            Create <span className="relative inline-block">
              Account
              <span className="absolute left-0 bottom-[-3px] w-full h-[3px] bg-coral-accent"></span>
            </span>
          </h2>

          <p className="text-text-muted">
            Sign up to start ordering premium print products.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={submit} className="space-y-6">

          {/* Name */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Password
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-2 p-4 rounded-lg border border-stone-border focus:ring-2 focus:ring-plum-deep outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-plum-deep text-white py-4 rounded-lg font-bold shadow-soft-plum hover:bg-[#2D244C] transition-all"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-plum-deep font-semibold cursor-pointer hover:text-coral-accent"
          >
            Sign In
          </span>
        </p>

      </div>
    </AuthLayout>
  );
}
