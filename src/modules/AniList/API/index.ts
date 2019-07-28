import Axios, { AxiosInstance } from 'axios';
import { omit } from 'lodash';

// Custom Components
import Log from '@/log';
import { aniListStore } from '@/store';
import {
  AniListListStatus,
  AniListSeason,
  AniListType,
  IAniListActivity,
  IAniListEntry,
  IAniListMedia,
  IAniListMediaListCollection,
  IAniListSearchResult,
  IAniListSeasonPreview,
  IAniListSeasonPreviewMedia,
  IAniListUser,
} from '../types';

// Queries
import getAnimeInfo from './queries/getAnimeInfo.graphql';
import getLatestActivities from './queries/getLatestActivities.graphql';
import getListEntry from './queries/getListEntry.graphql';
import getSeasonPreview from './queries/getSeasonPreview.graphql';
import getUser from './queries/getUser.graphql';
import getUserList from './queries/getUserList.graphql';
import searchAnime from './queries/searchAnime.graphql';

// Mutations
import setEpisodeProgress from './mutations/setEpisodeProgress.graphql';
import updateEntry from './mutations/updateEntry.graphql';

const axios: AxiosInstance = Axios.create({
  baseURL: 'https://graphql.anilist.co/',
  timeout: 60000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * @class AniListAPI
 * @description Contains only static functions to connect to AniList's API
 */
export default class AniListAPI {
  /**
   * @function getUserList
   * @static
   * @param {string} userName contains the name of the user
   * @param {AniListType} type contains the type of media
   * @returns {Promise<IAniListMediaListCollection | null>} User's Media list collection or nothing
   */
  // tslint:disable-next-line max-line-length
  public static async getUserList(userName: string, type: AniListType, accessToken: string): Promise<IAniListMediaListCollection | null> {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.post('/', {
        query: getUserList,
        variables: {
          userName,
          type,
        },
      }, { headers });

      // response.data is part of the axios response object.
      // the last data is part of the response of AniList
      return response.data.data.list as IAniListMediaListCollection;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getUserList'], error);
    }

    return null;
  }

  /**
   * @function getUser
   * @static
   * @param {string} accessToken contains the access token to use AniList's API
   * @returns {Promise<IAniListUser | null>} User's data or nothing
   */
  public static async getUser(accessToken: string): Promise<IAniListUser | null> {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.post('/', { query: getUser }, { headers });

      return response.data.data.user as IAniListUser;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getUser'], error);
    }

    return null;
  }

  public static async getLatestActivities(userId: number, page: number = 0, perPage: number = 0): Promise<IAniListActivity[] | null> {
    try {
      const response = await axios.post('/', {
        query: getLatestActivities,
        variables: {
          userId,
          page,
          perPage,
        },
      });

      return response.data.data.page.activities;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getLatestActivities'], error);
    }

    return null;
  }

  public static async getSeasonPreview(seasonYear: number, season: AniListSeason): Promise<IAniListSeasonPreview | null> {
    try {
      const response = await axios.post('/', {
        query: getSeasonPreview,
        variables: {
          season,
          seasonYear,
        },
      });

      const { media } = response.data.data.page;

      return {
        season,
        seasonYear,
        media,
      };
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getSeasonPreview'], error);
    }

    return null;
  }

  public static async getAnimeInfo(aniListId: number): Promise<IAniListMedia | null> {
    try {
      const response = await axios.post('/', {
        query: getAnimeInfo,
        variables: {
          id: aniListId,
        },
      });

      const media = response.data.data.media as IAniListMedia;

      return media;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getAnimeInfo'], error);
    }

    return null;
  }

  public static async getListEntryByMediaId(mediaId: number): Promise<IAniListEntry | null> {
    try {
      const { accessToken } = aniListStore.session;
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.post('/', {
        query: getListEntry,
        variables: {
          mediaId,
        },
      }, { headers });

      const { media } = response.data.data;
      const listEntry = media.mediaListEntry || {};
      listEntry.media = omit(media, 'mediaListEntry');

      return listEntry as IAniListEntry;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getListEntry'], error);
    }

    return null;
  }

  // tslint:disable-next-line max-line-length
  public static async searchAnime(query: string, filters: { isAdult: boolean | null, listStatus: AniListListStatus[], genres: string[] }): Promise<IAniListSearchResult[] | null> {
    try {
      const { accessToken } = aniListStore.session;
      const headers = { Authorization: `Bearer ${accessToken}` };
      const genres = filters.genres.length ? filters.genres : null;
      const onList = !!filters.listStatus.length;
      const { isAdult } = filters;

      const mediaQueryDeclaration = [
        '$query: String!',
        '$type: MediaType!',
        '$genres: [String]',
      ];
      const mediaQueryDefinition = [
        'search: $query',
        'type: $type',
        'genre_in: $genres',
      ];
      const mediaQueryParameters: {
        query: string,
        type: string,
        genres: string[] | null,
        onList?: boolean,
        isAdult?: boolean,
      } = {
        query,
        type: 'ANIME',
        genres,
      };

      if (onList) {
        mediaQueryDeclaration.push('$onList: Boolean');
        mediaQueryDefinition.push('onList: $onList');
        mediaQueryParameters.onList = onList;
      }

      if (isAdult) {
        mediaQueryDeclaration.push('$isAdult: Boolean');
        mediaQueryDefinition.push('isAdult: $isAdult');
        mediaQueryParameters.isAdult = isAdult;
      }

      const searchQuery = searchAnime
        .replace('{0}', mediaQueryDeclaration.join(', '))
        .replace('{1}', mediaQueryDefinition.join(', '));

      const response = await axios.post('/', {
        query: searchQuery,
        variables: mediaQueryParameters,
      }, { headers });

      const searchResults: IAniListSearchResult[] = response.data.data.page.media;

      if (filters.listStatus.length) {
        const results = searchResults.filter((e) => {
          if (!e.mediaListEntry) {
            return false;
          }

          return filters.listStatus.find(filter => filter === e.mediaListEntry.status);
        });

        return results;
      }

      return searchResults;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getListEntry'], error);
    }

    return null;
  }

  // Mutations

  public static async updateEntry(entryId: number, progress: number, score: number, status: AniListListStatus): Promise<void> {
    try {
      const { accessToken } = aniListStore.session;
      const headers = { Authorization: `Bearer ${accessToken}` };

      await axios.post('/', {
        query: updateEntry,
        variables: {
          entryId,
          progress,
          score,
          status,
        },
      }, { headers });
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'updateEntry'], error);
    }
  }

  public static async setEntryProgress(entryId: number, progress: number): Promise<void> {
    try {
      const { accessToken } = aniListStore.session;
      const headers = { Authorization: `Bearer ${accessToken}` };

      await axios.post('/', {
        query: setEpisodeProgress,
        variables: {
          entryId,
          progress,
        },
      }, { headers });
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'setEpisodeProgress'], error);
    }
  }

  public static async setEntryCompleted(entryId: number, episodeAmount: number): Promise<void> {
    try {
      const { accessToken } = aniListStore.session;
      const headers = { Authorization: `Bearer ${accessToken}` };

      const now = new Date();
      const completedAt = {
        year: now.getUTCFullYear(),
        month: now.getUTCMonth() + 1,
        day: now.getUTCDate(),
      };

      await axios.post('/', {
        query: setEpisodeProgress,
        variables: {
          entryId,
          progress: episodeAmount,
          completedAt,
        },
      }, { headers });
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'setEntryCompleted'], error);
    }
  }
}
