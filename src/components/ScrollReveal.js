'use client';

import { useEffect } from 'react';

// Плавна поява елементів із класом .reveal при прокрутці.
// Захищено від «зникнення» контенту: те, що вже у в'юпорті, показуємо одразу,
// а через 2.5с примусово показуємо все, що лишилось, — щоб плитки ніколи
// не залишались невидимими, навіть якщо IntersectionObserver дасть збій.
export default function ScrollReveal() {
  useEffect(() => {
    const items = Array.from(document.querySelectorAll('.reveal:not(.in-view)'));
    if (!items.length) return;

    // Негайно показуємо елементи, що вже (майже) видно.
    const revealIfVisible = (el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 1.1 && r.bottom > -40) el.classList.add('in-view');
    };
    items.forEach(revealIfVisible);

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => {
      if (!el.classList.contains('in-view')) observer.observe(el);
    });

    // Страховка: показати все, що з якоїсь причини не проявилось.
    const fallback = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.in-view)').forEach((el) => el.classList.add('in-view'));
    }, 2500);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  });

  return null;
}
