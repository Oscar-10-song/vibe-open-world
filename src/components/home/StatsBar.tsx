import { Container } from '@/components/layout/Container';

interface StatsBarProps {
  total_projects: number;
  total_builders: number;
  total_categories: number;
}

export function StatsBar({ total_projects, total_builders, total_categories }: StatsBarProps) {
  return (
    <div className="border-t border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <Container>
        <div className="grid grid-cols-3 divide-x divide-[var(--color-border)]">
          <div className="py-6 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-accent)] tabular-nums">
              {total_projects.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">Projects</p>
          </div>
          <div className="py-6 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tabular-nums">
              {total_builders.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">Builders</p>
          </div>
          <div className="py-6 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-[var(--color-text)] tabular-nums">
              {total_categories}
            </p>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1">Categories</p>
          </div>
        </div>
      </Container>
    </div>
  );
}
