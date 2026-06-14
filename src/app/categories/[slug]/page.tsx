import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { CategoryNav } from '@/components/home/CategoryNav';
import { BottomCTA } from '@/components/home/BottomCTA';
import { categorySEO } from '@/lib/seo';
import { getDb } from '@/lib/db';
import { getMockProjects, getMockCategories } from '@/lib/mock-data';
import type { Category, ProjectWithRelations } from '@/types';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return categorySEO({ name: slug, description: null });
  return categorySEO(category);
}

function getCategoryBySlug(slug: string): Category | undefined {
  return getMockCategories().find(c => c.slug === slug);
}

async function getCategoryProjects(slug: string): Promise<{
  category: Category | null;
  projects: ProjectWithRelations[];
  allCategories: Category[];
}> {
  const mockCategories = getMockCategories();
  const category = mockCategories.find(c => c.slug === slug) || null;

  try {
    const sql = getDb();
    const [catRes, projectsRes] = await Promise.all([
      sql`SELECT * FROM categories WHERE slug = ${slug}`,
      sql`
        SELECT p.*, a.id as author_id, a.name as author_name,
               a.avatar_url as author_avatar, a.twitter as author_twitter,
               a.github as author_github
        FROM projects p
        LEFT JOIN authors a ON p.author_id = a.id
        WHERE p.status IN ('approved', 'featured')
        AND p.category_id = (SELECT id FROM categories WHERE slug = ${slug})
        ORDER BY p.created_at DESC
        LIMIT 50
      `,
    ]);

    if (catRes && catRes.length > 0) {
      const mappedProjects = (projectsRes as any[] || []).map(p => ({
        ...p,
        category: { id: catRes[0].id, name: catRes[0].name, slug: catRes[0].slug },
        author: { id: p.author_id, name: p.author_name, avatar_url: p.author_avatar },
        ai_tools: [] as any[],
        tech_stack: [] as string[],
      })) as ProjectWithRelations[];

      return {
        category: catRes[0] as Category,
        projects: mappedProjects,
        allCategories: mockCategories,
      };
    }
  } catch {
    // Fallback to mock data
  }

  if (!category) return { category: null, projects: [], allCategories: mockCategories };

  const mockProjects = getMockProjects().filter(
    p => p.category_id === category.id
  );

  return { category, projects: mockProjects, allCategories: mockCategories };
}

export async function generateStaticParams() {
  return getMockCategories().map(c => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const { category, projects, allCategories } = await getCategoryProjects(slug);

  if (!category) notFound();

  return (
    <>
      <Section>
        <Container>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-2">
            {category.icon} {category.name}
          </h1>
          {category.description && (
            <p className="text-[var(--color-text-secondary)]">{category.description}</p>
          )}
        </Container>
      </Section>

      <Section topPadding={false} bottomPadding={false}>
        <Container>
          <div className="flex flex-wrap gap-2 justify-start mb-10">
            <CategoryNav categories={allCategories} />
          </div>
        </Container>
      </Section>

      <Section topPadding={false}>
        <Container>
          <ProjectGrid
            projects={projects}
            emptyMessage={`No ${category.name.toLowerCase()} projects yet.`}
          />
        </Container>
      </Section>

      <BottomCTA />
    </>
  );
}
