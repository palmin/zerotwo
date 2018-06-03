import Default from '@/layouts/Default';
import { routes as Home } from '@/modules/home';
import { routes as MyAnimeList } from '@/modules/myAnimeList';
import { routes as AniList } from '@/modules/aniList';

export default [
  ...Home,
  ...MyAnimeList,
  ...AniList,
  {
    path: '*',
    redirect: '/aniList/Watching',
    meta: {
      layout: Default,
    },
  },
];
