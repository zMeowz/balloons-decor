import { NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

// Шляхи, які НЕ треба чіпати мовним роутингом.
function isIgnoredPath(pathname) {
  return (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/media') ||
    pathname.startsWith('/works') || // статичні картинки з /public/works
    pathname.includes('.') // файли (картинки, іконки тощо)
  );
}

function getLocaleFromRequest(request) {
  // 1) Якщо користувач уже обирав мову — беремо з cookie.
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 2) Інакше — дивимось на мову браузера.
  const accept = request.headers.get('accept-language') || '';
  const preferred = accept.split(',').map((l) => l.split(';')[0].trim().toLowerCase());
  for (const lang of preferred) {
    if (lang.startsWith('uk')) return 'uk';
    if (lang.startsWith('ru')) return 'ru';
  }
  return defaultLocale;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isIgnoredPath(pathname)) return NextResponse.next();

  // Чи вже є мовний префікс у шляху?
  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) {
    // Передаємо поточну мову в кореневий layout через заголовок,
    // щоб коректно виставити <html lang="...">.
    const current = pathname.split('/')[1];
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', current);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Немає префікса — редіректимо на потрібну мову.
  const locale = getLocaleFromRequest(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
