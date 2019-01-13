import Vue from 'vue';
import VueI18n from 'vue-i18n';

import ar from '@/assets/locales/ar';
import de from '@/assets/locales/de';
import en from '@/assets/locales/en';
import ja from '@/assets/locales/ja';
import zh from '@/assets/locales/zh';

Vue.use(VueI18n);

const messages = {
  ar,
  de,
  en,
  ja,
  zh,
  'zh-cn': zh,
};

const i18n = new VueI18n({
  fallbackLocale: 'en',
  messages,
});

export { i18n };
export { default as store } from './store';
