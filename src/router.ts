import { AniListListStatus } from '@/modules/AniList/types';
import Vue from 'vue';
import Router from 'vue-router';
import AniList from './views/AniList.vue';
import Home from './views/Home.vue';
import SeasonPreview from './views/SeasonPreview.vue';
import Settings from './views/Settings.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/aniList',
      name: 'Home',
      component: Home,
      meta: {
        routeName: 'aniList',
      },
    },
    {
      path: '/aniList/watching',
      name: 'Watching',
      component: AniList,
      meta: {
        sortingPage: true,
        routeName: 'aniList',
        status: AniListListStatus.CURRENT,
      },
    },
    {
      path: '/aniList/repeating',
      name: 'Repeating',
      component: AniList,
      meta: {
        sortingPage: true,
        routeName: 'aniList',
        status: AniListListStatus.REPEATING,
      },
    },
    {
      path: '/aniList/completed',
      name: 'Completed',
      component: AniList,
      meta: {
        sortingPage: true,
        routeName: 'aniList',
        status: AniListListStatus.COMPLETED,
      },
    },
    {
      path: '/aniList/dropped',
      name: 'Dropped',
      component: AniList,
      meta: {
        sortingPage: true,
        routeName: 'aniList',
        status: AniListListStatus.DROPPED,
      },
    },
    {
      path: '/aniList/planning',
      name: 'Planning',
      component: AniList,
      meta: {
        sortingPage: true,
        routeName: 'aniList',
        status: AniListListStatus.PLANNING,
      },
    },
    {
      path: '/aniList/paused',
      name: 'Paused',
      component: AniList,
      meta: {
        sortingPage: true,
        routeName: 'aniList',
        status: AniListListStatus.PAUSED,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
      meta: {
        routeName: 'settings',
      },
    },
    {
      path: '/season-preview',
      name: 'SeasonPreview',
      component: SeasonPreview,
      meta: {
        sortingPage: true,
        routeName: 'seasonPreview',
      },
    },
    {
      path: '*',
      redirect: '/aniList',
    },
  ],
});
