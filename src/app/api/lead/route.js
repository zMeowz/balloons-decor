import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase';

export const runtime = 'nodejs';

function clean(str, max = 800) {
  return String(str || '').trim().slice(0, max);
}

async function sendTelegram({ name, phone, date, message, locale, source }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

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

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
  return res.ok;
}

async function saveToDb(lead) {
  const supabase = getAdminClient();
  if (!supabase) return false;
  const { error } = await supabase.from('leads').insert({
    name: lead.name,
    phone: lead.phone,
    event_date: lead.date || null,
    message: lead.message || null,
    locale: lead.locale || null,
    source: lead.source || null,
    status: 'new',
  });
  return !error;
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

  // Обовʼязкові поля
  if (!lead.name || !lead.phone) {
    return NextResponse.json({ ok: false, error: 'required' }, { status: 400 });
  }
  // Проста перевірка телефону (мінімум цифр)
  const digits = (lead.phone.match(/\d/g) || []).length;
  if (digits < 7) {
    return NextResponse.json({ ok: false, error: 'phone' }, { status: 400 });
  }

  // Надсилаємо паралельно; помилка одного каналу не має валити заявку
  const [tg, db] = await Promise.allSettled([sendTelegram(lead), saveToDb(lead)]);
  const tgOk = tg.status === 'fulfilled' && tg.value;
  const dbOk = db.status === 'fulfilled' && db.value;

  if (!tgOk && !dbOk) {
    // Нічого не налаштовано (демо-режим) — не показуємо помилку користувачу,
    // але й не втрачаємо факт: лишаємо запис у логах сервера.
    console.warn('[lead] Ні Telegram, ні Supabase не налаштовані. Заявка:', lead);
  }

  return NextResponse.json({ ok: true });
}
