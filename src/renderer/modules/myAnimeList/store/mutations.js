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
};
