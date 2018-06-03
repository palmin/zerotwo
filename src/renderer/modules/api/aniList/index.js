import Axios from 'axios';
import getUserList from './queries/getUserList';
import getUserAnimeInformation from './queries/getUserAnimeInformation';
import addAnimeToList from './queries/addAnimeToList';
import updateAnimeInList from './queries/updateAnimeToList';
import deleteAnimeFromList from './queries/deleteAnimeFromList';
import searchAnime from './queries/searchAnime';

const axios = Axios.create({
  baseURL: 'https://graphql.anilist.co/',
  timeout: 15000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default () => ({
  getUserList(userName, type) {
    return axios.post('/', {
      query: getUserList,
      variables: {
        userName,
        type,
      },
    })
      .then(response => response.data.data.list)
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  },
  searchAnime(query) {
    return axios.post('/', {
      query: searchAnime,
      variables: {
        query,
        page: 1,
        perPage: 50,
      },
    })
      .then(response => response.data.data.results.media);
  },
  openAnimeInformation(mediaId, token) {
    return axios.post('/', {
      query: getUserAnimeInformation,
      variables: {
        mediaId,
      },
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.data.data.entry);
  },
  addAnimeToList({
    mediaId, score, progress, status,
  }, token) {
    return axios.post('/', {
      query: addAnimeToList,
      variables: {
        mediaId,
        score,
        progress,
        status,
      },
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.data);
  },
  updateAnimeInList({
    id, score, progress, status,
  }, token) {
    return axios.post('/', {
      query: updateAnimeInList,
      variables: {
        id,
        score,
        progress,
        status,
      },
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.data);
  },
  deleteAnimeFromList(id, token) {
    return axios.post('/', {
      query: deleteAnimeFromList,
      variables: {
        id,
      },
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.data);
  },
});
