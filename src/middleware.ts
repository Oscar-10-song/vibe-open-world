import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// ============================================================
// 管理后台路由保护 — 统一认证检查
// ============================================================

const ADMIN_PATH = '/admin';
const ADMIN_LOGIN = '/admin/login';
const API_ADMIN = '/api/admin';
const API_ADMIN_LOGIN = '/api/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;
  const isAuthenticated = verifyToken(token);

  // ============================================================
  // Admin page routes (except login)
  // ============================================================
  if (
    pathname.startsWith(ADMIN_PATH) &&
    !pathname.startsWith(ADMIN_LOGIN)
  ) {
    if (!isAuthenticated) {
      const loginUrl = new URL(ADMIN_LOGIN, request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ============================================================
  // Admin API routes (except login)
  // ============================================================
  if (
    pathname.startsWith(API_ADMIN) &&
    !pathname.startsWith(API_ADMIN_LOGIN)
  ) {
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

// ============================================================
// Matcher — only run middleware on admin paths
// ============================================================
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
