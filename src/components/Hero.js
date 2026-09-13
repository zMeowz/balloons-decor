import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { IconArrow } from './icons';

// Перевіряємо один раз при рендері на сервері: чи є відео для банера?
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
  const collage = works.slice(0, 2);

  return (
    <section className={`hero ${hasVideo ? 'hero--has-media' : ''}`}>
      <div className="hero__bg" aria-hidden="true">
        {hasVideo ? (
          <video autoPlay muted loop playsInline poster={collage[0]?.image_url}>
            <source src="/media/hero.mp4" type="video/mp4" />
          </video>
        ) : null}
      </div>
      <div className="hero__veil" aria-hidden="true" />
      {!hasVideo && (
        <>
          <div className="orb orb--violet" style={{ width: 420, height: 420, top: '-8%', right: '6%' }} />
          <div className="orb orb--pink" style={{ width: 360, height: 360, bottom: '-10%', left: '-6%' }} />
        </>
      )}

      <div className="container hero__inner">
        <div className="hero__content">
          <span className="hero__kicker reveal in-view">
            <span className="dot" /> {dict.hero.kicker}
          </span>

          <h1 className="hero__title">
            <span className="line reveal in-view">{dict.hero.titleTop}</span>
            <span className="line reveal in-view reveal-d1"><em className="accent">{dict.hero.titleAccent}</em></span>
            <span className="line reveal in-view reveal-d2">{dict.hero.titleBottom}</span>
          </h1>

          <p className="hero__lead reveal in-view reveal-d2">{dict.hero.lead}</p>

          <div className="hero__actions reveal in-view reveal-d3">
            <Link href={`${base}/contact`} className="btn btn--primary btn--lg">
              {dict.hero.ctaPrimary} <IconArrow />
            </Link>
            <Link href={`${base}/works`} className="btn btn--ghost btn--lg">
              {dict.hero.ctaSecondary}
            </Link>
          </div>

          <div className="hero__stats reveal in-view reveal-d3">
            {dict.hero.stats.map((s, i) => (
              <div className="hero__stat" key={i}>
                <strong>{s.value}<span className="suf">{s.suffix}</span></strong>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {!hasVideo && collage.length >= 2 && (
          <div className="hero__collage reveal in-view reveal-d2" aria-hidden="true">
            <div className="hero__ph hero__ph--1 parallax" data-speed="0.05">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={collage[0].image_url} alt="" />
            </div>
            <div className="hero__ph hero__ph--2 parallax" data-speed="0.11">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={collage[1].image_url} alt="" />
            </div>
            <span className="hero__chip hero__chip--a">✨ wow-декор</span>
            <span className="hero__chip hero__chip--b">🎀 під ключ</span>
          </div>
        )}
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span className="mouse" />
        {dict.hero.scroll}
      </div>
    </section>
  );
}
