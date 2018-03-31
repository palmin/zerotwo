import Watching from './pages/Watching';
import Canceled from './pages/Canceled';
import Finished from './pages/Finished';
import OnHold from './pages/OnHold';
import Planned from './pages/Planned';

export default [
  {
    path: '/watching',
    name: 'Watching',
    component: Watching,
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
