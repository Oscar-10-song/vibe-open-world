import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <span className="text-6xl mb-6 block">🔭</span>
      <h1 className="text-3xl font-bold text-[var(--color-text)] mb-3">404 — Not Found</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">This page doesn&apos;t exist in this universe.</p>
      <Button href="/">Back to Home</Button>
    </Container>
  );
}
