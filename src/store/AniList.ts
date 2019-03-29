import { action, getter, Module, mutation, VuexModule } from 'vuex-class-component';

// Custom components
import Log from '@/log';
import API from '@/modules/AniList/API';
import {
  AniListScoreFormat,
  AniListType,
  IAniListMediaListCollection,
  IAniListSession,
  IAniListUser,
} from '@/modules/AniList/types';

/**
 * @module AniListStore
 * @description contains the user's data that is connected to AniList
 */
@Module()
export class AniListStore extends VuexModule {
  /**
   * @private
   * @var {IAniListMediaListCollection} _aniListData contains the logged in user's lists
   */
  private _aniListData: IAniListMediaListCollection = { lists: [] };
  /**
   * @private
   * @var {number} _refreshRate contains the amount of numbers until the app refreshes the user's lists
   */
  private _refreshRate: number = 15;
  /**
   * @private
   * @var {IAniListSession} _session contains the user's session
   */
  private _session: IAniListSession = {
    accessToken: '',
    user: {
      avatar: {
        medium: '',
      },
      bannerImage: '',
      id: -1,
      mediaListOptions: {
        scoreFormat: AniListScoreFormat.POINT_100,
      },
      name: '',
      stats: {
        watchedTime: 0,
      },
      options: {
        displayAdultContent: false,
      },
    },
  };

  /**
   * @getter
   * @method aniListData
   * @returns {IAniListMediaListCollection} the current user's AniList data
   */
  @getter
  public get aniListData(): IAniListMediaListCollection {
    return this._aniListData;
  }

  /**
   * @getter
   * @method refreshRate
   * @returns {number} the current user's set refresh rate (in minutes)
   */
  @getter
  public get refreshRate(): number {
    return this._refreshRate;
  }

  /**
   * @getter
   * @method session
   * @returns {IAniListSession} the current user's AniList session
   */
  @getter
  public get session(): IAniListSession {
    return this._session;
  }

  /**
   * @getter
   * @method isAuthenticated
   * @returns {boolean} is the current user logged in
   */
  @getter
  public get isAuthenticated(): boolean {
    return !!this._session.accessToken;
  }

  /**
   * @action
   * @async
   * @method refreshAniListData
   * @description triggers the refresh of the current user's AniList lists
   * @returns {Promise<void>}
   */
  @action()
  public async refreshAniListData(): Promise<void> {
    if (!this.session.accessToken) {
      return;
    }

    try {
      const accessToken = this.session.accessToken;
      const user = await API.getUser(accessToken);

      const userName = (user as IAniListUser).name;
      const userList = await API.getUserList(userName, AniListType.ANIME);

      if (userList && user) {
        this._setAniListData(userList);
        this._setUser(user);
      }
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['aniList', 'store', 'refreshAniListData'], error);
    }
  }

  /**
   * @action
   * @async
   * @method setSession
   * @param {string} accessToken the access token
   * @description calls the {protected} mutation method _setSession
   * @returns {Promise<void>}
   */
  @action()
  public async setSession(accessToken: string): Promise<void> {
    this._setSession(accessToken);
  }

  /**
   * @protected
   * @mutation
   * @method _setSession
   * @param {string} accessToken the access token
   * @description sets the session's access token
   * @returns {void}
   */
  @mutation
  protected _setSession(accessToken: string): void {
    this._session.accessToken = accessToken;
  }

  /**
   * @protected
   * @mutation
   * @method _setUser
   * @param {IAniListUser} data the user data of the AniList user
   * @description sets the session's user data
   * @returns {void}
   */
  @mutation
  protected _setUser(data: IAniListUser): void {
    this._session.user = data;
  }

  /**
   * @protected
   * @mutation
   * @method _setAniListData
   * @param {IAniListMediaListCollection} data
   * @description sets the user's complete list data
   * @returns {void}
   */
  @mutation
  protected _setAniListData(data: IAniListMediaListCollection): void {
    this._aniListData = data;
  }
}

export const aniListModule = AniListStore.ExtractVuexModule(AniListStore);
