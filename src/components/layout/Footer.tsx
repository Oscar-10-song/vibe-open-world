import Link from 'next/link';
import { Container } from './Container';
import { CATEGORIES } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <Container>
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-[var(--color-text)] no-underline mb-3">
              <span>🌍</span>
              Vibe Open World
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              A showcase directory for AI-powered projects. Built by vibe coders, for vibe coders.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-sm text-[var(--color-text)] mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  Submit Project
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-sm text-[var(--color-text)] mb-3">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Categories */}
          <div>
            <h4 className="font-medium text-sm text-[var(--color-text)] mb-3">&nbsp;</h4>
            <ul className="space-y-2">
              {CATEGORIES.slice(6).map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="py-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            © {new Date().getFullYear()} Vibe Open World. Built with AI. All projects belong to their respective creators.
          </p>
          <div className="flex items-center gap-4 text-xs text-[var(--color-text-tertiary)]">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
              Twitter / X
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--color-text)] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
