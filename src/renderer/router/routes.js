import Default from '@/layouts/Default';
import { routes as Main } from '@/modules/main';

export default [
  ...Main,
  {
    path: '*',
    redirect: '/airing',
    meta: {
      layout: Default,
    },
  },
];
