'use client';

import { useState, useEffect } from 'react';
import { PHONE, WA_URL } from '@/lib/constants';

const font = "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif";

export default function StickyContactBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        zIndex: 9999,
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        backdropFilter: 'blur(12px)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'all 0.35s cubic-bezier(0.4, 0.0, 0.2, 1)',
      }}
    >
      <style jsx>{`
        @media (max-width: 640px) {
          .contact-label { display: none; }
          .contact-btn { 
            flex: 1; 
            font-size: 13px; 
            padding: 11px 18px; 
            justify-content: center;
          }
        }
      `}</style>

      <span 
        className="contact-label"
        style={{ 
          fontFamily: font,
          fontSize: '14px', 
          color: 'rgba(0,0,0,0.65)',
          letterSpacing: '0.01em',
        }}
      >
        Get your quote in 4 hours
      </span>

      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-btn"
        style={{
          fontFamily: font,
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '11px 28px',
          fontSize: '14px',
          fontWeight: 400,
          letterSpacing: '0.02em',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          border: 'none',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#333333';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#000000';
        }}
      >
        WhatsApp
      </a>

      <a
        href={`tel:${PHONE}`}
        className="contact-btn"
        style={{
          fontFamily: font,
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '11px 28px',
          fontSize: '14px',
          fontWeight: 400,
          letterSpacing: '0.02em',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
          border: 'none',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#333333';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#000000';
        }}
      >
        Call
      </a>
    </div>
  );
}
