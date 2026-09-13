import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated } from '@/lib/auth';
import { getAdminClient, isSupabaseConfigured } from '@/lib/supabase';
import AdminShell from '@/components/admin/AdminShell';

export const dynamic = 'force-dynamic';

async function getCounts() {
  const supabase = getAdminClient();
  if (!supabase) return null;
  const [works, prices, leads, newLeads] = await Promise.all([
    supabase.from('works').select('*', { count: 'exact', head: true }),
    supabase.from('prices').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
  ]);
  return {
    works: works.count ?? 0,
    prices: prices.count ?? 0,
    leads: leads.count ?? 0,
    newLeads: newLeads.count ?? 0,
  };
}

export default async function AdminDashboard() {
  if (!isAuthenticated()) redirect('/admin/login');

  const configured = isSupabaseConfigured() && Boolean(getAdminClient());
  let counts = null;
  try {
    counts = await getCounts();
  } catch {
    counts = null;
  }

  return (
    <AdminShell>
      <h1 className="adm__title">Вітаю! 👋</h1>
      <p className="adm__sub">Тут ти керуєш сайтом Balloons Decor: додаєш роботи, ціни й бачиш заявки.</p>

      {!configured && (
        <div className="adm__warn">
          <strong>Supabase ще не підключено.</strong><br />
          Зараз сайт показує демо-контент. Щоб керувати роботами й цінами та отримувати заявки,
          додай ключі Supabase у змінні оточення (файл <code>.env.local</code> локально або
          Environment Variables у Vercel). Покроково — у файлі <code>README.md</code> та <code>SETUP.md</code>.
        </div>
      )}

      {configured && counts && (
        <div className="adm__cards">
          <div className="adm__card"><strong>{counts.works}</strong><span>Роботи</span></div>
          <div className="adm__card"><strong>{counts.prices}</strong><span>Ціни</span></div>
          <div className="adm__card"><strong>{counts.leads}</strong><span>Усього заявок</span></div>
          <div className="adm__card"><strong>{counts.newLeads}</strong><span>Нові заявки</span></div>
        </div>
      )}

      <div className="adm-panel">
        <h2>Швидкі дії</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/admin/works" className="adm-btn">➕ Додати роботу</Link>
          <Link href="/admin/prices" className="adm-btn adm-btn--ghost">💰 Змінити ціни</Link>
          <Link href="/admin/leads" className="adm-btn adm-btn--ghost">📩 Переглянути заявки</Link>
        </div>
      </div>
    </AdminShell>
  );
}
