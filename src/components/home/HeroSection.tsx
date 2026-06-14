import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 sm:pt-28 pb-16 sm:pb-20">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent-subtle)]/50 to-transparent pointer-events-none" />

      <Container className="relative text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full px-4 py-1.5 text-sm text-[var(--color-text-secondary)] mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          The Vibe Coding Project Directory
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--color-text)] text-balance max-w-3xl mx-auto leading-[1.1]">
          Built with AI,
          <br />
          <span className="text-[var(--color-accent)]">Shipped by Humans</span>
        </h1>

        <p className="mt-6 text-lg text-[var(--color-text-secondary)] text-balance max-w-xl mx-auto leading-relaxed">
          A curated showcase of products built with Claude Code, Cursor, Bolt, Lovable, v0, and more.
          Discover what solo builders can create with AI.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
          <Button href="/submit" size="lg">
            Submit Your Project
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Button>
          <Button href="/categories/saas" variant="outline" size="lg">
            Explore Projects
          </Button>
        </div>
      </Container>
    </section>
  );
}
