import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'bd_admin';
const MAX_AGE = 60 * 60 * 12; // 12 годин

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || 'dev-insecure-secret-change-me';
}

// Створюємо підписаний токен: payload.signature
function sign(payload) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verify(token) {
  if (!token || !token.includes('.')) return null;
  const [data, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');
  // Постійне за часом порівняння, щоб уникнути timing-атак.
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// Перевіряє пароль. Повертає true/false.
export function checkPassword(password) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  const a = Buffer.from(String(password));
  const b = Buffer.from(String(real));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function createSessionCookie() {
  const token = sign({ role: 'admin', exp: Date.now() + MAX_AGE * 1000 });
  return {
    name: COOKIE_NAME,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: MAX_AGE,
    },
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    options: { httpOnly: true, path: '/', maxAge: 0 },
  };
}

// Чи авторизований адмін (для server components / actions).
export function isAuthenticated() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return Boolean(verify(token));
}
