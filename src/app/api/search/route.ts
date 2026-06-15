import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// ============================================================
// GET /api/search?q=...&page=1&limit=12
// 全文搜索已通过审核的项目
// ============================================================

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get('q')?.trim();
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));

  if (!q) {
    return NextResponse.json({
      success: true,
      results: [],
      total: 0,
      page: 1,
      totalPages: 0,
    });
  }

  try {
    const sql = getDb();
    const offset = (page - 1) * limit;

    // Search across title, tagline, description
    const searchPattern = `%${q}%`;

    const [countRes, resultsRes] = await Promise.all([
      sql`
        SELECT COUNT(*)::int as total
        FROM projects
        WHERE status IN ('approved', 'featured')
          AND (title ILIKE ${searchPattern}
            OR tagline ILIKE ${searchPattern}
            OR description ILIKE ${searchPattern})
      `,
      sql`
        SELECT p.*, c.name as category_name, c.slug as category_slug,
               a.id as author_id, a.name as author_name, a.avatar_url as author_avatar
        FROM projects p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN authors a ON p.author_id = a.id
        WHERE p.status IN ('approved', 'featured')
          AND (p.title ILIKE ${searchPattern}
            OR p.tagline ILIKE ${searchPattern}
            OR p.description ILIKE ${searchPattern})
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
    ]);

    const total = (countRes[0] as any)?.total ?? 0;

    // Map to ProjectWithRelations shape
    const results = (resultsRes as any[]).map((p: any) => ({
      ...p,
      category: p.category_id ? { id: p.category_id, name: p.category_name, slug: p.category_slug } : null,
      author: { id: p.author_id, name: p.author_name, avatar_url: p.author_avatar },
      ai_tools: [],
      tech_stack: [],
    }));

    return NextResponse.json({
      success: true,
      results,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    // DB unavailable
    return NextResponse.json({
      success: true,
      results: [],
      total: 0,
      page: 1,
      totalPages: 0,
    });
  }
}
