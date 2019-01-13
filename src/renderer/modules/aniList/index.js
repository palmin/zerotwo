// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import API from '../api';

export const init = (store) => {
  // REFRESH TOKENS ARE NOT USED BY ANILIST!
  // if (store.state.aniList.session.access_token) {
  //   ipcRenderer.send('aniList-oauth', 'refreshToken', store.state.aniList.session.access_token);
  // }

  // eslint-disable-next-line camelcase
  ipcRenderer.on('aniList-oauth-reply', (event, { access_token, refresh_token }) => {
    store.commit('aniList/SET_ACCESS_TOKEN', access_token);
    store.commit('aniList/SET_REFRESH_TOKEN', refresh_token);
    API.getUser(access_token).then((user) => {
      store.commit('aniList/SET_USER', user);
    });
  });

  // eslint-disable-next-line camelcase
  ipcRenderer.on('aniList-oauth-refresh', (event, { refresh_token }) => {
    store.commit('aniList/SET_REFRESH_TOKEN', refresh_token);
  });
};

export { default as store } from './store';
export { default as routes } from './routes';
export { default as settings } from './settings';
