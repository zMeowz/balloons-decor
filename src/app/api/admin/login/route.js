import { NextResponse } from 'next/server';
import { checkPassword, createSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: 'no_password_configured' }, { status: 500 });
  }

  if (!checkPassword(body.password)) {
    return NextResponse.json({ ok: false, error: 'wrong' }, { status: 401 });
  }

  const cookie = createSessionCookie();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
