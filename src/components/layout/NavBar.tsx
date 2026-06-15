'use client';

import { useState } from 'react';
import Link from 'next/link';

// ============================================================
// NavBar — Light-oriented navigation bar
// Fonts: Schibsted Grotesk (logo 24px SemiBold, menu 16px Medium)
// ============================================================

export function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const chevronIcon = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

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
          <Link href="/platform" className="no-underline hover:opacity-70 transition-opacity" style={menuItemStyle}>
            Platform
          </Link>
          <Link href="/features" className="no-underline hover:opacity-70 transition-opacity inline-flex items-center gap-1" style={menuItemStyle}>
            Features
            <span style={{ color: 'var(--hero-gray)', opacity: 0.5 }}>{chevronIcon}</span>
          </Link>
          <Link href="/projects" className="no-underline hover:opacity-70 transition-opacity" style={menuItemStyle}>
            Projects
          </Link>
          <Link href="/community" className="no-underline hover:opacity-70 transition-opacity" style={menuItemStyle}>
            Community
          </Link>
          <Link href="/contact" className="no-underline hover:opacity-70 transition-opacity" style={menuItemStyle}>
            Contact
          </Link>
        </div>

        {/* ---- Right Buttons ---- */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <button
            className="rounded-lg border border-black/20 bg-transparent hover:bg-[#f8f8f8] transition-colors cursor-pointer"
            style={{
              fontFamily: 'var(--font-schibsted)',
              fontWeight: 500,
              fontSize: '16px',
              color: 'var(--hero-black)',
              width: '82px',
              padding: '8px 0',
              textAlign: 'center',
            }}
          >
            Sign Up
          </button>
          <button
            className="rounded-lg border-none bg-black text-white hover:bg-black/90 transition-colors cursor-pointer"
            style={{
              fontFamily: 'var(--font-schibsted)',
              fontWeight: 500,
              fontSize: '16px',
              width: '101px',
              padding: '8px 0',
              textAlign: 'center',
            }}
          >
            Log In
          </button>
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
          style={{ padding: '12px 120px 16px' }}
        >
          <Link
            href="/platform"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors no-underline"
            style={menuItemStyle}
          >
            Platform
          </Link>
          <Link
            href="/features"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors no-underline"
            style={menuItemStyle}
          >
            Features
          </Link>
          <Link
            href="/projects"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors no-underline"
            style={menuItemStyle}
          >
            Projects
          </Link>
          <Link
            href="/community"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors no-underline"
            style={menuItemStyle}
          >
            Community
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-black/[0.04] transition-colors no-underline"
            style={menuItemStyle}
          >
            Contact
          </Link>
          <div className="flex gap-3 pt-2">
            <button
              className="rounded-lg border border-black/20 bg-transparent hover:bg-[#f8f8f8] transition-colors cursor-pointer"
              style={{
                fontFamily: 'var(--font-schibsted)',
                fontWeight: 500,
                fontSize: '16px',
                color: 'var(--hero-black)',
                width: '82px',
                padding: '8px 0',
                textAlign: 'center',
              }}
            >
              Sign Up
            </button>
            <button
              className="rounded-lg border-none bg-black text-white cursor-pointer"
              style={{
                fontFamily: 'var(--font-schibsted)',
                fontWeight: 500,
                fontSize: '16px',
                width: '101px',
                padding: '8px 0',
                textAlign: 'center',
              }}
            >
              Log In
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
