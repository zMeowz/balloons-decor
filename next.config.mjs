/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Дозволяємо картинки, завантажені в Supabase Storage.
    // ВАЖЛИВО: після створення проєкту Supabase заміни хост нижче на свій
    // (він виглядає як xxxxxxxx.supabase.co) або додай свій через змінні оточення.
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: '*.supabase.in' },
    ],
  },
};

export default nextConfig;
