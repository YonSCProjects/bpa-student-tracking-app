import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';
import he from './he';

const i18n = new I18n({
  he,
});

// Set fallback locale
i18n.defaultLocale = 'he';
i18n.locale = 'he';

// Enable fallbacks
i18n.enableFallback = true;

// Configure to use Hebrew as primary language
i18n.locale = 'he';

export default i18n;

export const t = (key: string, options?: any): string => {
  return i18n.t(key, options);
};
