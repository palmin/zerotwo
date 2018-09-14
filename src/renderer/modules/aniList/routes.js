import Main from './pages/Main';

export default [
  {
    path: '/aniList/Watching',
    name: 'Ani-Watching',
    component: Main,
    props: { status: 'CURRENT' },
  },
  {
    path: '/aniList/Completed',
    name: 'Ani-Completed',
    component: Main,
    props: { status: 'COMPLETED' },
  },
  {
    path: '/aniList/Paused',
    name: 'Ani-Paused',
    component: Main,
    props: { status: 'PAUSED' },
  },
  {
    path: '/aniList/Dropped',
    name: 'Ani-Dropped',
    component: Main,
    props: { status: 'DROPPED' },
  },
  {
    path: '/aniList/Planning',
    name: 'Ani-Planning',
    component: Main,
    props: { status: 'PLANNING' },
  },
];
