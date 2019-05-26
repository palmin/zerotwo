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
  IAniListSeasonPreview,
  IAniListSeasonPreviewMedia,
  IAniListUser,
} from '../types';

const axios: AxiosInstance = Axios.create({
  baseURL: 'https://graphql.anilist.co/',
  timeout: 60000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Queries
import getAnimeInfo from './queries/getAnimeInfo.graphql';
import getLatestActivities from './queries/getLatestActivities.graphql';
import getListEntry from './queries/getListEntry.graphql';
import getSeasonPreview from './queries/getSeasonPreview.graphql';
import getUser from './queries/getUser.graphql';
import getUserList from './queries/getUserList.graphql';

// Mutations
import setEpisodeProgress from './mutations/setEpisodeProgress.graphql';
import updateEntry from './mutations/updateEntry.graphql';

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
   * @returns {Promise<IAniListMediaListCollection | void>} User's Media list collection or nothing
   */
  // tslint:disable-next-line max-line-length
  public static async getUserList(userName: string, type: AniListType, accessToken: string): Promise<IAniListMediaListCollection | void> {
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

    return;
  }

  /**
   * @function getUser
   * @static
   * @param {string} accessToken contains the access token to use AniList's API
   * @returns {Promise<IAniListUser | void>} User's data or nothing
   */
  public static async getUser(accessToken: string): Promise<IAniListUser | void> {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      const response = await axios.post('/', { query: getUser }, { headers });

      return response.data.data.user as IAniListUser;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getUser'], error);
    }

    return;
  }

  // tslint:disable-next-line max-line-length
  public static async getLatestActivities(userId: number, page: number = 0, perPage: number = 0): Promise<IAniListActivity[] | void> {
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
  }

  // tslint:disable-next-line max-line-length
  public static async getSeasonPreview(seasonYear: number, season: AniListSeason): Promise<IAniListSeasonPreview | null> {
    try {
      const response = await axios.post('/', {
        query: getSeasonPreview,
        variables: {
          season,
          seasonYear,
        },
      });

      const media: IAniListSeasonPreviewMedia[] = response.data.data.page.media;

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

  public static async getAnimeInfo(aniListId: number): Promise<IAniListMedia | void> {
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

      const media = response.data.data.media;
      const listEntry = media.mediaListEntry || {};
      listEntry.media = omit(media, 'mediaListEntry');

      return listEntry as IAniListEntry;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'api', 'getListEntry'], error);
    }

    return null;
  }

  // Mutations

  // tslint:disable-next-line max-line-length
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

  /**
   * @constructor
   * @private
   * @description Empty private constructor
   */
  private constructor() {}
}
