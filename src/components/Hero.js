import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { IconArrow } from './icons';
import Counter from './Counter';
import HeroVideo from './HeroVideo';

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
          <HeroVideo src="/media/hero.mp4" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          bg && <img src={bg.image_url} alt="" />
        )}
      </div>
      <div className="hero__veil" aria-hidden="true" />

      <div className="container hero__inner hero-anim">
        {/* Кутики видошукача — мотив «ми кадруємо ваші миті» */}
        <span className="vf vf--tl" aria-hidden="true" />
        <span className="vf vf--tr" aria-hidden="true" />
        <span className="vf vf--bl" aria-hidden="true" />
        <span className="vf vf--br" aria-hidden="true" />

        <div className="hero__meta">
          <span className="hero__rec"><i className="hero__recdot" />{dict.hero.kicker}</span>
        </div>

        <h1 className="hero__title">
          <span className="line">{dict.hero.titleTop}</span>
          <span className="line line--thin">{dict.hero.titleBottom}</span>
          <span className="line line--accent">{dict.hero.titleAccent}</span>
        </h1>

        <div className="hero__row">
          <p className="hero__lead"><span>{dict.hero.lead}</span></p>
          <div className="hero__actions">
            <Link href={`${base}/contact`} className="btn btn--primary btn--lg">
              {dict.hero.ctaPrimary} <IconArrow />
            </Link>
            <Link href={`${base}/works`} className="btn btn--ghost btn--lg">
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="hero__stats">
          {dict.hero.stats.map((s, i) => (
            <div className="hero__stat" key={i}>
              <strong><Counter value={s.value} /><span className="suf">{s.suffix}</span></strong>
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
