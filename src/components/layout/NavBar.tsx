'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================================
// NavBar — MVP navigation (showcase only, no community/auth)
// Fonts: Schibsted Grotesk (logo 24px SemiBold, menu 16px Medium)
// ============================================================

const NAV_ITEMS = [
  { href: '/', label: 'Projects' },
  { href: '/about', label: 'About' },
];

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItemStyle: React.CSSProperties = {
    fontFamily: 'var(--font-schibsted)',
    fontWeight: 500,
    fontSize: '16px',
    letterSpacing: '-0.2px',
    color: 'var(--hero-gray)',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/[0.06]">
      <nav
        className="flex items-center justify-between mx-auto"
        style={{ maxWidth: '100%', padding: '16px 120px' }}
      >
        {/* ---- Logo ---- */}
        <Link
          href="/"
          className="no-underline shrink-0"
          style={{
            fontFamily: 'var(--font-schibsted)',
            fontWeight: 600,
            fontSize: '24px',
            letterSpacing: '-1.44px',
            color: 'var(--hero-black)',
          }}
        >
          Vibe Open World
        </Link>

        {/* ---- Desktop Menu ---- */}
        <div className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="no-underline hover:opacity-70 transition-opacity"
              style={menuItemStyle}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ---- Right CTA ---- */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <Link
            href="/submit"
            className="no-underline rounded-lg bg-black text-white hover:bg-black/85 transition-colors inline-flex items-center justify-center"
            style={{
              fontFamily: 'var(--font-schibsted)',
              fontWeight: 500,
              fontSize: '16px',
              padding: '9px 24px',
            }}
          >
            Submit Project
          </Link>
        </div>

        {/* ---- Mobile hamburger ---- */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-black/[0.04] transition-colors cursor-pointer"
          aria-label="Toggle menu"
          style={{ color: 'var(--hero-black)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </nav>

      {/* ---- Mobile menu ---- */}
      {mobileOpen && (
        <div
          className="lg:hidden pb-4 border-t border-black/[0.06] pt-3 space-y-1 bg-white"
          style={{ padding: '12px 24px 16px' }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors no-underline"
              style={menuItemStyle}
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/submit"
              onClick={() => setMobileOpen(false)}
              className="no-underline rounded-lg bg-black text-white hover:bg-black/85 transition-colors inline-flex items-center justify-center w-full"
              style={{
                fontFamily: 'var(--font-schibsted)',
                fontWeight: 500,
                fontSize: '16px',
                padding: '10px 0',
              }}
            >
              Submit Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
