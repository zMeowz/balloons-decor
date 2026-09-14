import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import HeroVideo from './HeroVideo';
import { IconArrow } from './icons';

// Секція-смуга з фоновим відео та текстом поверх.
// Автоматично підхоплює public/media/section.mp4; поки його немає —
// показує фото-заглушку, щоб розділ не був порожнім.
function sectionVideoExists() {
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', 'media', 'section.mp4'));
  } catch {
    return false;
  }
}

export default function VideoBand({ locale, dict, fallbackImage }) {
  const hasVideo = sectionVideoExists();
  const base = `/${locale}`;

  return (
    <section className="band">
      <div className="band__bg" aria-hidden="true">
        {hasVideo ? (
          <HeroVideo src="/media/section.mp4" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          fallbackImage && <img src={fallbackImage} alt="" />
        )}
      </div>
      <div className="band__veil" aria-hidden="true" />

      <div className="container band__inner reveal">
        <span className="eyebrow">{dict.band.kicker}</span>
        <h2 className="band__title">{dict.band.title}</h2>
        <p className="band__text">{dict.band.text}</p>
        <Link href={`${base}/contact`} className="btn btn--primary btn--lg">
          {dict.band.cta} <IconArrow />
        </Link>
      </div>
    </section>
  );
}
