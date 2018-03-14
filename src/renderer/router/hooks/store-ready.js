import store from '@/store';

export default (router) => {
  router.beforeEach((to, from, next) => {
    if (store.state.isReady) {
      next();
      return;
    }

    const unsub = store.subscribe(({ type, payload }) => {
      if (type === 'setReady' && payload === true) {
        unsub();
        next();
      }
    });
  });
};
