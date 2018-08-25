import Axios from 'axios';
import { Parser } from 'xml2js';
import map from 'lodash/map';
import find from 'lodash/find';
import first from 'lodash/first';
import qs from 'qs';
import util from 'util';
import transformSingles from '@/utils/transformSingles';

const parser = new Parser();
const parseString = util.promisify(parser.parseString);

const axios = Axios.create({
  baseURL: 'https://myanimelist.net/',
  timeout: 5000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    // 'User-Agent': '',
  },
  withCredentials: true,
});

export default () => ({
  getAnimeList(user) {
    return axios
      .get(`/malappinfo.php?u=${user}&status=all&type=anime`)
      .then(response => response.data)
      .then(data => parseString(data))
      .then(data => ({
        anime: map(data.myanimelist.anime, entry => transformSingles(entry)),
        user: map(data.myanimelist.myinfo, entry => transformSingles(entry)),
      }));
  },
  findAnime(query, auth) {
    const searchValue = query.replace(/[&/\\#,+()$~%.'":*?<>{}\s]/g, '_');
    return axios
      .get(`/api/anime/search.xml?q=${encodeURI(searchValue)}`, { auth })
      .then(response => response.data)
      .then(data => parseString(data))
      .then((data) => {
        if (data.anime.entry.length > 1) {
          data.anime.entry = map(data.anime.entry, entry => transformSingles(entry));
          const entry = find(data.anime.entry, item => item.title === query);
          if (entry === undefined) {
            return null;
          }

          return entry;
        }

        return transformSingles(first(data.anime.entry));
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
          return map(data.anime.entry, entry => transformSingles(entry));
        }

        return transformSingles(first(data.anime.entry));
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then(response => response.data);
  },
  deleteAnime(auth, { id }) {
    return axios
      .delete(`/api/animelist/delete/${id}.xml`, {
        auth,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then(response => response.data);
  },
  updateAnime(auth, { id, xml }) {
    return axios
      .post(`/api/animelist/update/${id}.xml`, qs.stringify({ data: xml }), {
        auth,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then(response => response.data);
  },
});
