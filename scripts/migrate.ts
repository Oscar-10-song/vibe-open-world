/**
 * Database migration script — creates tables and seeds demo data.
 *
 * Usage:  npx tsx scripts/migrate.ts
 * Requires: DATABASE_URL in .env.local
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
config({ path: resolve(__dirname, '..', '.env.local') });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL is not set. Please create .env.local with your Neon connection string.');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function migrate() {
  const seedPath = resolve(__dirname, '..', 'src', 'lib', 'seed.sql');
  const fullSql = readFileSync(seedPath, 'utf-8');

  // Split by statement: remove comments, split on semicolons, trim whitespace
  const statements = fullSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));

  // Filter out comment-only lines within multi-line statements
  const batches: string[] = [];
  for (const stmt of statements) {
    const clean = stmt.replace(/^--.*$/gm, '').trim();
    if (clean) batches.push(clean);
  }

  let success = 0;
  let skipped = 0;

  for (const stmt of batches) {
    try {
      await sql.unsafe(stmt + ';');
      success++;
    } catch (err: any) {
      if (
        err.message?.includes('already exists') ||
        err.message?.includes('duplicate key')
      ) {
        skipped++;
      } else {
        console.error(`\n❌ Failed:\n  ${stmt.slice(0, 120)}...\n  ${err.message}`);
      }
    }
  }

  console.log(`\n✅ Migration complete — ${success} executed, ${skipped} skipped (already exists).`);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
