import Axios from 'axios';

import generateMyAnimeList from './myanimelist';

const axios = Axios.create({
  baseURL: 'https://myanimelist.net/',
  timeout: 5000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    // 'User-Agent': '',
  },
  withCredentials: true,
});

const myAnimeList = generateMyAnimeList(axios);

export default {
  ...myAnimeList,
};
