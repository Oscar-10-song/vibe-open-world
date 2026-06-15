import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '..', '.env.local') });

const sql = neon(process.env.DATABASE_URL!);

async function verify() {
  const tables = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public' ORDER BY table_name
  `;
  console.log('Tables:', tables.map((r: any) => r.table_name).join(', '));

  const counts = await sql`
    SELECT 'categories' as t, count(*)::int as c FROM categories
    UNION ALL SELECT 'ai_tools', count(*)::int FROM ai_tools
    UNION ALL SELECT 'authors', count(*)::int FROM authors
    UNION ALL SELECT 'projects', count(*)::int FROM projects
    UNION ALL SELECT 'project_ai_tools', count(*)::int FROM project_ai_tools
    UNION ALL SELECT 'project_tech_stack', count(*)::int FROM project_tech_stack
  `;
  for (const r of counts as any[]) console.log('  ' + r.t + ': ' + r.c + ' rows');
}

verify().then(() => process.exit(0));
