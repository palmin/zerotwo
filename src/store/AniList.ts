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

@Module()
export class AniListStore extends VuexModule {
  private _aniListData: IAniListMediaListCollection = { lists: [] };
  private _refreshRate: number = 15;
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

  @getter
  public get aniListData(): IAniListMediaListCollection {
    return this._aniListData;
  }

  @getter
  public get refreshRate(): number {
    return this._refreshRate;
  }

  @getter
  public get session(): IAniListSession {
    return this._session;
  }

  @getter
  public get isAuthenticated(): boolean {
    return !!this._session.accessToken;
  }

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

  @action()
  public async setSession(accessToken: string): Promise<void> {
    this._setSession(accessToken);
  }

  @mutation
  protected _setSession(accessToken: string) {
    this._session.accessToken = accessToken;
  }

  @mutation
  protected _setUser(data: IAniListUser) {
    this._session.user = data;
  }

  @mutation
  protected _setAniListData(data: IAniListMediaListCollection) {
    this._aniListData = data;
  }
}

export const aniListModule = AniListStore.ExtractVuexModule(AniListStore);
