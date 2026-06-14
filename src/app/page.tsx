import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { CategoryNav } from '@/components/home/CategoryNav';
import { BottomCTA } from '@/components/home/BottomCTA';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { constructMetadata } from '@/lib/seo';
import { getDb } from '@/lib/db';
import { getMockHomePageData } from '@/lib/mock-data';
import type { Category, ProjectWithRelations } from '@/types';

export const metadata = constructMetadata();

// ============================================================
// 获取首页数据
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

    // 转换项目数据
    const mapped: ProjectWithRelations[] = allProjects.map(p => ({
      ...p,
      category: p.category_id ? { id: p.category_id, name: p.category_name, slug: p.category_slug } : null,
      author: { id: p.author_id, name: p.author_name, avatar_url: p.author_avatar },
      ai_tools: [],
      tech_stack: [],
    }));

    return {
      featured: mapped.filter(p => p.status === 'featured').slice(0, 6),
      latest: mapped.filter(p => p.status === 'approved').slice(0, 12),
      popular: [...mapped].sort((a, b) => b.view_count - a.view_count).slice(0, 6),
      categories: categories.length > 0 ? categories : getMockHomePageData().categories,
      stats,
    };
  } catch {
    // 数据库未连接 → 使用 Mock 数据展示完整首页
  }

  return getMockHomePageData();
}

export default async function HomePage() {
  const { featured, latest, popular, categories, stats } = await getHomePageData();
  const hasProjects = featured.length > 0 || latest.length > 0;

  return (
    <>
      <HeroSection />

      {!hasProjects ? (
        <Section topPadding={false}>
          <Container className="text-center">
            <div className="max-w-lg mx-auto py-12">
              <span className="text-6xl mb-6 block">🚀</span>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                Be the First to Share
              </h2>
              <p className="text-[var(--color-text-secondary)] leading-relaxed">
                No projects have been submitted yet. Submit yours and kickstart the directory!
              </p>
            </div>
          </Container>
        </Section>
      ) : (
        <>
          {featured.length > 0 && (
            <Section topPadding={false}>
              <Container>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Featured</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-8">Hand-picked projects</p>
                <ProjectGrid projects={featured} />
              </Container>
            </Section>
          )}

          {latest.length > 0 && (
            <Section topPadding={false}>
              <Container>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Latest</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-8">Fresh from the community</p>
                <ProjectGrid projects={latest} />
              </Container>
            </Section>
          )}

          {popular.length > 0 && (
            <Section topPadding={false}>
              <Container>
                <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">Popular</h2>
                <p className="text-sm text-[var(--color-text-secondary)] mb-8">Trending this week</p>
                <ProjectGrid projects={popular} />
              </Container>
            </Section>
          )}
        </>
      )}

      {/* 分类导航 */}
      <Section topPadding={false}>
        <Container>
          <h2 className="text-2xl font-bold text-[var(--color-text)] text-center mb-6">
            Browse by Category
          </h2>
          <CategoryNav categories={categories} />
        </Container>
      </Section>

      {/* 统计 */}
      {stats.total_projects > 0 && <StatsBar {...stats} />}

      {/* CTA */}
      <BottomCTA />
    </>
  );
}
