'use client';

import { useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from './icons';

// Колода фото-карток, які можна гортати свайпом або кнопками.
export default function StackedDeck({ works, locale, dict }) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [animating, setAnimating] = useState(false);
  const startX = useRef(null);
  const n = works.length;

  if (!n) return null;

  const title = (w) => (locale === 'ru' ? w.title_ru : w.title_uk) || w.title_uk;
  const desc = (w) => (locale === 'ru' ? w.description_ru : w.description_uk) || '';

  const go = (dir) => {
    setIndex((i) => (i + dir + n) % n);
    setDrag(0);
  };

  const onDown = (e) => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? null;
    setAnimating(false);
  };
  const onMove = (e) => {
    if (startX.current === null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDrag(x - startX.current);
  };
  const onUp = () => {
    if (startX.current === null) return;
    setAnimating(true);
    if (drag > 90) go(-1);
    else if (drag < -90) go(1);
    else setDrag(0);
    startX.current = null;
  };

  // Показуємо 3 картки в стеку
  const stack = [];
  for (let i = 0; i < Math.min(3, n); i++) {
    stack.push({ work: works[(index + i) % n], depth: i });
  }

  return (
    <div className="deck">
      <div className="deck__viewport">
        {stack
          .slice()
          .reverse()
          .map(({ work, depth }) => {
            const isTop = depth === 0;
            let transform;
            let transition = animating || !isTop ? 'transform 0.5s cubic-bezier(0.22,1,0.36,1)' : 'none';
            if (isTop) {
              transform = `translateX(${drag}px) rotate(${drag * 0.04}deg)`;
            } else {
              transform = `translateY(${depth * 16}px) scale(${1 - depth * 0.05})`;
            }
            return (
              <article
                key={work.id + '-' + depth}
                className="deck__card"
                style={{
                  transform,
                  transition,
                  zIndex: 10 - depth,
                  opacity: depth > 1 ? 0.7 : 1,
                }}
                onPointerDown={isTop ? onDown : undefined}
                onPointerMove={isTop ? onMove : undefined}
                onPointerUp={isTop ? onUp : undefined}
                onPointerLeave={isTop ? onUp : undefined}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={work.image_url} alt={title(work)} draggable="false" />
                <div className="deck__meta">
                  <h3>{title(work)}</h3>
                  {desc(work) && <p>{desc(work)}</p>}
                </div>
              </article>
            );
          })}
      </div>

      <div className="deck__controls">
        <button className="deck__btn" onClick={() => { setAnimating(true); go(-1); }} aria-label="Попередня">
          <IconChevronLeft />
        </button>
        <div className="deck__dots">
          {works.map((_, i) => (
            <span key={i} className={`deck__dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>
        <button className="deck__btn" onClick={() => { setAnimating(true); go(1); }} aria-label="Наступна">
          <IconChevronRight />
        </button>
      </div>
      <p className="deck__hint">← {dict.worksTeaser.swipeHint} →</p>
    </div>
  );
}
