import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getMockProjects } from '@/lib/mock-data';

// ============================================================
// Auth helper
// ============================================================
function isAuthorized(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || 'vibeadmin123';
  return token === adminPassword;
}

// ============================================================
// GET — List all projects (including pending), newest first
// ============================================================
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    // DB unavailable → use mock data
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
// PATCH — Update project status (approve / reject / feature)
// ============================================================
export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { projectId, status } = body;

    if (!projectId || !['pending', 'approved', 'rejected', 'featured'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid request. Required: projectId, status' },
        { status: 400 }
      );
    }

    const sql = getDb();
    await sql`
      UPDATE projects SET status = ${status}, updated_at = NOW()
      WHERE id = ${projectId}
    `;

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Database not connected. Status update unavailable.' },
      { status: 500 }
    );
  }
}
