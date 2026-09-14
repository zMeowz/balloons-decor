import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';
import AdminShell from '@/components/admin/AdminShell';
import { createWork, updateWork, deleteWork } from '../actions';

export const dynamic = 'force-dynamic';

const CATEGORIES = [
  ['birthday', 'Дні народження'],
  ['baby', 'Baby shower'],
  ['wedding', 'Весілля'],
  ['firstYear', 'Перший рочок'],
  ['corporate', 'Корпоративи'],
  ['other', 'Інше'],
];

async function getWorks() {
  const supabase = getAdminClient();
  if (!supabase) return null;
  const { data } = await supabase.from('works').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
  return data || [];
}

export default async function AdminWorks() {
  if (!isAuthenticated()) redirect('/admin/login');
  const works = await getWorks();

  return (
    <AdminShell>
      <h1 className="adm__title">Роботи</h1>
      <p className="adm__sub">Додавай фото своїх оформлень — вони одразу зʼявляться на сайті та в портфоліо.</p>

      {works === null && (
        <div className="adm__warn">
          Спочатку підключи Supabase (див. <code>SETUP.md</code>), щоб додавати роботи.
        </div>
      )}

      <div className="adm-panel">
        <h2>➕ Нова робота</h2>
        <form action={createWork}>
          <div className="adm-field">
            <label>Фото (завантаж файл)</label>
            <input type="file" name="image" accept="image/*" />
          </div>
          <div className="adm-field">
            <label>…або посилання на головне фото (якщо файл не завантажуєш)</label>
            <input type="url" name="image_url" placeholder="https://..." />
          </div>
          <div className="adm-field">
            <label>Додаткові фото — по одному посиланню на рядок (щоб гортати в галереї)</label>
            <textarea name="extra_images" rows={3} placeholder={'https://...\nhttps://...'} />
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Назва (укр)</label>
              <input type="text" name="title_uk" placeholder="Ніжна арка для першого рочка" required />
            </div>
            <div className="adm-field">
              <label>Назва (рус)</label>
              <input type="text" name="title_ru" placeholder="Нежная арка для первого годика" />
            </div>
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Опис (укр)</label>
              <input type="text" name="description_uk" placeholder="Пастельні відтінки, бабоки" />
            </div>
            <div className="adm-field">
              <label>Опис (рус)</label>
              <input type="text" name="description_ru" placeholder="Пастельные оттенки, бабочки" />
            </div>
          </div>
          <div className="adm-row">
            <div className="adm-field">
              <label>Категорія</label>
              <select name="category" defaultValue="birthday">
                {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div className="adm-field">
              <label>Порядок (менше = вище)</label>
              <input type="number" name="sort_order" defaultValue={10} />
            </div>
          </div>
          <div className="adm-field">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input type="checkbox" name="featured" defaultChecked style={{ width: 'auto' }} />
              Показувати на головній сторінці
            </label>
          </div>
          <button className="adm-btn" type="submit">Зберегти роботу</button>
        </form>
      </div>

      {works && works.length > 0 && (
        <div className="adm-panel">
          <h2>Усі роботи ({works.length})</h2>
          <div className="adm-list">
            {works.map((w) => (
              <details className="adm-edit" key={w.id}>
                <summary>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.image_url} alt={w.title_uk} className="adm-edit__thumb" />
                  <span className="adm-edit__title">
                    {w.title_uk}{' '}
                    <span className="adm-badge">{w.category}</span>{' '}
                    {w.featured && <span className="adm-badge">на головній</span>}
                  </span>
                  <span className="adm-edit__hint">Редагувати ✎</span>
                </summary>
                <form action={updateWork} className="adm-edit__form">
                  <input type="hidden" name="id" value={w.id} />
                  <div className="adm-row">
                    <div className="adm-field"><label>Назва (укр)</label><input name="title_uk" defaultValue={w.title_uk} /></div>
                    <div className="adm-field"><label>Назва (рус)</label><input name="title_ru" defaultValue={w.title_ru || ''} /></div>
                  </div>
                  <div className="adm-row">
                    <div className="adm-field"><label>Опис (укр)</label><input name="description_uk" defaultValue={w.description_uk || ''} /></div>
                    <div className="adm-field"><label>Опис (рус)</label><input name="description_ru" defaultValue={w.description_ru || ''} /></div>
                  </div>
                  <div className="adm-row">
                    <div className="adm-field">
                      <label>Категорія</label>
                      <select name="category" defaultValue={w.category || 'other'}>
                        {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                      </select>
                    </div>
                    <div className="adm-field"><label>Порядок</label><input type="number" name="sort_order" defaultValue={w.sort_order} /></div>
                  </div>
                  <div className="adm-field">
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <input type="checkbox" name="featured" defaultChecked={w.featured} style={{ width: 'auto' }} />
                      Показувати на головній
                    </label>
                  </div>
                  <div className="adm-field">
                    <label>Замінити головне фото (необовʼязково)</label>
                    <input type="file" name="image" accept="image/*" />
                  </div>
                  <button className="adm-btn" type="submit">Зберегти зміни</button>
                </form>
                <form action={deleteWork} className="adm-edit__delete">
                  <input type="hidden" name="id" value={w.id} />
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
