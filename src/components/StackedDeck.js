'use client';

import { useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from './icons';

// Магнітна колода: картки лежать стопкою внахлéст (з легким поворотом),
// верхню можна «кинути» свайпом — вона відлітає, а наступна пружинисто
// стає на її місце.
const PRESETS = [
  { y: 0, s: 1, r: 0 },       // 0 — верхня
  { y: 20, s: 0.94, r: 4 },   // 1
  { y: 40, s: 0.88, r: -5 },  // 2
  { y: 60, s: 0.82, r: 3 },   // 3
];
const lerp = (a, b, t) => a + (b - a) * t;

export default function StackedDeck({ works, locale, dict }) {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [fly, setFly] = useState(0); // напрямок відльоту: -1 / 0 / 1
  const startX = useRef(null);
  const busy = useRef(false);
  const n = works.length;

  if (!n) return null;

  const title = (w) => (locale === 'ru' ? w.title_ru : w.title_uk) || w.title_uk;
  const desc = (w) => (locale === 'ru' ? w.description_ru : w.description_uk) || '';

  // step: +1 наступна / -1 попередня; flyDir: куди відлітає верхня
  const move = (step, flyDir) => {
    if (busy.current) return;
    busy.current = true;
    setFly(flyDir);
    setDragging(false);
    window.setTimeout(() => {
      setIndex((i) => (i + step + n) % n);
      setFly(0);
      setDrag(0);
      busy.current = false;
    }, 360);
  };

  const onDown = (e) => {
    if (busy.current) return;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? null;
    setDragging(true);
  };
  const onMove = (e) => {
    if (startX.current === null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    setDrag(x - startX.current);
  };
  const onUp = () => {
    if (startX.current === null) return;
    startX.current = null;
    if (drag > 90) move(1, 1);
    else if (drag < -90) move(1, -1);
    else { setDragging(false); setDrag(0); } // магнітне повернення
  };

  const progress = dragging ? Math.min(Math.abs(drag) / 150, 1) : 0;

  const stack = [];
  for (let d = 0; d < Math.min(4, n); d++) {
    stack.push({ work: works[(index + d) % n], depth: d });
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
            let transition;
            let opacity = 1;

            if (isTop) {
              if (fly !== 0) {
                transform = `translateX(${fly * 150}%) translateY(-24px) rotate(${fly * 16}deg)`;
                transition = 'transform 0.36s cubic-bezier(0.4,0,0.7,0.2), opacity 0.36s ease';
                opacity = 0;
              } else if (dragging) {
                transform = `translateX(${drag}px) rotate(${drag * 0.045}deg)`;
                transition = 'none';
              } else {
                transform = 'translateX(0) rotate(0deg)';
                transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
              }
            } else {
              const p = depth === 1 ? progress : 0; // передня з-під низу підіймається до верху
              const base = PRESETS[depth];
              const y = lerp(base.y, PRESETS[0].y, p);
              const s = lerp(base.s, 1, p);
              const r = lerp(base.r, 0, p);
              transform = `translateY(${y}px) scale(${s}) rotate(${r}deg)`;
              transition = dragging ? 'transform 0.15s linear' : 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)';
              opacity = depth > 2 ? 0.6 : 1;
            }

            return (
              <article
                key={work.id + '-' + depth}
                className="deck__card"
                style={{ transform, transition, opacity, zIndex: 10 - depth }}
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
        <button className="deck__btn" onClick={() => move(-1, 1)} aria-label="Попередня">
          <IconChevronLeft />
        </button>
        <div className="deck__dots">
          {works.map((_, i) => (
            <span key={i} className={`deck__dot ${i === index ? 'active' : ''}`} />
          ))}
        </div>
        <button className="deck__btn" onClick={() => move(1, -1)} aria-label="Наступна">
          <IconChevronRight />
        </button>
      </div>
      <p className="deck__hint">← {dict.worksTeaser.swipeHint} →</p>
    </div>
  );
}
