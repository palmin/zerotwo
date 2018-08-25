import Axios from 'axios';
import { readFileSync } from 'fs';

// Queries
const getAnime = readFileSync(`${__dirname}/queries/getAnime.graphql`, 'utf-8');
const getUser = readFileSync(`${__dirname}/queries/getUser.graphql`, 'utf-8');
const getUserList = readFileSync(`${__dirname}/queries/getUserList.graphql`, 'utf-8');
const getUserAnimeInformation = readFileSync(`${__dirname}/queries/getUserAnimeInformation.graphql`, 'utf-8');
const searchAnime = readFileSync(`${__dirname}/queries/searchAnime.graphql`, 'utf-8');

// Mutations
const addAnimeToList = readFileSync(`${__dirname}/mutations/addAnimeToList.graphql`, 'utf-8');
const updateAnimeInList = readFileSync(`${__dirname}/mutations/updateAnimeToList.graphql`, 'utf-8');
const deleteAnimeFromList = readFileSync(`${__dirname}/mutations/deleteAnimeFromList.graphql`, 'utf-8');

const axios = Axios.create({
  baseURL: 'https://graphql.anilist.co/',
  timeout: 60000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default () => ({
  getUser(token) {
    return axios.post('/', { query: getUser }, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => response.data.data.user)
      .catch(err => err);
  },
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
      variables: { mediaId },
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => response.data.data.entry);
  },
  addAnimeToList({ mediaId, score, progress, status }, token) {
    return axios.post('/', {
      query: addAnimeToList,
      variables: {
        mediaId,
        score,
        progress,
        status,
      },
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => response.data);
  },
  updateAnimeInList({ id, score, progress, status }, token) {
    return axios.post('/', {
      query: updateAnimeInList,
      variables: {
        id,
        score,
        progress,
        status,
      },
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => response.data);
  },
  deleteAnimeFromList(id, token) {
    return axios.post('/', {
      query: deleteAnimeFromList,
      variables: { id },
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(response => response.data);
  },
});
