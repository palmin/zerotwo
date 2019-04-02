import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Settings from './views/Settings.vue';
import Watching from './views/Watching.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/watching',
      name: 'Watching',
      component: Watching,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
  ],
});
