import { ipcRenderer } from 'electron';
import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';

// Custom Stores
import { aniListModule, AniListStore } from './AniList';
import { appModule, AppStore } from './App';
import { UserSettings, userSettingsModule } from './UserSettings';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {},
  modules: {
    aniListModule,
    appModule,
    userSettingsModule,
  },
  // To keep mutated changes in local Storage
  plugins: [new VuexPersistence().plugin],
});

/**
 * @module UserSettings This module consists of all user settings
 * @description This creates a proxy for the Vue Templates to use.
 */
export const userStore = UserSettings.CreateProxy(store, UserSettings);
/**
 * @module AppStore This module contains all general App data
 */
export const appStore = AppStore.CreateProxy(store, AppStore);
/**
 * @module AniListStore This module contains all data concerning AniList
 */
export const aniListStore = AniListStore.CreateProxy(store, AniListStore);

ipcRenderer.on('aniListOAuthReply', (event: any, accessToken: string) => {
  aniListStore.setSession(accessToken);
  aniListStore.refreshAniListData();
});
