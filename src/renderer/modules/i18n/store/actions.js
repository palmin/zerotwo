import find from 'lodash/find';

export default {
  detectAndSetLocale({ commit }) {
    const { language } = window.navigator;

    // This array contains all first parts of the language code
    // that should be split into two parts and only the first
    // should be taken.
    // Chinese (zh-cn) for example should not be split.
    const singleCodeLanguages = [
      'de',
      'en',
      'ja',
    ];

    const singleCode = language.split('-')[0];
    if (find(singleCodeLanguages, item => item === singleCode) !== undefined) {
      commit('setLocale', singleCode);

      return Promise.resolve(singleCode);
    }

    commit('setLocale', language);

    return Promise.resolve(language);
  },
};
