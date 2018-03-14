import List from './pages/List';
import Airing from './pages/Airing';
import Canceled from './pages/Canceled';
import Finished from './pages/Finished';
import OnHold from './pages/OnHold';
import Planned from './pages/Planned';

export default [
  {
    path: '/',
    name: 'Main',
    component: List,
  },
  {
    path: '/airing',
    name: 'Airing',
    component: Airing,
  },
  {
    path: '/canceled',
    name: 'Canceled',
    component: Canceled,
  },
  {
    path: '/finished',
    name: 'Finished',
    component: Finished,
  },
  {
    path: '/on-hold',
    name: 'OnHold',
    component: OnHold,
  },
  {
    path: '/planned',
    name: 'Planned',
    component: Planned,
  },
];
