import actions from './actions';
import mutations from './mutations';

export default {
  namespaced: true,
  actions,
  mutations,
  state: {
    malData: null,
    auth: null,
    information: null,
    refreshRate: 15, // set a default refreshRate of 15 minutes
    timeUntilNextRefresh: null,
  },
};
