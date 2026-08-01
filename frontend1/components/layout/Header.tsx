'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const MENU_BG = '#ffedc9';

interface HeaderProps {
  /** 'home' = white text on transparent hero, flips black after scroll
   *  default = always black text, transparent → frosted on scroll */
  variant?: 'home' | 'default';
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = variant === 'home';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // On home page: warm off-white (matches footer text) until scrolled, then black.
  // On all other pages: always black.
  const useDarkText = !isHome || scrolled;

  // Text colour for home transparent state — matches footer's rgba(255,255,255,0.7)
  const heroTextColor = 'rgba(255,255,255,0.82)';

  const navLinks = [
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
    { label: 'Contact',  href: '/contact' },
  ];

  return (
    <>
      {/* ── HEADER BAR ── */}
      <header
        className="fixed top-0 left-0 right-0 flex items-center h-16 md:h-[72px] transition-all duration-500"
        style={{
          zIndex: 200,
          backgroundColor: scrolled ? 'rgba(255,255,255,0.55)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
        }}
      >
        <div className="wix-container flex items-center justify-between w-full">

          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-[17px] leading-none tracking-tight transition-all duration-300 hover:opacity-60"
            style={{
              fontFamily: "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif",
              color: (useDarkText || menuOpen) ? '#000' : heroTextColor,
              textDecoration: 'none',
            }}
          >
            Vijetha Digital
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-[15px] font-normal leading-none transition-opacity duration-200 hover:opacity-60
                  after:absolute after:bottom-[-3px] after:left-0 after:h-[1px] after:w-0
                  after:transition-all after:duration-300 hover:after:w-full
                  ${useDarkText ? 'after:bg-black' : 'after:bg-white'}`}
                style={{
                  fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
                  color: useDarkText ? '#000' : heroTextColor,
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <a
            href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20get%20a%20quote%20for%20printing%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center justify-center px-7 py-[11px] text-[14px] font-normal leading-none transition-all duration-300 hover:opacity-80"
            style={{
              fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              textDecoration: 'none',
              backgroundColor: useDarkText ? '#000' : heroTextColor,
              color: useDarkText ? '#fff' : '#000',
            }}
          >
            Get a Quote
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <line x1="2" y1="2" x2="20" y2="20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                <line x1="20" y1="2" x2="2" y2="20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <span className="flex flex-col gap-[5px]">
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="block w-6 h-[2px] transition-colors duration-300"
                    style={{ backgroundColor: (useDarkText || menuOpen) ? '#000' : heroTextColor }}
                  />
                ))}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* ── FULL-PAGE MOBILE MENU ── */}
      <div
        className={`md:hidden fixed inset-0 flex flex-col transition-all duration-500 ease-out ${
          menuOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
        style={{ zIndex: 199, backgroundColor: MENU_BG }}
      >
        <div className="flex items-center justify-between h-16 px-5" style={{ borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-bold text-[17px] text-black leading-none"
            style={{ fontFamily: "'helvetica-w01-bold','Helvetica Neue',Helvetica,Arial,sans-serif" }}
          >
            Vijetha Digital
          </Link>
          <button onClick={() => setMenuOpen(false)} className="flex items-center justify-center w-10 h-10" aria-label="Close menu">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="2" y1="2" x2="20" y2="20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
              <line x1="20" y1="2" x2="2" y2="20" stroke="black" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`w-full text-center text-[26px] font-normal text-black py-5 border-b border-black/10 transition-all duration-400 ${
                menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
                transitionDelay: menuOpen ? `${i * 80 + 100}ms` : '0ms',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://wa.me/919248195552?text=Hi%21%20I%20would%20like%20to%20get%20a%20quote%20for%20printing%20services."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className={`w-full mt-6 bg-black text-white text-center text-[16px] font-normal py-4 transition-all duration-400 ${
              menuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              fontFamily: "'helvetica-w01-roman','Helvetica Neue',Helvetica,Arial,sans-serif",
              transitionDelay: menuOpen ? '380ms' : '0ms',
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Get a Quote
          </a>
        </div>
      </div>
    </>
  );
}
