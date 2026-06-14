import { neon } from '@neondatabase/serverless';

// ============================================================
// Neon 数据库客户端（Vercel 原生集成）
// ============================================================

export function getDb() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return neon(dbUrl);
}
