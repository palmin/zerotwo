import Vue from 'vue';
import axios from 'axios';
import VueI18n from 'vue-i18n';
import semantic from 'semantic-ui/dist/semantic.min';
import 'semantic-ui/dist/semantic.min.css';

import App from './App';
import router from './router';
import store from './store';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.http = Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.use(VueI18n);

const i18n = new VueI18n({
  fallbackLocale: 'en',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  semantic,
  i18n,
  ...App,
});
