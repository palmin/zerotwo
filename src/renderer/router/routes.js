import Default from '@/layouts/Default';
import { routes as Main } from '@/modules/main';

export default [
  ...Main,
  {
    path: '*',
    redirect: '/watching',
    meta: {
      layout: Default,
    },
  },
];
