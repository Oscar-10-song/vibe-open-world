import Link from 'next/link';
import { Container } from './Container';
import { CATEGORIES } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.05] bg-[#0c0c18]">
      <Container>
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-semibold text-base text-white no-underline mb-4">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs">
                🌍
              </span>
              <span>Vibe Open World</span>
            </Link>
            <p className="text-sm text-white/25 leading-relaxed max-w-xs">
              A global showcase for AI-powered creations. Built by creators, for creators.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium text-sm text-white/60 mb-3">Navigation</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/explore" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  Submit Project
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-white/30 hover:text-white/60 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-medium text-sm text-white/60 mb-3">Categories</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(0, 6).map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-white/30 hover:text-white/60 transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-medium text-sm text-white/60 mb-3">&nbsp;</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.slice(6).map(cat => (
                <li key={cat.slug}>
                  <Link
                    href={`/categories/${cat.slug}`}
                    className="text-sm text-white/30 hover:text-white/60 transition-colors"
                  >
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/15">
            © {new Date().getFullYear()} Vibe Open World. All projects belong to their respective creators.
          </p>
          <div className="flex items-center gap-5 text-xs text-white/15">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">
              Twitter
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
