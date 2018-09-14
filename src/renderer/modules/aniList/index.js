// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron';
import API from '../api';

export const init = (store) => {
  if (store.state.aniList.session.access_token) {
    ipcRenderer.send('aniList-oauth', 'refreshToken', store.state.aniList.session.access_token);
    ipcRenderer.send('aniList-oauth', 'authorizationToken');
  }

  // eslint-disable-next-line camelcase
  ipcRenderer.on('aniList-oauth-reply', (event, { access_token, refresh_token }, authorizationToken) => {
    store.commit('aniList/SET_ACCESS_TOKEN', access_token);
    store.commit('aniList/SET_REFRESH_TOKEN', refresh_token);
    store.commit('aniList/SET_AUTHORIZATION_TOKEN', authorizationToken);
    API.getUser(access_token).then((user) => {
      store.commit('aniList/SET_USER', user);
    });
  });

  // eslint-disable-next-line camelcase
  ipcRenderer.on('aniList-oauth-refresh', (event, { refresh_token }) => {
    store.commit('aniList/SET_REFRESH_TOKEN', refresh_token);
  });

  // eslint-disable-next-line camelcase
  ipcRenderer.on('aniList-oauth-authorize', (event, token) => {
    store.commit('aniList/SET_AUTHORIZATION_TOKEN', token);
  });
};

export { default as store } from './store';
export { default as routes } from './routes';
