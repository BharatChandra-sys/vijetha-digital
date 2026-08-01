'use client';

import { useEffect } from 'react';

/**
 * ScrollAnimations
 *
 * Global scroll observer — mounts once at the page level and watches
 * every .wix-motion element on the page. Mirrors exact Wix behaviour:
 *
 * - Trigger threshold: 10% visible
 * - Root margin: -30px bottom offset so animation fires just before center
 * - Duration / easing: defined in globals.css via CSS custom properties
 * - Mobile (≤750px): all elements made visible immediately, no JS animation
 * - prefers-reduced-motion: all elements made visible immediately
 * - MutationObserver: picks up any elements added after initial mount
 *   (important for Next.js hydration and dynamic content)
 */
export default function ScrollAnimations() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 750px)').matches;

    // Show everything immediately when animations should be skipped
    if (prefersReducedMotion || isMobile) {
      document.querySelectorAll<HTMLElement>('.wix-motion').forEach((el) => {
        el.setAttribute('data-motion-enter', 'done');
      });
      return;
    }

    const timers = new Map<Element, number>();

    const observe = (el: HTMLElement) => {
      // Already done — skip
      if (el.getAttribute('data-motion-enter') === 'done') return;

      io.observe(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          io.unobserve(el);

          // Play animation
          el.classList.add('wix-motion-running');

          // Lock final state after 1200ms animation + 100ms buffer
          const timer = window.setTimeout(() => {
            el.setAttribute('data-motion-enter', 'done');
            timers.delete(el);
          }, 1300);

          timers.set(el, timer);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px',
      }
    );

    // Observe all existing elements
    document.querySelectorAll<HTMLElement>('.wix-motion').forEach(observe);

    // Watch for elements added after hydration (Next.js / dynamic imports)
    const mo = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          if (node.classList.contains('wix-motion')) observe(node);
          node.querySelectorAll<HTMLElement>('.wix-motion').forEach(observe);
        });
      });
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return null;
}
