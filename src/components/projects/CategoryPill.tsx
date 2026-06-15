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
        'inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full font-medium transition-all duration-200 whitespace-nowrap',
        active
          ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]'
          : 'bg-white/[0.03] text-white/45 border border-white/[0.06] hover:text-white/70 hover:bg-white/[0.06] hover:border-white/[0.1]',
      ].join(' ')}
    >
      {icon && <span>{icon}</span>}
      {name}
    </Link>
  );
}
