'use client';

import { useEffect } from 'react';

// Плавна поява елементів із класом .reveal при прокрутці.
export default function ScrollReveal() {
  useEffect(() => {
    const items = document.querySelectorAll('.reveal:not(.in-view)');
    if (!items.length) return;

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
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  return null;
}
