import Link from 'next/link';
import { Container } from './Container';

const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/submit', label: 'Submit Project' },
];

export function Footer() {
  return (
    <footer className="border-t border-black/[0.06] bg-[#f8f8f8]">
      <Container>
        <div className="py-14 flex flex-col sm:flex-row items-start justify-between gap-10">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 font-semibold text-base text-[#0f1419] no-underline mb-3"
            >
              <span className="w-7 h-7 rounded-lg bg-[#0f1419] flex items-center justify-center text-xs text-white">
                V
              </span>
              <span>Vibe Open World</span>
            </Link>
            <p className="text-sm text-[#505050] leading-relaxed max-w-xs">
              A global showcase for AI-powered creations. Built by creators, for creators.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-medium text-sm text-[#0f1419] mb-3">Navigation</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#505050] hover:text-[#0f1419] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-medium text-sm text-[#0f1419] mb-3">Links</h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#505050] hover:text-[#0f1419] transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#505050] hover:text-[#0f1419] transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-black/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8b98a5]">
            © {new Date().getFullYear()} Vibe Open World. All projects belong to their respective creators.
          </p>
        </div>
      </Container>
    </footer>
  );
}
