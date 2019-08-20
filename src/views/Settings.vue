<template>
  <v-content>
    <v-card>
      <v-card-text>
        <v-tabs
          v-model="tabs"
          grow
          fluid
        >
          <v-tab
            v-for="tab in settingsTabs"
            :key="tab.key"
            :disabled="tab.disabled"
            ripple
          >
            {{ tab.value }}
          </v-tab>

          <v-tabs-items v-model="tabs">
            <AppSettings :tab-key="appSettingsTab.key" />

            <AniList :tab-key="aniListTab.key" />

            <About :tab-key="aboutTab.key" />

            <Changelog :tab-key="changelogTab.key" />
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </v-content>
</template>

<script lang="ts">
import { TranslateResult } from 'vue-i18n';
import { Component, Vue } from 'vue-property-decorator';
import AppSettings from './Settings/AppSettings.vue';
import AniList from './Settings/AniList.vue';
import About from './Settings/About.vue';
import Changelog from './Settings/Changelog.vue';

interface ISettingTab {
  key: string;
  value: TranslateResult;
  disabled?: boolean;
}

@Component({
  components: {
    About,
    AniList,
    AppSettings,
    Changelog,
  },
})
export default class Settings extends Vue {
  private tabs = null;

  /**
   * @function settingsTabs
   * @private
   * @returns {ISettingTab[]} the Settings tabs
   */
  private get settingsTabs(): ISettingTab[] {
    return [
      this.appSettingsTab,
      this.aniListTab,
      this.aboutTab,
      this.changelogTab,
    ];
  }

  private get appSettingsTab(): ISettingTab {
    return {
      key: 'appSettings',
      value: this.$t('system.settings.menu.appSettings'),
    };
  }

  private get aniListTab(): ISettingTab {
    return {
      key: 'aniList',
      value: this.$t('system.settings.menu.aniList'),
    };
  }

  private get aboutTab(): ISettingTab {
    return {
      key: 'about',
      value: this.$t('system.settings.menu.about'),
    };
  }

  private get changelogTab(): ISettingTab {
    return {
      key: 'changelog',
      value: this.$t('system.settings.menu.changelog'),
    };
  }
}
</script>
