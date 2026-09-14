'use server';

import { revalidatePath } from 'next/cache';
import { isAuthenticated } from '@/lib/auth';
import { getAdminClient } from '@/lib/supabase';

function requireAuth() {
  if (!isAuthenticated()) throw new Error('Не авторизовано');
}

function db() {
  const client = getAdminClient();
  if (!client) {
    throw new Error(
      'Supabase не налаштований. Додай NEXT_PUBLIC_SUPABASE_URL та SUPABASE_SERVICE_ROLE_KEY у змінні оточення.'
    );
  }
  return client;
}

function refreshSite() {
  // Оновлюємо кеш публічного сайту, щоб зміни зʼявились одразу.
  revalidatePath('/', 'layout');
}

// Завантаження фото у Supabase Storage (bucket "works" має бути public).
async function uploadImage(formData) {
  const file = formData.get('image');
  const pastedUrl = (formData.get('image_url') || '').toString().trim();

  if (file && typeof file === 'object' && typeof file.arrayBuffer === 'function' && file.size > 0) {
    const supabase = db();
    const safeName = (file.name || 'photo').replace(/[^a-zA-Z0-9.]/g, '-');
    const filePath = `w-${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await supabase.storage.from('works').upload(filePath, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    });
    if (error) throw new Error('Не вдалося завантажити фото: ' + error.message);
    const { data } = supabase.storage.from('works').getPublicUrl(filePath);
    return data.publicUrl;
  }
  return pastedUrl || null;
}

/* ─────────────── РОБОТИ ─────────────── */

export async function createWork(formData) {
  requireAuth();
  const supabase = db();
  const image_url = await uploadImage(formData);
  if (!image_url) throw new Error('Додай фото або посилання на фото.');

  // Додаткові фото (по одному URL на рядок) — для гортання в галереї.
  const extra = (formData.get('extra_images') || '')
    .toString()
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  const images = [image_url, ...extra];

  const { error } = await supabase.from('works').insert({
    title_uk: (formData.get('title_uk') || '').toString().trim(),
    title_ru: (formData.get('title_ru') || '').toString().trim(),
    description_uk: (formData.get('description_uk') || '').toString().trim(),
    description_ru: (formData.get('description_ru') || '').toString().trim(),
    category: (formData.get('category') || 'other').toString(),
    image_url,
    images,
    featured: formData.get('featured') === 'on',
    published: true,
    sort_order: Number(formData.get('sort_order') || 100),
  });
  if (error) throw new Error(error.message);
  refreshSite();
  revalidatePath('/admin/works');
}

export async function deleteWork(formData) {
  requireAuth();
  const id = formData.get('id');
  const { error } = await db().from('works').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refreshSite();
  revalidatePath('/admin/works');
}

export async function toggleWorkFeatured(formData) {
  requireAuth();
  const id = formData.get('id');
  const featured = formData.get('featured') === 'true';
  const { error } = await db().from('works').update({ featured: !featured }).eq('id', id);
  if (error) throw new Error(error.message);
  refreshSite();
  revalidatePath('/admin/works');
}

/* ─────────────── ЦІНИ ─────────────── */

export async function createPrice(formData) {
  requireAuth();
  const { error } = await db().from('prices').insert({
    name_uk: (formData.get('name_uk') || '').toString().trim(),
    name_ru: (formData.get('name_ru') || '').toString().trim(),
    description_uk: (formData.get('description_uk') || '').toString().trim(),
    description_ru: (formData.get('description_ru') || '').toString().trim(),
    unit_uk: (formData.get('unit_uk') || '').toString().trim(),
    unit_ru: (formData.get('unit_ru') || '').toString().trim(),
    price_from: Number(formData.get('price_from') || 0),
    published: true,
    sort_order: Number(formData.get('sort_order') || 100),
  });
  if (error) throw new Error(error.message);
  refreshSite();
  revalidatePath('/admin/prices');
}

export async function deletePrice(formData) {
  requireAuth();
  const id = formData.get('id');
  const { error } = await db().from('prices').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refreshSite();
  revalidatePath('/admin/prices');
}

/* ─────────────── КОНТАКТИ / КОНТЕНТ ─────────────── */

export async function saveContent(formData) {
  requireAuth();
  const supabase = db();
  const keys = ['phone', 'phone_raw', 'instagram', 'telegram', 'email'];
  const rows = keys.map((key) => ({ key, value: (formData.get(key) || '').toString().trim() }));
  const { error } = await supabase.from('content').upsert(rows, { onConflict: 'key' });
  if (error) throw new Error(error.message);
  refreshSite();
  revalidatePath('/admin/content');
}

/* ─────────────── ЗАЯВКИ ─────────────── */

export async function updateLeadStatus(formData) {
  requireAuth();
  const id = formData.get('id');
  const status = (formData.get('status') || 'new').toString();
  const { error } = await db().from('leads').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}

export async function deleteLead(formData) {
  requireAuth();
  const id = formData.get('id');
  const { error } = await db().from('leads').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/leads');
}
