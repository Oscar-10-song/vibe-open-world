import { ImageResponse } from 'next/og';
import { getMockProjects } from '@/lib/mock-data';
import { getDb } from '@/lib/db';

export const runtime = 'edge';
export const alt = 'Project preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function getProjectData(slug: string) {
  try {
    const sql = getDb();
    const res = await sql`
      SELECT p.title, p.tagline, p.screenshot_url, a.name as author_name
      FROM projects p
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ${slug} AND p.status IN ('approved', 'featured')
    `;
    if (res && res.length > 0) {
      return {
        title: (res[0] as any).title,
        tagline: (res[0] as any).tagline,
        author: (res[0] as any).author_name,
      };
    }
  } catch {}
  const mock = getMockProjects().find(p => p.slug === slug);
  return mock ? { title: mock.title, tagline: mock.tagline, author: mock.author.name } : null;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getProjectData(slug);

  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <span style={{ fontSize: 80 }}>🌍</span>
          <span style={{ fontSize: 48, fontWeight: 700, color: '#f97316', marginTop: 20 }}>
            Vibe Open World
          </span>
          <span style={{ fontSize: 24, color: '#a1a1aa', marginTop: 10 }}>
            Projects Built with AI
          </span>
        </div>
      ),
      { ...size },
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0a0b 0%, #1a1a2e 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          justifyContent: 'space-between',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 36 }}>🌍</span>
          <span style={{ fontSize: 22, color: '#a1a1aa', fontWeight: 500 }}>Vibe Open World</span>
        </div>

        {/* Center: Project info */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '85%' }}>
          <span style={{ fontSize: 56, fontWeight: 800, color: '#ffffff', lineHeight: 1.15 }}>
            {data.title}
          </span>
          <span style={{ fontSize: 28, color: '#d4d4d8', marginTop: 16, lineHeight: 1.3 }}>
            {data.tagline}
          </span>
        </div>

        {/* Bottom: Author + Brand */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#f97316',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {data.author.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 22, color: '#a1a1aa' }}>{data.author}</span>
          </div>
          <div
            style={{
              background: '#f97316',
              color: '#fff',
              padding: '10px 24px',
              borderRadius: 12,
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            View Project →
          </div>
        </div>

        {/* Accent corner */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            background: '#f97316',
            opacity: 0.15,
            borderRadius: '0 0 0 200px',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
