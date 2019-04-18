<template>
  <v-layout row wrap>
    <v-flex xs12 v-if="!listData.length">
      <v-container>
        <div class="headline text-xs-center">
          {{ $t('$vuetify.noDataText') }}
        </div>
      </v-container>
    </v-flex>
    <v-flex d-flex xs3 v-for="item in listData" :key="item.id">
      <v-card class="ma-1">
        <v-layout row wrap>
          <v-flex xs12>
            <v-img
              :src="item.imageLink"
              height="250px"
              position="50% 35%"
              @click.native="moveToDetails(item.aniListId)"
            >
              <template v-slot:placeholder>
                <v-layout
                  fill-height
                  align-center
                  justify-center
                  ma-0
                >
                  <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                </v-layout>
              </template>
              <v-container fill-height fluid>
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span class="title shadowed">{{ item.name }}</span>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-img>
          </v-flex>
          <v-flex xs12>
            <v-container fluid class="pa-3">
              <v-layout row wrap>
                <v-flex xs6>
                  <span class="grey--text">{{ $t('system.aniList.currentProgress', [item.currentProgress, item.episodeAmount]) }}</span>
                </v-flex>

                <v-flex xs12>
                  <v-layout align-center justify-center row>
                    <v-flex grow>
                      <v-progress-linear color="success" :value="item.progressPercentage" height="20"></v-progress-linear>
                    </v-flex>
                    <v-flex shrink v-if="showEpisodeIncreaseButton">
                      <v-btn flat color="success" class="episode-increase-icon">
                        <v-icon color="green" size="22">mdi-plus</v-icon>
                      </v-btn>
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex xs12>
                  <span v-if="item.nextEpisode" class="success--text">{{ item.nextEpisode }}</span>
                  <span v-else class="info--text">{{ $t('system.aniList.airingFinished') }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-flex>
        </v-layout>
        <v-card-actions>
          <v-layout align-start justify-start>
            <template v-if="item.forAdults">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-icon color="error" v-on="on">mdi-alert</v-icon>
                </template>
                <span>{{ $t('system.alerts.adultContent') }}</span>
              </v-tooltip>
            </template>
          </v-layout>

          <v-layout align-center justify-end>
            ({{ item.score }})<v-rating :length="ratingStarAmount" half-increments dense small readonly :value="item.scoreStars"></v-rating>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
import { chain } from 'lodash';
import moment from 'moment';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

// Custom Components
import { AniListListStatus, AniListScoreFormat, IAniListEntry } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';

@Component
export default class List extends Vue {
  private listData: any[] = [];
  // TODO: Make this a non-static number via Store
  private startAmount: number = 20;

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

  private get showEpisodeIncreaseButton(): boolean {
    return this.status !== AniListListStatus.COMPLETED;
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
      ? this.$t(
        'system.aniList.nextAiringEpisode',
        [
          media.nextAiringEpisode.episode,
          moment(media.nextAiringEpisode.airingAt, 'X').fromNow(),
        ],
      )
      : null;
    const progressPercentage = this.calculateProgressPercentage(entry);

    return {
      aniListId: media.id,
      currentProgress: entry.progress,
      episodeAmount: media.episodes || '?',
      forAdults: media.isAdult,
      id: entry.id,
      imageLink,
      name: media.title.userPreferred,
      nextEpisode,
      progressPercentage,
      score: entry.score,
      scoreStars,
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

  private moveToDetails(id: number) {
    const aniListId = id.toString();
    const location: RawLocation = { name: 'DetailView', params: { id: aniListId } };
    this.$router.push(location);
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
}
</script>

<style lang="scss" scoped>
.shadowed {
  color: #FFF;
  text-shadow:
    -1px 1px 2px #000,
    1px 1px 2px #000,
    1px -1px 0 #000,
    -1px -1px 0 #000;
}

.episode-increase-icon {
  height: auto;
  min-width: auto;
  margin: auto;
  padding: 0;
  margin-left: 2px;
  opacity: 0;
  transition: opacity ease-in-out 0.1s;

  &:hover {
    opacity: 1;
  }
}
</style>
