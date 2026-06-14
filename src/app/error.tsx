'use client';

import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <Container className="py-20 text-center">
      <span className="text-6xl mb-6 block">💥</span>
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-3">Something went wrong</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">An unexpected error occurred.</p>
      <Button onClick={reset}>Try Again</Button>
    </Container>
  );
}
