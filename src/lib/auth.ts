import { createHash } from 'crypto';

// ============================================================
// 管理后台认证工具
// 使用 SHA-256 哈希，避免明文密码存储在 cookie 中
// ============================================================

const COOKIE_SALT = 'vibe-open-world-admin-2024';

/**
 * 从明文密码派生出安全的 token（存储在 cookie 中）
 */
export function deriveToken(password: string): string {
  return createHash('sha256')
    .update(password + COOKIE_SALT)
    .digest('hex');
}

/**
 * 验证 cookie 中的 token 是否有效
 */
export function verifyToken(token: string | undefined): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'vibeadmin123';
  if (!token) return false;
  return token === deriveToken(adminPassword);
}

/**
 * 获取管理员密码（用于用户名+密码验证）
 */
export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || 'vibeadmin123';
}

/**
 * 获取管理员用户名
 */
export function getAdminUsername(): string {
  return process.env.ADMIN_USERNAME || 'admin';
}
