import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';
import AdminShell from '@/components/admin/AdminShell';
import { createPrice, updatePrice, deletePrice } from '../actions';

export const dynamic = 'force-dynamic';

async function getPrices() {
  const supabase = getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from('prices').select('*').order('sort_order', { ascending: true });
  return data || [];
}

export default async function AdminPrices() {
  if (!isAuthenticated()) redirect('/admin/login');
  const prices = await getPrices();

  return (
    <AdminShell>
      <h1 className="adm__title">Ціни</h1>
      <p className="adm__sub">Керуй прайсом фотозон і послуг. Ціни оновлюються на сайті автоматично.</p>

      {prices === null && (
        <div className="adm__warn">Підключи Supabase (див. <code>SETUP.md</code>), щоб керувати цінами.</div>
      )}

      <div className="adm-panel">
        <h2>➕ Нова послуга / ціна</h2>
        <form action={createPrice}>
          <div className="adm-row">
            <div className="adm-field">
              <label>Назва (укр)</label>
              <input type="text" name="name_uk" placeholder="Фотозона під ключ" required />
            </div>
            <div className="adm-field">
              <label>Назва (рус)</label>
              <input type="text" name="name_ru" placeholder="Фотозона под ключ" />
            </div>
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Опис (укр)</label>
              <input type="text" name="description_uk" placeholder="Повне оформлення простору" />
            </div>
            <div className="adm-field">
              <label>Опис (рус)</label>
              <input type="text" name="description_ru" placeholder="Полное оформление пространства" />
            </div>
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Ціна від (грн)</label>
              <input type="number" name="price_from" placeholder="6000" required />
            </div>
            <div className="adm-field">
              <label>Порядок</label>
              <input type="number" name="sort_order" defaultValue={10} />
            </div>
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Одиниця (укр)</label>
              <input type="text" name="unit_uk" placeholder="за фотозону" />
            </div>
            <div className="adm-field">
              <label>Одиниця (рус)</label>
              <input type="text" name="unit_ru" placeholder="за фотозону" />
            </div>
          </div>
          <button className="adm-btn" type="submit">Зберегти</button>
        </form>
      </div>

      {prices && prices.length > 0 && (
        <div className="adm-panel">
          <h2>Прайс ({prices.length})</h2>
          <div className="adm-list">
            {prices.map((p) => (
              <details className="adm-edit" key={p.id}>
                <summary>
                  <span className="adm-edit__title">{p.name_uk} — від {Number(p.price_from).toLocaleString('uk-UA')} грн</span>
                  <span className="adm-edit__hint">Редагувати ✎</span>
                </summary>
                <form action={updatePrice} className="adm-edit__form">
                  <input type="hidden" name="id" value={p.id} />
                  <div className="adm-row">
                    <div className="adm-field"><label>Назва (укр)</label><input name="name_uk" defaultValue={p.name_uk} /></div>
                    <div className="adm-field"><label>Назва (рус)</label><input name="name_ru" defaultValue={p.name_ru} /></div>
                  </div>
                  <div className="adm-row">
                    <div className="adm-field"><label>Опис (укр)</label><input name="description_uk" defaultValue={p.description_uk || ''} /></div>
                    <div className="adm-field"><label>Опис (рус)</label><input name="description_ru" defaultValue={p.description_ru || ''} /></div>
                  </div>
                  <div className="adm-row">
                    <div className="adm-field"><label>Ціна від (грн)</label><input type="number" name="price_from" defaultValue={p.price_from} /></div>
                    <div className="adm-field"><label>Порядок</label><input type="number" name="sort_order" defaultValue={p.sort_order} /></div>
                  </div>
                  <div className="adm-row">
                    <div className="adm-field"><label>Одиниця (укр)</label><input name="unit_uk" defaultValue={p.unit_uk || ''} /></div>
                    <div className="adm-field"><label>Одиниця (рус)</label><input name="unit_ru" defaultValue={p.unit_ru || ''} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="adm-btn" type="submit">Зберегти зміни</button>
                  </div>
                </form>
                <form action={deletePrice} className="adm-edit__delete">
                  <input type="hidden" name="id" value={p.id} />
                  <button className="adm-btn adm-btn--danger" type="submit">Видалити</button>
                </form>
              </details>
            ))}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
