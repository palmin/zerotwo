import electron from 'electron';
import FS from 'fs';
import Path from 'path';
import request from 'request';
import UUIDv4 from 'uuid/v4';
import { action, getter, Module, mutation, VuexModule } from 'vuex-class-component';

// Custom components
import Log from '@/log';
import API from '@/modules/AniList/API';
import {
  AniListImageSize,
  AniListScoreFormat,
  AniListType,
  IAniListActivity,
  IAniListImageStorage,
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
        large: '',
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
   * @private
   * @var {IAniListActivity[]} _latestActivities contains the current user's latest activities
   */
  private _latestActivities: IAniListActivity[] = [];
  /**
   * @private
   * @var {string | null} _currentMediaTitle contains the title of the currently viewing media
   */
  private _currentMediaTitle: string | null = null;
  /**
   * @private
   * @var {IAniListImageStorage[]} _storedImages contains the information about all currently stored images.
   */
  private _storedImages: IAniListImageStorage[] = [];

  private constructor() {
    super();

    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    const jsonPath = Path.join(userDataPath, 'storedImages.json');

    if (FS.existsSync(jsonPath)) {
      this._storedImages = this.parseImageStorageData(jsonPath);
    } else {
      FS.writeFileSync(jsonPath, '[]');
    }

    const imagesFolder = Path.join(userDataPath, 'AniListImages');
    if (!FS.existsSync(imagesFolder)) {
      FS.mkdirSync(imagesFolder);
    }
  }

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
   * @method latestActivities
   * @returns {IAniListActivity[]} the current user's latest activities
   */
  @getter
  public get latestActivities(): IAniListActivity[] {
    return this._latestActivities;
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

  @getter
  public get currentMediaTitle(): string | null {
    return this._currentMediaTitle;
  }

  @getter
  public get storedImages(): IAniListImageStorage[] {
    return this._storedImages;
  }

  @action()
  public async searchImage(
    { aniListId, originalLink, size }:
    { aniListId?: number; originalLink?: string; size: AniListImageSize } = { size: AniListImageSize.LARGE }):
  Promise<IAniListImageStorage | null> {
    try {
      let image = null;

      if (aniListId) {
        image = this._storedImages.find((storedImage) =>
          storedImage.id === aniListId && storedImage.size === size);
      } else if (originalLink) {
        image = this._storedImages.find((storedImage) =>
          storedImage.originalLink === originalLink);
      } else {
        throw Error('Neither aniListId nor originalLink has been provided!');
      }

      if (!image) {
        return null;
      }

      return image;
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['store', 'AniList', 'searchImage'], error, aniListId, originalLink, size);
      return null;
    }
  }

  @action()
  public async addImageToStorage(
    { aniListId, originalLink, size }: { aniListId: number | null, originalLink: string, size: AniListImageSize }):
    Promise<string> {
    const imageExtension = Path.extname(originalLink);
    const fileName = UUIDv4();
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    const filePath = Path.join(userDataPath, 'AniListImages', `${fileName}${imageExtension}`);

    await new Promise((resolve) =>
      request(originalLink)
        .pipe(FS.createWriteStream(filePath))
        .on('finish', resolve));

    const imageStorage: IAniListImageStorage = {
      id: aniListId,
      fileName,
      originalLink,
      size,
      path: filePath,
    };
    this._storedImages.push(imageStorage);

    return imageStorage.path;
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

      const userId = (user as IAniListUser).id;
      const latestActivities = await API.getLatestActivities(userId, 0, 10);

      if (userList && user && latestActivities) {
        this._setAniListData(userList);
        this._setUser(user);
        this._setLatestActivities(latestActivities);
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

  @action()
  public async setCurrentMediaTitle(title: string | null): Promise<void> {
    this._setCurrentMediaTitle(title);
  }

  @mutation
  public setStoredImages() {
    this._storedImages = [];
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

  @mutation
  protected _setLatestActivities(data: IAniListActivity[]): void {
    this._latestActivities = data;
  }

  @mutation
  protected _setCurrentMediaTitle(title: string | null): void {
    this._currentMediaTitle = title;
  }

  private parseImageStorageData(filePath: string): IAniListImageStorage[] {
    try {
      return JSON.parse(FS.readFileSync(filePath).toString());
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['store', 'AniList', 'parseImageStorageData'], error);
    }

    return [];
  }
}

export const aniListModule = AniListStore.ExtractVuexModule(AniListStore);
