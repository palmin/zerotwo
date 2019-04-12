import Axios, { AxiosInstance } from 'axios';

// Custom Components
import Log from '@/log';
import {
  AniListSeason,
  AniListType,
  IAniListActivity,
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
import getSeasonPreview from './queries/getSeasonPreview.graphql';
import getUser from './queries/getUser.graphql';
import getUserList from './queries/getUserList.graphql';

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
  public static async getUserList(userName: string, type: AniListType): Promise<IAniListMediaListCollection | void> {
    try {
      const response = await axios.post('/', {
        query: getUserList,
        variables: {
          userName,
          type,
        },
      });

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

  /**
   * @constructor
   * @private
   * @description Empty private constructor
   */
  private constructor() {}
}
