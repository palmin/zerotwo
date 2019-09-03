import Vue from 'vue';
import Notification from 'vue-notification';
import Vuetify from 'vuetify';
import './registerServiceWorker';

// Components
import App from './App.vue';
import { i18n } from './i18n';
import router from './router';
import { store } from './store';

// Styles & Fonts
import '@/assets/scss/extra.scss';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
});

Vue.use(Notification);

Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  store,
  i18n,
  render: (h: any) => h(App),
}).$mount('#app');
