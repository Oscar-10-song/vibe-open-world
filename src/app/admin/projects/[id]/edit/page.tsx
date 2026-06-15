import { Container } from '@/components/layout/Container';
import { EditProjectForm } from '@/components/admin/EditProjectForm';
import { getDb } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Project — Vibe Open World',
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  try {
    const sql = getDb();
    const res = await sql`
      SELECT p.*, c.slug as category_slug
      FROM projects p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ${id}
      LIMIT 1
    `;
    if (!res[0]) return null;
    const p = res[0] as Record<string, any>;
    return {
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      description: p.description || '',
      url: p.url,
      github_url: p.github_url || '',
      screenshot_url: p.screenshot_url,
      category_slug: p.category_slug || '',
      status: p.status,
    };
  } catch {
    return null;
  }
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <Container narrow className="py-10">
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="text-sm text-[#8b98a5] hover:text-[#0f1419] transition-colors flex items-center gap-1"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-[#0f1419] mt-3">Edit Project</h1>
        <p className="text-sm text-[#505050] mt-1">{project.title}</p>
      </div>

      <EditProjectForm project={project} />
    </Container>
  );
}
