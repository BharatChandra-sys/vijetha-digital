'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded]   = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setLoaded(true);
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const onMQ = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onMQ);

    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', onMQ);
    };
  }, []);

  // No parallax on mobile — image stays still, lighter feel
  const parallaxY = isMobile ? 0 : scrollY * 0.25;

  return (
    <section
      style={{
        position:        'relative',
        width:           '100%',
        // Mobile: 60vh feels right — not full screen heavy
        // Desktop: full viewport
        height:          isMobile ? '60vh' : '100vh',
        minHeight:       isMobile ? '380px' : '580px',
        overflow:        'hidden',
        display:         'flex',
        alignItems:      'center',
        backgroundColor: '#000',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position:           'absolute',
          inset:              0,
          backgroundImage:    'url(/images/hero-banner-hq.jpg)',
          backgroundSize:     'cover',
          backgroundPosition: isMobile ? 'center center' : 'center top',
          backgroundRepeat:   'no-repeat',
          transform:          `translateY(${parallaxY}px) scale(${isMobile ? 1 : 1.08})`,
          willChange:         'transform',
          transformOrigin:    'center top',
        }}
      />

      {/* Overlay — slightly heavier on mobile for readability */}
      <div
        style={{
          position:        'absolute',
          inset:           0,
          backgroundColor: isMobile ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0.28)',
        }}
      />

      {/* Content */}
      <div
        className="wix-container"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div style={{ maxWidth: isMobile ? '100%' : '560px' }}>

          {/* Label */}
          <p
            style={{
              fontFamily:     "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              fontSize:       isMobile ? '9px' : '11px',
              fontWeight:     400,
              letterSpacing:  '0.18em',
              textTransform:  'uppercase',
              color:          'rgba(255,255,255,0.8)',
              marginBottom:   isMobile ? '10px' : '18px',
              opacity:        loaded ? 1 : 0,
              transform:      loaded ? 'none' : 'translateY(12px)',
              transition:     'opacity 0.8s cubic-bezier(0.37,0,0.63,1) 0.1s, transform 0.8s cubic-bezier(0.87,0,0.13,1) 0.1s',
            }}
          >
            Premium Printing Solutions
          </p>

          {/* Heading */}
          <h1
            style={{
              fontFamily:  "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              // Mobile: ~38px, tablet: scales, desktop: up to 72px
              fontSize:    'clamp(34px, 7vw, 72px)',
              fontWeight:  400,
              lineHeight:  1.1,
              color:       '#ffffff',
              marginBottom: isMobile ? '20px' : '32px',
              opacity:     loaded ? 1 : 0,
              transform:   loaded ? 'none' : 'translateY(32px)',
              transition:  'opacity 1s cubic-bezier(0.37,0,0.63,1) 0.25s, transform 1s cubic-bezier(0.87,0,0.13,1) 0.25s',
            }}
          >
            Print Your<br />Vision to Life
          </h1>

          {/* CTA — smaller on mobile */}
          <div
            style={{
              opacity:   loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(16px)',
              transition:'opacity 0.8s cubic-bezier(0.37,0,0.63,1) 0.45s, transform 0.8s cubic-bezier(0.87,0,0.13,1) 0.45s',
            }}
          >
            <Link
              href="#about"
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                justifyContent:  'center',
                backgroundColor: '#000000',
                color:           '#ffffff',
                fontFamily:      "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
                fontSize:        isMobile ? '13px' : '15px',
                fontWeight:      400,
                letterSpacing:   '0.03em',
                // Smaller padding on mobile
                padding:         isMobile ? '12px 28px' : '16px 40px',
                textDecoration:  'none',
              }}
            >
              Read More
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
