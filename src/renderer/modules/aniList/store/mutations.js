export default {
  SET_USER(state, user) {
    state.session.user = user;
  },
  REMOVE_USER(state) {
    state.session.user = {};
  },
  SET_ACCESS_TOKEN(state, token) {
    state.session.access_token = token;
  },
  REMOVE_ACCESS_TOKEN(state) {
    state.session.access_token = false;
  },
  SET_REFRESH_TOKEN(state, token) {
    state.session.refresh_token = token;
  },
  REMOVE_REFRESH_TOKEN(state) {
    state.session.refresh_token = false;
  },
  SET_AUTHORIZATION_TOKEN(state, token) {
    state.session.authorization_token = token;
  },
  REMOVE_AUTHORIZATION_TOKEN(state) {
    state.session.authorization_token = false;
  },
  setAniData(state, payload) {
    state.aniData = payload;
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
    state.aniData = null;
    state.information = null;
    state.refreshRate = 15;
    state.timeUntilNextRefresh = null;
    state.timerRunning = false;
  },
};
