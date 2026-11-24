'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BrandMark from '@/components/brand/BrandMark';
import { WA_URL } from '@/lib/constants';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Machinery', href: '/machinery' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href));

  return (
    <>
      <header className="vd-header" data-scrolled={scrolled}>
        <div className="wix-container vd-header-inner">
          <Link href="/" className="vd-logo" aria-label="Vijetha Digital home" onClick={() => setMenuOpen(false)}>
            <BrandMark size={34} />
            <span className="vd-logo-text">
              Vijetha Digital
              <small>Printing &amp; Signage</small>
            </span>
          </Link>

          <nav className="vd-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
                {link.label}
              </Link>
            ))}
          </nav>

          <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="vd-header-cta">
            Get a quote
          </a>

          <button
            type="button"
            className="vd-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="vd-mobile-menu"
            data-open={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </header>

      <div id="vd-mobile-menu" className="vd-mobile-menu" data-open={menuOpen} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
              style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : '0ms' }}
              aria-current={isActive(link.href) ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="vd-btn vd-btn--full"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        >
          Get a quote on WhatsApp
        </a>
      </div>
    </>
  );
}
