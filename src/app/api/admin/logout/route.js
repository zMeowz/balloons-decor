import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request) {
  const cookie = clearSessionCookie();
  const url = new URL('/admin/login', request.url);
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
