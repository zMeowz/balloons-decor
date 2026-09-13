'use client';

import { useState } from 'react';

export default function LeadForm({ dict, content, locale, source = 'site' }) {
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error
  const [form, setForm] = useState({ name: '', phone: '', date: '', message: '' });

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus('required');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale, source }),
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
          <input id="lf-phone" type="tel" value={form.phone} onChange={update('phone')} placeholder={dict.form.phonePlaceholder} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="lf-date">{dict.form.date}</label>
          <input id="lf-date" type="date" value={form.date} onChange={update('date')} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="lf-msg">{dict.form.message}</label>
        <textarea id="lf-msg" value={form.message} onChange={update('message')} placeholder={dict.form.messagePlaceholder} />
      </div>

      <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={status === 'sending'}>
        {status === 'sending' ? dict.form.submitting : dict.form.submit}
      </button>

      {status === 'required' && (
        <div className="form__status form__status--err">{dict.form.required}</div>
      )}
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
