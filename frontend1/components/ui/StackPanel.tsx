'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Sticky panel for the stacked home sections. A panel taller than the screen
 * pins by its bottom edge, so all of it is seen before the next one covers it.
 */
export default function StackPanel({ z, children }: { z: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      el.style.top = `${Math.min(0, window.innerHeight - el.offsetHeight)}px`;
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div ref={ref} style={{ position: 'sticky', top: 0, zIndex: z }}>
      {children}
    </div>
  );
}
