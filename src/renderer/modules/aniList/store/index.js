import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import plugins from './plugins';

const state = {
  aniData: null,
  refreshRate: 15, // set a default refreshRate of 15 minutes
  timeUntilNextRefresh: null,
  timerRunning: false,
  server: {
    url: 'https://graphql.anilist.co/',
  },
  session: {
    access_token: '',
    refresh_token: '',
    authorization_token: '',
    user: {
      name: '',
      id: -1,
      avatar: {
        medium: '',
      },
    },
  },
};

export default {
  namespaced: true,
  actions,
  mutations,
  getters,
  plugins,
  state,
};
