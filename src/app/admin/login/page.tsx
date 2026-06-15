import { Container } from '@/components/layout/Container';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login — Vibe Open World',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // Already logged in → redirect to dashboard
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;

  if (verifyToken(token)) {
    redirect('/admin/projects');
  }

  return (
    <Container narrow className="py-20">
      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🔐</span>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Login</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            Sign in to manage project submissions
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </Container>
  );
}
