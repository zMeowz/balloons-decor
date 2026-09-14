import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getPublicClient } from '@/lib/supabase';
import { getWorks } from '@/lib/data';

// ТИМЧАСОВИЙ діагностичний маршрут — перевірити, звідки беруться роботи.
// Видалити після діагностики.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const out = { configured: isSupabaseConfigured() };

  // Перевіряємо, чи реально віддається статична демо-картинка на цьому домені.
  try {
    const host = request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const imgUrl = `${proto}://${host}/works/gallery-4.jpg`;
    out.imageUrlTested = imgUrl;
    const r = await fetch(imgUrl, { cache: 'no-store' });
    out.imageStatus = r.status;
    out.imageContentType = r.headers.get('content-type');
    out.imageBytes = r.headers.get('content-length');
  } catch (e) {
    out.imageFetchError = String(e?.message || e);
  }

  try {
    const works = await getWorks();
    out.worksReturned = works.length;
    out.firstImage = works[0]?.image_url || null;
    out.source = works[0]?.image_url?.startsWith('/works/') ? 'seed (demo)' : 'database';
  } catch (e) {
    out.getWorksError = String(e?.message || e);
  }

  if (out.configured) {
    try {
      const sb = getPublicClient();
      const { data, error, count } = await sb
        .from('works')
        .select('id, image_url, published', { count: 'exact' })
        .limit(3);
      out.dbError = error ? error.message || String(error) : null;
      out.dbTotalRows = count;
      out.dbSample = (data || []).map((r) => ({ id: r.id, published: r.published, image_url: r.image_url }));
    } catch (e) {
      out.dbException = String(e?.message || e);
    }
  }

  return NextResponse.json(out);
}
