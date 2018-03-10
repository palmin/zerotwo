export default {
  detectAndSetLocale({ commit }) {
    // IE11 uses non-standard userLanguage property
    const language = window.navigator.language || window.navigator.userLanguage;
    const locale = language.split('-')[0] || window.env.FALLBACK_LOCALE;

    commit('setLocale', locale);

    return Promise.resolve(locale);
  },
};
