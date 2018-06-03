export default {
  setRoute({ commit }, route) {
    commit('setRoute', route);
  },
  setFirstLoad({ commit }, firstLoad) {
    commit('setFirstLoad', firstLoad);
  },
};
