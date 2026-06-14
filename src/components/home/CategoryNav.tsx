import { CategoryPill } from '@/components/projects/CategoryPill';
import { Category } from '@/types';

interface CategoryNavProps {
  categories: Category[];
}

export function CategoryNav({ categories }: CategoryNavProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(cat => (
          <CategoryPill
            key={cat.slug}
            name={cat.name}
            slug={cat.slug}
            icon={cat.icon}
          />
        ))}
    </div>
  );
}
