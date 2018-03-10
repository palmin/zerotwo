import Vue from 'vue';
import Vuex from 'vuex';
import { merge, startsWith } from 'lodash';
import { store as i18n } from '@/modules/i18n';
import createLocalForageState from './plugins/local-forage';

const strict = process.env.NODE_ENV === 'production';
const plugins = [
  createLocalForageState({
    persistPaths: [
      'i18n',
    ],
    mutationFilter({ type }) {
      return startsWith(type, 'i18n/');
    },
    afterInit(store, savedState) {
      store.commit('hydrateState', savedState);

      Promise
        .resolve(store.state.i18n.locale || store.dispatch('i18n/detectAndSetLocale'))
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
  },
  mutations: {
    hydrateState(state, payload) {
      merge(state, payload);
    },
    setReady(state, payload) {
      state.isReady = payload; // eslint-disable-line no-param-reassign
    },
  },
  modules: {
    i18n,
  },
});
