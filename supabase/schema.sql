-- ============================================================
--  Balloons Decor ZP — схема бази даних для Supabase
--  Як застосувати:
--  1) Створи проєкт на supabase.com
--  2) Відкрий SQL Editor → New query
--  3) Встав увесь цей файл і натисни RUN
--  4) У Storage створи публічний bucket з назвою "works"
-- ============================================================

-- Розширення для генерації id
create extension if not exists "pgcrypto";

-- ---------- РОБОТИ (портфоліо) ----------
create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title_uk text not null default '',
  title_ru text not null default '',
  description_uk text default '',
  description_ru text default '',
  image_url text not null,
  images text[] default '{}',
  category text default 'other',
  featured boolean default true,
  published boolean default true,
  sort_order int default 100
);

-- ---------- ЦІНИ ----------
create table if not exists public.prices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name_uk text not null default '',
  name_ru text not null default '',
  description_uk text default '',
  description_ru text default '',
  unit_uk text default '',
  unit_ru text default '',
  price_from numeric not null default 0,
  published boolean default true,
  sort_order int default 100
);

-- ---------- КОНТЕНТ (контакти тощо) ----------
create table if not exists public.content (
  key text primary key,
  value text default ''
);

-- ---------- ЗАЯВКИ ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  phone text not null,
  event_date text,
  message text,
  locale text,
  source text,
  status text default 'new'
);

-- ============================================================
--  БЕЗПЕКА (Row Level Security)
--  Увімкнено RLS. Публіці дозволяємо ТІЛЬКИ читати опубліковане.
--  Запис/редагування робить сервер через service_role (обходить RLS).
-- ============================================================
alter table public.works enable row level security;
alter table public.prices enable row level security;
alter table public.content enable row level security;
alter table public.leads enable row level security;

-- Публічне читання опублікованих робіт і цін
drop policy if exists "public read works" on public.works;
create policy "public read works" on public.works
  for select using (published = true);

drop policy if exists "public read prices" on public.prices;
create policy "public read prices" on public.prices
  for select using (published = true);

drop policy if exists "public read content" on public.content;
create policy "public read content" on public.content
  for select using (true);

-- Заявки: НЕ читаються публічно (тільки сервер через service_role).
-- Політик на select для anon навмисно немає.

-- ============================================================
--  Демо-дані (можна видалити або лишити для старту)
-- ============================================================
insert into public.content (key, value) values
  ('phone', '+38 (099) 354 60 48'),
  ('phone_raw', '380993546048'),
  ('instagram', 'https://www.instagram.com/balloons_decor_zp/'),
  ('telegram', 'https://t.me/balloons_decor_zp'),
  ('email', '')
on conflict (key) do nothing;

insert into public.prices (name_uk, name_ru, description_uk, description_ru, unit_uk, unit_ru, price_from, sort_order) values
  ('Гелієві кульки', 'Гелиевые шары', 'Букети та композиції', 'Букеты и композиции', 'за композицію', 'за композицию', 2500, 1),
  ('Декор дому / виписка', 'Декор дома / выписка', 'Оформлення кімнати', 'Оформление комнаты', 'за оформлення', 'за оформление', 3500, 2),
  ('Фотозона під ключ', 'Фотозона под ключ', 'Повне оформлення простору', 'Полное оформление пространства', 'за фотозону', 'за фотозону', 6000, 3),
  ('Оформлення залу', 'Оформление зала', 'Весілля, ювілеї, корпоративи', 'Свадьбы, юбилеи, корпоративы', 'за захід', 'за мероприятие', 9000, 4)
on conflict do nothing;

-- ============================================================
--  СХОВИЩЕ ФОТО
--  Після RUN зайди у Storage і створи PUBLIC bucket "works".
--  (Або розкоментуй рядок нижче — інколи потрібні права.)
-- ============================================================
-- insert into storage.buckets (id, name, public) values ('works', 'works', true) on conflict do nothing;
