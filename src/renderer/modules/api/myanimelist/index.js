import { xml2json } from 'xml-js';

const options = {
  ignoreDeclaration: true,
  ignoreComments: true,
  compact: true,
  textKey: 'text',
};

export default axios => ({
  getAnimeList(user) {
    return axios
      .get(`/malappinfo.php?u=${user}&status=all&type=anime`)
      .then(response => response.data)
      .then(data => xml2json(data, options));
  },
  findAnime(query) {
    return axios
      .get(`/api/anime/search.xml?q=${encodeURI(query)}`)
      .then(response => response.data)
      .then(data => xml2json(data, options));
  },
  login({ username, password }) {
    return axios
      .get('/api/account/verify_credentials.xml', {
        auth: {
          username,
          password,
        },
      })
      .then(response => response.data)
      .then(data => xml2json(data, options));
  },
});
