import Vue from 'vue';
import Vuetify from 'vuetify';

// Components
import App from './App';
import { i18n } from './i18n';
import router from './router';
import { store } from './store';

// Styles & Fonts
import '@/assets/scss/extra.scss';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
  iconfont: 'mdi',
  lang: { t: (key: string, ...params: any) => i18n.t(key, params) },
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
