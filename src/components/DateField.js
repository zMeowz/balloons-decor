'use client';

// Власний вибір дати замість системного <input type="date">.
// Причина: нативний календар Chrome бере мову з налаштувань браузера, а не
// з сайту, тож на укр-версії він міг показуватись російською. Тут мова
// завжди збігається з мовою сайту, стиль — фірмовий, і ті самі межі дат.

import { useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from './icons';

const L = {
  uk: {
    months: ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'],
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
    today: 'Сьогодні',
    clear: 'Очистити',
    placeholder: 'дд.мм.рррр',
  },
  ru: {
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    today: 'Сегодня',
    clear: 'Очистить',
    placeholder: 'дд.мм.гггг',
  },
};

const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};
// Понеділок = 0 … Неділя = 6
const mondayIndex = (jsDay) => (jsDay + 6) % 7;

export default function DateField({ id, value, onChange, min, max, locale = 'uk' }) {
  const t = L[locale] || L.uk;
  const selected = parseISO(value);
  const minD = parseISO(min);
  const maxD = parseISO(max);

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => {
    const base = selected || minD || new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const wrapRef = useRef(null);

  // Закрити при кліку поза полем або по Esc.
  useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const isDisabled = (d) => (minD && startOfDay(d) < startOfDay(minD)) || (maxD && startOfDay(d) > startOfDay(maxD));

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstOffset = mondayIndex(new Date(year, month, 1).getDay());
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const today = new Date();
  const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const canPrev = !minD || new Date(year, month, 1) > new Date(minD.getFullYear(), minD.getMonth(), 1);
  const canNext = !maxD || new Date(year, month, 1) < new Date(maxD.getFullYear(), maxD.getMonth(), 1);

  const pick = (d) => { if (isDisabled(d)) return; onChange(toISO(d)); setOpen(false); };
  const goToday = () => {
    if (isDisabled(today)) return;
    setView(new Date(today.getFullYear(), today.getMonth(), 1));
    onChange(toISO(today));
    setOpen(false);
  };

  const display = selected ? `${pad(selected.getDate())}.${pad(selected.getMonth() + 1)}.${selected.getFullYear()}` : '';

  return (
    <div className="datefield" ref={wrapRef}>
      <button
        type="button"
        id={id}
        className={`datefield__btn ${display ? '' : 'is-placeholder'}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>{display || t.placeholder}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" />
        </svg>
      </button>

      {open && (
        <div className="cal" role="dialog" aria-label={t.months[month] + ' ' + year}>
          <div className="cal__head">
            <button type="button" className="cal__nav" onClick={() => canPrev && setView(new Date(year, month - 1, 1))} disabled={!canPrev} aria-label="←">
              <IconChevronLeft width="18" height="18" />
            </button>
            <span className="cal__title">{t.months[month]} {year}</span>
            <button type="button" className="cal__nav" onClick={() => canNext && setView(new Date(year, month + 1, 1))} disabled={!canNext} aria-label="→">
              <IconChevronRight width="18" height="18" />
            </button>
          </div>

          <div className="cal__grid cal__grid--wd">
            {t.weekdays.map((w, i) => (
              <span key={w} className={`cal__wd ${i >= 5 ? 'is-weekend' : ''}`}>{w}</span>
            ))}
          </div>

          <div className="cal__grid">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} className="cal__day is-empty" />;
              const dis = isDisabled(d);
              const sel = sameDay(d, selected);
              const isToday = sameDay(d, today);
              return (
                <button
                  key={toISO(d)}
                  type="button"
                  className={`cal__day ${sel ? 'is-selected' : ''} ${isToday && !sel ? 'is-today' : ''}`}
                  disabled={dis}
                  onClick={() => pick(d)}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          <div className="cal__foot">
            {value && <button type="button" className="cal__link" onClick={() => { onChange(''); setOpen(false); }}>{t.clear}</button>}
            <button type="button" className="cal__link cal__link--accent" onClick={goToday} disabled={isDisabled(today)}>{t.today}</button>
          </div>
        </div>
      )}
    </div>
  );
}
