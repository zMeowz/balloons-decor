'use client';

import { useEffect, useRef, useState } from 'react';

// Плавно «накручує» число від 0 до value, коли елемент зʼявляється у полі зору.
export default function Counter({ value, className }) {
  const target = parseInt(String(value).replace(/\D/g, ''), 10) || 0;
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setN(target); return; }

    const run = () => {
      if (done.current) return;
      done.current = true;
      const dur = 1400;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out
        setN(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) { run(); return; }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { run(); obs.disconnect(); } }),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref} className={className}>{n.toLocaleString('uk-UA')}</span>;
}
