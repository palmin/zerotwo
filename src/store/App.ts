import { getter, Module, mutation, VuexModule } from 'vuex-class-component';
import { version } from '../../package.json';

/**
 * @module AppStore This store contains general data about the app.
 */
@Module()
export class AppStore extends VuexModule {
  /**
   * @private
   * @var {string} _version contains the current app's version string
   */
  private _version: string = version;
  /**
   * @private
   * @var {string} _locale contains the locale string
   */
  private _locale?: string = process.env.VUE_APP_I18N_FALLBACK_LOCALE;

  /**
   * @getter
   * @method AppStore.version
   * @returns the current Version string
   */
  @getter
  public get version(): string {
    return this._version;
  }

  /**
   * @getter
   * @method AppStore.language
   * @returns the current language string or undefined, if not yet set.
   */
  @getter
  public get language(): string | undefined {
    return this._locale;
  }

  /**
   * @mutation
   * @method AppStore.setLanguage
   * @description Sets the app's locale to set language
   * @param {string} language
   */
  @mutation
  public setLanguage(language: string) {
    this._locale = language;
  }
}

export const appModule = AppStore.ExtractVuexModule(AppStore);
