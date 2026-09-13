import { locales } from '@/i18n/config';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://balloonsdecor.com.ua';
const paths = ['', '/works', '/about', '/contact'];

export default function sitemap() {
  const entries = [];
  for (const locale of locales) {
    for (const p of paths) {
      entries.push({
        url: `${SITE_URL}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: p === '/works' ? 'weekly' : 'monthly',
        priority: p === '' ? 1 : 0.7,
      });
    }
  }
  return entries;
}
