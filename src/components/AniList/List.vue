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
      <v-card class="ma-1" hover @click="changeMetaMediaTitle(item.name)">
        <v-layout row wrap>
          <v-flex xs12 class="pl-1">
            <v-img
              :src="item.imageLink"
              height="250px"
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
            <v-card-title primary-title>
              <div>
                <span class="grey--text">{{ $t('system.aniList.currentProgress', [item.currentProgress, item.episodeAmount]) }}</span>
              </div>
            </v-card-title>
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
import { Component, Prop, Vue } from 'vue-property-decorator';

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

  // TODO: Add actual link to media page route
  private changeMetaMediaTitle(title: string): void {
    aniListStore.setCurrentMediaTitle(title);
  }

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

    return {
      id: entry.id,
      name: media.title.userPreferred,
      imageLink,
      currentProgress: entry.progress,
      episodeAmount: media.episodes || '?',
      score: entry.score,
      scoreStars,
      forAdults: media.isAdult,
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
}
</script>

<style lang="scss" scoped>
.shadowed {
  text-shadow:
    -1px 1px 2px #000,
    1px 1px 2px #000,
    1px -1px 0 #000,
    -1px -1px 0 #000;
}
</style>
