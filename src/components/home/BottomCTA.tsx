import { Container } from '@/components/layout/Container';
import Link from 'next/link';

export function BottomCTA() {
  return (
    <section className="py-24 sm:py-32 bg-white">
      <Container>
        <div className="relative rounded-2xl border border-black/[0.06] bg-[#f8f8f8] overflow-hidden">
          <div className="relative py-16 sm:py-20 px-6 sm:px-12 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1419] tracking-tight">
              Ready to share your creation?
            </h2>
            <p className="mt-3 text-base text-[#505050] max-w-md mx-auto leading-relaxed">
              Join creators from around the world. Submit your AI-powered project
              and get discovered by the community.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0f1419] text-white text-sm font-semibold hover:bg-black transition-all duration-200"
              >
                Submit Your Work
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-black/[0.08] text-[#505050] text-sm font-medium hover:text-[#0f1419] hover:border-black/[0.15] transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
