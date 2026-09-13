'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../admin.css';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push('/admin');
        router.refresh();
      } else if (data.error === 'no_password_configured') {
        setError('Пароль адміна ще не налаштовано. Додай ADMIN_PASSWORD у змінні оточення.');
      } else {
        setError('Невірний пароль. Спробуй ще раз.');
      }
    } catch {
      setError('Помилка звʼязку. Спробуй ще раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="adm adm-login">
      <div className="adm-login__box">
        <h1>🎈 Адмін-панель</h1>
        <p>Balloons Decor ZP — вхід для власника</p>
        <form onSubmit={submit}>
          <div className="adm-field">
            <label htmlFor="pwd">Пароль</label>
            <input
              id="pwd"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
            />
          </div>
          {error && <div className="adm__warn" style={{ marginBottom: 16 }}>{error}</div>}
          <button className="adm-btn" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Входимо…' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  );
}
