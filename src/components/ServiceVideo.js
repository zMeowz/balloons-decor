'use client';

import { useEffect, useRef, useState } from 'react';

// Відео у картці послуги. Щоб не вантажити телефон, відео відтворюється
// лише коли картка на екрані (IntersectionObserver): зʼявилась — грає,
// зникла — ставимо на паузу. Плавно проявляється, коли готове.
export default function ServiceVideo({ src, poster }) {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="service__media">
      <video
        ref={ref}
        className={ready ? 'is-ready' : ''}
        muted
        loop
        playsInline
        preload="none"
        poster={poster || undefined}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
