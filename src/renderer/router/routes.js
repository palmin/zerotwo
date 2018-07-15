import AniListLayout from '@/layouts/AniList';
// import MyAnimeListLayout from '@/layouts/MyAnimeList';
// import TorrentsLayout from '@/layouts/Torrents';
import { routes as Home } from '@/modules/home';
import { routes as MyAnimeList } from '@/modules/myAnimeList';
import { routes as AniList } from '@/modules/aniList';
import { routes as Torrents } from '@/modules/torrents';

export default [
  ...Home,
  ...MyAnimeList,
  ...AniList,
  ...Torrents,
  {
    path: '*',
    redirect: '/aniList/Watching',
    meta: {
      layout: AniListLayout,
    },
  },
];
