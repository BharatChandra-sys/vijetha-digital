'use client';

import Link from 'next/link';
import Image from 'next/image';
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
      {/* Background image - Optimized WebP with priority loading */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${parallaxY}px) scale(${isMobile ? 1 : 1.08})`,
          willChange: 'transform',
          transformOrigin: 'center top',
        }}
      >
        <Image
          src="/images/hero-banner-hq.webp"
          alt="Commercial Printing Hyderabad - Vijetha Digital"
          fill
          priority
          fetchPriority="high"
          quality={85}
          sizes="(max-width: 768px) 100vw, 100vw"
          style={{
            objectFit: 'cover',
            objectPosition: isMobile ? 'center center' : 'center top',
          }}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCMAFmB//Z"
        />
      </div>

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
            Commercial Printing<br />Hyderabad
          </h1>
          {/* CTA — stronger action buttons */}
          <div
            style={{
              opacity:   loaded ? 1 : 0,
              transform: loaded ? 'none' : 'translateY(16px)',
              transition:'opacity 0.8s cubic-bezier(0.37,0,0.63,1) 0.45s, transform 0.8s cubic-bezier(0.87,0,0.13,1) 0.45s',
              display: 'flex',
              gap: isMobile ? '12px' : '16px',
              flexWrap: 'wrap',
            }}
          >
            <a
              href="https://wa.me/919248195552?text=Hi%20Vijetha%20Digital%2C%20I%20need%20a%20quote%20for"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '8px',
                backgroundColor: '#000000',
                color:           '#ffffff',
                fontFamily:      "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
                fontSize:        isMobile ? '14px' : '16px',
                fontWeight:      400,
                letterSpacing:   '0.02em',
                padding:         isMobile ? '14px 24px' : '18px 36px',
                textDecoration:  'none',
                transition:      'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#333333';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Get Free Quote
            </a>
            
            <a
              href="tel:+917942643004"
              style={{
                display:         'inline-flex',
                alignItems:      'center',
                justifyContent:  'center',
                gap:             '8px',
                backgroundColor: '#ffffff',
                color:           '#000000',
                fontFamily:      "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
                fontSize:        isMobile ? '14px' : '16px',
                fontWeight:      400,
                letterSpacing:   '0.02em',
                padding:         isMobile ? '14px 24px' : '18px 36px',
                textDecoration:  'none',
                transition:      'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.transform = 'none';
              }}
            >
              Call Now
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
