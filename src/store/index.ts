import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import localForage from 'localforage';

// Custom Stores
import { aniListModule, AniListStore } from './AniList';
import { appModule, AppStore } from './App';
import { UserSettings, userSettingsModule } from './UserSettings';

Vue.use(Vuex);

const vuexPersist = new VuexPersistence<any>({
  storage: localForage,
  asyncStorage: false,
  key: 'zerotwo_store',
});

export const store = new Vuex.Store<any>({
  state: {},
  modules: {
    aniListModule,
    appModule,
    userSettingsModule,
  },
  // To keep mutated changes in local Storage
  plugins: [vuexPersist.plugin],
});

/**
 * @module UserSettings This module consists of all user settings
 * @description This creates a proxy for the Vue Templates to use.
 */
export const userStore = UserSettings.CreateProxy(store, UserSettings) as UserSettings;
/**
 * @module AppStore This module contains all general App data
 */
export const appStore = AppStore.CreateProxy(store, AppStore) as AppStore;
/**
 * @module AniListStore This module contains all data concerning AniList
 */
export const aniListStore = AniListStore.CreateProxy(store, AniListStore) as AniListStore;
