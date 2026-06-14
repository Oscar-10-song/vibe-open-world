import { Button } from '@/components/ui/Button';
import { Container } from '@/components/layout/Container';

export function BottomCTA() {
  return (
    <section className="py-16 sm:py-24 bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)]">
      <Container className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] mb-4">
          Built something with AI?
        </h2>
        <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mb-8 text-balance">
          Show the world what you&apos;ve created. Submit your project and inspire other builders.
        </p>
        <Button href="/submit" size="lg">
          Submit Your Project
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </Button>
      </Container>
    </section>
  );
}
