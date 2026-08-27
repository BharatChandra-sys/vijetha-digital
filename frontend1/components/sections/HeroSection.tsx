'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // RAF-based parallax — mutates DOM directly, no setState, no re-renders
    let rafId: number;
    const mq = window.matchMedia('(max-width: 768px)');
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (bgRef.current && !mq.matches) {
          bgRef.current.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.08)`;
        }
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* All responsive logic is CSS-only — no JS state = no hydration mismatch */}
      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 580px;
          overflow: hidden;
          display: flex;
          align-items: center;
          background-color: #000;
        }
        @media (max-width: 768px) {
          .hero-section { height: 60vh; min-height: 380px; }
        }

        .hero-bg {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          transform: scale(1.08);
          will-change: transform;
          transform-origin: center top;
        }

        .hero-overlay {
          position: absolute;
          top: 0; right: 0; bottom: 0; left: 0;
          background-color: rgba(0,0,0,0.28);
        }
        @media (max-width: 768px) {
          .hero-overlay { background-color: rgba(0,0,0,0.42); }
        }

        .hero-inner {
          max-width: 680px;
        }
        @media (max-width: 768px) {
          .hero-inner { max-width: 100%; }
        }

        .hero-label {
          font-family: 'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.8);
          margin-bottom: 18px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.8s cubic-bezier(0.37,0,0.63,1) 0.1s,
                      transform 0.8s cubic-bezier(0.87,0,0.13,1) 0.1s;
        }
        @media (max-width: 768px) {
          .hero-label { font-size: 9px; margin-bottom: 10px; }
        }

        .hero-h1 {
          font-family: 'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size: clamp(34px, 7vw, 72px);
          font-weight: 400;
          line-height: 1.1;
          color: #ffffff;
          margin-bottom: 24px;
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 1s cubic-bezier(0.37,0,0.63,1) 0.25s,
                      transform 1s cubic-bezier(0.87,0,0.13,1) 0.25s;
        }
        @media (max-width: 768px) { .hero-h1 { margin-bottom: 16px; } }

        .hero-sub {
          font-family: 'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size: 18px;
          font-weight: 400;
          line-height: 1.6;
          color: rgba(255,255,255,0.9);
          margin-bottom: 32px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.9s cubic-bezier(0.37,0,0.63,1) 0.35s,
                      transform 0.9s cubic-bezier(0.87,0,0.13,1) 0.35s;
        }
        @media (max-width: 768px) {
          .hero-sub { font-size: 15px; margin-bottom: 24px; }
        }

        .hero-ctas {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.8s cubic-bezier(0.37,0,0.63,1) 0.45s,
                      transform 0.8s cubic-bezier(0.87,0,0.13,1) 0.45s;
        }
        @media (max-width: 768px) { .hero-ctas { gap: 12px; } }

        .hero-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #000;
          color: #fff;
          font-family: 'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.02em;
          padding: 18px 36px;
          text-decoration: none;
          transition: background-color 0.2s, transform 0.2s;
        }
        .hero-btn-primary:hover {
          background-color: #333;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .hero-btn-primary { font-size: 14px; padding: 14px 24px; }
        }

        .hero-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          color: #000;
          font-family: 'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif;
          font-size: 16px;
          font-weight: 400;
          letter-spacing: 0.02em;
          padding: 18px 36px;
          text-decoration: none;
          transition: background-color 0.2s, transform 0.2s;
        }
        .hero-btn-secondary:hover {
          background-color: #f0f0f0;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .hero-btn-secondary { font-size: 14px; padding: 14px 24px; }
        }

        /* mounted class triggers all fade-in animations */
        .hero-section.hero-mounted .hero-label,
        .hero-section.hero-mounted .hero-h1,
        .hero-section.hero-mounted .hero-sub,
        .hero-section.hero-mounted .hero-ctas {
          opacity: 1;
          transform: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-label, .hero-h1, .hero-sub, .hero-ctas {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <section className={`hero-section${mounted ? ' hero-mounted' : ''}`}>

        {/* Background — ref used for RAF parallax only, no state */}
        <div ref={bgRef} className="hero-bg" suppressHydrationWarning>
          <Image
            src="/images/hero-banner-hq.webp"
            alt="Commercial Printing Hyderabad - Vijetha Digital"
            fill
            priority
            fetchPriority="high"
            quality={75}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
            }}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCMAFmB//Z"
          />
        </div>

        <div className="hero-overlay" />

        <div className="wix-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-inner">

            <p className="hero-label">Premium Printing Solutions</p>

            <h1 className="hero-h1">
              Commercial Printing<br />Hyderabad
            </h1>

            <p className="hero-sub">
              LED Sign Boards • Vehicle Branding • Flex Printing • Offset Printing • Exhibition Displays
            </p>

            <div className="hero-ctas">
              <a
                href="https://wa.me/919248195552?text=Hi%20Vijetha%20Digital%2C%20I%20need%20a%20quote%20for"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-primary"
              >
                Get Free Quote
              </a>
              <a
                href="tel:+917942643004"
                className="hero-btn-secondary"
              >
                Call Now
              </a>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
