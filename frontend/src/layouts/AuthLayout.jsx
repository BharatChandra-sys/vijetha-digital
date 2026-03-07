import { Link } from "react-router-dom";

export default function AuthLayout({
  children,
  leftTag,
  leftTitle,
  leftSubtitle,
}) {
  return (
    <main className="min-h-screen flex bg-[#F8F7F4] text-[#3B2F63] overflow-hidden">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-[55%] xl:w-[60%] relative bg-[#E9E4D9] overflow-hidden flex-col p-16">

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
          <span
            className="text-[25rem] font-bold tracking-widest text-[#3B2F63]"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            VIJETHA
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 mt-[120px] max-w-md">
          {leftTag && (
            <p className="text-sm uppercase tracking-[2px] font-medium text-[#3B2F63]/70 mb-2">
              {leftTag}
            </p>
          )}

          {leftTitle && (
            <div className="relative mb-4">
              <h1 className="text-[32px] font-semibold text-[#3B2F63] leading-tight">
                {leftTitle}
              </h1>
              <div className="w-[50px] h-[2px] bg-[#FF6B5E] mt-2"></div>
            </div>
          )}

          {leftSubtitle && (
            <p className="text-[#3B2F63] font-light text-lg leading-relaxed opacity-90">
              {leftSubtitle}
            </p>
          )}
        </div>

        {/* Footer Branding */}
        <div className="relative z-10 mt-auto space-y-4">
          <div className="flex items-center gap-3">
            <img src="/vd-logo.jpeg" alt="Vijetha Digital" className="h-10 w-10 rounded-xl object-cover shadow-lg flex-shrink-0" />
            <span className="tracking-[0.25em] text-xs uppercase font-bold">
              Vijetha Digital
            </span>
          </div>
          
          {/* Footer Links */}
          <div className="flex gap-4 text-xs text-[#3B2F63]/60">
            <Link to="/terms" className="hover:text-[#3B2F63] transition-colors">Terms of Service</Link>
            <span className="text-[#3B2F63]/30">·</span>
            <Link to="/privacy-policy" className="hover:text-[#3B2F63] transition-colors">Privacy Policy</Link>
            <span className="text-[#3B2F63]/30">·</span>
            <Link to="/contact" className="hover:text-[#3B2F63] transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 lg:w-[45%] xl:w-[40%] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>

    </main>
  );
}
