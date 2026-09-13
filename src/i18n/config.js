// Налаштування мов сайту.
// Основна мова — українська. Друга — російська.
export const locales = ['uk', 'ru'];
export const defaultLocale = 'uk';

export function isValidLocale(locale) {
  return locales.includes(locale);
}
