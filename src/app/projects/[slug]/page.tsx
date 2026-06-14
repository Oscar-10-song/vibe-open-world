import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Tag } from '@/components/ui/Tag';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { ShareButton } from '@/components/ui/ShareButton';
import { projectSEO } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { getDb } from '@/lib/db';
import { getMockProjects } from '@/lib/mock-data';
import type { ProjectWithRelations } from '@/types';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ============================================================
// SEO — 动态 Meta & OG Image
// ============================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return projectSEO({ title: 'Not Found', tagline: '', screenshot_url: '' });
  return projectSEO({ ...project, ai_tools: project.ai_tools });
}

// ============================================================
// 数据获取：DB 优先 → Mock 回退
// ============================================================
async function getProjectBySlug(slug: string): Promise<ProjectWithRelations | null> {
  try {
    const sql = getDb();

    // 1. 查项目 + 作者 + 分类
    const res = await sql`
      SELECT p.*,
             a.id as author_id, a.name as author_name, a.avatar_url as author_avatar,
             a.twitter as author_twitter, a.github as author_github, a.website as author_website,
             c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM projects p
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ${slug} AND p.status IN ('approved', 'featured')
    `;

    if (!res || res.length === 0) {
      // fall through to mock
      throw new Error('Not found in DB');
    }

    const p = res[0] as any;
    const projectId = p.id;

    // 2. 查 AI 工具关联
    const toolsRes = await sql`
      SELECT at.id, at.name, at.slug, at.website, at.created_at
      FROM project_ai_tools pat
      JOIN ai_tools at ON pat.ai_tool_id = at.id
      WHERE pat.project_id = ${projectId}
    `;

    // 3. 查技术栈
    const techRes = await sql`
      SELECT tech_name FROM project_tech_stack
      WHERE project_id = ${projectId}
    `;

    const ai_tools = (toolsRes as any[]).map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      website: t.website,
      created_at: t.created_at,
    }));

    const tech_stack = (techRes as any[]).map(t => t.tech_name);

    return {
      ...p,
      category: p.category_id
        ? { id: p.category_id, name: p.category_name, slug: p.category_slug, description: null, icon: null, sort_order: 0, created_at: '' }
        : null,
      author: {
        id: p.author_id,
        name: p.author_name,
        email: null,
        avatar_url: p.author_avatar,
        website: p.author_website,
        twitter: p.author_twitter,
        github: p.author_github,
        created_at: '',
      },
      ai_tools,
      tech_stack,
    } as ProjectWithRelations;
  } catch {
    // DB 不可用 → 使用 mock 数据
  }

  const mockProject = getMockProjects().find(p => p.slug === slug);
  return mockProject || null;
}

// ============================================================
// 相关项目（同分类，排除当前）
// ============================================================
function getRelatedProjects(current: ProjectWithRelations): ProjectWithRelations[] {
  const all = getMockProjects();
  // 优先同分类
  const sameCategory = all.filter(
    p => p.category_id === current.category_id && p.id !== current.id
  );
  if (sameCategory.length >= 3) return sameCategory.slice(0, 3);

  // 不够 3 个，用其他项目补足
  const others = all.filter(p => p.id !== current.id && p.category_id !== current.category_id);
  return [...sameCategory, ...others].slice(0, 3);
}

// ============================================================
// 页面组件
// ============================================================
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project);
  const projectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeopenworld.com'}/projects/${project.slug}`;

  return (
    <Section>
      <Container narrow>
        {/* ---- Back link ---- */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </Link>

        {/* ---- Screenshot ---- */}
        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-[var(--color-bg-tertiary)] mb-8 border border-[var(--color-border)] shadow-sm">
          <img
            src={project.screenshot_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {/* 盈利 / Featured 标签 */}
          <div className="absolute top-4 right-4 flex gap-2">
            {project.is_profitable && (
              <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                💰 Revenue
              </span>
            )}
            {project.status === 'featured' && (
              <span className="bg-[var(--color-accent)] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                ⭐ Featured
              </span>
            )}
          </div>
        </div>

        {/* ---- Title & tagline ---- */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="min-w-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-3">
              {project.title}
            </h1>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {project.tagline}
            </p>
          </div>
          <ShareButton url={projectUrl} title={project.title} />
        </div>

        {/* ---- Actions ---- */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button href={project.url} variant="primary" size="lg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Visit Project
          </Button>
          {project.github_url && (
            <Button href={project.github_url} variant="outline" size="lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              View Source
            </Button>
          )}
        </div>

        {/* ---- Meta Grid ---- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] mb-8">
          <div>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Author</p>
            <p className="text-sm font-medium text-[var(--color-text)]">{project.author.name}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Category</p>
            <p className="text-sm font-medium text-[var(--color-text)]">
              {project.category?.icon} {project.category?.name || 'Uncategorized'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Submitted</p>
            <p className="text-sm font-medium text-[var(--color-text)]">{formatDate(project.created_at)}</p>
          </div>
          {project.dev_duration && (
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Dev Time</p>
              <p className="text-sm font-medium text-[var(--color-text)] capitalize">{project.dev_duration}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Views</p>
            <p className="text-sm font-medium text-[var(--color-text)]">{project.view_count.toLocaleString()}</p>
          </div>
          {project.author.twitter && (
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-1">Twitter</p>
              <a
                href={`https://x.com/${project.author.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                {project.author.twitter}
              </a>
            </div>
          )}
          {project.author.github && (
            <div>
              <p className="text-xs text-[var(--color-text-tertiary)] mb-1">GitHub</p>
              <a
                href={`https://github.com/${project.author.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                @{project.author.github}
              </a>
            </div>
          )}
        </div>

        {/* ---- AI Tools ---- */}
        {project.ai_tools.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">🤖 Built With AI</h3>
            <div className="flex flex-wrap gap-2">
              {project.ai_tools.map(tool => (
                <Badge key={tool.id} variant="accent">{tool.name}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* ---- Tech Stack ---- */}
        {project.tech_stack.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-3">🛠 Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map(tech => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          </div>
        )}

        {/* ---- Description ---- */}
        {project.description && (
          <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
            <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">📖 About This Project</h3>
            <div className="prose prose-sm max-w-none text-[var(--color-text-secondary)]">
              <p className="leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </div>
          </div>
        )}

        {/* ---- Divider ---- */}
        <div className="mt-12 mb-10 border-t border-[var(--color-border)]" />

        {/* ---- Related Projects ---- */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[var(--color-text)]">
                More in {project.category?.name || 'Projects'}
              </h2>
              {project.category && (
                <Link
                  href={`/categories/${project.category.slug}`}
                  className="text-sm text-[var(--color-accent)] hover:underline font-medium"
                >
                  View All →
                </Link>
              )}
            </div>
            <ProjectGrid projects={related} emptyMessage="" />
          </div>
        )}
      </Container>
    </Section>
  );
}
