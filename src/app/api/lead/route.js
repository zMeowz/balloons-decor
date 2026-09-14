import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

function clean(str, max = 800) {
  return String(str || '').trim().slice(0, max);
}

// Повертає null при успіху або рядок-причину помилки.
async function sendTelegram({ name, phone, date, message, locale, source }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return 'not_configured';

  const lines = [
    '🎈 <b>Нова заявка з сайту!</b>',
    '',
    `👤 <b>Імʼя:</b> ${name}`,
    `📞 <b>Телефон:</b> ${phone}`,
    date ? `📅 <b>Дата події:</b> ${date}` : null,
    message ? `💬 <b>Деталі:</b> ${message}` : null,
    '',
    `🌐 Мова: ${locale || '-'} · Джерело: ${source || '-'}`,
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
    });
    if (res.ok) return null;
    const j = await res.json().catch(() => ({}));
    return 'tg_error: ' + (j.description || res.status);
  } catch (e) {
    return 'tg_fetch_error: ' + e.message;
  }
}

async function saveToDb(lead) {
  const supabase = getAdminClient();
  if (!supabase) return 'no_service_role';
  const { error } = await supabase.from('leads').insert({
    name: lead.name,
    phone: lead.phone,
    event_date: lead.date || null,
    message: lead.message || null,
    locale: lead.locale || null,
    source: lead.source || null,
    status: 'new',
  });
  return error ? 'db_error: ' + error.message : null;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const lead = {
    name: clean(body.name, 120),
    phone: clean(body.phone, 40),
    date: clean(body.date, 40),
    message: clean(body.message, 1500),
    locale: clean(body.locale, 5),
    source: clean(body.source, 40),
  };

  if (!lead.name || !lead.phone) {
    return NextResponse.json({ ok: false, error: 'required' }, { status: 400 });
  }
  const digits = (lead.phone.match(/\d/g) || []).length;
  if (digits < 7) {
    return NextResponse.json({ ok: false, error: 'phone' }, { status: 400 });
  }

  const [tgR, dbR] = await Promise.allSettled([sendTelegram(lead), saveToDb(lead)]);
  const tgErr = tgR.status === 'fulfilled' ? tgR.value : 'tg_throw: ' + tgR.reason;
  const dbErr = dbR.status === 'fulfilled' ? dbR.value : 'db_throw: ' + dbR.reason;
  const tgOk = tgErr === null;
  const dbOk = dbErr === null;

  // Заявка прийнята, якщо спрацював хоча б один канал (база або Telegram).
  if (!tgOk && !dbOk) {
    console.warn('[lead] delivery failed:', { tgErr, dbErr });
    return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
