import { RouteConfig } from 'vue-router';
import { AniListListStatus } from '@/modules/AniList/types';
import AniList from '@/views/AniList/AniList.vue';
import DetailView from '@/views/AniList/DetailView.vue';
import Home from '@/views/AniList/Home.vue';
import SeasonPreview from '@/views/AniList/SeasonPreview.vue';

const routes: RouteConfig[] = [{
  path: '/aniList',
  name: 'Home',
  component: Home,
  meta: {
    refreshablePage: true,
    routeName: 'aniList',
  },
},
{
  path: '/aniList/watching',
  name: 'Watching',
  component: AniList,
  meta: {
    refreshablePage: true,
    searchablePage: true,
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
    refreshablePage: true,
    searchablePage: true,
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
    refreshablePage: true,
    searchablePage: true,
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
    refreshablePage: true,
    searchablePage: true,
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
    refreshablePage: true,
    searchablePage: true,
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
    refreshablePage: true,
    searchablePage: true,
    sortingPage: true,
    routeName: 'aniList',
    status: AniListListStatus.PAUSED,
  },
}, {
  path: '/season-preview',
  name: 'SeasonPreview',
  component: SeasonPreview,
  meta: {
    searchablePage: true,
    sortingPage: true,
    routeName: 'seasonPreview',
  },
}, {
  path: '/detail-view/{id}',
  name: 'DetailView',
  component: DetailView,
  meta: {
    routeName: 'detailView',
    mediaPage: true,
  },
}];

export default routes;
