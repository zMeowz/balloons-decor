import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '80vh', display: 'grid', placeItems: 'center', textAlign: 'center', padding: '40px 20px',
    }}>
      <div>
        <div style={{ fontSize: 72 }}>🎈</div>
        <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: 'clamp(2rem, 6vw, 3.4rem)', margin: '10px 0' }}>
          Сторінку не знайдено
        </h1>
        <p style={{ color: 'var(--muted, #857e97)', maxWidth: 380, margin: '0 auto 26px' }}>
          Здається, ця кулька відлетіла. Повернімося на головну.
        </p>
        <Link href="/uk" className="btn btn--primary btn--lg">На головну</Link>
      </div>
    </div>
  );
}
