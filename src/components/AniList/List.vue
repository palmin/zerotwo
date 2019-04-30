<template>
  <v-layout row wrap>
    <v-flex xs12 v-show="isLoading" align-self-center>
      <div class="display-3 text-xs-center ma-4">
        {{ $t('system.actions.loading') }}
      </div>
    </v-flex>
    <v-flex xs12 v-if="!listData.length && !isLoading">
      <v-container>
        <div class="headline text-xs-center">
          {{ $t('$vuetify.noDataText') }}
        </div>
      </v-container>
    </v-flex>
    <template v-if="!isLoading">
      <v-flex d-flex xs3 v-for="item in listData" :key="item.id">
        <v-card class="ma-1">
          <v-layout row wrap>
            <v-flex xs12>
              <ListImage :imageLink="item.imageLink" :aniListId="item.aniListId" :name="item.name" />
            </v-flex>
            <v-flex xs12>
              <v-container fluid class="pa-3">
                <v-layout row wrap>
                  <v-flex xs4>
                    <ProgressCircle
                      :entryId="item.id"
                      :status="status"
                      :progressPercentage="item.progressPercentage"
                      :currentProgress="item.currentProgress"
                      :episodeAmount="item.episodeAmount"
                      @increase="increaseCurrentEpisodeProgress" />
                  </v-flex>

                  <v-flex xs8>
                    <v-layout align-center justify-end row wrap>
                      <v-flex xs12>
                        <EpisodeState :status="item.status" :nextEpisode="item.nextEpisode" />
                      </v-flex>
                      <v-flex xs12>
                        <MissingEpisodes :nextAiringEpisode="item.nextAiringEpisode" :currentProgress="item.currentProgress" />
                      </v-flex>
                    </v-layout>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-flex>
          </v-layout>
          <v-card-actions>
            <AdultToolTip v-if="item.forAdults" />
            <StarRating :score="item.score" :ratingStarAmount="ratingStarAmount" :scoreStars="item.scoreStars" />
          </v-card-actions>
        </v-card>
      </v-flex>
    </template>
    <v-snackbar v-model="isSnackbarVisible" top :color="snackbarColor" :timeout="3500">{{ snackbarText }}</v-snackbar>
  </v-layout>
</template>

<script lang="ts">
import { chain, isEmpty, reduce } from 'lodash';
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

// Custom Components
import API from '@/modules/AniList/API';
import { AniListListStatus, AniListMediaStatus, AniListScoreFormat, IAniListEntry } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';
import AdultToolTip from './ListElements/AdultToolTip.vue';
import EpisodeState from './ListElements/EpisodeState.vue';
import ListImage from './ListElements/ListImage.vue';
import MissingEpisodes from './ListElements/MissingEpisodes.vue';
import ProgressCircle from './ListElements/ProgressCircle.vue';
import StarRating from './ListElements/StarRating.vue';

@Component({
  components: {
    AdultToolTip,
    EpisodeState,
    ListImage,
    MissingEpisodes,
    ProgressCircle,
    StarRating,
  },
})
export default class List extends Vue {
  private listData: any[] = [];
  // TODO: Make this a non-static number via Store
  private startAmount: number = 20;
  // Contains the Timer ID
  private updateTimer: NodeJS.Timeout | null = null;
  private updatePayload: any[] = [];
  private updateInterval = 750;
  private snackbarColor: string = 'success';
  private isSnackbarVisible: boolean = false;
  private snackbarText: string = '';

  @Prop()
  private readonly status!: AniListListStatus;

  private get ratingStarAmount(): number {
    return aniListStore.session.user.mediaListOptions.scoreFormat === AniListScoreFormat.POINT_3
      ? 3
      : 5;
  }

  private get isLoading(): boolean {
    return appStore.isLoading;
  }

  private async created() {
    const entries = await this.getData(0);
    if (entries.length) {
      this.listData = entries;
    }

    // Infinite Scrolling
    window.onscroll = async () => {
      const bottomOfWindow = document.documentElement.scrollTop + window.innerHeight ===
        document.documentElement.offsetHeight;
      if (bottomOfWindow) {
        const newEntries = await this.getData(this.listData.length);
        if (newEntries.length) {
          this.listData = [...this.listData, ...newEntries];
        }
      }
    };
  }

  private async prepareEntry(entry: IAniListEntry) {
    const { media } = entry;
    const scoreStars = this.getScoreStarValue(entry.score);
    const imageLink = media.coverImage.extraLarge;

    const nextEpisode = media.nextAiringEpisode
      ? this.$root.$t(
        'system.aniList.nextAiringEpisode',
        [
          media.nextAiringEpisode.episode,
          moment(media.nextAiringEpisode.airingAt, 'X').fromNow(),
        ],
      )
      : null;
    const progressPercentage = this.calculateProgressPercentage(entry);
    const missingEpisodes = this.calculateMissingEpisodes(entry);

    return {
      aniListId: media.id,
      currentProgress: entry.progress,
      entry,
      episodeAmount: media.episodes || '?',
      forAdults: media.isAdult,
      id: entry.id,
      imageLink,
      missingEpisodes,
      name: media.title.userPreferred,
      nextAiringEpisode: media.nextAiringEpisode,
      nextEpisode,
      progressPercentage,
      score: entry.score,
      scoreStars,
      status: media.status,
    };
  }

  private async getData(startValue: number): Promise<any> {
    if (!aniListStore.aniListData.lists.length) {
      return [];
    }

    const listElement = aniListStore.aniListData.lists.find((list) => list.status === this.status);

    // If we can't find our list, just return empty.
    if (!listElement) {
      return [];
    }

    let newEntries = await Promise.all(listElement.entries.map((entry) => this.prepareEntry(entry)));

    newEntries = chain(newEntries)
      .orderBy((entry) => entry.name.toLowerCase(), ['asc'])
      .slice(startValue, this.startAmount + startValue)
      .value();

    return newEntries;
  }

  private getScoreStarValue(score: number): number {
    if (!score) {
      return 0;
    }

    const userScoringSystem = aniListStore.session.user.mediaListOptions.scoreFormat;

    switch (userScoringSystem) {
      case AniListScoreFormat.POINT_100:
        return score / 20;
      case AniListScoreFormat.POINT_10_DECIMAL:
      case AniListScoreFormat.POINT_10:
        return score / 2;
      case AniListScoreFormat.POINT_5:
      case AniListScoreFormat.POINT_3:
        return score;
      default:
        return 0;
    }
  }

  private calculateProgressPercentage(entry: IAniListEntry): number {
    const episodes = entry.media.episodes;
    const nextAiringEpisode = entry.media.nextAiringEpisode;
    const currentProgress = entry.progress;

    if (!currentProgress) {
      return 0;
    }

    // Check if max episode amount is known
    if (episodes) {
      return currentProgress / episodes * 100;
    }

    // We don't know the exact amount of episodes
    // But we might know how many episodes have been aired so far
    // so we can calculate the percentage of the currently available episodes
    // and then add some buffer
    if (nextAiringEpisode && nextAiringEpisode.episode) {
      // We have to substract one here as that episode isn't aired yet
      const episode = nextAiringEpisode.episode - 1 > 0
        ? nextAiringEpisode.episode - 1
        : 1;

      // We choose only 80 percent here, as we are unaware of the episode amount
      return currentProgress / episode * 80;
    }

    // Just return 75% if we have a non-zero progress but
    // neither through the next airing episode nor through the episode amount
    // we can determine our status.
    return 75;
  }

  private calculateMissingEpisodes(entry: IAniListEntry): number | null {
    const nextAiringEpisode = entry.media.nextAiringEpisode;
    const currentProgress = entry.progress;

    // We don't care about episodes that are not airing anymore.
    if (!nextAiringEpisode) {
      return null;
    }

    const nextEpisode = nextAiringEpisode.episode;

    // Return the amount of episodes only when there are next episodes
    // and if there are episodes the user hasn't watched yet.
    return nextEpisode - 1 > 0 && nextEpisode - 1 - currentProgress > 0
      ? nextEpisode - 1 - currentProgress
      : null;
  }

  private increaseCurrentEpisodeProgress(entryId: number): void {
    const listEntry = this.listData.find((entry) => entry.id === entryId);

    if (!listEntry) {
      return;
    }

    const { currentProgress, episodeAmount } = listEntry;
    if (currentProgress + 1 >= episodeAmount) {
      listEntry.status = AniListListStatus.COMPLETED;
      listEntry.currentProgress++;
    } else {
      listEntry.currentProgress++;
    }

    this.startUpdateTimer(listEntry);
  }

  private startUpdateTimer(listEntry: any) {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    const now = Date.now();
    const entry = {
      id: listEntry.id,
      mediaId: listEntry.aniListId,
      title: listEntry.name,
      progress: listEntry.currentProgress,
      status: listEntry.status,
      score: listEntry.score,
      changeFrom: now,
    };

    this.updatePayload.push(entry);
    this.updateTimer = setTimeout(this.updateChanges, this.updateInterval);
  }

  private async updateChanges() {
    if (isEmpty(this.updatePayload)) {
      return;
    }

    const entries = chain(this.updatePayload)
      .groupBy((value) => value.id)
      .map((group) => reduce((group), (accumulator, item) =>
        (item.changeFrom > accumulator.changeFrom ? item : accumulator), {
          id: null,
          title: null,
          status: null,
          progress: null,
          score: null,
          changeFrom: 0,
        }))
      .filter((group) => !!group.id)
      .value();

    if (isEmpty(entries)) {
      return;
    }

    await Promise.all(entries.map(async (entry) => {
      const { id, title, status, progress, score } = entry;

      if (!id || progress === null) {
        return;
      }

      if (status === AniListListStatus.COMPLETED) {
        await API.setEntryCompleted(id, progress);
        this.$notify({
          title: this.$t('system.aniList.notification.title') as string,
          text: this.$t('system.aniList.notification.completeUpdateText', [title, progress]) as string,
        });
      } else {
        await API.setEntryProgress(id, progress);
        this.$notify({
          title: this.$t('system.aniList.notification.title') as string,
          text: this.$t('system.aniList.notification.simpleUpdateText', [title, progress]) as string,
        });
      }
    }))
    .finally(() => {
      this.updatePayload = [];
    });
  }
}
</script>
