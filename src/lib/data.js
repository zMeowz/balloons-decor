import { getPublicClient, isSupabaseConfigured } from './supabase';
import { seedWorks, seedPrices, seedContent } from './seed';

// Гарантуємо, що у кожної роботи є масив фото (images).
function withImages(list) {
  return (list || []).map((w) => ({
    ...w,
    images: Array.isArray(w.images) && w.images.length ? w.images : [w.image_url].filter(Boolean),
  }));
}

// Усі функції мають «підстраховку»: якщо Supabase не налаштований або сталася
// помилка — повертаємо демо-дані, щоб сайт ніколи не «падав» порожнім.

export async function getWorks({ onlyFeatured = false, category = null } = {}) {
  if (!isSupabaseConfigured()) {
    return filterSeedWorks(onlyFeatured, category);
  }
  try {
    const supabase = getPublicClient();
    let query = supabase
      .from('works')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (onlyFeatured) query = query.eq('featured', true);
    if (category && category !== 'all') query = query.eq('category', category);

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return filterSeedWorks(onlyFeatured, category);
    }
    return withImages(data);
  } catch {
    return filterSeedWorks(onlyFeatured, category);
  }
}

function filterSeedWorks(onlyFeatured, category) {
  let list = [...seedWorks];
  if (onlyFeatured) list = list.filter((w) => w.featured);
  if (category && category !== 'all') list = list.filter((w) => w.category === category);
  return withImages(list);
}

export async function getPrices() {
  if (!isSupabaseConfigured()) return seedPrices;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase
      .from('prices')
      .select('*')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    if (error || !data || data.length === 0) return seedPrices;
    return data;
  } catch {
    return seedPrices;
  }
}

export async function getContent() {
  if (!isSupabaseConfigured()) return seedContent;
  try {
    const supabase = getPublicClient();
    const { data, error } = await supabase.from('content').select('key, value');
    if (error || !data || data.length === 0) return seedContent;
    const map = { ...seedContent };
    for (const row of data) {
      if (row.value) map[row.key] = row.value;
    }
    return map;
  } catch {
    return seedContent;
  }
}
