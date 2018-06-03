// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import axios from 'axios';
import { isAuthenticated, username } from './getters';
import getUserQuery from '../../api/aniList/queries/getUser';

const getAxiosClient = state => axios.create({
  baseURL: state.server.url,
  headers: {
    Authorization: `Bearer ${state.session.access_token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  responseType: 'json',
});

const getUser = ({ state }) => new Promise((resolve, reject) => {
  const params = {
    query: getUserQuery,
  };
  getAxiosClient(state).post('/', params).then((response) => {
    resolve(response.data.data.user);
  }, (err) => {
    // console.log(err);
    reject(err);
  });
});

export default {
  detectAndSetAniData({ commit, state }) {
    if (!state.session.access_token || !state.session.user.name) {
      return Promise.resolve();
    }

    // eslint-disable-next-line no-underscore-dangle
    return this._vm.$http.getUserList(state.session.user.name, 'ANIME')
      .then((data) => {
        commit('setAniData', data);
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
  resetState({ commit }) {
    commit('resetState');
  },
  getUser,
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
      resolve();
    });
  },
  initApp({ commit, state }) {
    return new Promise((resolve) => {
      if (!state.session.access_token || !state.session.user.name) {
        return resolve();
      }

      return getUser({ state }).then((user) => {
        commit('SET_USER', user);
        resolve();
      }, (err) => {
        // eslint-disable-next-line no-console
        console.log('Error while getting user from aniList, user will have to login', err);
        resolve();
      });
    });
  },
};
