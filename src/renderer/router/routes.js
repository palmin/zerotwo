import { routes as Main } from '@/modules/main';

export default [
  ...Main,
  {
    path: '*',
    redirect: '/',
  },
];
