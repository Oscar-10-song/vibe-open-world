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
          ? 'bg-[#0f1419] text-white'
          : 'bg-white border border-black/[0.06] text-[#505050] hover:text-[#0f1419] hover:border-black/[0.12] hover:bg-[#f8f8f8]',
      ].join(' ')}
    >
      {icon && <span>{icon}</span>}
      {name}
    </Link>
  );
}
