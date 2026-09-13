import { headers, cookies } from 'next/headers';
import { Oswald, Manrope } from 'next/font/google';
import './globals.css';

const display = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata = {
  icons: { icon: '/favicon.svg' },
};

export const viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  // Мову для <html lang> бере з заголовка, який виставляє middleware.
  const locale = headers().get('x-locale') || 'uk';
  // Тема з cookie (темна за замовчуванням) — щоб не було «моргання» при завантаженні.
  const theme = cookies().get('theme')?.value === 'light' ? 'light' : 'dark';
  return (
    <html lang={locale} data-theme={theme} className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
