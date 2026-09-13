import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Чи налаштований Supabase взагалі? Якщо ні — сайт працює на демо-даних.
export function isSupabaseConfigured() {
  return Boolean(url && anonKey);
}

// Публічний клієнт (тільки читання того, що дозволено RLS). Для сторінок сайту.
export function getPublicClient() {
  if (!isSupabaseConfigured()) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false },
  });
}

// Серверний клієнт з повними правами (service_role). ТІЛЬКИ на сервері!
// Використовується в адмінці для запису/редагування/видалення.
export function getAdminClient() {
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
