import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { submitProjectSchema } from '@/lib/validators';
import { slugify } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = submitProjectSchema.parse(body);
    const sql = getDb();
    const slug = slugify(validated.title);

    // 1. Upsert author
    const authorRes = await sql`
      INSERT INTO authors (name, email, twitter, github, website)
      VALUES (${validated.author_name}, ${validated.author_email || null},
              ${validated.author_twitter || null}, ${validated.author_github || null},
              ${validated.author_website || null})
      ON CONFLICT DO NOTHING
      RETURNING id
    `;
    const authorId = authorRes[0]?.id;

    // 2. Insert project (pending status)
    const projectRes = await sql`
      INSERT INTO projects (
        title, slug, tagline, description, url, github_url,
        screenshot_url, category_id, author_id, status,
        dev_duration, is_profitable
      ) VALUES (
        ${validated.title}, ${slug}, ${validated.tagline},
        ${validated.description || null}, ${validated.url},
        ${validated.github_url || null}, ${validated.screenshot_url},
        ${validated.category_id || null}, ${authorId}, 'pending',
        ${validated.dev_duration || null}, ${validated.is_profitable || false}
      )
      RETURNING id, slug
    `;

    const projectId = projectRes[0]?.id;

    // 3. Insert AI Tools
    if (validated.ai_tool_ids?.length > 0) {
      const values = validated.ai_tool_ids.map(toolId => `(${projectId}, ${toolId})`).join(',');
      await sql.unsafe(`
        INSERT INTO project_ai_tools (project_id, ai_tool_id)
        VALUES ${values}
      `);
    }

    // 4. Insert Tech Stack
    if (validated.tech_stack?.length > 0) {
      const techValues = validated.tech_stack.map(tech =>
        `(${projectId}, '${tech.replace(/'/g, "''")}')`
      ).join(',');
      await sql.unsafe(`
        INSERT INTO project_tech_stack (project_id, tech_name)
        VALUES ${techValues}
      `);
    }

    return NextResponse.json({
      success: true,
      project: { id: projectId, slug: projectRes[0]?.slug },
    }, { status: 201 });
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit project. Please try again.' },
      { status: 500 }
    );
  }
}
