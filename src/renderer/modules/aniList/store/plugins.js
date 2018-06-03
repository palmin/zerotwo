import createLogger from 'vuex/dist/logger';

const localStoragePlugin = (store) => {
  store.subscribe((mutation, { session }) => {
    if (session.access_token) {
      store.dispatch('aniList/access_token', session.access_token);
    } else {
      store.dispatch('aniList/access_token', null);
    }
  });
};

export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin];
