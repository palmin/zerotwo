import AniList from '@/routes/AniList';
import Settings from '@/views/Settings.vue';
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    ...AniList,
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        routeName: 'settings',
      },
    },
    {
      path: '*',
      redirect: '/aniList',
    },
  ],
});
