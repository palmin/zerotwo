<template>
  <v-app id="app">
    <main>
      <Navigation @navigationDrawerUpdated="navigationDrawer = !navigationDrawer" />
      <router-view :key="$route.path" />
      <ZeroTwoNotifications position="top center" />
    </main>
  </v-app>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { validLanguageCodes } from './i18n';
import { aniListStore, appStore } from './store';

// Components
import Navigation from '@/components/Navigation.vue';
import ZeroTwoNotifications from '@/components/Notifications.vue';

@Component({
  components: {
    Navigation,
    ZeroTwoNotifications,
  },
})
export default class App extends Vue {
  public get locale(): string | undefined {
    return appStore.language;
  }

  public get darkMode(): boolean {
    return appStore.darkMode;
  }

  public get loggedIntoAniList(): boolean {
    return aniListStore.isAuthenticated;
  }

  @Watch('loggedIntoAniList')
  public async loggedInStateChanged(newState: boolean) {
    if (newState) {
      await appStore.setLoadingState(true);
      await aniListStore.refreshAniListData();
      await aniListStore.restartRefreshTimer();
      await appStore.setLoadingState(false);
    } else {
      await aniListStore.destroyRefreshTimer();
    }
  }

  /**
   * @description Watches changes of locale
   * @see {@link store/App.ts}
   * @param {string | undefined} newLocale
   */
  @Watch('locale')
  public localeChanged(newLocale: string | undefined) {
    this.$i18n.locale = newLocale && validLanguageCodes.includes(newLocale)
      ? newLocale
      : this.$i18n.fallbackLocale;
    moment.locale(this.$i18n.locale);
  }

  @Watch('darkMode')
  public darkModeChanged(newValue: boolean) {
    this.$vuetify.theme.dark = newValue;
  }

  private created() {
    if (!this.locale) {
      if (window.navigator.languages && window.navigator.languages.length) {
        appStore.setLanguage(window.navigator.languages[0]);
      } else {
        appStore.setLanguage(window.navigator.language);
      }
    } else {
      this.$i18n.locale = this.locale;
    }

    this.$vuetify.theme.dark = appStore.darkMode;

    moment.locale(this.$i18n.locale);
  }

  private async beforeMount() {
    // await appStore.setLoadingState(true);

    // if (aniListStore.isAuthenticated) {
    //   await aniListStore.refreshAniListData();
    //   await aniListStore.restartRefreshTimer();
    // }

    // await appStore.setLoadingState(false);
  }

  private async beforeDestroy() {
    await aniListStore.destroyRefreshTimer();
  }
}
</script>
