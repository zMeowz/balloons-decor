import { NextResponse } from 'next/server';
import { isSupabaseConfigured, getPublicClient } from '@/lib/supabase';
import { getWorks } from '@/lib/data';

// ТИМЧАСОВИЙ діагностичний маршрут — перевірити, звідки беруться роботи.
// Видалити після діагностики.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const out = { configured: isSupabaseConfigured() };

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
