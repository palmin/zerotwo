<template>
  <v-content>
    <v-layout row wrap>
      <v-flex d-flex xs3 v-for="item in preparedMedia" :key="item.id">
        <v-card hover class="ma-1">
          <v-layout row wrap>
            <v-flex xs12 class="pl-1">
              <v-img
                :src="item.coverImage"
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
                  <span class="grey--text">{{ $tc('seasonPreview.episodes', item.episodes) }}</span>
                  <div class="grey--text">{{ $t('seasonPreview.startDate') }} {{ item.startDate }}</div>
                </div>
              </v-card-title>
            </v-flex>
          </v-layout>
          <v-card-actions>
            <v-layout row wrap>
              <v-flex xs1>
                <v-layout row fill-height align-start justify-start>
                  <template v-if="item.isAdult">
                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-btn flat icon v-on="on">
                          <v-icon color="error">mdi-alert</v-icon>
                        </v-btn>
                      </template>
                      <span>{{ $t('system.alerts.adultContent') }}</span>
                    </v-tooltip>
                  </template>
                </v-layout>
              </v-flex>
              <v-flex xs11>
                <v-layout row fill-height align-end justify-end>
                  <v-btn flat :disabled="item.isLocked">
                    <v-icon left color="success">mdi-library-plus</v-icon>
                    {{ $t('system.actions.addToPlanToWatch') }}
                  </v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script lang="ts">
import API from '@/modules/AniList/API';
import { AniListSeason, IAniListSeasonPreviewMedia } from '@/modules/AniList/types';
import { chain } from 'lodash';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class SeasonPreview extends Vue {
  private media: IAniListSeasonPreviewMedia[] = [];
  private seasonYear: number = new Date().getUTCFullYear();
  private season: AniListSeason = this.getCurrentSeason();

  private get preparedMedia() {
    return chain(this.media)
      .map((item) => {
        const outputFormat = item.startDate.day
          ? this.$t('system.dates.full') as string
          : item.startDate.month
            ? this.$t('system.dates.monthAndYear') as string
            : item.startDate.year
              ? this.$t('system.dates.yearOnly') as string
              : undefined;

        let dateFormat = '';
        let itemDate = '';

        if (item.startDate.year) {
          dateFormat = 'YYYY';
          itemDate = `${item.startDate.year}`;
        }
        if (item.startDate.month) {
          dateFormat = `M-YYYY`;
          itemDate = `${item.startDate.month}-${item.startDate.year}`;
        }

        if (item.startDate.day) {
          dateFormat = `D-${dateFormat}`;
          itemDate = `${item.startDate.day}-${itemDate}`;
        }
        const startDateTimestamp = moment(itemDate, dateFormat).format('X');
        const startDate = moment(itemDate, dateFormat).format(outputFormat)
          || this.$t('system.dates.dateUnknown');
        const coverImage = item.coverImage.extraLarge;

        return {
          id: item.id,
          isAdult: item.isAdult,
          isLocked: item.isLocked,
          name: item.title.userPreferred,
          coverImage,
          episodes: item.episodes || 0,
          startDateTimestamp,
          startDate,
        };
      })
      .orderBy(['startDateTimestamp'], ['asc'])
      .value();
  }

  private async created() {
    try {
      const preview = await API.getSeasonPreview(this.seasonYear, this.season);
      if (!preview) {
        this.media = [];
      } else {
        this.media = preview.media;
      }
    } catch (error) {
      this.media = [];
    }
  }

  private getCurrentSeason() {
    const currentMonth = new Date().getUTCMonth();

    // Spring months
    return currentMonth >= 2 && currentMonth <= 4
      ? AniListSeason.SPRING
      // Summer months
      : currentMonth >= 5 && currentMonth <= 7
        ? AniListSeason.SUMMER
        // Fall months
        : currentMonth >= 8 && currentMonth <= 10
          ? AniListSeason.FALL
          : AniListSeason.WINTER;
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
