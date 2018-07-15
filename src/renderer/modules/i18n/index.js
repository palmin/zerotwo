import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  de: require('@/assets/locales/de.json'),
  en: require('@/assets/locales/en.json'),
  ja: require('@/assets/locales/ja.json'),
  'zh-cn': require('@/assets/locales/zh-cn.json'),
};

const i18n = new VueI18n({
  fallbackLocale: 'en',
  messages,
});

export { i18n };
export { default as store } from './store';
