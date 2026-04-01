import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Maintenance({ message }) {
  const [dots, setDots] = useState(".");

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1220] flex flex-col items-center justify-center px-4 font-display relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8431A]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-10 w-10 rounded-xl object-cover" />
          <span className="text-white font-bold tracking-tight text-base">VIJETHA DIGITAL</span>
        </div>

        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
          <span className="material-symbols-outlined text-[#E8431A] text-4xl">construction</span>
        </div>

        {/* Heading */}
        <h1 className="text-[2rem] sm:text-[2.5rem] font-extrabold text-white mb-4 leading-tight tracking-tight">
          We'll be back soon{dots}
        </h1>

        {/* Message */}
        <p className="text-white/60 text-base leading-relaxed mb-8">
          {message || "We're performing scheduled maintenance to improve your experience. Thank you for your patience."}
        </p>

        {/* Status bar */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[0.8125rem] font-semibold text-white/70">Maintenance in progress</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Database optimisation",  done: true  },
              { label: "Security updates",        done: true  },
              { label: "Performance improvements",done: false },
              { label: "Final testing",           done: false },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-base ${item.done ? "text-green-400" : "text-white/20"}`}>
                  {item.done ? "check_circle" : "radio_button_unchecked"}
                </span>
                <span className={`text-[0.8125rem] ${item.done ? "text-white/60 line-through" : "text-white/40"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <p className="text-white/40 text-[0.8125rem] mb-2">
          Need urgent help?{" "}
          <a href="tel:+917942643004" className="text-white/60 hover:text-white transition-colors underline underline-offset-2">
            +91 79426 43004
          </a>
        </p>
        <p className="text-white/40 text-[0.8125rem]">
          Or WhatsApp us at{" "}
          <a href="https://wa.me/917942643004" target="_blank" rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors underline underline-offset-2">
            wa.me/917942643004
          </a>
        </p>

        {/* Admin link — very subtle */}
        <div className="mt-12 pt-6 border-t border-white/5">
          <Link to="/admin/login" className="text-[0.6875rem] text-white/15 hover:text-white/40 transition-colors">
            Admin access
          </Link>
        </div>
      </div>
    </div>
  );
}
