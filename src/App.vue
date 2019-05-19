<template>
  <v-app :dark="darkMode" id="app">
    <main>
      <Navigation />
      <router-view :key="$route.path" />
      <notifications position="top center" />
    </main>
  </v-app>
</template>

<script lang="ts">
import { remote } from 'electron';
import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { validLanguageCodes } from './i18n';
import { aniListStore, appStore } from './store';

// Components
import Navigation from './components/Navigation.vue';

@Component({
  components: {
    Navigation,
  },
})
export default class App extends Vue {
  public get locale(): string | undefined {
    return appStore.language;
  }

  public get darkMode(): boolean {
    return appStore.darkMode;
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

  private created() {
    if (!this.locale) {
      appStore.setLanguage(remote.app.getLocale());
    } else {
      this.$i18n.locale = this.locale;
    }

    moment.locale(this.$i18n.locale);
  }

  private async beforeMount() {
    await appStore.setLoadingState(true);

    if (aniListStore.isAuthenticated) {
      await aniListStore.refreshAniListData();
      await aniListStore.restartRefreshTimer();
    }

    await appStore.setLoadingState(false);
  }

  private async beforeDestroy() {
    await aniListStore.destroyRefreshTimer();
  }
}
</script>
