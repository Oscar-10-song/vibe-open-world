import { MetadataRoute } from 'next';
import { getMockProjects, getMockCategories } from '@/lib/mock-data';
import { getDb } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vibeopenworld.com';

  // 静态页
  const staticRoutes = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
    { url: `${baseUrl}/submit`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ];

  // 分类页
  const categories = getMockCategories();
  const categoryRoutes = categories.map(cat => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 项目详情页
  let projectSlugs: string[] = getMockProjects().map(p => p.slug);

  try {
    const sql = getDb();
    const res = await sql`
      SELECT slug FROM projects WHERE status IN ('approved', 'featured')
    `;
    if (res && res.length > 0) {
      projectSlugs = (res as any[]).map(r => r.slug);
    }
  } catch {}

  const projectRoutes = projectSlugs.map(slug => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...projectRoutes];
}
