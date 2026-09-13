import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getDictionary } from '@/i18n';
import { getWorks } from '@/lib/data';
import { IconArrow } from '@/components/icons';

export async function generateMetadata({ params }) {
  const dict = getDictionary(params.locale);
  return {
    title: dict.aboutPage.title + ' · ' + dict.brand.author,
    description: dict.aboutPage.lead,
    alternates: { canonical: `/${params.locale}/about`, languages: { uk: '/uk/about', ru: '/ru/about' } },
  };
}

// Фото Ані: поклади файл у public/media/anya.jpg — і воно зʼявиться автоматично.
function anyaPhoto(fallback) {
  try {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'media', 'anya.jpg'))) return '/media/anya.jpg';
  } catch {}
  return fallback;
}

export default async function AboutPage({ params }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const works = await getWorks({ onlyFeatured: true });
  const photo = anyaPhoto(works[0]?.image_url || '/works/gallery-3.jpg');
  const base = `/${locale}`;

  return (
    <>
      <section className="section" style={{ paddingTop: 'clamp(120px, 16vw, 200px)' }}>
        <div className="container intro__grid" style={{ alignItems: 'center' }}>
          <div className="intro__visual reveal in-view">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={dict.aboutPage.photoAlt} />
            <div className="intro__badge">
              <strong>{dict.brand.author.split(' ')[0]}</strong>
              <span>{locale === 'ru' ? 'основательница' : 'засновниця'}</span>
            </div>
          </div>
          <div className="reveal in-view reveal-d2">
            <span className="eyebrow">{dict.aboutPage.kicker}</span>
            <h1 style={{ fontSize: 'clamp(2.6rem, 6vw, 4.4rem)', margin: '16px 0 18px' }}>{dict.aboutPage.title}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--ink-soft)', fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
              {dict.aboutPage.lead}
            </p>
            {dict.aboutPage.body.map((p, i) => (
              <p key={i} style={{ color: 'var(--ink-soft)', marginTop: 16 }}>{p}</p>
            ))}
            <Link href={`${base}/contact`} className="btn btn--primary btn--lg" style={{ marginTop: 26 }}>
              {dict.aboutPage.cta} <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="values-grid">
            {dict.aboutPage.values.map((v, i) => (
              <div className="point reveal" key={i} style={{ padding: 34 }}>
                <span className="point__num">0{i + 1}</span>
                <h3 style={{ fontSize: '1.5rem' }}>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
