'use client';

import { useMemo, useState } from 'react';

export default function WorksGrid({ works, dict, locale }) {
  const [active, setActive] = useState('all');

  const title = (w) => (locale === 'ru' ? w.title_ru : w.title_uk) || w.title_uk;
  const desc = (w) => (locale === 'ru' ? w.description_ru : w.description_uk) || '';

  // Категорії, які реально є серед робіт
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
        {filtered.map((w) => (
          <div key={w.id} className="work-tile reveal in-view">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={w.image_url} alt={title(w)} loading="lazy" />
            <div className="work-tile__cap">
              <h3>{title(w)}</h3>
              {desc(w) && <p>{desc(w)}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
