import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validators';
import { deriveToken, getAdminPassword, getAdminUsername } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = adminLoginSchema.parse(body);

    const adminUsername = getAdminUsername();
    const adminPassword = getAdminPassword();

    if (username !== adminUsername || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = deriveToken(password);

    const response = NextResponse.json({ success: true });

    // Set httpOnly cookie with derived token (NOT the plaintext password)
    response.cookies.set('admin_token', token, {
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
