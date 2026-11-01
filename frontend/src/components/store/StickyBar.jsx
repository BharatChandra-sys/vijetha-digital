import { useEffect, useRef } from "react";

/**
 * Mobile-only bar pinned to the bottom of purchase pages. It publishes its
 * height as --sticky-bar so the WhatsApp button and footer can clear it.
 */
export default function StickyBar({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      const height = media.matches ? 0 : ref.current?.offsetHeight || 0;
      root.style.setProperty("--sticky-bar", `${height}px`);
    };
    sync();
    media.addEventListener("change", sync);
    window.addEventListener("resize", sync);
    return () => {
      media.removeEventListener("change", sync);
      window.removeEventListener("resize", sync);
      root.style.removeProperty("--sticky-bar");
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface px-4 pt-2.5 lg:hidden"
      style={{ paddingBottom: "max(0.625rem, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center justify-between gap-3">{children}</div>
    </div>
  );
}
