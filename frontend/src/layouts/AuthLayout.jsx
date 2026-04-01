import { Link } from "react-router-dom";

export default function AuthLayout({ children, leftTag, leftTitle, leftSubtitle }) {
  return (
    <main className="min-h-screen flex bg-warm-white font-display overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-[52%] xl:w-[55%] relative bg-plum-deep overflow-hidden flex-col p-14 xl:p-16">

        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Glow accent */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-coral-accent/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-sm">
          {leftTag && (
            <p className="text-[0.6875rem] uppercase tracking-[0.2em] font-bold text-white/50 mb-4">
              {leftTag}
            </p>
          )}
          {leftTitle && (
            <div className="mb-5">
              <h1 className="text-[2rem] xl:text-[2.25rem] font-bold text-white leading-tight">
                {leftTitle}
              </h1>
              <div className="w-10 h-[3px] bg-coral-accent mt-3 rounded-full" />
            </div>
          )}
          {leftSubtitle && (
            <p className="text-white/60 text-base leading-relaxed">{leftSubtitle}</p>
          )}

          {/* Trust badges */}
          <div className="mt-10 space-y-3">
            {[
              { icon: "verified_user", text: "500+ businesses trust us" },
              { icon: "receipt_long",  text: "GST invoice on every order" },
              { icon: "bolt",          text: "24–48h turnaround time" },
            ].map(b => (
              <div key={b.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-coral-accent text-base">{b.icon}</span>
                </div>
                <span className="text-[0.8125rem] text-white/70 font-medium">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer branding */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-9 w-9 rounded-xl object-cover flex-shrink-0" />
            <span className="text-[0.75rem] tracking-[0.2em] uppercase font-bold text-white/70">Vijetha Digital</span>
          </div>
          <div className="flex gap-4 text-[0.6875rem] text-white/40">
            <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
            <Link to="/privacy-policy" className="hover:text-white/70 transition-colors">Privacy</Link>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-[360px]">
          {children}
        </div>
      </div>
    </main>
  );
}
