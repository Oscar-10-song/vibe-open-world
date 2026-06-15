// @deprecated — replaced by NavBar.tsx as part of v2 redesign
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Button } from '@/components/ui/Button';
import { Container } from './Container';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08080f]/70 backdrop-blur-xl border-b border-white/[0.05]">
      <Container>
        <nav className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-base text-white no-underline"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs">
              🌍
            </span>
            <span className="hidden sm:inline tracking-tight">Vibe Open World</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm text-white/45 hover:text-white/80 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/explore"
              className="px-3 py-2 text-sm text-white/45 hover:text-white/80 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/about"
              className="px-3 py-2 text-sm text-white/45 hover:text-white/80 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              About
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button href="/submit" size="sm" className="hidden sm:inline-flex">
              Submit Project
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/45 hover:text-white/80 hover:bg-white/[0.04] transition-colors"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/[0.05] pt-3 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-white/45 hover:text-white/80 rounded-lg hover:bg-white/[0.04]"
            >
              Home
            </Link>
            <Link
              href="/explore"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-white/45 hover:text-white/80 rounded-lg hover:bg-white/[0.04]"
            >
              Explore
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm text-white/45 hover:text-white/80 rounded-lg hover:bg-white/[0.04]"
            >
              About
            </Link>
            <div className="pt-2">
              <Button href="/submit" size="sm" className="w-full">
                Submit Project
              </Button>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
