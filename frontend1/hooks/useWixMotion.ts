'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * useWixMotion
 *
 * Replicates the exact Wix scroll-enter animation behaviour extracted from source:
 *
 * - Duration: 1200ms
 * - FadeIn easing:  cubic-bezier(0.37, 0, 0.63, 1)
 * - SlideIn easing: cubic-bezier(0.87, 0, 0.13, 1)
 * - Trigger:        10% of element visible (rootMargin -30px bottom)
 * - Mobile (≤750px): animations disabled, elements shown immediately
 * - Once fired, observer is disconnected for that element (no re-trigger)
 * - After animation ends, opacity/transform locked at final state via data-motion-enter="done"
 */

type WixMotionOptions = {
  threshold?: number;
  rootMargin?: string;
};

export function useWixMotion(options: WixMotionOptions = {}) {
  const containerRef = useRef<HTMLElement | null>(null);
  const { threshold = 0.1, rootMargin = '0px 0px -30px 0px' } = options;

  const activate = useCallback((el: HTMLElement) => {
    el.classList.add('wix-motion-running');
    // Lock final state after animation completes (1200ms + 100ms buffer)
    const timer = window.setTimeout(() => {
      el.setAttribute('data-motion-enter', 'done');
    }, 1300);
    return timer;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('.wix-motion');
    if (elements.length === 0) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 750px)').matches;

    // Wix skips scroll animations entirely on mobile and for reduced-motion
    if (isMobile || prefersReducedMotion) {
      elements.forEach((el) => {
        el.setAttribute('data-motion-enter', 'done');
      });
      return;
    }

    const timers: number[] = [];
    const observers: IntersectionObserver[] = [];

    elements.forEach((el) => {
      if (el.getAttribute('data-motion-enter') === 'done') return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            const timer = activate(el);
            timers.push(timer);
          }
        },
        { threshold, rootMargin }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [activate, threshold, rootMargin]);

  return containerRef;
}
