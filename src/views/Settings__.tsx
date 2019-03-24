import { ipcRenderer, shell } from 'electron';
import { map } from 'lodash';
import { TranslateResult } from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { aniListStore, appStore } from '../store';

interface ISettingTab {
  key: string;
  value: TranslateResult;
  disabled?: boolean;
}

@Component
export default class Settings extends Vue {
  private _locale: string = '';
  private githubPage: URL = new URL('https://github.com/nicoaiko/zerotwo');
  private discordPage: URL = new URL('https://discord.gg/sTpR4Gw');
  private zeroTwoPage: URL = new URL('https://www.zerotwo.org');

  /**
   * @method render renders the Component
   */
  public render() {
    const vTabs = this.tabs.map((tab) => {
      return (
        <v-tab key={tab.key} disabled={tab.disabled} ripple>
          {tab.value}
        </v-tab>
      );
    });

    const vTabItems = (
      <v-tabs-items>
        {this.appSettingsTab}
        {this.aniListTab}
        {this.aboutTab}
      </v-tabs-items>
    );

    return (
      <v-content>
        <v-card dark>
          <v-card-text>
            <v-tabs grow fluid dark>
              {vTabs}
              {vTabItems}
            </v-tabs>
          </v-card-text>
        </v-card>
      </v-content>
    );
  }

  /**
   * @method created is being called before mount
   * @protected
   */
  protected created(): void {
    this._locale = appStore.language as string;
  }

  /**
   * @function tabs
   * @private
   * @returns {ISettingTab[]} the Settings tabs
   */
  private get tabs(): ISettingTab[] {
    return [{
      key: 'appSettings',
      value: this.$t('system.settings.menu.appSettings'),
    }, {
      key: 'aniList',
      value: this.$t('system.settings.menu.aniList'),
    }, {
      key: 'about',
      value: this.$t('system.settings.menu.about'),
    }];
  }

  /**
   * @function appSettingsTab
   * @private
   * @returns the App Settings Tab
   */
  private get appSettingsTab() {
    const messages = this.$i18n.messages;
    const languages = map(messages, (value, key) => {
      const locale = key;
      const original = value.originalReading;
      const english = value.englishReading;

      return {
        value: locale,
        original,
        english,
      };
    });

    return (
      <v-tab-item key="appSettings">
        <v-card flat>
          <v-container fluid>
            <v-flex xs6>
              <v-select
                items={languages}
                item-text="original"
                value={this._locale}
                label={this.$t('system.settings.appSettings.chooseLanguage')}
                onchange={this.setLanguage}>
              </v-select>
            </v-flex>
          </v-container>
        </v-card>
      </v-tab-item>
    );
  }

  private get aniListTab() {
    const authenticationLayout = (
      <v-layout fill-height justify-center align-center>
        <v-btn color="primary" onclick={this.loginToAniList}>
          {this.$t('system.actions.login')}
        </v-btn>
      </v-layout>
    );

    return (
      <v-tab-item key="aniList">
        <v-card flat>
          <v-container fluid>
            {!aniListStore.isAuthenticated ? authenticationLayout : ''}
          </v-container>
        </v-card>
      </v-tab-item>
    );
  }

  private get aboutTab() {
    return (
      <v-tab-item key="about">
        <v-card flat>
          <v-container fluid>
            <v-layout align-center justify-center row wrap>
              <v-flex xs12>
                <h2 class="display-3 text-xs-center">{this.$t('system.settings.aboutZeroTwo.version')}</h2>
                <h3 class="display-2 text-xs-center">{this.currentAppVersion}</h3>
              </v-flex>
              <v-flex xs4>
                <a href="#" class="headline" onclick={this.openGitHub}>
                  <v-img src={require('@/assets/logos/github-logo.png')} alt="GitHub" />
                </a>
              </v-flex>
              <v-flex xs4>
                <a href="#" class="headline" onclick={this.openDiscord}>
                  <v-img src={require('@/assets/logos/discord-blurple-logo.png')} alt="Discord" />
                </a>
              </v-flex>
              <v-flex xs4>
                <a href="#" class="headline" onclick={this.openZeroTwo}>
                  <v-img src={require('@/assets/logos/ZeroTwoAppIcon_1024.png')} alt="ZeroTwo" />
                </a>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-tab-item>
    );
  }

  /**
   * @method setLanguage
   * @private
   * @param {string} newLanguage contains the locale value of the new language
   */
  private setLanguage(newLanguage: string): void {
    appStore.setLanguage(newLanguage);
    this._locale = newLanguage;
  }

  private loginToAniList() {
    if (!aniListStore.isAuthenticated) {
      ipcRenderer.send('aniListOAuth', 'getToken');
    }
  }

  private openGitHub(event: MouseEvent) {
    shell.openExternal(this.githubPage.toString());
    event.preventDefault();
  }

  private openDiscord(event: MouseEvent) {
    shell.openExternal(this.discordPage.toString());
    event.preventDefault();
  }

  private openZeroTwo(event: MouseEvent) {
    shell.openExternal(this.zeroTwoPage.toString());
    event.preventDefault();
  }

  private get currentAppVersion(): string {
    return appStore.version;
  }
}
