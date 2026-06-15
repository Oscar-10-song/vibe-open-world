import { Container } from '@/components/layout/Container';
import { AdminProjectActions } from '@/components/admin/AdminProjectActions';
import { SignOutButton } from '@/components/admin/SignOutButton';
import { formatDate } from '@/lib/utils';
import { getDb } from '@/lib/db';
import { getMockProjects } from '@/lib/mock-data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Vibe Open World',
  robots: { index: false, follow: false },
};

interface AdminProjectItem {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  status: string;
  author_name: string;
  category_name: string | null;
  view_count: number;
  created_at: string;
  is_profitable: boolean;
}

async function getProjects(): Promise<AdminProjectItem[]> {
  try {
    const sql = getDb();
    const res = await sql`
      SELECT p.id, p.title, p.slug, p.tagline, p.status,
             p.view_count, p.created_at, p.is_profitable,
             a.name as author_name,
             c.name as category_name
      FROM projects p
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    return (res as any[]).map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      tagline: p.tagline,
      status: p.status,
      author_name: p.author_name || 'Unknown',
      category_name: p.category_name,
      view_count: p.view_count,
      created_at: p.created_at,
      is_profitable: p.is_profitable,
    }));
  } catch {
    return getMockProjects().map(p => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      tagline: p.tagline,
      status: p.status,
      author_name: p.author.name,
      category_name: p.category?.name || null,
      view_count: p.view_count,
      created_at: p.created_at,
      is_profitable: p.is_profitable,
    }));
  }
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  const counts = {
    total: projects.length,
    pending: projects.filter(p => p.status === 'pending').length,
    approved: projects.filter(p => p.status === 'approved').length,
    featured: projects.filter(p => p.status === 'featured').length,
    rejected: projects.filter(p => p.status === 'rejected').length,
  };

  return (
    <Container className="py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Review and manage project submissions</p>
        </div>
        <SignOutButton />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {[
          { label: 'Total', value: counts.total, color: 'text-[var(--color-text)]' },
          { label: 'Pending', value: counts.pending, color: 'text-yellow-600' },
          { label: 'Approved', value: counts.approved, color: 'text-green-600' },
          { label: 'Featured', value: counts.featured, color: 'text-orange-500' },
          { label: 'Rejected', value: counts.rejected, color: 'text-red-500' },
        ].map(stat => (
          <div
            key={stat.label}
            className="p-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-center"
          >
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Projects table */}
      {projects.length === 0 ? (
        <div className="p-12 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-center">
          <span className="text-4xl mb-4 block">📋</span>
          <p className="text-[var(--color-text-secondary)]">No projects submitted yet.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text)]">Project</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text)] hidden sm:table-cell">Author</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text)] hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--color-text)]">Status</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--color-text)] hidden sm:table-cell">Views</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr
                    key={project.id}
                    className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg-secondary)] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-[var(--color-text)] truncate max-w-[200px]">
                          {project.title}
                        </p>
                        <p className="text-xs text-[var(--color-text-tertiary)] truncate max-w-[200px]">
                          {project.tagline}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-tertiary)] mt-0.5">
                          {formatDate(project.created_at)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden sm:table-cell">
                      {project.author_name}
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)] hidden sm:table-cell">
                      {project.category_name || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <AdminProjectActions
                        projectId={project.id}
                        currentStatus={project.status}
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-[var(--color-text-tertiary)] hidden sm:table-cell">
                      {project.view_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Container>
  );
}
