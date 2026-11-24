'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import BrandMark from '@/components/brand/BrandMark';
import { WA_URL } from '@/lib/constants';

interface NavLink {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const SERVICE_LINKS = [
  { label: 'Signage & Sign Boards', href: '/services/signage' },
  { label: 'Digital Printing', href: '/services/digital-printing' },
  { label: 'Vehicle & Fleet Branding', href: '/services/vehicle-branding' },
  { label: 'Flex & Vinyl Printing', href: '/products/flex-vinyl-printing' },
  { label: 'Eco-Solvent Printing', href: '/products/eco-solvent-print' },
  { label: 'UV Printing', href: '/products/uv-print' },
  { label: 'ACP Cladding Signs', href: '/products/acp-cladding-sign' },
  { label: 'Acrylic Letters', href: '/products/acrylic-letter-sign' },
  { label: 'LED Sign Boards', href: '/products/led-sign-board' },
  { label: 'In-Shop Branding', href: '/products/retail-in-shop-branding' },
  { label: 'Office Branding', href: '/products/office-wall-branding' },
  { label: 'Exhibition Displays', href: '/products/trade-show-booth' },
];

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Clients', href: '/#clients' },
  { label: 'Services', href: '/services', children: SERVICE_LINKS },
  { label: 'Products', href: '/products' },
  { label: 'Machinery', href: '/machinery' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact Us', href: '/contact' },
];

const Chevron = () => (
  <svg className="vd-chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
    <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
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

  useEffect(() => {
    setDropOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!dropOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDropOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dropOpen]);

  const isActive = (href: string) =>
    href.includes('#') ? false : href === '/' ? pathname === '/' : pathname?.startsWith(href);
  const closeAll = () => { setMenuOpen(false); setDropOpen(false); };

  return (
    <>
      <header className="vd-header" data-scrolled={scrolled}>
        <div className="wix-container vd-header-inner">
          <Link href="/" className="vd-logo" aria-label="Vijetha Digital home" onClick={closeAll}>
            <BrandMark size={34} />
            <span className="vd-logo-text">
              Vijetha Digital
              <small>Printing &amp; Signage</small>
            </span>
          </Link>

          <nav className="vd-nav" aria-label="Main navigation">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div
                  key={link.href}
                  className="vd-nav-drop"
                  data-open={dropOpen}
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropOpen(false); }}
                >
                  <Link href={link.href} aria-current={isActive(link.href) ? 'page' : undefined} onFocus={() => setDropOpen(true)}>
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    className="vd-nav-drop-toggle"
                    aria-label={`${link.label} menu`}
                    aria-expanded={dropOpen}
                    aria-controls="vd-services-menu"
                    onClick={() => setDropOpen((o) => !o)}
                  >
                    <Chevron />
                  </button>
                  <div id="vd-services-menu" className="vd-nav-panel">
                    <ul>
                      {link.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} onClick={closeAll} aria-current={pathname === c.href ? 'page' : undefined}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link href={link.href} className="vd-nav-panel-all" onClick={closeAll}>All services →</Link>
                  </div>
                </div>
              ) : (
                <Link key={link.href} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
                  {link.label}
                </Link>
              ),
            )}
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
          {NAV_LINKS.map((link, i) =>
            link.children ? (
              <div key={link.href} className="vd-m-group" style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : '0ms' }}>
                <div className="vd-m-row">
                  <Link href={link.href} onClick={closeAll} tabIndex={menuOpen ? 0 : -1} aria-current={isActive(link.href) ? 'page' : undefined}>
                    {link.label}
                  </Link>
                  <button
                    type="button"
                    className="vd-m-toggle"
                    data-open={subOpen}
                    aria-label={`Show ${link.label.toLowerCase()}`}
                    aria-expanded={subOpen}
                    aria-controls="vd-m-services"
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={() => setSubOpen((o) => !o)}
                  >
                    <Chevron />
                  </button>
                </div>
                <ul id="vd-m-services" className="vd-m-sub" data-open={subOpen}>
                  {link.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} onClick={closeAll} tabIndex={menuOpen && subOpen ? 0 : -1}>{c.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeAll}
                tabIndex={menuOpen ? 0 : -1}
                style={{ transitionDelay: menuOpen ? `${80 + i * 50}ms` : '0ms' }}
                aria-current={isActive(link.href) ? 'page' : undefined}
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="vd-btn vd-btn--full"
          tabIndex={menuOpen ? 0 : -1}
          onClick={closeAll}
        >
          Get a quote on WhatsApp
        </a>
      </div>
    </>
  );
}
