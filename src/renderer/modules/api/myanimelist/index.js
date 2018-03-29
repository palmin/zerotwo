import { Parser } from 'xml2js';
import Promise from 'bluebird';
import transformSingles from '@/utils/transformSingles';
import _ from 'lodash';
import qs from 'qs';

const parser = new Parser();
const parseString = Promise.promisify(parser.parseString);

export default axios => ({
  getAnimeList(user) {
    return axios
      .get(`/malappinfo.php?u=${user}&status=all&type=anime`)
      .then(response => response.data)
      .then(data => parseString(data))
      .then(data => _.map(data.myanimelist.anime, entry => transformSingles(entry)));
  },
  findAnime(query, auth) {
    return axios
      .get(`/api/anime/search.xml?q=${encodeURI(query)}`, { auth })
      .then(response => response.data)
      .then(data => parseString(data))
      .then((data) => {
        if (data.anime.entry.length > 1) {
          data.anime.entry = _.map(data.anime.entry, entry => transformSingles(entry));
          const entry = _.find(data.anime.entry, item => item.title === query);
          if (entry === undefined) {
            return null;
          }

          return entry;
        }

        return transformSingles(_.first(data.anime.entry));
      });
  },
  findAnimes(query, auth) {
    return axios
      .get(`/api/anime/search.xml?q=${encodeURI(query)}`, { auth })
      .then(response => response.data)
      .then(data => parseString(data))
      .then((data) => {
        if (!data) {
          return null;
        }

        if (data.anime.entry.length > 1) {
          return _.map(data.anime.entry, entry => transformSingles(entry));
        }

        return transformSingles(_.first(data.anime.entry));
      });
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
      .then(data => parseString(data));
  },
  addAnime(auth, { id, xml }) {
    return axios
      .post(`/api/animelist/add/${id}.xml`, qs.stringify({ data: xml }), {
        auth,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => response.data);
  },
  deleteAnime(auth, { id }) {
    return axios
      .delete(`/api/animelist/delete/${id}.xml`, {
        auth,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => response.data);
  },
  updateAnime(auth, { id, xml }) {
    return axios
      .post(`/api/animelist/update/${id}.xml`, qs.stringify({ data: xml }), {
        auth,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => response.data);
  },
});
