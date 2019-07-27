<template>
  <v-content>
    <v-container fluid class="py-0 px-1" fill-height>
      <v-layout wrap>
        <v-flex xs3 lg3 xl2 v-for="item in preparedMedia" :key="item.id">
          <v-card hover class="ma-1">
            <ListImage :imageLink="item.coverImage" :name="item.name" :aniListId="item.id" />

            <v-card-text>
              <v-layout row fill-height align-center>
                <v-layout column class="px-2" justify-start>
                  <v-flex class="subtitle-1 grey--text">{{ $tc('seasonPreview.episodes', item.episodes) }}</v-flex>
                  <v-flex class="subtitle-1 grey--text">{{ $t('seasonPreview.startDate') }} {{ item.startDate }}</v-flex>
                </v-layout>

                <template v-if="item.isAdult">
                  <v-flex class="mx-2 text-right">
                    <v-divider vertical inset></v-divider>

                    <v-tooltip top>
                      <template v-slot:activator="{ on }">
                        <v-icon large color="error" v-on="on">mdi-alert</v-icon>
                      </template>
                      <span>{{ $t('system.alerts.adultContent') }}</span>
                    </v-tooltip>
                  </v-flex>
                </template>
              </v-layout>
            </v-card-text>

            <v-card-actions>
              <v-btn block text :disabled="item.isLocked">
                <v-icon left color="success">mdi-library-plus</v-icon>
                {{ $t('system.actions.addToPlanToWatch') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import ListImage from '@/components/AniList/ListElements/ListImage.vue';
import API from '@/modules/AniList/API';
import { AniListSeason, IAniListSeasonPreviewMedia } from '@/modules/AniList/types';
import { chain } from 'lodash';
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';

@Component({ components: { ListImage }})
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
  color: #FFF;
  text-shadow:
    -1px 1px 2px #000,
    1px 1px 2px #000,
    1px -1px 0 #000,
    -1px -1px 0 #000;
}
</style>
