import Vue from 'vue';
import Vuex from 'vuex';
import { merge, startsWith } from 'lodash';
import { store as i18n } from '@/modules/i18n';
import { store as myAnimeList } from '@/modules/myAnimeList';
import createLocalForageState from './plugins/local-forage';

const strict = process.env.NODE_ENV === 'production';
const plugins = [
  createLocalForageState({
    persistPaths: [
      'i18n',
      'myAnimeList',
    ],
    mutationFilter({ type }) {
      return startsWith(type, 'i18n/') || startsWith(type, 'myAnimeList/');
    },
    afterInit(store, savedState) {
      store.commit('hydrateState', savedState);

      Promise
        .resolve((store.state.i18n.locale || store.dispatch('i18n/detectAndSetLocale'))
          && (store.state.myAnimeList.malData || store.dispatch('myAnimeList/detectAndSetMALData')))
        .then(() => store.commit('setReady', true));
    },
  }),
];

Vue.use(Vuex);

export default new Vuex.Store({
  strict,
  plugins,
  state: {
    isReady: false,
    currentAppVersion: '0.5.0',
  },
  mutations: {
    hydrateState(state, payload) {
      merge(state, payload);
    },
    setReady(state, payload) {
      state.isReady = payload;
    },
  },
  modules: {
    i18n,
    myAnimeList,
  },
});
