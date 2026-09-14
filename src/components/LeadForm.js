'use client';

import { useEffect, useState } from 'react';

// Формат українського номера: 10 цифр (0XX XXX XX XX).
function formatUaPhone(digits) {
  const s = digits.slice(0, 10);
  return [s.slice(0, 3), s.slice(3, 6), s.slice(6, 8), s.slice(8, 10)].filter(Boolean).join(' ');
}

export default function LeadForm({ dict, content, locale, source = 'site' }) {
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error | required | phone
  const [form, setForm] = useState({ name: '', phone: '', date: '', message: '' });
  const [dateBounds, setDateBounds] = useState({ min: '', max: '' });

  // Обмеження дати: від сьогодні і не далі ніж +2 роки (без минулого і без «через 3 роки»).
  useEffect(() => {
    const pad = (n) => String(n).padStart(2, '0');
    const fmt = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const today = new Date();
    const max = new Date(today);
    max.setFullYear(max.getFullYear() + 2);
    setDateBounds({ min: fmt(today), max: fmt(max) });
  }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const onPhone = (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setForm((f) => ({ ...f, phone: digits }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setStatus('required'); return; }
    if (form.phone.length !== 10) { setStatus('phone'); return; }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          phone: '+38 ' + formatUaPhone(form.phone),
          locale,
          source,
        }),
      });
      if (!res.ok) throw new Error('bad response');
      setStatus('ok');
      setForm({ name: '', phone: '', date: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'ok') {
    return (
      <div className="form">
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: 52 }}>🎈</div>
          <h3 style={{ fontSize: '1.7rem', marginTop: 10 }}>{dict.form.successTitle}</h3>
          <p style={{ color: 'var(--ink-soft)', marginTop: 10 }}>{dict.form.successText}</p>
        </div>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="lf-name">{dict.form.name}</label>
        <input id="lf-name" type="text" value={form.name} onChange={update('name')} placeholder={dict.form.namePlaceholder} autoComplete="name" />
      </div>

      <div className="field field--row">
        <div>
          <label htmlFor="lf-phone">{dict.form.phone}</label>
          <div className="phone-field">
            <span className="phone-field__prefix">+38</span>
            <input
              id="lf-phone"
              type="tel"
              inputMode="numeric"
              value={formatUaPhone(form.phone)}
              onChange={onPhone}
              placeholder="0XX XXX XX XX"
              autoComplete="tel"
            />
          </div>
        </div>
        <div>
          <label htmlFor="lf-date">{dict.form.date}</label>
          <input id="lf-date" type="date" value={form.date} onChange={update('date')} min={dateBounds.min} max={dateBounds.max} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="lf-msg">{dict.form.message}</label>
        <textarea id="lf-msg" value={form.message} onChange={update('message')} placeholder={dict.form.messagePlaceholder} />
      </div>

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? dict.form.submitting : dict.form.submit}
      </button>

      {status === 'required' && <div className="form__status form__status--err">{dict.form.required}</div>}
      {status === 'phone' && <div className="form__status form__status--err">{dict.form.phoneInvalid}</div>}
      {status === 'error' && (
        <div className="form__status form__status--err">
          <strong>{dict.form.errorTitle}.</strong> {dict.form.errorText}
        </div>
      )}

      <p className="form__direct">
        {dict.form.orDirect}:{' '}
        {content.phone && <a href={`tel:${content.phone_raw ? '+' + content.phone_raw : content.phone}`}>{content.phone}</a>}
        {content.instagram && <> · <a href={content.instagram} target="_blank" rel="noopener">Instagram</a></>}
        {content.telegram && <> · <a href={content.telegram} target="_blank" rel="noopener">Telegram</a></>}
      </p>
    </form>
  );
}
