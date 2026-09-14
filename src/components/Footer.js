import Link from 'next/link';
import { IconInstagramColor, IconTelegramColor, IconViber, IconPhone, IconMapPin } from './icons';

export default function Footer({ locale, dict, content }) {
  const base = `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="brand__name" style={{ fontSize: '1.5rem' }}>Balloons Decor</span>
            <p className="footer__about">{dict.footer.about}</p>
            <div className="footer__social" style={{ marginTop: 20 }}>
              {content.instagram && (
                <a href={content.instagram} target="_blank" rel="noopener" aria-label="Instagram"><IconInstagramColor /></a>
              )}
              {content.telegram && (
                <a href={content.telegram} target="_blank" rel="noopener" aria-label="Telegram"><IconTelegramColor /></a>
              )}
              {content.phone_raw && (
                <a href={`viber://chat?number=%2B${content.phone_raw}`} aria-label="Viber"><IconViber /></a>
              )}
            </div>
          </div>

          <div>
            <h4>{dict.footer.nav}</h4>
            <div className="footer__links">
              <Link href={base}>{dict.nav.home}</Link>
              <Link href={`${base}/works`}>{dict.nav.works}</Link>
              <Link href={`${base}/about`}>{dict.nav.about}</Link>
              <Link href={`${base}/contact`}>{dict.nav.contact}</Link>
            </div>
          </div>

          <div>
            <h4>{dict.footer.contacts}</h4>
            <div className="footer__links">
              {content.phone && (
                <a href={`tel:${content.phone_raw ? '+' + content.phone_raw : content.phone}`} style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                  <IconPhone /> {content.phone}
                </a>
              )}
              <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
                <IconMapPin /> {dict.footer.workingArea}
              </span>
            </div>
          </div>

          <div>
            <h4>{dict.footer.social}</h4>
            <div className="footer__links">
              {content.instagram && <a href={content.instagram} target="_blank" rel="noopener">Instagram</a>}
              {content.telegram && <a href={content.telegram} target="_blank" rel="noopener">Telegram</a>}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} Balloons Decor {dict.brand.city}. {dict.footer.rights}</span>
          <span>{dict.footer.madeWith} 🎈</span>
        </div>
      </div>
    </footer>
  );
}
