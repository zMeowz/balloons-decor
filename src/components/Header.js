'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales } from '@/i18n/config';
import ThemeToggle from './ThemeToggle';
import { IconBalloonMark } from './icons';

export default function Header({ locale, dict, logo }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Закривати мобільне меню при зміні сторінки
  useEffect(() => setOpen(false), [pathname]);

  const base = `/${locale}`;
  const links = [
    { href: base, label: dict.nav.home },
    { href: `${base}/works`, label: dict.nav.works },
    { href: `${base}/about`, label: dict.nav.about },
    { href: `${base}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href) =>
    href === base ? pathname === base : pathname.startsWith(href);

  // Побудувати шлях для іншої мови, зберігаючи поточну сторінку
  const swapLocale = (target) => {
    const parts = pathname.split('/');
    if (locales.includes(parts[1])) parts[1] = target;
    else parts.splice(1, 0, target);
    return parts.join('/') || `/${target}`;
  };

  const setLocaleCookie = (target) => {
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link href={base} className="brand" aria-label="Balloons Decor">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="brand__logo" src={logo} alt="Balloons Decor" />
          ) : (
            <>
              <IconBalloonMark className="brand__markicon" />
              <span>
                <span className="brand__name">Balloons Decor</span>
                <span className="brand__sub">{dict.brand.city} · декор</span>
              </span>
            </>
          )}
        </Link>

        <nav className={`nav ${open ? 'nav--open' : ''}`}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav__link ${isActive(l.href) ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          {/* Перемикач мови всередині мобільного меню */}
          <div className="nav__lang">
            {locales.map((l) => (
              <Link
                key={l}
                href={swapLocale(l)}
                className={l === locale ? 'active' : ''}
                onClick={() => setLocaleCookie(l)}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>
        </nav>

        <div className="header__actions">
          <ThemeToggle />
          <div className="lang" role="group" aria-label="Мова / Язык">
            {locales.map((l) => (
              <Link
                key={l}
                href={swapLocale(l)}
                className={l === locale ? 'active' : ''}
                onClick={() => setLocaleCookie(l)}
              >
                {l.toUpperCase()}
              </Link>
            ))}
          </div>

          <Link href={`${base}/contact`} className="btn btn--primary nav__cta" style={{ padding: '11px 22px' }}>
            {dict.nav.order}
          </Link>

          <button
            className={`burger ${open ? 'open' : ''}`}
            aria-label="Меню"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
