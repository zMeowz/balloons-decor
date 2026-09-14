'use client';

import { useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconClose } from './icons';

// Перегляд роботи: велике фото на весь екран, знизу виїжджає інфо-панель.
// Якщо фото кілька — їх можна гортати (свайп / стрілки / крапки).
export default function Lightbox({ work, locale, dict, onClose }) {
  const images = work?.images?.length ? work.images : work ? [work.image_url] : [];
  const [idx, setIdx] = useState(0);
  const [drag, setDrag] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [entered, setEntered] = useState(false);
  const startX = useRef(null);
  const n = images.length;

  const title = work && (locale === 'ru' ? work.title_ru : work.title_uk);
  const desc = work && (locale === 'ru' ? work.description_ru : work.description_uk);
  const cat = work && (dict.categories[work.category] || '');

  // Блокуємо прокрутку сторінки, поки відкрито; закриття по Esc; анімація появи.
  useEffect(() => {
    if (!work) return;
    setIdx(0);
    setEntered(false);
    const t = requestAnimationFrame(() => setEntered(true));
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % n);
      if (e.key === 'ArrowLeft') setIdx((i) => (i - 1 + n) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(t);
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [work, n, onClose]);

  if (!work) return null;

  const go = (step) => setIdx((i) => (i + step + n) % n);

  const onDown = (e) => {
    if (n < 2) return;
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
    if (drag > 60) go(-1);
    else if (drag < -60) go(1);
    startX.current = null;
    setDragging(false);
    setDrag(0);
  };

  return (
    <div className={`lb ${entered ? 'lb--in' : ''}`} onClick={onClose}>
      <button className="lb__close" aria-label="Закрити" onClick={onClose}><IconClose /></button>

      <div className="lb__stage" onClick={(e) => e.stopPropagation()}>
        <div
          className="lb__imgwrap"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
          style={{ transform: dragging ? `translateX(${drag}px)` : 'translateX(0)', transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(0.22,1,0.36,1)' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[idx]} alt={title} draggable="false" />
        </div>

        {n > 1 && (
          <>
            <button className="lb__nav lb__nav--prev" aria-label="Попереднє" onClick={() => go(-1)}><IconChevronLeft /></button>
            <button className="lb__nav lb__nav--next" aria-label="Наступне" onClick={() => go(1)}><IconChevronRight /></button>
            <div className="lb__counter">{idx + 1} / {n}</div>
          </>
        )}

        {/* Інфо-панель, що виїжджає знизу */}
        <div className="lb__info">
          {cat && <span className="lb__chip">{cat}</span>}
          <h3>{title}</h3>
          {desc && <p>{desc}</p>}
          {n > 1 && (
            <div className="lb__dots">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`lb__dot ${i === idx ? 'active' : ''}`}
                  aria-label={`Фото ${i + 1}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
