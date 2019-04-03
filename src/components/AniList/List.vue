<template>
  <v-layout row wrap class="infinite-wrapper">
    <v-flex d-flex xs3 v-for="item in listData" :key="item.id">
      <v-card class="ma-1" dark hover @click="changeMetaMediaTitle(item.name)">
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
          <v-layout align-center justify-end>
            ({{ item.score }})<v-rating :length="ratingStarAmount" half-increments dark dense small readonly :value="item.scoreStars"></v-rating>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <!--<infinite-loading @infinite="fetchData" spinner="waveDots" force-use-infinite-wrapper=".infinite-wrapper"></infinite-loading>-->
  </v-layout>
</template>

<script lang="ts">
import { chain } from 'lodash';
import InfiniteLoading, { InfiniteOptions } from 'vue-infinite-loading';
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { AniListScoreFormat } from '@/modules/AniList/types';
import { aniListStore } from '@/store';

@Component({ components: { InfiniteLoading } })
export default class List extends Vue {
  private listData: any[] = [];
  private startAmount: number = 50;

  // TODO: Add actual link to media page route
  private changeMetaMediaTitle(title: string): void {
    aniListStore.setCurrentMediaTitle(title);
  }

  private get ratingStarAmount(): number {
    return aniListStore.session.user.mediaListOptions.scoreFormat === AniListScoreFormat.POINT_3
      ? 3
      : 5;
  }

  private created() {
    const entries = this.getData();
    if (entries.length) {
      this.listData = entries;
    }
  }

  private fetchData($state: any): void {
    console.log('called');
    const entries = this.getData();
    if (entries.length) {
      this.listData = entries;
      $state.loaded();
    } else {
      $state.complete();
    }
  }

  private getData(): any[] {
    if (!aniListStore.aniListData.lists.length) {
      return [];
    }

    const listElement = aniListStore.aniListData.lists[0];

    const newEntries = chain(listElement.entries)
      .map((entry) => {
      const { media } = entry;

      const scoreStars = this.getScoreStarValue(entry.score);

      return {
        id: entry.id,
        name: media.title.userPreferred,
        imageLink: media.coverImage.extraLarge,
        currentProgress: entry.progress,
        episodeAmount: media.episodes,
        score: entry.score,
        scoreStars,
      };
    })
    .orderBy((entry) => entry.name.toLowerCase(), ['asc'])
    .slice(this.listData.length, this.startAmount)
    .value();

    return [...this.listData, ...newEntries];
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
