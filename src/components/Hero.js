import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { IconArrow } from './icons';

function heroVideoExists() {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', 'media', 'hero.mp4'));
  } catch {
    return false;
  }
}

export default function Hero({ locale, dict, works }) {
  const hasVideo = heroVideoExists();
  const base = `/${locale}`;
  const bg = works[0];
  const film = works.slice(0, 5);
  const catLabel = (w) => dict.categories[w.category] || '';

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        {hasVideo ? (
          <video autoPlay muted loop playsInline poster={bg?.image_url}>
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          bg && <img src={bg.image_url} alt="" />
        )}
      </div>
      <div className="hero__veil" aria-hidden="true" />

      <div className="container hero__inner">
        <span className="hero__kicker">{dict.hero.kicker}</span>

        <h1 className="hero__title">
          <span className="line reveal in-view">{dict.hero.titleTop}</span>
          <span className="line line--thin reveal in-view reveal-d1">{dict.hero.titleBottom}</span>
          <span className="line line--accent reveal in-view reveal-d2">{dict.hero.titleAccent}</span>
        </h1>

        <div className="hero__row reveal in-view reveal-d2">
          <p className="hero__lead">{dict.hero.lead}</p>
          <div className="hero__actions">
            <Link href={`${base}/contact`} className="btn btn--primary btn--lg">
              {dict.hero.ctaPrimary} <IconArrow />
            </Link>
            <Link href={`${base}/works`} className="btn btn--ghost btn--lg">
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="hero__stats reveal in-view reveal-d3">
          {dict.hero.stats.map((s, i) => (
            <div className="hero__stat" key={i}>
              <strong>{s.value}<span className="suf">{s.suffix}</span></strong>
              <p>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="hero__film">
          {film.map((w) => (
            <Link key={w.id} href={`${base}/works`} className="hero__film-item">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={w.image_url} alt={locale === 'ru' ? w.title_ru : w.title_uk} />
              <span>{catLabel(w)}</span>
            </Link>
          ))}
          <Link href={`${base}/works`} className="hero__film-more">
            {dict.worksTeaser.cta} →
          </Link>
        </div>
      </div>
    </section>
  );
}
