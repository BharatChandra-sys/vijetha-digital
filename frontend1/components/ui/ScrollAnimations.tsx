'use client';

import { useEffect } from 'react';

/**
 * Scroll-linked entrance motion for every `.wix-motion` element.
 *
 * Each element gets a progress value `--p` (0 → 1) tied to how far it has
 * scrolled into view, so motion follows the scroll: faster scrolling plays it
 * faster, scrolling back reverses it. CSS turns `--p` into opacity/transform.
 * Progress is eased toward its target each frame so it never jitters.
 * Stagger: `.wix-delay-N` or an inline transition-delay shifts the start.
 */
export default function ScrollAnimations() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    root.classList.add('vd-motion-on');

    const state = new Map<HTMLElement, { cur: number; offset: number }>();
    const active = new Set<HTMLElement>();
    let raf = 0;

    const staggerOf = (el: HTMLElement) => {
      const m = el.className.match(/wix-delay-(\d)/);
      if (m) return (Number(m[1]) - 1) * 0.15;
      const d = parseFloat(el.style.transitionDelay || '0');
      return Number.isFinite(d) ? (el.style.transitionDelay.endsWith('ms') ? d / 1000 : d) : 0;
    };

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const targetFor = (el: HTMLElement, offset: number) => {
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const start = vh * (0.98 - offset * 0.12);
      const span = vh * (vh < 700 ? 0.28 : 0.34);
      return Math.min(1, Math.max(0, (start - top) / span));
    };

    const tick = () => {
      raf = 0;
      let moving = false;
      active.forEach((el) => {
        const s = state.get(el);
        if (!s) return;
        const target = targetFor(el, s.offset);
        const next = s.cur + (target - s.cur) * 0.2;
        s.cur = Math.abs(target - next) < 0.002 ? target : next;
        if (s.cur !== target) moving = true;
        el.style.setProperty('--p', ease(s.cur).toFixed(4));
      });
      if (moving) raf = requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) active.add(el);
          else {
            active.delete(el);
            // Off screen: snap so it is ready to play again from the right place.
            const s = state.get(el);
            if (s) {
              s.cur = targetFor(el, s.offset);
              el.style.setProperty('--p', ease(s.cur).toFixed(4));
            }
          }
        });
        schedule();
      },
      { rootMargin: '25% 0px 25% 0px' },
    );

    const track = (el: HTMLElement) => {
      if (state.has(el)) return;
      const offset = staggerOf(el);
      const cur = targetFor(el, offset);
      state.set(el, { cur, offset });
      el.style.setProperty('--p', ease(cur).toFixed(4));
      io.observe(el);
    };

    document.querySelectorAll<HTMLElement>('.wix-motion').forEach(track);

    const mo = new MutationObserver((muts) => {
      muts.forEach((m) =>
        m.addedNodes.forEach((n) => {
          if (!(n instanceof HTMLElement)) return;
          if (n.classList.contains('wix-motion')) track(n);
          n.querySelectorAll<HTMLElement>('.wix-motion').forEach(track);
        }),
      );
    });
    mo.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      io.disconnect();
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      root.classList.remove('vd-motion-on');
    };
  }, []);

  return null;
}
