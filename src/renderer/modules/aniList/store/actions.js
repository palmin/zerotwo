import Promise from 'bluebird';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import API from '@/modules/api';

export default {
  detectAndSetAniData({ commit, state }) {
    if (!state.session.access_token || !state.session.user.name) {
      return Promise.resolve();
    }

    return Promise.all([
      API.getUserList(state.session.user.name, 'ANIME'),
      API.getUser(state.session.access_token),
    ])
      .spread((listData, userData) => {
        commit('setAniData', listData);
        commit('SET_USER', userData);
      })
      .then(() => Promise.resolve());
  },
  updateRefreshRate({ commit }, refreshRate) {
    commit('setRefreshRate', refreshRate);
  },
  setTimeUntilNextRefresh({ commit }, time) {
    commit('setTimeUntilNextRefresh', time);
  },
  setTimerRunning({ commit }, status) {
    commit('setTimerRunning', status);
  },
  setRestartTimer({ commit }, status) {
    commit('setRestartTimer', status);
  },
  resetState({ commit }) {
    commit('resetState');
  },
  setTableHeaders({ commit }, headers) {
    commit('setTableHeaders', headers);
  },
  // eslint-disable-next-line no-unused-vars
  getToken({ commit }) {
    ipcRenderer.send('aniList-oauth', 'getToken');
  },
  refreshToken({ commit }) {
    ipcRenderer.send('aniList-oauth', 'refreshToken');
  },
  logout({ commit }) {
    return new Promise((resolve) => {
      commit('REMOVE_ACCESS_TOKEN');
      commit('REMOVE_REFRESH_TOKEN');
      commit('REMOVE_USER');
      commit('REMOVE_ANI_DATA');
      resolve();
    });
  },
  initApp({ commit, state }) {
    return new Promise((resolve) => {
      if (!state.session.access_token || !state.session.user.name) {
        return resolve();
      }

      return API.getUser(state.session.access_token)
        .then((user) => {
          commit('SET_USER', user);
          resolve();
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.log('Error while getting user from aniList, user will have to login', err);
          resolve();
        });
    });
  },
};
