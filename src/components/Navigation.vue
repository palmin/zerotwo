<template>
  <v-toolbar app fixed flat dense>
    <v-menu offset-y>
      <v-btn flat slot="activator">
        <v-icon left>mdi-menu</v-icon>
        {{ currentRouteName }}
      </v-btn>
      <v-list>
        <v-list-tile v-for="(item, index) in menuItems" :key="index" @click="navigateTo(item.location)">
          <v-list-tile-title>{{ $t(item.title) }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>

    <v-spacer></v-spacer>

    <template v-if="!isMediaPage && isAniListRoute">
      <v-toolbar-items>
        <v-btn flat exact :to="{ name: 'Home' }">{{ $t('menu.home') }}</v-btn>

        <template v-if="isAuthenticated">
          <v-btn flat exact :to="{ name: 'Watching' }">{{ $t('menu.watching') }}</v-btn>
          <v-btn flat exact :to="{ name: 'Repeating' }">{{ $t('menu.repeating') }}</v-btn>
          <v-btn flat exact :to="{ name: 'Completed' }">{{ $t('menu.completed') }}</v-btn>
          <v-btn flat exact :to="{ name: 'Paused' }">{{ $t('menu.paused') }}</v-btn>
          <v-btn flat exact :to="{ name: 'Dropped' }">{{ $t('menu.dropped') }}</v-btn>
          <v-btn flat exact :to="{ name: 'Planning' }">{{ $t('menu.planning') }}</v-btn>
        </template>
      </v-toolbar-items>

      <v-spacer></v-spacer>
    </template>

    <template v-if="isMediaPage">
      <v-toolbar-items>
        <v-btn flat v-if="isMediaPage">
          {{ currentMediaTitle }}
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
    </template>

    <v-toolbar-items>
      <v-btn flat small icon v-if="isLoading">
        <v-progress-circular size="16" width="2" indeterminate></v-progress-circular>
      </v-btn>

      <v-btn flat icon v-if="isMediaPage || isSettingsPage" @click="$router.back()">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn flat icon v-if="isSortingPage" v-on="{ ...toolTip }" @click="jumpToTop">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('system.actions.toPageTop') }}</span>
      </v-tooltip>

      <v-menu v-model="sortMenu" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on: sortWindow }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: toolTip }">
              <v-btn flat icon v-if="isSortingPage" v-on="{ ...toolTip, ...sortWindow }">
                <v-icon>mdi-sort</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('system.actions.sort') }}</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-container fluid>
            <v-flex xs12 d-flex>
              <v-select :items="['Name']" label="Sort by"></v-select>
            </v-flex>
          </v-container>
        </v-card>
      </v-menu>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn flat icon v-on="{ ...toolTip }" @click="() => {}" v-if="isSearchablePage">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('system.actions.search') }}</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn flat icon v-on="{ ...toolTip }" @click="refreshData" v-if="isAuthenticated">
            <v-progress-circular :rotate="-90" :width="2" color="success" :value="timeUntilRefreshPercentage">
              <v-icon style="vertical-align: text-top" size="18" color="white">mdi-sync {{ isLoading ? 'mdi-spin' : '' }}</v-icon>
            </v-progress-circular>
          </v-btn>
        </template>
        <span>({{ timeUntilRefresh }})</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn flat exact icon :to="{ name: 'Settings' }" v-on="{ ...toolTip }">
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('menu.settings') }}</span>
      </v-tooltip>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

// Custom Components
import Log from '@/log';
import { aniListStore, appStore } from '@/store';

@Component
export default class Navigation extends Vue {
  private sortMenu: boolean = false;

  private menuItems: Array<{ title: string, location: RawLocation }> = [{
    title: 'system.modules.aniList',
    location: { name: 'Home' },
  }, {
    title: 'menu.seasonPreview',
    location: { name: 'SeasonPreview' },
  }];

  private get isRefreshablePage(): boolean {
    return this.$route.meta && this.$route.meta.refreshablePage;
  }

  private get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }

  private get isSearchablePage(): boolean {
    return this.$route.meta && this.$route.meta.searchablePage;
  }

  private get isMediaPage(): boolean {
    return this.$route.meta && this.$route.meta.mediaPage;
  }

  private get isSettingsPage(): boolean {
    return this.$route.name === 'Settings';
  }

  private get currentRouteName(): string {
    const routeName = this.$route.meta.routeName;

    return this.$t(`system.routes.${routeName}`) as string;
  }

  private get currentMediaTitle(): string | null {
    return aniListStore.currentMediaTitle;
  }

  private get isAuthenticated(): boolean {
    return aniListStore.isAuthenticated;
  }

  private get isLoading(): boolean {
    return appStore.isLoading;
  }

  private get isAniListRoute(): boolean {
    const currentRoute = this.$route.path;

    return currentRoute.startsWith('/aniList');
  }

  private get timeUntilRefresh(): string {
    const time = aniListStore.timeUntilRefresh * 1000;

    return moment(time).format('mm:ss');
  }

  private get timeUntilRefreshPercentage(): number {
    const fullTime = aniListStore.refreshRate * 60;
    const currentTime = aniListStore.timeUntilRefresh;

    return (currentTime / fullTime) * 100;
  }

  private navigateTo(location: RawLocation) {
    this.$router.push(location);
  }

  private async refreshData() {
    await appStore.setLoadingState(true);

    // AniList
    try {
      await aniListStore.refreshAniListData();
      await aniListStore.restartRefreshTimer();
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['navigation', 'refreshData', 'aniList'], error);
    }

    await appStore.setLoadingState(false);
  }

  private jumpToTop(): void {
    window.scrollTo(0, 0);
  }
}
</script>
