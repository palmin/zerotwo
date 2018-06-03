import Watching from './pages/Watching';
import Completed from './pages/Completed';
import Paused from './pages/Paused';
import Dropped from './pages/Dropped';
import Planning from './pages/Planning';

export default [
  {
    path: '/aniList/Watching',
    name: 'Ani-Watching',
    component: Watching,
  },
  {
    path: '/aniList/Completed',
    name: 'Ani-Completed',
    component: Completed,
  },
  {
    path: '/aniList/Paused',
    name: 'Ani-Paused',
    component: Paused,
  },
  {
    path: '/aniList/Dropped',
    name: 'Ani-Dropped',
    component: Dropped,
  },
  {
    path: '/aniList/Planning',
    name: 'Ani-Planning',
    component: Planning,
  },
];
