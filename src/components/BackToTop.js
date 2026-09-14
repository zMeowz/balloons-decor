'use client';

import { useEffect, useState } from 'react';

// Кнопка «нагору»: з'являється після прокручування і плавно піднімає сторінку.
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`to-top ${show ? 'is-visible' : ''}`}
      onClick={toTop}
      aria-label="Нагору"
      type="button"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" width="22" height="22" aria-hidden="true">
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
