export default {
  setMALData(state, payload) {
    state.malData = payload;
  },
  setLoginData(state, payload) {
    state.auth = payload;
  },
  setInformation(state, payload) {
    state.information = payload;
  },
  setRefreshRate(state, payload) {
    state.refreshRate = payload;
  },
  setTimeUntilNextRefresh(state, payload) {
    state.timeUntilNextRefresh = payload;
  },
};
