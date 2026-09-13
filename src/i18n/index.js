import uk from './dictionaries/uk';
import ru from './dictionaries/ru';
import { defaultLocale } from './config';

const dictionaries = { uk, ru };

// Повертає словник для потрібної мови (з підстраховкою на основну мову).
export function getDictionary(locale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}
