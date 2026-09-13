import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';
import AdminShell from '@/components/admin/AdminShell';
import { updateLeadStatus, deleteLead } from '../actions';

export const dynamic = 'force-dynamic';

const STATUSES = [
  ['new', '🆕 Нова'],
  ['in_progress', '⏳ В роботі'],
  ['done', '✅ Готово'],
  ['declined', '❌ Відмова'],
];

async function getLeads() {
  const supabase = getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200);
  return data || [];
}

function fmt(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleString('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return d;
  }
}

export default async function AdminLeads() {
  if (!isAuthenticated()) redirect('/admin/login');
  const leads = await getLeads();

  return (
    <AdminShell>
      <h1 className="adm__title">Заявки</h1>
      <p className="adm__sub">Усі заявки з форм сайту. Нові також миттєво приходять у Telegram.</p>

      {leads === null && (
        <div className="adm__warn">Підключи Supabase (див. <code>SETUP.md</code>), щоб зберігати історію заявок.</div>
      )}

      {leads && leads.length === 0 && (
        <div className="adm-panel"><p style={{ margin: 0, color: 'var(--a-muted)' }}>Заявок поки немає.</p></div>
      )}

      {leads && leads.length > 0 && (
        <div className="adm-list">
          {leads.map((l) => (
            <div className="adm-item" key={l.id} style={{ alignItems: 'flex-start' }}>
              <div className="adm-item__body">
                <h3>{l.name} · <a href={`tel:${l.phone}`} style={{ color: 'var(--a-violet)' }}>{l.phone}</a></h3>
                <p style={{ marginTop: 4 }}>
                  {l.event_date ? `📅 ${l.event_date} · ` : ''}{fmt(l.created_at)}
                  {l.source ? ` · ${l.source}` : ''}{l.locale ? ` · ${l.locale}` : ''}
                </p>
                {l.message && <p style={{ marginTop: 6, color: 'var(--a-text)' }}>💬 {l.message}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <form action={updateLeadStatus} style={{ display: 'flex', gap: 6 }}>
                  <input type="hidden" name="id" value={l.id} />
                  <select name="status" defaultValue={l.status || 'new'}>
                    {STATUSES.map(([v, lbl]) => <option key={v} value={v}>{lbl}</option>)}
                  </select>
                  <button className="adm-btn adm-btn--ghost" type="submit" style={{ padding: '8px 12px' }}>OK</button>
                </form>
                <form action={deleteLead}>
                  <input type="hidden" name="id" value={l.id} />
                  <button className="adm-btn adm-btn--danger" type="submit">Видалити</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
