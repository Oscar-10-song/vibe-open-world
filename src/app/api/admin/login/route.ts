import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = adminLoginSchema.parse(body);

    const adminPassword = process.env.ADMIN_PASSWORD || 'vibeadmin123';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set httpOnly cookie valid for 24 hours
    response.cookies.set('admin_token', password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
