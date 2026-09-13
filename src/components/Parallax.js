'use client';

import { useEffect } from 'react';

// Легкий паралакс: зсуває елементи з класом .parallax[data-speed] при скролі.
export default function Parallax() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const items = Array.from(document.querySelectorAll('.parallax'));
    if (!items.length) return;

    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      items.forEach((el) => {
        const speed = Number(el.dataset.speed || 0.08);
        el.style.setProperty('--shift', `${y * speed * -1}px`);
      });
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
