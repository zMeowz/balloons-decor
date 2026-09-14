'use client';

import { useState } from 'react';

// Фонове відео банера, що плавно проявляється, коли готове до відтворення.
// Без «постера» зі старим фото — тому нічого не мигає при завантаженні.
export default function HeroVideo({ src }) {
  const [ready, setReady] = useState(false);
  return (
    <video
      className={ready ? 'is-ready' : ''}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      onLoadedData={() => setReady(true)}
      onCanPlay={() => setReady(true)}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
