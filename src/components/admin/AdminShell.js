'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/app/admin/admin.css';

const NAV = [
  { href: '/admin', label: '📊 Огляд' },
  { href: '/admin/works', label: '🖼️ Роботи' },
  { href: '/admin/prices', label: '💰 Ціни' },
  { href: '/admin/leads', label: '📩 Заявки' },
  { href: '/admin/content', label: '⚙️ Контакти' },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const isActive = (href) => (href === '/admin' ? pathname === '/admin' : pathname.startsWith(href));

  return (
    <div className="adm">
      <aside className="adm__aside">
        <div className="adm__brand">🎈 Balloons Decor</div>
        {NAV.map((n) => (
          <Link key={n.href} href={n.href} className={`adm__navlink ${isActive(n.href) ? 'active' : ''}`}>
            {n.label}
          </Link>
        ))}
        <div className="adm__logout">
          <form action="/api/admin/logout" method="post">
            <button type="submit">Вийти</button>
          </form>
        </div>
      </aside>
      <main className="adm__main">{children}</main>
    </div>
  );
}
