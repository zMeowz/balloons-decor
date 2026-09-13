import { notFound } from 'next/navigation';
import { locales, isValidLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { getContent } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import Parallax from '@/components/Parallax';
import { IconWhatsapp } from '@/components/icons';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://balloonsdecor.com.ua';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = params;
  const dict = getDictionary(locale);
  const isUk = locale === 'uk';
  const title = isUk
    ? 'Balloons Decor ZP — преміальні фотозони та декор у Запоріжжі'
    : 'Balloons Decor ZP — премиальные фотозоны и декор в Запорожье';
  const description = isUk
    ? 'Стильні фотозони під ключ, гелієві кульки та авторський декор свят у Запоріжжі. Створюємо емоції, у які віриш.'
    : 'Стильные фотозоны под ключ, гелиевые шары и авторский декор праздников в Запорожье. Создаём эмоции, в которые веришь.';

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${dict.brand.name}` },
    description,
    keywords: isUk
      ? ['фотозона Запоріжжя', 'кульки Запоріжжя', 'декор свята', 'оформлення кульками', 'гелієві кульки']
      : ['фотозона Запорожье', 'шары Запорожье', 'декор праздника', 'оформление шарами', 'гелиевые шары'],
    alternates: {
      canonical: `/${locale}`,
      languages: { uk: '/uk', ru: '/ru' },
    },
    openGraph: {
      type: 'website',
      locale: isUk ? 'uk_UA' : 'ru_RU',
      url: `${SITE_URL}/${locale}`,
      title,
      description,
      siteName: dict.brand.name,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = params;
  if (!isValidLocale(locale)) notFound();

  const dict = getDictionary(locale);
  const content = await getContent();

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main>{children}</main>
      <Footer locale={locale} dict={dict} content={content} />

      {content.phone_raw && (
        <a
          className="float-cta"
          href={`https://wa.me/${content.phone_raw}`}
          target="_blank"
          rel="noopener"
          aria-label="WhatsApp"
        >
          <IconWhatsapp />
          <span>{dict.nav.order}</span>
        </a>
      )}

      <ScrollReveal />
      <Parallax />
    </>
  );
}
