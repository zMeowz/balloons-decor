import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { getDictionary } from '@/i18n';
import { getWorks, getPrices, getContent } from '@/lib/data';
import Hero from '@/components/Hero';
import StackedDeck from '@/components/StackedDeck';
import LeadForm from '@/components/LeadForm';
import Counter from '@/components/Counter';
import VideoBand from '@/components/VideoBand';
import ServiceVideo from '@/components/ServiceVideo';
import { IconArrow } from '@/components/icons';

// Відео для карток послуг: поклади файли у public/media з назвами
// service-1.mp4 … service-4.mp4 — і вони автоматично зʼявляться у картках
// (за бажанням service-1.jpg поруч стане постером-заглушкою).
function serviceMedia(i) {
  const n = i + 1;
  try {
    if (fs.existsSync(path.join(process.cwd(), 'public', 'media', `service-${n}.mp4`))) {
      const posterExists = ['jpg', 'webp', 'png'].find((ext) =>
        fs.existsSync(path.join(process.cwd(), 'public', 'media', `service-${n}.${ext}`))
      );
      return { src: `/media/service-${n}.mp4`, poster: posterExists ? `/media/service-${n}.${posterExists}` : null };
    }
  } catch {}
  return null;
}

export default async function HomePage({ params }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const [works, prices, content] = await Promise.all([
    getWorks({ onlyFeatured: true }),
    getPrices(),
    getContent(),
  ]);
  const base = `/${locale}`;
  const serviceVideos = dict.services.items.map((_, i) => serviceMedia(i));

  // Мікророзмітка для Google (локальний бізнес)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Balloons Decor ZP',
    description: dict.footer.about,
    image: works[0]?.image_url,
    telephone: content.phone,
    areaServed: dict.brand.city,
    address: { '@type': 'PostalAddress', addressLocality: dict.brand.city, addressCountry: 'UA' },
    sameAs: [content.instagram, content.telegram].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Hero locale={locale} dict={dict} works={works} />

      {/* Біжучий рядок категорій */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...dict.marquee, ...dict.marquee].map((m, i) => (
            <span className="marquee__item" key={i}>{m}</span>
          ))}
        </div>
      </div>

      {/* Чому ми */}
      <section className="section">
        <div className="container intro__grid">
          <div className="intro__text reveal reveal--l">
            <span className="eyebrow">{dict.intro.kicker}</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', margin: '18px 0 16px' }}>{dict.intro.title}</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.08rem' }}>{dict.intro.text}</p>
            <div className="intro__points" style={{ marginTop: 30 }}>
              {dict.intro.points.map((p, i) => (
                <div className="point" key={i}>
                  <span className="point__num">0{i + 1}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="intro__visual reveal reveal--r reveal-d2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={works[2]?.image_url || works[0]?.image_url} alt={dict.intro.title} />
            <div className="intro__badge">
              <strong><Counter value="500" />+</strong>
              <span>{locale === 'ru' ? 'счастливых клиентов' : 'щасливих клієнтів'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Послуги */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{dict.services.kicker}</span>
            <h2>{dict.services.title}</h2>
          </div>
          <div className="services__grid">
            {dict.services.items.map((s, i) => (
              <article className={`service reveal ${serviceVideos[i] ? 'service--media' : ''}`} key={i}>
                {serviceVideos[i] && <ServiceVideo src={serviceVideos[i].src} poster={serviceVideos[i].poster} />}
                {s.tag && <span className="service__tag">{s.tag}</span>}
                <span className="service__index">/ 0{i + 1}</span>
                <h3>{s.name}</h3>
                <p>{s.text}</p>
                <Link href={`${base}/contact`} className="service__arrow">
                  {dict.nav.order} <IconArrow />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Роботи — колода */}
      <section className="section">
        <div className="container intro__grid" style={{ alignItems: 'center' }}>
          <div className="reveal reveal--l">
            <span className="eyebrow">{dict.worksTeaser.kicker}</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4.4vw, 3.2rem)', margin: '18px 0 16px' }}>{dict.worksTeaser.title}</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.08rem', maxWidth: '40ch' }}>{dict.worksTeaser.text}</p>
            <Link href={`${base}/works`} className="btn btn--primary btn--lg" style={{ marginTop: 26 }}>
              {dict.worksTeaser.cta} <IconArrow />
            </Link>
          </div>
          <div className="reveal reveal--r reveal-d2">
            <StackedDeck works={works} locale={locale} dict={dict} />
          </div>
        </div>
      </section>

      {/* Ціни */}
      <section className="section section--soft">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <span className="eyebrow">{dict.prices.kicker}</span>
            <h2>{dict.prices.title}</h2>
            <p>{dict.prices.text}</p>
          </div>
          <div className="prices__grid">
            {prices.map((p) => (
              <div className="price-card reveal" key={p.id}>
                <div>
                  <h3>{locale === 'ru' ? p.name_ru : p.name_uk}</h3>
                  <p>{locale === 'ru' ? p.description_ru : p.description_uk}</p>
                </div>
                <div className="price-card__val">
                  <div className="price-card__from">{dict.prices.from}</div>
                  <div className="price-card__num">{Number(p.price_from).toLocaleString('uk-UA')}</div>
                  <div className="price-card__cur">{dict.prices.currency} · {locale === 'ru' ? p.unit_ru : p.unit_uk}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="prices__note">{dict.prices.note}</p>
        </div>
      </section>

      {/* Процес */}
      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <span className="eyebrow">{dict.process.kicker}</span>
            <h2>{dict.process.title}</h2>
          </div>
          <div className="process__grid">
            <div className="process__line" aria-hidden="true" />
            {dict.process.steps.map((s, i) => (
              <div className="step reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <div className="step__dot">{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Смуга з фоновим відео (діти біля арки) */}
      <VideoBand locale={locale} dict={dict} fallbackImage={works[3]?.image_url || works[0]?.image_url} />

      {/* Відгуки (темна секція) */}
      <section className="section section--dark reviews" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="orb orb--violet" style={{ width: 500, height: 500, top: '-20%', left: '-10%' }} />
        <div className="orb orb--gold" style={{ width: 360, height: 360, bottom: '-20%', right: '-8%' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-head section-head--center reveal">
            <span className="eyebrow">{dict.testimonials.kicker}</span>
            <h2>{dict.testimonials.title}</h2>
          </div>
          <div className="reviews__grid">
            {dict.testimonials.items.map((t, i) => (
              <blockquote className="review reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="review__quote">“</div>
                <p>{t.text}</p>
                <div className="review__author">{t.author}</div>
                <div className="review__event">{t.event}</div>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + форма */}
      <section className="section" id="order">
        <div className="container cta__grid">
          <div className="reveal">
            <span className="eyebrow">{dict.cta.kicker}</span>
            <h2 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', margin: '18px 0 16px' }}>{dict.cta.title}</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', maxWidth: '42ch' }}>{dict.cta.text}</p>
          </div>
          <div className="reveal reveal-d2">
            <LeadForm dict={dict} content={content} locale={locale} source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
