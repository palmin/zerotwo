import Vue from 'vue';
import Router from 'vue-router';
import { routes as Main } from '@/modules/main';

Vue.use(Router);

export default new Router({
  routes: [
    ...Main,
    {
      path: '*',
      redirect: '/',
    },
  ],
});
