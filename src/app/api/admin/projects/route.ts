import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getMockProjects } from '@/lib/mock-data';

// Auth is handled by middleware.ts — all /api/admin/* routes are protected

// ============================================================
// GET — List all projects (including pending), newest first
// ============================================================
export async function GET() {
  try {
    const sql = getDb();
    const res = await sql`
      SELECT p.*, a.name as author_name, a.email as author_email,
             c.name as category_name, c.slug as category_slug
      FROM projects p
      LEFT JOIN authors a ON p.author_id = a.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    return NextResponse.json({ success: true, projects: res });
  } catch {
    const projects = getMockProjects().map(p => ({
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
    return NextResponse.json({ success: true, projects });
  }
}

// ============================================================
// PATCH — Update project status OR edit project fields
// ============================================================
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'projectId is required' },
        { status: 400 }
      );
    }

    const sql = getDb();

    // ----- Status-only update (existing behavior) -----
    if (body.status && !body.title && !body.tagline) {
      const { status } = body;
      if (!['pending', 'approved', 'rejected', 'featured'].includes(status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status: ${status}` },
          { status: 400 }
        );
      }
      await sql`
        UPDATE projects SET status = ${status}, updated_at = NOW()
        WHERE id = ${projectId}
      `;
      return NextResponse.json({ success: true });
    }

    // ----- Full project edit -----
    const { title, tagline, description, url, github_url, screenshot_url, category_slug } = body;

    // Resolve category slug → UUID
    let categoryId: string | null | undefined = undefined;
    if (category_slug === '') {
      categoryId = null; // explicitly clear
    } else if (category_slug) {
      const catRes = await sql`
        SELECT id FROM categories WHERE slug = ${category_slug} LIMIT 1
      `;
      categoryId = catRes[0]?.id ?? null;
    }

    // Update only provided fields
    const updates: string[] = [];
    const now = 'NOW()';

    if (title !== undefined) {
      // Also update slug when title changes
      const { slugify } = await import('@/lib/utils');
      const newSlug = slugify(title);
      updates.push(`title = '${title.replace(/'/g, "''")}'`);
      updates.push(`slug = '${newSlug.replace(/'/g, "''")}'`);
    }
    if (tagline !== undefined) updates.push(`tagline = '${tagline.replace(/'/g, "''")}'`);
    if (description !== undefined) {
      const desc = description ? description.replace(/'/g, "''") : '';
      updates.push(`description = ${description ? `'${desc}'` : 'NULL'}`);
    }
    if (url !== undefined) updates.push(`url = '${url.replace(/'/g, "''")}'`);
    if (github_url !== undefined) {
      const gh = github_url ? github_url.replace(/'/g, "''") : '';
      updates.push(`github_url = ${github_url ? `'${gh}'` : 'NULL'}`);
    }
    if (screenshot_url !== undefined) updates.push(`screenshot_url = '${screenshot_url.replace(/'/g, "''")}'`);
    if (categoryId !== undefined) {
      updates.push(`category_id = ${categoryId ? `'${categoryId}'` : 'NULL'}`);
    }
    updates.push('updated_at = NOW()');

    if (updates.length > 0) {
      const setClause = updates.join(', ');
      await sql.unsafe(`
        UPDATE projects SET ${setClause}
        WHERE id = '${projectId}'
      `);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin PATCH error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}
