export default {
  isAuthenticated: state => !!state.session.access_token,
  getUsername: state => state.session.user.name,
  refreshRate: state => state.refreshRate,
  getUserId: state => state.session.user.id,
};
