'use client';

import { useMemo, useState } from 'react';
import Lightbox from './Lightbox';
import { IconBalloonMark } from './icons';

export default function WorksGrid({ works, dict, locale }) {
  const [active, setActive] = useState('all');
  const [selected, setSelected] = useState(null);
  const [broken, setBroken] = useState({}); // id -> true, якщо фото не завантажилось
  const markBroken = (id) => setBroken((b) => (b[id] ? b : { ...b, [id]: true }));

  const title = (w) => (locale === 'ru' ? w.title_ru : w.title_uk) || w.title_uk;
  const desc = (w) => (locale === 'ru' ? w.description_ru : w.description_uk) || '';
  const count = (w) => (w.images?.length ? w.images.length : 1);

  const cats = useMemo(() => {
    const set = new Set(works.map((w) => w.category).filter(Boolean));
    return Array.from(set);
  }, [works]);

  const filtered = active === 'all' ? works : works.filter((w) => w.category === active);

  if (!works.length) {
    return <p style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 0' }}>{dict.worksPage.empty}</p>;
  }

  return (
    <div>
      <div className="filters">
        <button className={`filter ${active === 'all' ? 'active' : ''}`} onClick={() => setActive('all')}>
          {dict.worksPage.all}
        </button>
        {cats.map((c) => (
          <button key={c} className={`filter ${active === c ? 'active' : ''}`} onClick={() => setActive(c)}>
            {dict.categories[c] || c}
          </button>
        ))}
      </div>

      <div className="works-grid">
        {filtered.map((w, i) => (
          <button
            key={w.id}
            className="work-tile reveal"
            style={{ transitionDelay: `${(i % 6) * 0.07}s` }}
            onClick={() => setSelected(w)}
            aria-label={title(w)}
          >
            {broken[w.id] || !w.image_url ? (
              <span className="work-tile__ph" aria-hidden="true">
                <IconBalloonMark className="work-tile__ph-mark" />
                <span className="work-tile__ph-title">{title(w)}</span>
              </span>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={w.image_url} alt={title(w)} loading="lazy" onError={() => markBroken(w.id)} />
            )}
            {count(w) > 1 && <span className="work-tile__multi">◨ {count(w)}</span>}
            <span className="work-tile__zoom" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6" strokeLinecap="round"/></svg>
            </span>
            <span className="work-tile__cap">
              <span className="work-tile__cap-title">{title(w)}</span>
              {desc(w) && <span className="work-tile__cap-desc">{desc(w)}</span>}
            </span>
          </button>
        ))}
      </div>

      <Lightbox work={selected} locale={locale} dict={dict} onClose={() => setSelected(null)} />
    </div>
  );
}
