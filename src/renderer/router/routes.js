import Default from '@/layouts/Default';
import { routes as Home } from '@/modules/home';
import { routes as MyAnimeList } from '@/modules/myAnimeList';

export default [
  ...Home,
  ...MyAnimeList,
  {
    path: '*',
    redirect: '/home',
    meta: {
      layout: Default,
    },
  },
];
