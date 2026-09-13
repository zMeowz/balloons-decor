import { getDictionary } from '@/i18n';
import { getWorks } from '@/lib/data';
import WorksGrid from '@/components/WorksGrid';

export async function generateMetadata({ params }) {
  const dict = getDictionary(params.locale);
  return {
    title: dict.worksPage.title,
    description: dict.worksPage.text,
    alternates: { canonical: `/${params.locale}/works`, languages: { uk: '/uk/works', ru: '/ru/works' } },
  };
}

export default async function WorksPage({ params }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const works = await getWorks();

  return (
    <section className="section" style={{ paddingTop: 'clamp(120px, 16vw, 200px)' }}>
      <div className="container">
        <div className="section-head reveal in-view">
          <span className="eyebrow">{dict.worksPage.kicker}</span>
          <h2 style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)' }}>{dict.worksPage.title}</h2>
          <p>{dict.worksPage.text}</p>
        </div>
        <WorksGrid works={works} dict={dict} locale={locale} />
      </div>
    </section>
  );
}
