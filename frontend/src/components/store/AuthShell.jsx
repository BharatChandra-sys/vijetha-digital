import { Link } from "react-router-dom";

/* Customer sign-in pages. Portal sign-in keeps layouts/AuthLayout.jsx. */
export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <main id="main" className="flex min-h-screen font-display">
      <section className="relative hidden w-[46%] flex-col justify-between overflow-hidden bg-night p-12 text-white lg:flex xl:p-16">
        <img
          src="/products/offset-printing.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <Link to="/" className="relative flex items-center gap-3">
          <img src="/vd-logo.jpeg" alt="" width="40" height="40" className="h-10 w-10 rounded-md object-cover" />
          <span className="text-lg font-bold tracking-tight">Vijetha Digital</span>
        </Link>
        <div className="relative max-w-md">
          {eyebrow && <p className="mb-2 text-[0.9375rem] font-semibold text-white/85">{eyebrow}</p>}
          <p className="vd-h1">{title}</p>
          {subtitle && <p className="mt-3 text-[1.0625rem] leading-relaxed text-white/85">{subtitle}</p>}
          <ul className="mt-8 space-y-2 border-t border-white/25 pt-5 text-[0.9375rem] text-white/90">
            <li>500+ businesses trust us</li>
            <li>GST invoice on every order</li>
            <li>24–48h turnaround time</li>
          </ul>
        </div>
      </section>

      <section className="flex w-full flex-1 flex-col px-4 py-6 sm:px-8 lg:items-center lg:justify-center lg:py-10">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 flex items-center justify-between lg:mb-6">
            <Link to="/" className="flex items-center gap-2.5 lg:hidden">
              <img src="/vd-logo.jpeg" alt="" width="36" height="36" className="h-9 w-9 rounded-md object-cover" />
              <span className="font-bold tracking-tight">Vijetha Digital</span>
            </Link>
            <Link to="/" className="inline-flex min-h-[44px] items-center gap-1 text-sm text-ink-2 hover:text-ink">
              <span className="material-symbols-outlined text-lg">arrow_back</span>
              Back to Home
            </Link>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
