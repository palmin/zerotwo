export default {
  setMALData(state, payload) {
    state.malData = payload;
  },
  setUserData(state, payload) {
    state.userData = payload;
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
  setTimerRunning(state, payload) {
    state.timerRunning = payload;
  },
  resetState(state) {
    state.malData = null;
    state.userData = null;
    state.auth = null;
    state.information = null;
    state.refreshRate = 15;
    state.timeUntilNextRefresh = null;
    state.timerRunning = false;
  },
};
