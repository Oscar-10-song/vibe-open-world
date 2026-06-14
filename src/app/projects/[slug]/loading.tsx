import { Container } from '@/components/layout/Container';

export default function ProjectDetailLoading() {
  return (
    <Container narrow className="py-12">
      {/* Back link skeleton */}
      <div className="h-4 w-24 bg-[var(--color-bg-tertiary)] rounded mb-6 animate-pulse" />

      {/* Screenshot skeleton */}
      <div className="aspect-[16/9] rounded-xl bg-[var(--color-bg-tertiary)] mb-8 animate-pulse" />

      {/* Title skeleton */}
      <div className="h-9 w-2/3 bg-[var(--color-bg-tertiary)] rounded mb-3 animate-pulse" />
      <div className="h-6 w-1/2 bg-[var(--color-bg-tertiary)] rounded mb-8 animate-pulse" />

      {/* Actions skeleton */}
      <div className="flex gap-3 mb-8">
        <div className="h-11 w-36 bg-[var(--color-bg-tertiary)] rounded-xl animate-pulse" />
        <div className="h-11 w-36 bg-[var(--color-bg-tertiary)] rounded-xl animate-pulse" />
      </div>

      {/* Meta grid skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-12 bg-[var(--color-bg-tertiary)] rounded mb-1.5 animate-pulse" />
            <div className="h-4 w-20 bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Badges skeleton */}
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 bg-[var(--color-bg-tertiary)] rounded-full animate-pulse" />
        <div className="h-6 w-24 bg-[var(--color-bg-tertiary)] rounded-full animate-pulse" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mt-8 pt-8 border-t border-[var(--color-border)]">
        <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
        <div className="h-4 w-5/6 bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
        <div className="h-4 w-4/6 bg-[var(--color-bg-tertiary)] rounded animate-pulse" />
      </div>
    </Container>
  );
}
