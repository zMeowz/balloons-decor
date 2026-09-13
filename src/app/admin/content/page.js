import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getContent } from '@/lib/data';
import { getAdminClient } from '@/lib/supabase';
import AdminShell from '@/components/admin/AdminShell';
import { saveContent } from '../actions';

export const dynamic = 'force-dynamic';

export default async function AdminContent() {
  if (!isAuthenticated()) redirect('/admin/login');
  const content = await getContent();
  const configured = Boolean(getAdminClient());

  return (
    <AdminShell>
      <h1 className="adm__title">Контакти</h1>
      <p className="adm__sub">Ці дані показуються у шапці, підвалі, формі та кнопці WhatsApp.</p>

      {!configured && (
        <div className="adm__warn">Підключи Supabase (див. <code>SETUP.md</code>), щоб зберігати зміни контактів.</div>
      )}

      <div className="adm-panel">
        <form action={saveContent}>
          <div className="adm-row">
            <div className="adm-field">
              <label>Телефон (як показувати)</label>
              <input type="text" name="phone" defaultValue={content.phone || ''} placeholder="+38 (099) 354 60 48" />
            </div>
            <div className="adm-field">
              <label>Телефон для посилань (лише цифри)</label>
              <input type="text" name="phone_raw" defaultValue={content.phone_raw || ''} placeholder="380993546048" />
            </div>
          </div>
          <div className="adm-field">
            <label>Instagram (повне посилання)</label>
            <input type="url" name="instagram" defaultValue={content.instagram || ''} placeholder="https://www.instagram.com/balloons_decor_zp/" />
          </div>
          <div className="adm-field">
            <label>Telegram (повне посилання)</label>
            <input type="url" name="telegram" defaultValue={content.telegram || ''} placeholder="https://t.me/username" />
          </div>
          <div className="adm-field">
            <label>Email (необовʼязково)</label>
            <input type="email" name="email" defaultValue={content.email || ''} placeholder="hello@balloonsdecor.com.ua" />
          </div>
          <button className="adm-btn" type="submit">Зберегти</button>
        </form>
      </div>
    </AdminShell>
  );
}
