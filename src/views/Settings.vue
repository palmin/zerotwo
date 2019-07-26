<template>
  <v-content>
    <v-card>
      <v-card-text>
        <v-tabs v-model="tabs" grow fluid>
          <v-tab v-for="tab in settingsTabs" :key="tab.key" :disabled="tab.disabled" ripple>{{ tab.value }}</v-tab>

          <v-tabs-items v-model="tabs">
            <v-tab-item key="appSettings">
              <v-card flat>
                <v-container fluid>
                  <v-layout wrap>
                    <v-flex xs5>
                      <v-select
                      :items="languages"
                      item-text="original"
                      :value="this._locale"
                      :label="$t('system.settings.appSettings.chooseLanguage')"
                      @change="setLanguage">
                        <template v-slot:selection="data">
                          {{ data.item.original }} ({{ data.item.english }})
                        </template>
                        <template v-slot:item="data">
                          <v-list-item-content>
                            <v-list-item-title>{{ data.item.original }}</v-list-item-title>
                            <v-list-item-subtitle>{{ data.item.english }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-select>
                    </v-flex>

                    <v-flex xs5 offset-xs2 justify-center align-center>
                      <v-switch v-model="darkMode" :label="$t('system.settings.appSettings.darkMode')"></v-switch>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-tab-item>

            <v-tab-item key="aniList">
              <v-card flat>
                <v-container fluid>
                  <v-layout fill-height justify-center align-center v-if="!isAuthenticated">
                    <v-btn color="primary" @click="loginToAniList">
                      {{ $t('system.actions.login') }}
                    </v-btn>
                  </v-layout>
                  <v-layout fill-height v-else>
                    <v-flex xs4>
                      {{ $t('system.settings.aniList.loggedInAs', [currentUser.name]) }}
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                        type="number"
                        v-model="currentAniListRefreshRate"
                        :min="5"
                        :label="$t('system.settings.aniList.refreshRate')"
                        :suffix="$t('system.settings.aniList.refreshRateSuffix')"
                        :hint="$t('system.settings.aniList.refreshRateHint')">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-tab-item>

            <v-tab-item key="about">
              <v-card flat>
                <v-container fluid fill-height>
                  <v-layout align-center justify-center wrap fill-height>
                    <v-flex xs12>
                      <h2 class="display-3 text-center">{{ $t('system.settings.aboutZeroTwo.version') }}</h2>
                      <h3 class="display-2 text-center">{{ currentAppVersion }}</h3>
                    </v-flex>
                    <v-flex xs4>
                      <a href="#" class="headline" @click="openPage(Pages.GITHUB)">
                        <v-img :src="require('@/assets/logos/github-logo.png')" alt="GitHub" />
                      </a>
                    </v-flex>
                    <v-flex xs4>
                      <a href="#" class="headline" @click="openPage(Pages.DISCORD)">
                        <v-img :src="require('@/assets/logos/discord-blurple-logo.png')" alt="Discord" />
                      </a>
                    </v-flex>
                    <v-flex xs4>
                      <a href="#" class="headline" @click="openPage(Pages.ZEROTWO)">
                        <v-img :src="require('@/assets/logos/ZeroTwoAppIcon_1024.png')" alt="ZeroTwo" />
                      </a>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

        </v-tabs>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import { ipcRenderer, shell } from 'electron';
import { map } from 'lodash';
import { TranslateResult } from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { IAniListUser } from '@/modules/AniList/types';
import { version } from '../../package.json';
import { aniListStore, appStore } from '../store';

interface ISettingTab {
  key: string;
  value: TranslateResult;
  disabled?: boolean;
}

enum Pages {
  GITHUB = 'github',
  DISCORD = 'discord',
  ZEROTWO = 'zerotwo',
}

@Component
export default class Settings extends Vue {
  private _locale: string = '';
  private tabs = null;
  private githubPage: URL = new URL('https://github.com/nicoaiko/zerotwo');
  private discordPage: URL = new URL('https://discord.gg/sTpR4Gw');
  private zeroTwoPage: URL = new URL('https://www.zerotwo.org');

  /**
   * @method created is being called before mount
   * @protected
   */
  protected created(): void {
    this._locale = appStore.language as string;
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

  private openPage(page: Pages) {
    if (page === Pages.GITHUB) {
      shell.openExternal(this.githubPage.toString());
    } else if (page === Pages.DISCORD) {
      shell.openExternal(this.discordPage.toString());
    } else {
      shell.openExternal(this.zeroTwoPage.toString());
    }
  }

  /**
   * @function settingsTabs
   * @private
   * @returns {ISettingTab[]} the Settings tabs
   */
  private get settingsTabs(): ISettingTab[] {
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

  private get languages(): any {
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

    return languages;
  }

  private get currentAppVersion(): string {
    return version;
  }

  private get darkMode(): boolean {
    return appStore.darkMode;
  }

  private set darkMode(state: boolean) {
    appStore.setDarkMode(state);
  }

  private get isAuthenticated(): boolean {
    return aniListStore && aniListStore.isAuthenticated;
  }

  private get currentUser(): IAniListUser {
    return aniListStore.session.user;
  }

  private get currentAniListRefreshRate(): number {
    return aniListStore.refreshRate;
  }

  private set currentAniListRefreshRate(refreshRate: number) {
    aniListStore.setRefreshRate(refreshRate);
  }
}
</script>
