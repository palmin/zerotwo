import Vue from 'vue';
import Vuex from 'vuex';
import { merge, startsWith } from 'lodash';
import { store as i18n } from '@/modules/i18n';
import { store as myAnimeList } from '@/modules/myAnimeList';
import { store as aniList } from '@/modules/aniList';
import { store as router } from '@/router';

import createLocalForageState from './plugins/local-forage';
import { version } from '../../../package.json';


const strict = process.env.NODE_ENV === 'production';
const plugins = [
  createLocalForageState({
    persistPaths: [
      'i18n',
      'myAnimeList',
      'aniList',
      'router',
    ],
    mutationFilter({ type }) {
      return startsWith(type, 'i18n/') || startsWith(type, 'myAnimeList/') || startsWith(type, 'aniList/') || startsWith(type, 'router/');
    },
    afterInit(store, savedState) {
      store.commit('hydrateState', savedState);

      Promise
        .resolve((store.state.i18n.locale || store.dispatch('i18n/detectAndSetLocale'))
          // && ((store.state.myAnimeList.malData
          // || store.dispatch('myAnimeList/detectAndSetMALData'))))
          && store.state.aniList.session.user.name
          && ((store.state.aniList.aniData || store.dispatch('aniList/detectAndSetAniData'))))
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
    currentModule: 'aniList',
    currentAppVersion: version,
    modules: {
      aniList: 'aniList',
      myAnimeList: 'myAnimeList',
      torrents: 'torrents',
    },
  },
  mutations: {
    hydrateState(state, payload) {
      merge(state, payload);
    },
    setReady(state, payload) {
      state.isReady = payload;
    },
    setCurrentModule(state, payload) {
      state.currentModule = payload;
    },
  },
  modules: {
    i18n,
    myAnimeList,
    aniList,
    router,
  },
});
