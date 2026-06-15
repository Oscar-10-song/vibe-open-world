import { Container } from '@/components/layout/Container';
import Link from 'next/link';

export function BottomCTA() {
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden">
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)',
            }}
          />

          <div className="relative py-16 sm:py-20 px-6 sm:px-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Ready to share your creation?
            </h2>
            <p className="mt-3 text-base text-white/30 max-w-md mx-auto leading-relaxed">
              Join creators from around the world. Submit your AI-powered project
              and get discovered by the community.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#0f1419] text-sm font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/5"
              >
                Submit Your Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/[0.04] border border-white/[0.1] text-white/60 text-sm font-medium hover:bg-white/[0.08] hover:text-white/80 hover:border-white/[0.15] transition-all duration-200"
              >
                Explore Works
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
