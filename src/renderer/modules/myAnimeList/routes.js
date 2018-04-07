import Watching from './pages/Watching';
import Dropped from './pages/Dropped';
import Finished from './pages/Finished';
import OnHold from './pages/OnHold';
import Planned from './pages/Planned';

export default [
  {
    path: '/myAnimeList/watching',
    name: 'MAL-Watching',
    component: Watching,
  },
  {
    path: '/myAnimeList/dropped',
    name: 'MAL-Dropped',
    component: Dropped,
  },
  {
    path: '/myAnimeList/finished',
    name: 'MAL-Finished',
    component: Finished,
  },
  {
    path: '/myAnimeList/on-hold',
    name: 'MAL-OnHold',
    component: OnHold,
  },
  {
    path: '/myAnimeList/planned',
    name: 'MAL-Planned',
    component: Planned,
  },
];
