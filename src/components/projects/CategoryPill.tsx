import Link from 'next/link';

interface CategoryPillProps {
  name: string;
  slug: string;
  icon?: string | null;
  active?: boolean;
}

export function CategoryPill({ name, slug, icon, active = false }: CategoryPillProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className={[
        'inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full font-medium transition-colors whitespace-nowrap',
        active
          ? 'bg-[var(--color-accent)] text-white'
          : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-border)]',
      ].join(' ')}
    >
      {icon && <span>{icon}</span>}
      {name}
    </Link>
  );
}
