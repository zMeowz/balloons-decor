import { headers } from 'next/headers';
import { Playfair_Display, Manrope } from 'next/font/google';
import './globals.css';

const display = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
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
  return (
    <html lang={locale} className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
