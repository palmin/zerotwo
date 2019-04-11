import { action, getter, Module, mutation, VuexModule } from 'vuex-class-component';
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
   * @private
   * @var {boolean} _darkMode toggles the dark or light mode
   * @default true
   */
  private _darkMode: boolean = true;
  /**
   * @private
   * @var {boolean} _loading toggles the loading state
   * @default false
   */
  private _loading: boolean = false;

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
   * @getter
   * @method AppStore.darkMode
   * @returns {boolean} the current dark mode setting state
   */
  @getter
  public get darkMode(): boolean {
    return this._darkMode;
  }

  /**
   * @getter
   * @method AppStore.isLoading
   * @returns {boolean} the current loading state
   */
  @getter
  public get isLoading(): boolean {
    return this._loading;
  }

  /**
   * @async
   * @action
   * @method setLanguage
   * @param {string} language the language string
   * @returns {Promise<void>}
   */
  @action()
  public async setLanguage(language: string): Promise<void> {
    this._setLanguage(language);
  }

  /**
   * @async
   * @action
   * @method setDarkMode
   * @param {boolean} state contains the state if dark mode is to be enabled or not
   * @returns {Promise<void>}
   */
  @action()
  public async setDarkMode(state: boolean): Promise<void> {
    this._setDarkMode(state);
  }

  @action()
  public async setLoadingState(state: boolean): Promise<void> {
    this._setLoadingState(state);
  }

  /**
   * @protected
   * @mutation
   * @method _setLanguage
   * @description Sets the app's locale to set language
   * @param {string} language
   */
  @mutation
  protected _setLanguage(language: string) {
    this._locale = language;
  }

  /**
   * @protected
   * @mutation
   * @method _setDarkMode
   * @description Sets the app's dark mode to on or off
   * @param {boolean} state
   */
  @mutation
  protected _setDarkMode(state: boolean) {
    this._darkMode = state;
  }

  @mutation
  protected _setLoadingState(state: boolean) {
    this._loading = state;
  }
}

export const appModule = AppStore.ExtractVuexModule(AppStore);
