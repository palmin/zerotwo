import { getter, Module, mutation, VuexModule } from 'vuex-class-component';
import { version } from '../../package.json';

/**
 * @module AppStore This store contains general data about the app.
 */
@Module()
export class AppStore extends VuexModule {
  private _version: string = version;
  private _locale?: string = undefined;

  /**
   * @method AppStore.version
   * @returns the current Version string
   */
  @getter
  public get version(): string {
    return this._version;
  }

  /**
   * @method AppStore.language
   * @returns the current language string or undefined, if not yet set.
   */
  @getter
  public get language(): string | undefined {
    return this._locale;
  }

  @mutation
  public setLanguage(language: string) {
    this._locale = language;
  }
}

export const appModule = AppStore.ExtractVuexModule(AppStore);
