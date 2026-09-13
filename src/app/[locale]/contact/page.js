import { getDictionary } from '@/i18n';
import { getContent } from '@/lib/data';
import LeadForm from '@/components/LeadForm';
import { IconPhone, IconMapPin, IconClock, IconInstagram, IconTelegram } from '@/components/icons';

export async function generateMetadata({ params }) {
  const dict = getDictionary(params.locale);
  return {
    title: dict.nav.contact,
    description: dict.contactPage.text,
    alternates: { canonical: `/${params.locale}/contact`, languages: { uk: '/uk/contact', ru: '/ru/contact' } },
  };
}

export default async function ContactPage({ params }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const content = await getContent();

  const rows = [
    content.phone && {
      icon: <IconPhone />,
      label: dict.contactPage.phoneLabel,
      value: content.phone,
      href: `tel:${content.phone_raw ? '+' + content.phone_raw : content.phone}`,
    },
    {
      icon: <IconMapPin />,
      label: dict.contactPage.areaLabel,
      value: dict.footer.workingArea,
    },
    {
      icon: <IconClock />,
      label: dict.contactPage.hoursLabel,
      value: dict.contactPage.hours,
    },
  ].filter(Boolean);

  return (
    <section className="section" style={{ paddingTop: 'clamp(120px, 16vw, 200px)' }}>
      <div className="container cta__grid" style={{ alignItems: 'start' }}>
        <div className="reveal in-view">
          <span className="eyebrow">{dict.contactPage.kicker}</span>
          <h1 style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', margin: '16px 0 16px' }}>{dict.contactPage.title}</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: '1.1rem', maxWidth: '42ch' }}>{dict.contactPage.text}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 34 }}>
            {rows.map((r, i) => {
              const inner = (
                <>
                  <span style={{ width: 48, height: 48, borderRadius: 14, background: 'var(--lilac-soft)', color: 'var(--violet-deep)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                    {r.icon}
                  </span>
                  <span>
                    <span style={{ display: 'block', fontSize: '0.78rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' }}>{r.label}</span>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{r.value}</span>
                  </span>
                </>
              );
              const style = { display: 'flex', alignItems: 'center', gap: 14 };
              return r.href
                ? <a key={i} href={r.href} style={style}>{inner}</a>
                : <div key={i} style={style}>{inner}</div>;
            })}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
            {content.instagram && (
              <a href={content.instagram} target="_blank" rel="noopener" className="btn btn--ghost">
                <IconInstagram /> Instagram
              </a>
            )}
            {content.telegram && (
              <a href={content.telegram} target="_blank" rel="noopener" className="btn btn--ghost">
                <IconTelegram /> Telegram
              </a>
            )}
          </div>
        </div>

        <div className="reveal in-view reveal-d2">
          <LeadForm dict={dict} content={content} locale={locale} source="contact-page" />
        </div>
      </div>
    </section>
  );
}
