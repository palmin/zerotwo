<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn
        v-if="isAuthenticated"
        text
        icon
        v-on="{ ...toolTip }"
        @click="refreshData"
      >
        <v-progress-circular
          :rotate="-90"
          :width="2"
          :color="colorCode"
          :value="timeUntilRefreshPercentage"
        >
          <v-icon
            style="vertical-align: text-top"
            size="18"
          >
            mdi-sync {{ isLoading ? 'mdi-spin' : '' }}
          </v-icon>
        </v-progress-circular>
      </v-btn>
    </template>
    <span>({{ timeUntilRefresh }})</span>
  </v-tooltip>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import Log from '@/log';
import { aniListStore, appStore } from '@/store';

@Component
export default class Refresh extends Vue {
  private get isAuthenticated(): boolean {
    return aniListStore.isAuthenticated;
  }

  private get isLoading(): boolean {
    return appStore.isLoading;
  }

  private get colorCode(): string {
    if (this.timeUntilRefreshPercentage < 60 && this.timeUntilRefreshPercentage > 30) {
      return 'warning';
    } if (this.timeUntilRefreshPercentage < 30) {
      return 'error';
    }
    return 'success';
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

  private async refreshData() {
    await appStore.setLoadingState(true);

    // AniList
    try {
      await aniListStore.refreshAniListData();
      await aniListStore.restartRefreshTimer();
      this.$forceUpdate();
    } catch (error) {
      Log.log(Log.getErrorSeverity(), ['navigation', 'refreshData', 'aniList'], error);
    }

    await appStore.setLoadingState(false);
  }
}
</script>
