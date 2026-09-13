'use client';

import { useEffect, useState } from 'react';
import { IconSun, IconMoon } from './icons';

// Перемикач тем: додає/знімає data-theme="light" на <html> і памʼятає вибір у cookie.
export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current);
  }, []);

  const toggle = () => {
    const next =
      (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
    setTheme(next);
  };

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Світла / темна тема" title="Світла / темна тема">
      {theme === 'light' ? <IconMoon /> : <IconSun />}
    </button>
  );
}
