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
        <div className="relative z-10 flex items-center gap-4 mt-auto">
          <div className="w-9 h-9 rounded-lg bg-[#3B2F63] flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-semibold">P</span>
          </div>
          <span className="tracking-[0.25em] text-xs uppercase font-bold">
            Vijetha Digital
          </span>
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
