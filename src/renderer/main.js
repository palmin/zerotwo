import Vue from 'vue';
import VueNotification from 'vue-notification';
import Vuetify from 'vuetify';
import VueElectron from 'vue-electron';
import 'vuetify/dist/vuetify.min.css';

import api from '@/modules/api';
import { i18n } from '@/modules/i18n';
import { init as initAuth } from '@/modules/aniList';
import '@/assets/fontawesome/css/fontawesome-all.css';

import store from './store';
import App from './App';
import router from './router';
import getDate from './plugins/getDate';

Vue.http = Vue.prototype.$http = api;
Vue.config.productionTip = false;

Vue.use(VueElectron);
Vue.use(VueNotification);
Vue.use(getDate);
Vue.use(Vuetify, {
  iconfont: 'fa',
  lang: { t: (key, ...params) => i18n.t(key, params) },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  ...App,
});

initAuth(store);

/* Enable webpack hot reloading */
if (module.hot) {
  module.hot.accept();
}
