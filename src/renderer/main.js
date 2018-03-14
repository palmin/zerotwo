import Vue from 'vue';
import VueI18n from 'vue-i18n';
import 'semantic-ui/dist/semantic.min.css';
import 'semantic-ui/dist/semantic.min';
import api from '@/modules/api';
import App from './App';
import router from './router';
import store from './store';
import getDate from './plugins/getDate';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = api;
Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(getDate);

const i18n = new VueI18n({
  fallbackLocale: 'en',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  ...App,
});
