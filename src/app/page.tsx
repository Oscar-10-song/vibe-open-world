import { VideoHero } from '@/components/home/VideoHero';
import { StatsSection } from '@/components/home/StatsSection';
import { FeaturedWorks } from '@/components/home/FeaturedWorks';
import { TopCountries } from '@/components/home/TopCountries';
import { CategoryNav } from '@/components/home/CategoryNav';
import { BottomCTA } from '@/components/home/BottomCTA';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { constructMetadata } from '@/lib/seo';
import { getDb } from '@/lib/db';
import { getMockHomePageData } from '@/lib/mock-data';
import type { Category, ProjectWithRelations } from '@/types';

export const metadata = constructMetadata();

// ============================================================
// Data fetching — DB first, mock fallback
// ============================================================
async function getHomePageData(): Promise<{
  featured: ProjectWithRelations[];
  latest: ProjectWithRelations[];
  popular: ProjectWithRelations[];
  categories: Category[];
  stats: { total_projects: number; total_builders: number; total_categories: number };
}> {
  try {
    const sql = getDb();
    const [categoriesRes, projectsRes, statsRes] = await Promise.all([
      sql`SELECT * FROM categories ORDER BY sort_order ASC`,
      sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               a.id as author_id, a.name as author_name, a.avatar_url as author_avatar
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN authors a ON p.author_id = a.id
        WHERE p.status IN ('approved', 'featured')
        ORDER BY p.created_at DESC
        LIMIT 50
      `,
      sql`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('approved', 'featured')) as total_projects,
          COUNT(DISTINCT author_id) FILTER (WHERE status IN ('approved', 'featured')) as total_builders
        FROM projects
      `,
    ]);

    const categories = (categoriesRes || []) as Category[];
    const allProjects = (projectsRes || []) as any[];
    const stats = {
      total_projects: Number((statsRes?.[0] as any)?.total_projects ?? 0),
      total_builders: Number((statsRes?.[0] as any)?.total_builders ?? 0),
      total_categories: categories.length,
    };

    const mapped: ProjectWithRelations[] = allProjects.map((p: any) => ({
      ...p,
      category: p.category_id ? { id: p.category_id, name: p.category_name, slug: p.category_slug } : null,
      author: { id: p.author_id, name: p.author_name, avatar_url: p.author_avatar },
      ai_tools: [],
      tech_stack: [],
    }));

    return {
      featured: mapped.filter((p: ProjectWithRelations) => p.status === 'featured').slice(0, 6),
      latest: mapped.filter((p: ProjectWithRelations) => p.status === 'approved').slice(0, 12),
      popular: [...mapped].sort((a, b) => b.view_count - a.view_count).slice(0, 6),
      categories: categories.length > 0 ? categories : getMockHomePageData().categories,
      stats,
    };
  } catch {
    return getMockHomePageData();
  }
}

// ============================================================
// HomePage — Full Layout
// ============================================================
export default async function HomePage() {
  const { featured, latest, popular, categories, stats } = await getHomePageData();
  const hasProjects = featured.length > 0 || latest.length > 0;

  return (
    <>
      {/* ============================================================
          1. Hero — Full-screen video background
          ============================================================ */}
      <VideoHero />

      {/* ============================================================
          2. Global Stats — Animated counters
          ============================================================ */}
      <StatsSection
        totalProjects={stats.total_projects > 0 ? stats.total_projects : 8220}
        totalBuilders={stats.total_builders > 0 ? stats.total_builders : 4210}
        totalCategories={stats.total_categories > 0 ? stats.total_categories : 45}
        newToday={42}
      />

      {/* ============================================================
          3. Featured Works — Card grid
          ============================================================ */}
      {hasProjects ? (
        <FeaturedWorks projects={featured.length > 0 ? featured : latest.slice(0, 6)} />
      ) : (
        <Section topPadding={false}>
          <Container className="text-center">
            <div className="max-w-lg mx-auto py-16">
              <span className="text-6xl mb-6 block">🚀</span>
              <h2 className="text-2xl font-bold text-white mb-3">
                Be the First to Share
              </h2>
              <p className="text-white/30 leading-relaxed">
                No projects have been submitted yet. Submit yours and kickstart the directory!
              </p>
            </div>
          </Container>
        </Section>
      )}

      {/* ============================================================
          4. Categories
          ============================================================ */}
      <Section topPadding={false}>
        <Container>
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">
            Browse by Category
          </h2>
          <p className="text-sm text-white/30 text-center mb-10">
            Explore AI creations across every medium
          </p>
          <CategoryNav categories={categories} />
        </Container>
      </Section>

      {/* ============================================================
          5. Top Countries — Leaderboard
          ============================================================ */}
      <TopCountries />

      {/* ============================================================
          6. Bottom CTA
          ============================================================ */}
      <BottomCTA />
    </>
  );
}
